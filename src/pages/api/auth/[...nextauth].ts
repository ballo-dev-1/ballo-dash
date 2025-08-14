import NextAuth, { AuthOptions, SessionStrategy } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/db/db"; // your Drizzle db client
import { users } from "@/db/schema"; // your user table schema
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.username));

        if (!user) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );
        if (!isValid) return null;

        return {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          role: user.role,
          companyId: user.companyId,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      // Attach user.id, role, and companyId to token on initial sign-in
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.companyId = user.companyId;
      } 
      
      // No more token fetching - tokens are now fetched directly from database when needed
      return token;
    },
    async session({ session, token }) {
      // Add custom fields to session.user
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.companyId = token.companyId as string;
        // No more accessTokens - tokens are fetched directly from database when needed
      }
      return session;  // Return updated session
    },
    async redirect({ url, baseUrl }) {
      // Redirect to baseUrl (usually "/") after sign-in
      return baseUrl;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
export default handler;
