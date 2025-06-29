import clientPromise from "@/lib/mongodb";
import { redirect } from "next/navigation";

export default async function ShortUrlPage({ params }) {
  // Use await to access the params before using it
  const { shorturl } = await params; // Await the params object before accessing shorturl

  const client = await clientPromise;
  const db = client.db("bitlinks");
  const urls = db.collection("urls");

  const data = await urls.findOne({ shortUrl: shorturl });

  if (data?.original) {
    redirect(data.original);  // Redirect to the original URL
  }

  return <div>404 | This URL does not exist</div>;  // Fallback if short URL does not exist
}
