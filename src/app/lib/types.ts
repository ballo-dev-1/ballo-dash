// File: lib/types.ts
export type AnalyticsMetric = {
  type: string;
  value: number;
  date: string;
};

export type PlatformAnalytics = {
  platform: string;
  accountId: string;
  metrics: AnalyticsMetric[];
};
