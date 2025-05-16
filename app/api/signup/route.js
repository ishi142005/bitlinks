import clientPromise from "@/lib/mongodb";
import { hash } from "bcryptjs";

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    if (!email || !password || !name) {
      return Response.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("bitlinks");
    const users = db.collection("users");

    const existing = await users.findOne({ email });
    if (existing) {
      return Response.json(
        { success: false, message: "User already exists" },
        { status: 409 } // Conflict status code
      );
    }

    const hashedPassword = await hash(password, 12);
    await users.insertOne({
      name,
      email,
      password: hashedPassword,
    });

    return Response.json(
      { success: true, message: "User created successfully" },
      { status: 201 } // Created status code
    );
  } catch (error) {
    console.error("Error in user signup:", error);
    return Response.json(
      { success: false, message: "An error occurred during signup" },
      { status: 500 } // Internal Server Error status code
    );
  }
}
