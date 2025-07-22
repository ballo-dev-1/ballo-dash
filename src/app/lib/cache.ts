// src/lib/cache.ts
type CacheEntry<T> = {
  value: T;
  expiry: number;
};

const cache: Record<string, CacheEntry<any>> = {};

export function setCache<T>(key: string, value: T, ttlSeconds: number) {
  cache[key] = {
    value,
    expiry: Date.now() + ttlSeconds * 1000,
  };
}

export function getCache<T>(key: string): T | null {
  const entry = cache[key];
  if (!entry) return null;
  if (Date.now() > entry.expiry) {
    delete cache[key]; // optional: cleanup expired entry
    return null;
  }
  return entry.value;
}
