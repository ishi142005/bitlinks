import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const urls = db.collection('urls');
 
    const userUrls = await urls.find({ email: session.user.email }).toArray();

    return NextResponse.json({ success: true, urls: userUrls }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user URLs:', error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
