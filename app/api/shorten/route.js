import clientPromise from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return Response.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { originalUrl, shortUrl } = await req.json();

    if (!originalUrl || !originalUrl.startsWith('http')) {
      return Response.json(
        { success: false, error: 'Invalid URL' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const urls = client.db("bitlinks").collection('urls');

    let finalShortUrl = shortUrl?.trim() || null;

    if (!finalShortUrl) {
      return Response.json(
        { success: false, error: 'Custom short URL is required.' },
        { status: 400 }
      );
    }

    // Reject purely numeric short URLs
    if (/^\d+$/.test(finalShortUrl)) {
      return Response.json(
        { success: false, error: 'Custom short URL cannot be purely numeric. Please include letters.' },
        { status: 400 }
      );
    }

    // Reject invalid characters in alias
    if (!/^[a-zA-Z0-9_-]+$/.test(finalShortUrl)) {
      return Response.json(
        {
          success: false,
          error: 'Only letters, numbers, hyphens (-), and underscores (_) are allowed in custom short URLs.',
        },
        { status: 400 }
      );
    }

    // Check global uniqueness
    const taken = await urls.findOne({ shortUrl: finalShortUrl });
    if (taken) {
      return Response.json(
        { success: false, error: 'Custom short URL is already taken. Please choose a different one.' },
        { status: 400 }
      );
    }

    // Optional: Reuse if same user already shortened same URL
    const existingForUser = await urls.findOne({
      original: originalUrl,
      email: session.user.email,
    });
    if (existingForUser) {
      return Response.json(
        { success: true, shortUrl: existingForUser.shortUrl },
        { status: 200 }
      );
    }

    // Save the new short URL
    await urls.insertOne({
      original: originalUrl,
      shortUrl: finalShortUrl,
      email: session.user.email,
      createdAt: new Date(),
    });

    return Response.json(
      { success: true, shortUrl: finalShortUrl },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Error in shorten/route:', error);
    return Response.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
