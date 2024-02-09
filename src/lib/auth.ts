// Import necessary modules
import { NextAuthOptions } from "next-auth";
import { db } from "./db";
import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

// Function to get Google credentials from environment variables
function getGoogleCredentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID as string;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET as string;

  if (!clientId || clientId.length === 0)
    throw new Error("Missing GOOGLE_CLIENT_ID");
  if (!clientSecret || clientSecret.length === 0)
    throw new Error("Missing GOOGLE_CLIENT_SECRET");

  return { clientId, clientSecret };
}

// Function to get GitHub credentials from environment variables
function getGithubCredentials() {
  const clientId = process.env.GITHUB_ID as string;
  const clientSecret = process.env.GITHUB_SECRET as string;

  if (!clientId || clientId.length === 0) throw new Error("Missing GITHUB_ID");
  if (!clientSecret || clientSecret.length === 0)
    throw new Error("Missing GITHUB_SECRET");

  return { clientId, clientSecret };
}

// Configuration options for NextAuth.js
export const authOptions: NextAuthOptions = {
  // Adapter for storing session and user data in Upstash (Redis-based service)
  adapter: UpstashRedisAdapter(db),

  // Session configuration
  session: {
    strategy: "jwt", // JSON Web Token (JWT) strategy for sessions
  },

  // Customization of authentication pages
  pages: {
    signIn: "/login", // Custom sign-in page
  },

  // Authentication providers (GitHub and Google)
  providers: [
    GoogleProvider({
      clientId: getGoogleCredentials().clientId,
      clientSecret: getGoogleCredentials().clientSecret,
    }),
    GithubProvider({
      clientId: getGithubCredentials().clientId,
      clientSecret: getGithubCredentials().clientSecret,
    }),
  ],

  // Callbacks for customizing JWT (JSON Web Token) handling
callbacks: {
  // Callback executed when creating or updating the JWT token
  async jwt({ token, user }) {
    // Custom logic for handling JWT tokens

    // Retrieve user data from the database based on the user's ID in the token
    const dbUser = (await db.get(`user:${token.id}`)) as User | null;

    // If the user is not found in the database, update the token with the user's ID
    if (!dbUser) {
      token.id = user!.id; // Assuming user is defined (might want to add additional checks)
      return token; // Return the updated token
    }

    // If the user is found in the database, return a modified user object
    return {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      picture: dbUser.image,
    };
  },

  // Callback executed when creating or updating the session object
  async session({ session, token }) {
    // If a valid token is provided, update the session's user information
    if (token) {
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.image = token.picture;
    }

    // Return the updated session object
    return session;
  },

  // Callback executed when a redirect is triggered
  redirect() {
    // Redirect the user to the "/dashboard" page
    return "/dashboard";
  },
},

};
