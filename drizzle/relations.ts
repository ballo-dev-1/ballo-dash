import { relations } from "drizzle-orm/relations";
import { companies, socialProfiles, users, integrations, marketingPlans } from "./schema";

export const socialProfilesRelations = relations(socialProfiles, ({one}) => ({
	company: one(companies, {
		fields: [socialProfiles.companyId],
		references: [companies.id]
	}),
}));

export const companiesRelations = relations(companies, ({many}) => ({
	socialProfiles: many(socialProfiles),
	users: many(users),
	integrations: many(integrations),
	marketingPlans: many(marketingPlans),
}));

export const usersRelations = relations(users, ({one}) => ({
	company: one(companies, {
		fields: [users.companyId],
		references: [companies.id]
	}),
}));

export const integrationsRelations = relations(integrations, ({one}) => ({
	company: one(companies, {
		fields: [integrations.companyId],
		references: [companies.id]
	}),
}));

export const marketingPlansRelations = relations(marketingPlans, ({one}) => ({
	company: one(companies, {
		fields: [marketingPlans.companyId],
		references: [companies.id]
	}),
}));