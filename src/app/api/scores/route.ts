import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { User } from '@/types/game';

const uri = process.env.MONGODB_URI!;
const dbName = process.env.DATABASE_NAME!;

// Extend the global type to include our MongoDB client promise
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let client: MongoClient;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}
const clientPromise = global._mongoClientPromise;

// Interface for score entries in the database
interface ScoreEntry {
  _id?: string;
  userId: string;
  username: string;
  score: number;
  roundsPlayed: number;
  timestamp: Date;
}

// POST - Save a new score
export async function POST(request: NextRequest) {
  try {
    const { userId, username, score, roundsPlayed } = await request.json();

    // Validate input
    if (!userId || !username || typeof score !== 'number' || typeof roundsPlayed !== 'number') {
      return NextResponse.json(
        { error: 'userId, username, score, and roundsPlayed are required' },
        { status: 400 }
      );
    }

    if (score < 0 || roundsPlayed < 0) {
      return NextResponse.json(
        { error: 'Score and rounds played must be non-negative' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(dbName);
    const scoresCollection = db.collection<ScoreEntry>('scores');
    const usersCollection = db.collection<User>('users');

    // Create score entry
    const scoreEntry: ScoreEntry = {
      userId,
      username,
      score,
      roundsPlayed,
      timestamp: new Date()
    };

    // Save the score entry
    const scoreResult = await scoresCollection.insertOne(scoreEntry);

    // Update user's high score and total rounds if this is a new high score
    const user = await usersCollection.findOne({ _id: userId });
    if (user) {
      const updates: Partial<User> = {
        lastPlayedAt: new Date(),
        totalRoundsPlayed: (user.totalRoundsPlayed || 0) + roundsPlayed
      };

      // Update high score if this score is higher
      if (score > (user.highScore || 0)) {
        updates.highScore = score;
      }

      await usersCollection.updateOne(
        { _id: userId },
        { $set: updates }
      );
    }

    return NextResponse.json({
      success: true,
      scoreId: scoreResult.insertedId,
      highScoreUpdated: user ? score > (user.highScore || 0) : false
    });

  } catch (error) {
    console.error('Error saving score:', error);
    return NextResponse.json(
      { error: 'Failed to save score' },
      { status: 500 }
    );
  }
}

// GET - Fetch global leaderboard
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const userId = searchParams.get('userId');

    const client = await clientPromise;
    const db = client.db(dbName);
    const scoresCollection = db.collection<ScoreEntry>('scores');

    // Get top scores (global leaderboard) - only highest score per player
    const topScores = await scoresCollection.aggregate([
      // Sort by score descending, then timestamp ascending
      { $sort: { score: -1, timestamp: 1 } },
      // Group by user and take the first document (which is the best score)
      {
        $group: {
          _id: "$userId",
          username: { $first: "$username" },
          score: { $first: "$score" },
          roundsPlayed: { $first: "$roundsPlayed" },
          timestamp: { $first: "$timestamp" }
        }
      },
      // Sort again by score to get the final leaderboard order
      { $sort: { score: -1, timestamp: 1 } },
      // Limit results
      { $limit: Math.min(limit, 100) },
      // Reshape the output
      {
        $project: {
          _id: 0,
          userId: "$_id",
          username: 1,
          score: 1,
          roundsPlayed: 1,
          timestamp: 1
        }
      }
    ]).toArray();

    // If userId is provided, get user's position in the global ranking
    let userPosition = null;
    if (userId) {
      // Get all players' best scores
      const allBestScores = await scoresCollection.aggregate([
        { $sort: { score: -1, timestamp: 1 } },
        {
          $group: {
            _id: "$userId",
            score: { $first: "$score" },
            timestamp: { $first: "$timestamp" }
          }
        },
        { $sort: { score: -1, timestamp: 1 } }
      ]).toArray();

      // Find the user's rank
      const userRank = allBestScores.findIndex(score => score._id === userId);

      if (userRank !== -1) {
        const userBestScore = allBestScores[userRank];
        userPosition = {
          rank: userRank + 1,
          score: userBestScore.score,
          username: topScores.find(u => u.userId === userId)?.username || ''
        };
      }
    }

    // Format the leaderboard entries
    const leaderboard = topScores.map((entry) => ({
      id: entry._id?.toString() || '',
      playerName: entry.username,
      score: entry.score,
      roundsPlayed: entry.roundsPlayed,
      timestamp: entry.timestamp.getTime()
    }));

    return NextResponse.json({
      success: true,
      leaderboard,
      userPosition,
      total: leaderboard.length
    });

  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}