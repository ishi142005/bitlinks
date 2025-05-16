import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

// Ensure the MongoDB URI exists in the environment variables
if (!uri) {
  throw new Error('Please add your Mongo URI to .env.local');
}

// If we're in development mode, use the global variable to avoid multiple connections
if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, use a fresh MongoClient connection
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
