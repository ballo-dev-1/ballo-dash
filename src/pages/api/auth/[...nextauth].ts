import NextAuth, { AuthOptions, SessionStrategy } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/db/db"; // your Drizzle db client
import { users, integrations } from "@/db/schema"; // your user table schema
import bcrypt from "bcryptjs";
import { eq, and } from "drizzle-orm";
import type { JWT } from "next-auth/jwt";

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
      // console.log("🔄 JWT Callback triggered");
      // console.log("   Has user object:", !!user);
      // console.log("   Current token keys:", Object.keys(token));
      // console.log("   Current accessTokens:", token.accessTokens);
      
      // Attach user.id, role, and companyId to token on initial sign-in
      if (user) {
        // console.log("👤 User object found, processing initial sign-in");
        // console.log("   User email:", user.email);
        // console.log("   User companyId:", user.companyId);
        
        token.id = user.id;
        token.role = user.role;
        token.companyId = user.companyId;
      } else {
        // console.log("👤 No user object, token already exists");
        // console.log("   Current accessTokens in token:", token.accessTokens);
      }
      
      // Always check for access tokens (both on initial sign-in and subsequent calls)
      const companyId = token.companyId;
      if (companyId && (!token.accessTokens || Object.keys(token.accessTokens || {}).length === 0)) {
        // console.log("🔍 Fetching integrations for company:", companyId);
        try {
          const companyIntegrations = await db
            .select()
            .from(integrations)
            .where(eq(integrations.companyId, companyId));
          
          // console.log("📊 Found integrations:", companyIntegrations.length);
          companyIntegrations.forEach((integration, index) => {
            console.log(`   Integration ${index + 1}:`, {
              id: integration.id,
              type: integration.type,
              hasToken: !!integration.accessToken,
              tokenPreview: integration.accessToken ? integration.accessToken.substring(0, 20) + "..." : "NO_TOKEN"
            });
          });
          
          const accessTokens: { FACEBOOK?: string; LINKEDIN?: string } = {};
          
          companyIntegrations.forEach((integration) => {
            if (integration.accessToken) {
              // Ensure the token is properly preserved, especially the '=' prefix for LinkedIn
              const tokenValue = integration.accessToken;
              accessTokens[integration.type as keyof typeof accessTokens] = tokenValue;
              
              // Log token details for debugging
              if (integration.type === 'LINKEDIN') {
                console.log(`🔐 LinkedIn Token Details:`);
                console.log(`   Original Length: ${tokenValue.length}`);
                console.log(`   Starts with '=': ${tokenValue.startsWith('=')}`);
                console.log(`   First 50 chars: ${tokenValue.substring(0, 50)}`);
                console.log(`   Last 50 chars: ${tokenValue.substring(tokenValue.length - 50)}`);
              }
            }
          });
          
          token.accessTokens = accessTokens;
          
          // Check JWT token size to ensure LinkedIn token fits
          if (accessTokens.LINKEDIN) {
            const linkedinTokenSize = JSON.stringify(accessTokens.LINKEDIN).length;
            console.log("🔐 JWT Token Size Check:");
            console.log("   LinkedIn Token String Size:", linkedinTokenSize);
            console.log("   JWT Token Total Size Estimate:", JSON.stringify(token).length);
            
            // Warn if token is getting too large
            if (linkedinTokenSize > 4000) {
              console.warn("⚠️ LinkedIn token is very large, may cause JWT size issues");
            }
          }
          
          console.log("🔐 JWT Callback - Stored access tokens for user:", token.email || "unknown");
          console.log("   Company ID:", companyId);
          console.log("   Available tokens:", Object.keys(accessTokens));
          console.log("   Facebook token exists:", !!accessTokens.FACEBOOK);
          console.log("   LinkedIn token exists:", !!accessTokens.LINKEDIN);
          if (accessTokens.FACEBOOK) {
            console.log("   Facebook token preview:", accessTokens.FACEBOOK.substring(0, 20) + "...");
          }
          if (accessTokens.LINKEDIN) {
            console.log("   LinkedIn token preview:", accessTokens.LINKEDIN.substring(0, 20) + "...");
            console.log("   LinkedIn token full length in JWT:", accessTokens.LINKEDIN.length);
          }
        } catch (error) {
          console.error("❌ Error fetching access tokens for JWT:", error);
          token.accessTokens = {};
        }
      } else if (companyId) {
        // console.log("✅ Access tokens already exist in token for company:", companyId);
      } else {
        // console.log("⚠️ No company ID found in token");
      }
      
      // console.log("🔄 JWT Callback completed");
      return token;  // Return updated token
    },
    async session({ session, token }) {
      // Add custom fields to session.user
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.companyId = token.companyId as string;
        session.user.accessTokens = token.accessTokens as { FACEBOOK?: string; LINKEDIN?: string };
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
