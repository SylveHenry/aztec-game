import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const dbName = process.env.DATABASE_NAME!;

let client: MongoClient;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}
const clientPromise = global._mongoClientPromise;

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db(dbName);
    const leaderboardCollection = db.collection('leaderboard');
    const usersCollection = db.collection('users');

    // Get URL parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Try to get leaderboard from cache first
    let leaderboard = await leaderboardCollection
      .find({})
      .sort({ rank: 1 })
      .limit(20)
      .toArray();

    // If cache is empty, fall back to users collection and rebuild cache
    if (leaderboard.length === 0) {
      console.log('Leaderboard cache empty, falling back to users collection');
      
      const users = await usersCollection
        .find({ highScore: { $gt: 0 } })
        .sort({ highScore: -1, lastPlayedAt: -1 })
        .limit(20)
        .toArray();

      leaderboard = users.map((user, index) => ({
        _id: user._id,
        userId: user._id,
        username: user.username,
        highScore: user.highScore || 0,
        totalRoundsPlayed: user.totalRoundsPlayed || 0,
        lastPlayedAt: user.lastPlayedAt || user.createdAt,
        rank: index + 1
      }));

      // Rebuild cache in background (don't wait for it)
      rebuildLeaderboardCache().catch(console.error);
    }

    const formattedLeaderboard = leaderboard.map((entry) => ({
      id: entry.userId.toString(),
      rank: entry.rank,
      playerName: entry.username,
      score: entry.highScore,
      roundsPlayed: entry.totalRoundsPlayed,
      timestamp: entry.lastPlayedAt
    }));

    let userPosition = null;
    
    // If userId is provided, find the user's position in the leaderboard
    if (userId) {
      try {
        const userObjectId = new ObjectId(userId);
        const userEntry = await leaderboardCollection.findOne({ userId: userObjectId });
        
        if (userEntry && userEntry.highScore > 0) {
          userPosition = {
            rank: userEntry.rank,
            score: userEntry.highScore,
            isInTop20: userEntry.rank <= 20
          };
        } else {
          // Fallback to users collection if not in cache
          const user = await usersCollection.findOne({ _id: userObjectId });
          if (user && user.highScore > 0) {
            const higherScoreCount = await leaderboardCollection.countDocuments({
              highScore: { $gt: user.highScore }
            });
            
            userPosition = {
              rank: higherScoreCount + 1,
              score: user.highScore,
              isInTop20: higherScoreCount < 20
            };
          }
        }
      } catch (error) {
        console.error('Error finding user position:', error);
      }
    }

    return NextResponse.json({ 
      leaderboard: formattedLeaderboard,
      userPosition 
    });
  } catch (error) {
    console.error('Leaderboard GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}

// Helper function to rebuild leaderboard cache
async function rebuildLeaderboardCache() {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/leaderboard-cache`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'rebuild' })
    });
    
    if (!response.ok) {
      console.error('Failed to rebuild leaderboard cache');
    }
  } catch (error) {
    console.error('Error rebuilding leaderboard cache:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, score, roundsPlayed } = await request.json();

    if (!userId || typeof score !== 'number' || typeof roundsPlayed !== 'number') {
      return NextResponse.json(
        { error: 'User ID, score, and rounds played are required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(dbName);
    const usersCollection = db.collection('users');

    // Update user's high score if the new score is higher
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const updateData: Record<string, number | Date> = {
      totalRoundsPlayed: roundsPlayed,
      lastPlayedAt: new Date()
    };

    const isNewHighScore = score > (user.highScore || 0);
    
    // Only update high score if new score is higher
    if (isNewHighScore) {
      updateData.highScore = score;
    }

    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateData }
    );

    // Update leaderboard cache if it's a new high score
    if (isNewHighScore) {
      try {
        const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/leaderboard-cache`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            userId, 
            newScore: score, 
            roundsPlayed 
          })
        });
        
        if (!response.ok) {
          console.error('Failed to update leaderboard cache');
        }
      } catch (error) {
        console.error('Error updating leaderboard cache:', error);
      }
    }

    return NextResponse.json({
      success: true,
      highScoreUpdated: isNewHighScore,
      newHighScore: Math.max(score, user.highScore || 0)
    });
  } catch (error) {
    console.error('Leaderboard POST error:', error);
    return NextResponse.json(
      { error: 'Failed to update score' },
      { status: 500 }
    );
  }
}