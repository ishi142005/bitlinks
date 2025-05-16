import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import { compare } from "bcryptjs";

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    // ✅ Google Provider with prompt to force account selection
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account consent",
          access_type: "offline",
          response_type: "code",
        },
      },
      profile(profile) {
        return {
          id: profile.sub,
          email: profile.email,
          name: profile.name || profile.email.split("@")[0],
          image: profile.picture,
        };
      },
    }),

    //Email/Password Credentials Provider
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const client = await clientPromise;
        const users = client.db("bitlinks").collection("users");

        const user = await users.findOne({ email: credentials.email });

        if (!user || !(await compare(credentials.password, user.password))) {
          throw new Error("Invalid email or password");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name || user.email.split("@")[0],
        };
      },
    }),
  ],

  pages: {
    signIn: "/signin",
    error: "/auth/error",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    // Block Google sign-ins if email not found in DB
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const client = await clientPromise;
        const users = client.db("bitlinks").collection("users");

        const existingUser = await users.findOne({ email: user.email });
        if (!existingUser) {
          console.log("Blocked Google login attempt for:", user.email);
          return false;
        }
      }
      return true;
    },

    // ✅ Attach user ID to JWT
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        console.log("User data in JWT callback:", user);
      }
      console.log("Final JWT token:", token);
      return token;
    },

    // ✅ Attach ID to session
    async session({ session, token }) {
      if (token && session?.user) {
        session.user.id = token.id || token.sub;
        console.log("Session user data:", session.user);
      }
      return session;
    },
  },
};

// ✅ Fixed variable name
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
