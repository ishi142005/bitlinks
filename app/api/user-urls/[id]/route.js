import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// DELETE: delete a URL by ID
export async function DELETE(request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop(); // get the last segment of the URL path

    const client = await clientPromise;
    const db = client.db();

    // Fetch the URL to be deleted (in case you want to return it)
    const urlToDelete = await db.collection("urls").findOne({ _id: new ObjectId(id), email: session.user.email });

    const result = await db.collection("urls").deleteOne({
      _id: new ObjectId(id),
      email: session.user.email,
    });

    // If the deletion was successful, return the deleted URL
    if (result.deletedCount > 0) {
      return NextResponse.json({ success: true, deletedUrl: urlToDelete });
    } else {
      return NextResponse.json({ error: "Failed to delete URL" }, { status: 500 });
    }
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// GET: fetch a URL by ID
export async function GET(request, { params }) {
  const session = await getServerSession(authOptions); // No { req }

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();

    const url = await db.collection("urls").findOne({
      _id: new ObjectId(params.id),
      email: session.user.email,
    });

    if (!url) {
      return NextResponse.json({ error: "URL not found" }, { status: 404 });
    }

    return NextResponse.json(url);
  } catch (error) {
    console.error("Get error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
