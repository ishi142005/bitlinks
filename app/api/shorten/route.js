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

    // Ensure compound unique index exists (shortUrl + email)
    await urls.createIndex({ shortUrl: 1, email: 1 }, { unique: true });

    let finalShortUrl = shortUrl && shortUrl.trim() !== '' ? shortUrl.trim() : null;

    if (finalShortUrl) {
      // Disallow purely numeric custom short URLs
      if (/^\d+$/.test(finalShortUrl)) {
        return Response.json(
          { success: false, error: 'Custom short URL cannot be purely numeric. Please include letters.' },
          { status: 400 }
        );
      }

      // Check if the custom short URL already exists for this user
      const existingCustomShortUrl = await urls.findOne({
        shortUrl: finalShortUrl,
        email: session.user.email,
      });
      if (existingCustomShortUrl) {
        return Response.json(
          { success: false, error: 'Custom short URL already exists. Please try a different one.' },
          { status: 400 }
        );
      }
    } else {
      // Generate a unique short URL not used by the current user
      let isUnique = false;
      while (!isUnique) {
        finalShortUrl = nanoid(7);
        const existing = await urls.findOne({ shortUrl: finalShortUrl, email: session.user.email });
        if (!existing) {
          isUnique = true;
        }
      }
    }

    // Check if user already created a short URL for the same original URL
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
