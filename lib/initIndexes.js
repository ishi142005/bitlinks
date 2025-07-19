import clientPromise from './mongodb';

let indexesInitialized = false;

export async function initIndexes() {
  if (indexesInitialized) return; // prevent duplicate calls
  indexesInitialized = true;

  try {
    const client = await clientPromise;
    const db = client.db('bitlinks'); // change if your DB name is different
    const urls = db.collection('urls');

    // Create unique index on shortUrl to prevent duplicates
    await urls.createIndex({ shortUrl: 1 }, { unique: true });

    console.log('[MongoDB] Index on shortUrl ensured.');
  } catch (err) {
    console.error('[MongoDB] Index initialization error:', err);
  }
}
