export const subscriptionsPlans = {
  free: "FREE",
  pro: "PRO",
  enterprise: "ENTERPRISE",
};

export const integrationTypes = {
  facebook: "FACEBOOK",
  instagram: "INSTAGRAM",
  linkedin: "LINKEDIN",
  x: "X",
  tiktok: "TIKTOK",
  website: "WEBSITE",
  youtube: "YOUTUBE",
  whatsapp: "WHATSAPP",
  googleAnalytics: "GOOGLE_ANALYTICS",
  googleSearchConsole: "GOOGLE_SEARCH_CONSOLE",
};

export const integrationStatus = {
  connected: "CONNECTED",
  disconnected: "DISCONNECTED",
  pending: "PENDING",
  expired: "EXPIRED",
  error: "ERROR",
};

export const userRoles = {
  admin: "ADMIN", // Full access to company data & settings
  manager: "MANAGER", // Can view & manage campaigns, analytics
  analyst: "ANALYST", // Read-only access to analytics
  client: "CLIENT", // Basic access, e.g. view reports
};
