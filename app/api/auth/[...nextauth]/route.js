import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import mongoose from "mongoose";
import connectDB from '@/db/connectDB';
import User from '@/models/User';

import Payment from '@/models/Payment';


export const authOptions ={
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    // ...add more providers here
  ],

  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (account.provider == "github") {
        // Connect to the database
        await connectDB();

        // Extract email from the profile object
        const email = profile?.email || user?.email;

        if (!email) {
          console.error("Email is undefined. Cannot proceed with sign-in. ");
          return false; // Reject the sign-in attempt
        }
        // Check if the user already exists in the database
        let dbUser= await User.findOne({ email });
        if (!dbUser) {
          // Create a new user
            dbUser = new User({
            email,
            username: email.split("@")[0],
            name: profile.name || user.name || email.split("@")[0],
          })
          await dbUser.save();
        }
        user.name = dbUser.username;
        return true;
      }
      return false;
    },

    async session({ session}) {
      await connectDB();
      const dbUser = await User.findOne({ email: session.user.email })
      session.user.name = dbUser.username
      return session;
    },
  },
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };


