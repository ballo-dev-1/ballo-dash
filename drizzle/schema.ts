import { pgTable, index, unique, uuid, text, boolean, timestamp, foreignKey, jsonb, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const integrationStatus = pgEnum("integration_status", ['CONNECTED', 'EXPIRED', 'ERROR'])
export const integrationType = pgEnum("integration_type", ['FACEBOOK', 'INSTAGRAM', 'LINKEDIN', 'X', 'GOOGLE_ANALYTICS', 'GOOGLE_SEARCH_CONSOLE', 'TIKTOK', 'YOUTUBE', 'WEBSITE'])
export const plan = pgEnum("plan", ['FREE', 'PRO', 'ENTERPRISE'])
export const userRole = pgEnum("user_role", ['ADMIN', 'MANAGER', 'ANALYST', 'CLIENT'])


export const companies = pgTable("companies", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	domain: text(),
	logoUrl: text("logo_url"),
	websiteUrl: text("website_url"),
	timezone: text(),
	locale: text(),
	plan: plan().default('FREE').notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	isDeleted: boolean("is_deleted").default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	createdBy: text("created_by"),
	updatedBy: text("updated_by"),
}, (table) => [
	index("companies_domain_idx").using("btree", table.domain.asc().nullsLast().op("text_ops")),
	unique("companies_domain_unique").on(table.domain),
]);

export const socialProfiles = pgTable("social_profiles", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	companyId: uuid("company_id").notNull(),
	platform: integrationType().notNull(),
	profileId: text("profile_id").notNull(),
	handle: text(),
	connectedAt: timestamp("connected_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.companyId],
			foreignColumns: [companies.id],
			name: "social_profiles_company_id_companies_id_fk"
		}),
	unique("unique_company_platform_profile").on(table.companyId, table.platform),
]);

export const users = pgTable("users", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	companyId: uuid("company_id").notNull(),
	email: text().notNull(),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	passwordHash: text("password_hash").notNull(),
	role: userRole().default('CLIENT').notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	createdBy: text("created_by"),
	updatedBy: text("updated_by"),
}, (table) => [
	index("users_email_idx").using("btree", table.email.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.companyId],
			foreignColumns: [companies.id],
			name: "users_company_id_companies_id_fk"
		}),
	unique("unique_email_per_company").on(table.companyId, table.email),
]);

export const integrations = pgTable("integrations", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	type: integrationType().notNull(),
	status: integrationStatus().default('CONNECTED').notNull(),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	expiresAt: timestamp("expires_at", { mode: 'string' }),
	lastSyncedAt: timestamp("last_synced_at", { mode: 'string' }),
	metadata: jsonb(),
	companyId: uuid("company_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	createdBy: text("created_by"),
	updatedBy: text("updated_by"),
	appId: text("app_id"),
	appSecret: text("app_secret"),
}, (table) => [
	index("integrations_company_type_idx").using("btree", table.companyId.asc().nullsLast().op("uuid_ops"), table.type.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.companyId],
			foreignColumns: [companies.id],
			name: "integrations_company_id_companies_id_fk"
		}),
]);

export const marketingPlans = pgTable("marketing_plans", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	companyId: uuid("company_id").notNull(),
	timeframe: text().notNull(),
	periodStart: timestamp("period_start", { mode: 'string' }).notNull(),
	periodEnd: timestamp("period_end", { mode: 'string' }).notNull(),
	tasks: jsonb().default([]).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	createdBy: text("created_by"),
	updatedBy: text("updated_by"),
}, (table) => [
	index("marketing_plans_company_timeframe_idx").using("btree", table.companyId.asc().nullsLast().op("text_ops"), table.timeframe.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.companyId],
			foreignColumns: [companies.id],
			name: "marketing_plans_company_id_companies_id_fk"
		}),
	unique("unique_company_plan_period").on(table.companyId, table.timeframe, table.periodStart),
]);
