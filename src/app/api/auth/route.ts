import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { User } from '@/types/game';

const uri = process.env.MONGODB_URI!;
const dbName = process.env.DATABASE_NAME!;

let client: MongoClient;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}
const clientPromise = global._mongoClientPromise;

export async function POST(request: NextRequest) {
  try {
    const { username, pin, action } = await request.json();

    // Validate input
    if (!username || !pin) {
      return NextResponse.json(
        { error: 'Username and PIN are required' },
        { status: 400 }
      );
    }

    // Validate username format
    if (username.length < 4 || username.length > 10) {
      return NextResponse.json(
        { error: 'Username must be between 4 and 10 characters' },
        { status: 400 }
      );
    }

    // Validate PIN format (6 digits)
    if (!/^\d{6}$/.test(pin)) {
      return NextResponse.json(
        { error: 'PIN must be exactly 6 digits' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(dbName);
    const usersCollection = db.collection('users');

    if (action === 'login') {
      // Find existing user
      const existingUser = await usersCollection.findOne({ username, pin });
      
      if (!existingUser) {
        return NextResponse.json(
          { error: 'Invalid username or PIN' },
          { status: 401 }
        );
      }

      // Update last played timestamp
      await usersCollection.updateOne(
        { _id: existingUser._id },
        { $set: { lastPlayedAt: new Date() } }
      );

      return NextResponse.json({
        user: {
          _id: existingUser._id.toString(),
          username: existingUser.username,
          pin: existingUser.pin,
          highScore: existingUser.highScore || 0,
          totalRoundsPlayed: existingUser.totalRoundsPlayed || 0,
          createdAt: existingUser.createdAt,
          lastPlayedAt: new Date()
        }
      });
    } else if (action === 'register') {
      // Check if username already exists
      const existingUser = await usersCollection.findOne({ username });
      
      if (existingUser) {
        return NextResponse.json(
          { error: 'Username already exists' },
          { status: 409 }
        );
      }

      // Create new user
      const newUser: Omit<User, '_id'> = {
        username,
        pin,
        highScore: 0,
        totalRoundsPlayed: 0,
        createdAt: new Date(),
        lastPlayedAt: new Date()
      };

      const result = await usersCollection.insertOne(newUser);

      return NextResponse.json({
        user: {
          _id: result.insertedId.toString(),
          ...newUser
        }
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use "login" or "register"' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Auth API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}