export type Plan = "FREE" | "BASIC" | "PRO" | "ENTERPRISE"; // expand if you have more plans

export interface Company {
  id: string; // uuid
  name: string;
  domain?: string | null;
  logoUrl?: string | null;
  websiteUrl?: string | null;
  timezone?: string | null;
  locale?: string | null;
  plan: Plan;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string | null;
  updatedBy?: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified?: string | null;
  image?: string | null;
  role?: "ADMIN" | "USER" | "MANAGER" | "EDITOR"; // Extend as needed
  companyId?: string; // Useful if user is associated with a company
  createdAt?: string;
  updatedAt?: string;
}
