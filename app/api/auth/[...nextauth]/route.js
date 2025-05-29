import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import { compare } from "bcryptjs";

const adapter = MongoDBAdapter(clientPromise);

export const authOptions = {
  adapter,
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
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

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const client = await clientPromise;
          const users = client.db("bitlinks").collection("users");
      
          const user = await users.findOne({ email: credentials.email });
      
          if (!user) {
            console.log("No user found");
            return null; 
          }
      
          const isValid = await compare(credentials.password, user.password);
          if (!isValid) {
            console.log("Invalid password");
            return null; 
          }
      
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name || user.email.split("@")[0],
          };
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
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
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const client = await clientPromise;
        const users = client.db("bitlinks").collection("users");

        const existingUser = await users.findOne({ email: user.email });
        if (!existingUser) {
          // Automatically register new Google user
          await users.insertOne({
            email: user.email,
            name: user.name,
            image: user.image,
            provider: "google",
          });
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id || token.sub;
      }
      return session;
    },

    redirect({ url, baseUrl }) {
      return "/profile"; // Always redirect to profile after login
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
