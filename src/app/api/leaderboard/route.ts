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
    const usersCollection = db.collection('users');

    // Get URL parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Get top 20 users by high score
    const leaderboard = await usersCollection
      .find({})
      .sort({ highScore: -1 })
      .limit(20)
      .toArray();

    const formattedLeaderboard = leaderboard.map((user, index) => ({
      id: user._id.toString(),
      rank: index + 1,
      playerName: user.username,
      score: user.highScore || 0,
      roundsPlayed: user.totalRoundsPlayed || 0,
      timestamp: user.lastPlayedAt || user.createdAt
    }));

    let userPosition = null;
    
    // If userId is provided, find the user's position in the global leaderboard
    if (userId) {
      try {
        const userObjectId = new ObjectId(userId);
        const user = await usersCollection.findOne({ _id: userObjectId });
        
        if (user && user.highScore > 0) {
          // Count how many users have a higher score
          const higherScoreCount = await usersCollection.countDocuments({
            highScore: { $gt: user.highScore }
          });
          
          userPosition = {
            rank: higherScoreCount + 1,
            score: user.highScore,
            isInTop20: higherScoreCount < 20
          };
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

    // Only update high score if new score is higher
    if (score > (user.highScore || 0)) {
      updateData.highScore = score;
    }

    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateData }
    );

    return NextResponse.json({
      success: true,
      highScoreUpdated: score > (user.highScore || 0),
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