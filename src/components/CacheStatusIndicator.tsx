// src/components/CacheStatusIndicator.tsx
import React from 'react';

interface CacheStatusIndicatorProps {
  data: any;
  platform: string;
}

const CacheStatusIndicator: React.FC<CacheStatusIndicatorProps> = ({ data, platform }) => {
  if (!data || !(data as any)._cached) {
    return null;
  }

  const cacheInfo = {
    lastFetched: (data as any)._lastFetchedAt,
    status: (data as any)._fetchStatus,
    message: (data as any)._message
  };

  const getBadgeColor = (status: string) => {
    switch (status) {
      case 'ERROR':
        return 'bg-warning';
      case 'PENDING':
        return 'bg-secondary';
      case 'SUCCESS':
      default:
        return 'bg-info';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ERROR':
        return '⚠️';
      case 'PENDING':
        return '⏳';
      case 'SUCCESS':
      default:
        return '📦';
    }
  };

  const formatLastFetched = (timestamp: string) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  };

  return (
    <div className={`badge ${getBadgeColor(cacheInfo.status)} d-flex align-items-center gap-2 text-primary`}>
      <span>{getStatusIcon(cacheInfo.status)} {platform} Cached</span>
      <small>{cacheInfo.status}</small>
      {cacheInfo.lastFetched && (
        <small className="text-primary">({formatLastFetched(cacheInfo.lastFetched)})</small>
      )}
      {cacheInfo.message && (
        <small className="ms-2 text-primary">({cacheInfo.message})</small>
      )}
    </div>
  );
};

export default CacheStatusIndicator;
