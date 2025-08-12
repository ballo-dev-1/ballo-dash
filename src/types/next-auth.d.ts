import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      companyId: string;
      accessTokens: {
        FACEBOOK?: string;
        LINKEDIN?: string;
      };
    };
  }

  interface User {
    id: string;
    role: string;
    companyId: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    companyId: string;
    accessTokens: {
      FACEBOOK?: string;
      LINKEDIN?: string;
    };
  }
}
