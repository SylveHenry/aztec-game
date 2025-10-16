import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId, Collection } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const dbName = process.env.DATABASE_NAME!;

let client: MongoClient;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}
const clientPromise = global._mongoClientPromise;

interface LeaderboardEntry {
  _id?: ObjectId;
  userId: ObjectId;
  username: string;
  highScore: number;
  totalRoundsPlayed: number;
  lastPlayedAt: Date;
  rank: number;
  updatedAt: Date;
}

// Initialize leaderboard cache from users collection
export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();
    
    if (action !== 'rebuild') {
      return NextResponse.json(
        { error: 'Invalid action. Use "rebuild" to initialize cache.' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(dbName);
    const usersCollection = db.collection('users');
    const leaderboardCollection = db.collection<LeaderboardEntry>('leaderboard');

    // Clear existing leaderboard cache
    await leaderboardCollection.deleteMany({});

    // Get all users with scores, sorted by high score
    const users = await usersCollection
      .find({ highScore: { $gt: 0 } })
      .sort({ highScore: -1, lastPlayedAt: -1 })
      .toArray();

    if (users.length === 0) {
      return NextResponse.json({ 
        message: 'No users with scores found',
        entriesCreated: 0 
      });
    }

    // Create leaderboard entries with ranks
    const leaderboardEntries: LeaderboardEntry[] = users.map((user, index) => ({
      userId: user._id,
      username: user.username,
      highScore: user.highScore || 0,
      totalRoundsPlayed: user.totalRoundsPlayed || 0,
      lastPlayedAt: user.lastPlayedAt || user.createdAt,
      rank: index + 1,
      updatedAt: new Date()
    }));

    // Insert all entries
    await leaderboardCollection.insertMany(leaderboardEntries);

    // Create indexes for optimal performance
    await leaderboardCollection.createIndex({ rank: 1 });
    await leaderboardCollection.createIndex({ userId: 1 });
    await leaderboardCollection.createIndex({ highScore: -1 });

    return NextResponse.json({
      message: 'Leaderboard cache rebuilt successfully',
      entriesCreated: leaderboardEntries.length
    });

  } catch (error) {
    console.error('Leaderboard cache rebuild error:', error);
    return NextResponse.json(
      { error: 'Failed to rebuild leaderboard cache' },
      { status: 500 }
    );
  }
}

// Update single user's position in leaderboard cache
export async function PUT(request: NextRequest) {
  try {
    console.log('Leaderboard cache PUT request received');
    const { userId, newScore, oldScore, roundsPlayed } = await request.json();
    console.log('PUT request data:', { userId, newScore, oldScore, roundsPlayed });

    if (!userId || typeof newScore !== 'number' || typeof roundsPlayed !== 'number') {
      console.error('Invalid PUT request data:', { userId, newScore, roundsPlayed });
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(dbName);
    const usersCollection = db.collection('users');
    const leaderboardCollection = db.collection<LeaderboardEntry>('leaderboard');

    const userObjectId = new ObjectId(userId);

    // Use the oldScore from the request if provided, otherwise get from database
    let currentOldScore = oldScore;
    if (typeof oldScore !== 'number') {
      const user = await usersCollection.findOne({ _id: userObjectId });
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      currentOldScore = user.highScore || 0;
    }

    const isNewHighScore = newScore > currentOldScore;
    console.log('Score comparison:', { oldScore: currentOldScore, newScore, isNewHighScore });

    if (!isNewHighScore) {
      console.log('No high score update needed, returning early');
      // No leaderboard update needed
      return NextResponse.json({
        success: true,
        highScoreUpdated: false,
        leaderboardUpdated: false
      });
    }

    console.log('Updating user score in users collection');

    // Update user's score in users collection (only if we don't have the user data already)
    if (typeof oldScore !== 'number') {
      await usersCollection.updateOne(
        { _id: userObjectId },
        { 
          $set: { 
            highScore: newScore,
            lastPlayedAt: new Date()
          }
        }
      );
    }

    // Get updated user data to ensure we have the correct totalRoundsPlayed
    const updatedUser = await usersCollection.findOne({ _id: userObjectId });
    const currentTotalRounds = updatedUser?.totalRoundsPlayed || roundsPlayed;

    // Find current position in leaderboard
    const existingEntry = await leaderboardCollection.findOne({ userId: userObjectId });
    console.log('Existing leaderboard entry:', existingEntry ? 'found' : 'not found');
    
    if (existingEntry) {
      console.log('Updating existing leaderboard entry');
      // Update existing entry
      await leaderboardCollection.updateOne(
        { userId: userObjectId },
        { 
          $set: { 
            highScore: newScore,
            totalRoundsPlayed: currentTotalRounds,
            lastPlayedAt: new Date(),
            updatedAt: new Date()
          }
        }
      );
    } else {
      console.log('Inserting new leaderboard entry');
      // Insert new entry (user's first score)
      await leaderboardCollection.insertOne({
        userId: userObjectId,
        username: updatedUser?.username || 'Unknown User',
        highScore: newScore,
        totalRoundsPlayed: currentTotalRounds,
        lastPlayedAt: new Date(),
        rank: 0, // Will be updated in rerank
        updatedAt: new Date()
      });
    }

    console.log('Re-ranking leaderboard entries');
    // Rerank all entries
    await rerankLeaderboard(leaderboardCollection);

    console.log('Leaderboard cache update completed successfully');
    return NextResponse.json({
      success: true,
      highScoreUpdated: true,
      leaderboardUpdated: true,
      newHighScore: newScore
    });

  } catch (error) {
    console.error('Leaderboard cache update error:', error);
    return NextResponse.json(
      { error: 'Failed to update leaderboard cache' },
      { status: 500 }
    );
  }
}

// Helper function to rerank all leaderboard entries
async function rerankLeaderboard(leaderboardCollection: Collection<LeaderboardEntry>) {
  // Get all entries sorted by score
  const entries = await leaderboardCollection
    .find({})
    .sort({ highScore: -1, lastPlayedAt: -1 })
    .toArray();

  // Update ranks in batch
  const bulkOps = entries.map((entry: LeaderboardEntry, index: number) => ({
    updateOne: {
      filter: { _id: entry._id },
      update: { $set: { rank: index + 1 } }
    }
  }));

  if (bulkOps.length > 0) {
    await leaderboardCollection.bulkWrite(bulkOps);
  }
}