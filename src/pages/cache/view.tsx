// src/pages/cache/view.tsx
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Badge, Button, Alert, Spinner } from "react-bootstrap";
import { useRouter } from "next/router";

interface CacheEntry {
  id: string;
  companyId: string;
  platform: string;
  profileId: string;
  data: any;
  lastFetchedAt: string;
  expiresAt: string;
  fetchStatus: 'SUCCESS' | 'ERROR' | 'PENDING';
  errorMessage?: string;
}

interface CacheStats {
  total: number;
  byPlatform: { [key: string]: number };
  byStatus: { [key: string]: number };
  oldestEntry: string | null;
  newestEntry: string | null;
}

const CacheViewPage = () => {
  const [cacheData, setCacheData] = useState<{
    xCache: CacheEntry[];
    linkedInCache: CacheEntry[];
    metaCache: CacheEntry[];
  } | null>(null);
  const [cacheStats, setCacheStats] = useState<CacheStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const router = useRouter();

  const fetchCacheData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/debug/cache-view');
      if (!response.ok) {
        throw new Error(`Failed to fetch cache data: ${response.status}`);
      }
      
      const data = await response.json();
      setCacheData({
        xCache: data.xCache || [],
        linkedInCache: data.linkedInCache || [],
        metaCache: data.metaCache || []
      });
      setCacheStats(data.cacheStats || {});
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCacheData();
  }, [refreshKey]);

  const refreshData = () => {
    setRefreshKey(prev => prev + 1);
  };

  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return <Badge bg="success">SUCCESS</Badge>;
      case 'ERROR':
        return <Badge bg="danger">ERROR</Badge>;
      case 'PENDING':
        return <Badge bg="warning">PENDING</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toUpperCase()) {
      case 'X':
        return '🐦';
      case 'LINKEDIN':
        return '💼';
      case 'META':
        return '📘';
      default:
        return '📱';
    }
  };

  const renderCacheEntry = (entry: CacheEntry) => {
    const isExpired = new Date() > new Date(entry.expiresAt);
    
    return (
      <Card key={entry.id} className={`mb-3 ${isExpired ? 'border-warning' : ''}`}>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div>
            <span className="me-2">{getPlatformIcon(entry.platform)}</span>
            <strong>{entry.platform}</strong>
            <span className="ms-2 text-muted">•</span>
            <span className="ms-2">{entry.profileId}</span>
          </div>
          <div>
            {getStatusBadge(entry.fetchStatus)}
            {isExpired && <Badge bg="warning" className="ms-2">EXPIRED</Badge>}
          </div>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <small className="text-muted">Last Fetched:</small>
              <div>{formatTimestamp(entry.lastFetchedAt)}</div>
              <small className="text-muted">Expires:</small>
              <div>{formatTimestamp(entry.expiresAt)}</div>
            </Col>
            <Col md={6}>
              <small className="text-muted">Cache Age:</small>
              <div>{formatTimestamp(entry.lastFetchedAt)}</div>
              <small className="text-muted">Status:</small>
              <div>{entry.fetchStatus}</div>
            </Col>
          </Row>
          
          {entry.errorMessage && (
            <Alert variant="danger" className="mt-2 mb-0">
              <strong>Error:</strong> {entry.errorMessage}
            </Alert>
          )}
          
          <details className="mt-3">
            <summary>View Cached Data</summary>
            <pre className="mt-2 p-2 bg-light rounded" style={{ fontSize: '0.8rem' }}>
              {JSON.stringify(entry.data, null, 2)}
            </pre>
          </details>
        </Card.Body>
      </Card>
    );
  };

  const renderPlatformSection = (title: string, data: CacheEntry[], icon: string) => (
    <Col md={6} className="mb-4">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <span className="me-2">{icon}</span>
            {title}
          </h5>
          <Badge bg="info">{data.length} entries</Badge>
        </Card.Header>
        <Card.Body>
          {data.length === 0 ? (
            <Alert variant="info">No cached data available</Alert>
          ) : (
            data.map(renderCacheEntry)
          )}
        </Card.Body>
      </Card>
    </Col>
  );

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3">Loading cache data...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1>📦 Cache Management</h1>
              <p className="text-muted">View and manage cached social media data</p>
            </div>
            <div className="d-flex gap-2">
              <Button onClick={refreshData} variant="outline-primary">
                🔄 Refresh Cache Data
              </Button>
              <Button 
                onClick={() => window.open('/api/debug/db-check', '_blank')} 
                variant="outline-info"
              >
                🔍 Check Database
              </Button>
              <Button 
                onClick={() => window.open('/api/debug/tables-check', '_blank')} 
                variant="outline-secondary"
              >
                📋 Check Tables
              </Button>
              <Button 
                onClick={() => window.open('/api/debug/integrations-check', '_blank')} 
                variant="outline-warning"
              >
                🔌 Check Integrations
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="mb-4">
          <strong>Error:</strong> {error}
        </Alert>
      )}

      {/* Cache Statistics */}
      {cacheStats && (
        <Row className="mb-4">
          <Col>
            <Card>
              <Card.Header>
                <h5>📊 Cache Statistics</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={3}>
                    <div className="text-center">
                      <h3>{cacheStats.total}</h3>
                      <small className="text-muted">Total Entries</small>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="text-center">
                      <h3>{cacheStats.byPlatform?.X || 0}</h3>
                      <small className="text-muted">X Platform</small>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="text-center">
                      <h3>{cacheStats.byPlatform?.LINKEDIN || 0}</h3>
                      <small className="text-muted">LinkedIn</small>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="text-center">
                      <h3>{cacheStats.byPlatform?.META || 0}</h3>
                      <small className="text-muted">Meta</small>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Cache Data by Platform */}
      <Row>
        {renderPlatformSection('X (Twitter)', cacheData?.xCache || [], '🐦')}
        {renderPlatformSection('LinkedIn', cacheData?.linkedInCache || [], '💼')}
      </Row>
      
      <Row>
        {renderPlatformSection('Meta (Facebook)', cacheData?.metaCache || [], '📘')}
        <Col md={6} className="mb-4">
          <Card>
            <Card.Header>
              <h5>ℹ️ Cache Information</h5>
            </Card.Header>
            <Card.Body>
              <p><strong>Cache Duration:</strong> 30 minutes</p>
              <p><strong>Storage:</strong> PostgreSQL Database</p>
              <p><strong>Persistence:</strong> Survives sessions and restarts</p>
              <p><strong>Company Isolation:</strong> Each company has separate cache</p>
              <hr />
              <p className="text-muted small">
                Cached data is automatically cleaned up when expired. 
                Only successful API responses are stored in cache.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CacheViewPage;
