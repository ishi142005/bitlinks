import { nanoid } from 'nanoid';
import clientPromise from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { originalUrl, shortUrl } = await req.json();

    if (!originalUrl || !originalUrl.startsWith('http')) {
      return Response.json({ success: false, error: 'Invalid URL' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const urls = db.collection('urls');

    // Ensure shortUrl is globally unique (remove email from index!)
    await urls.createIndex({ shortUrl: 1 }, { unique: true });

    let finalShortUrl = shortUrl && shortUrl.trim() !== '' ? shortUrl.trim() : null;

    if (finalShortUrl) {
      // Prevent numeric-only short URLs
      if (/^\d+$/.test(finalShortUrl)) {
        return Response.json(
          { success: false, error: 'Custom short URL cannot be purely numeric. Please include letters.' },
          { status: 400 }
        );
      }

      // ❗ Check if this short URL is already taken globally
      const existingCustomShortUrl = await urls.findOne({ shortUrl: finalShortUrl });
      if (existingCustomShortUrl) {
        return Response.json(
          { success: false, error: 'Custom short URL is already taken. Please choose a different one.' },
          { status: 400 }
        );
      }
    } else {
      // Generate a unique short URL globally
      let isUnique = false;
      while (!isUnique) {
        finalShortUrl = nanoid(7);
        const existing = await urls.findOne({ shortUrl: finalShortUrl });
        if (!existing) {
          isUnique = true;
        }
      }
    }

    // Optional: Prevent duplicate original URLs per user (not mandatory)
    const existing = await urls.findOne({ original: originalUrl, email: session.user.email });
    if (existing) {
      return Response.json({ success: true, shortUrl: existing.shortUrl });
    }

    // Save the new short URL
    await urls.insertOne({
      original: originalUrl,
      shortUrl: finalShortUrl,
      email: session.user.email,
      createdAt: new Date(),
    });

    return Response.json({ success: true, shortUrl: finalShortUrl });
  } catch (error) {
    console.error('Error generating short URL:', error);
    return Response.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
