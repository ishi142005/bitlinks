import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (!uri) {
  throw new Error('Please add your Mongo URI to .env.local');
}

async function createIndexes(db) {
  try {
    const collection = db.collection('urls');

    // Create unique index on shortUrl field
    await collection.createIndex({ shortUrl: 1 }, { unique: true });

    // You can add more indexes here if needed
  } catch (error) {
    console.error('Error creating indexes:', error);
  }
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect().then(async (client) => {
      const db = client.db('bitlinks');
      await createIndexes(db);
      return client;
    });
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect().then(async (client) => {
    const db = client.db('bitlinks');
    await createIndexes(db);
    return client;
  });
}

export default clientPromise;
