import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  jsonb,
  pgEnum,
  index,
  unique,
} from "drizzle-orm/pg-core";
import {
  integrationStatus,
  integrationTypes,
  subscriptionsPlans,
  userRoles,
} from "src/data/constants";

// 1. ENUMS
export const planEnum = pgEnum("plan", [
  subscriptionsPlans.free,
  subscriptionsPlans.pro,
  subscriptionsPlans.enterprise,
]);

export const integrationTypeEnum = pgEnum("integration_type", [
  integrationTypes.facebook,
  integrationTypes.instagram,
  integrationTypes.linkedin,
  integrationTypes.x,
  integrationTypes.googleAnalytics,
  integrationTypes.googleSearchConsole,
  integrationTypes.tiktok,
  integrationTypes.youtube,
  integrationTypes.website,
]);

export const integrationStatusEnum = pgEnum("integration_status", [
  integrationStatus.connected,
  integrationStatus.disconnected,
  integrationStatus.pending,
  integrationStatus.expired,
  integrationStatus.error,
]);

export const userRoleEnum = pgEnum("user_role", [
  userRoles.admin,
  userRoles.manager,
  userRoles.analyst,
  userRoles.client,
]);

// 2. COMPANIES TABLE
export const companies = pgTable(
  "companies",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    domain: text("domain").unique(),
    logoUrl: text("logo_url"),
    websiteUrl: text("website_url"),
    timezone: text("timezone"),
    locale: text("locale"),
    plan: planEnum("plan").default("FREE").notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    isDeleted: boolean("is_deleted").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    createdBy: text("created_by"),
    updatedBy: text("updated_by"),
  },
  (companies) => ({
    domainIndex: index("companies_domain_idx").on(companies.domain),
  })
);

// 3. SOCIAL PROFILES TABLE (Normalized IDs per platform)
export const socialProfiles = pgTable(
  "social_profiles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id),
    platform: integrationTypeEnum("platform").notNull(),
    profileId: text("profile_id").notNull(), // e.g. Facebook Page ID
    handle: text("handle"),
    connectedAt: timestamp("connected_at").defaultNow(),
  },
  (socialProfiles) => ({
    uniqueCompanyPlatformProfile: unique("unique_company_platform_profile").on(
      socialProfiles.companyId,
      socialProfiles.platform
    ),
  })
);

// 4. INTEGRATIONS TABLE
export const integrations = pgTable(
  "integrations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    type: integrationTypeEnum("type").notNull(),
    status: integrationStatusEnum("status").default("PENDING").notNull(),
    handle: text("handle"), // Social media handle or profile identifier
    appId: text("app_id"),
    appSecret: text("app_secret"),
    accessToken: text("access_token").notNull(),
    refreshToken: text("refresh_token"),
    expiresAt: timestamp("expires_at"),
    lastSyncedAt: timestamp("last_synced_at"),
    metadata: jsonb("metadata"),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    createdBy: text("created_by"),
    updatedBy: text("updated_by"),
  },
  (integrations) => ({
    companyTypeIndex: index("integrations_company_type_idx").on(
      integrations.companyId,
      integrations.type
    ),
    uniqueIntegrationPerCompany: unique("unique_integration_per_company").on(
      integrations.companyId,
      integrations.type
    ),
  })
);

// 5. USERS TABLE
export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id),
    email: text("email").notNull(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    passwordHash: text("password_hash").notNull(), // Store hashed passwords only
    role: userRoleEnum("role").default("CLIENT").notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    createdBy: text("created_by"),
    updatedBy: text("updated_by"),
  },
  (users) => ({
    uniqueEmailPerCompany: unique("unique_email_per_company").on(
      users.companyId,
      users.email
    ),
    emailIndex: index("users_email_idx").on(users.email),
  })
);



// 7. MARKETING PLANS TABLE
export const marketingPlans = pgTable(
  "marketing_plans",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id),

    timeframe: text("timeframe").notNull(), // e.g., 'weekly', 'monthly', 'quarterly', 'annual'
    periodStart: timestamp("period_start").notNull(), // e.g. start of the week/month/quarter
    periodEnd: timestamp("period_end").notNull(),

    tasks: jsonb("tasks").notNull().default([]), // [{ id, title, platform, status, ... }]

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),

    createdBy: text("created_by"),
    updatedBy: text("updated_by"),
  },
  (marketingPlans) => ({
    uniqueCompanyPlanPeriod: unique("unique_company_plan_period").on(
      marketingPlans.companyId,
      marketingPlans.timeframe,
      marketingPlans.periodStart
    ),
    companyTimeframeIndex: index("marketing_plans_company_timeframe_idx").on(
      marketingPlans.companyId,
      marketingPlans.timeframe
    ),
  })
);
