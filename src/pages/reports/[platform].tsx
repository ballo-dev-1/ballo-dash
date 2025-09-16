import React, { ReactElement, useEffect, useState } from "react";
import { useRouter } from "next/router";
import BreadcrumbItem from "@common/BreadcrumbItem";
import Layout from "@layout/index";
import { Row, Col, Card, Button, Spinner } from "react-bootstrap";
import Image from "next/image";
import { useAppSelector } from "@/toolkit/hooks";
import { selectCompany } from "@/toolkit/Company/reducer";
import { useIntegrations } from "@/hooks/useIntegrations";
import dynamic from "next/dynamic";
import { Download, ArrowLeft, Share2, MoreVertical } from "lucide-react";
import "@/assets/scss/reports-page.scss";
import "@/assets/scss/platform-report.scss";

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

// Import platform icons
import facebookIcon from "@/assets/images/socials/facebook.png";
import instaIcon from "@/assets/images/socials/instagram.png";
import linkedinIcon from "@/assets/images/socials/linkedin.png";
import xIcon from "@/assets/images/socials/X_icon.png";
import allPlatformsIcon from "@/assets/images/all-platforms.png";

const platformIcons: { [key: string]: any } = {
  facebook: facebookIcon,
  instagram: instaIcon,
  linkedin: linkedinIcon,
  x: xIcon,
  all: allPlatformsIcon,
};

const platformNames: { [key: string]: string } = {
  facebook: "Facebook",
  instagram: "Instagram", 
  linkedin: "LinkedIn",
  x: "X (Twitter)",
  all: "All Platforms",
};

const PlatformReport = () => {
  const router = useRouter();
  const { platform } = router.query;
  const company = useAppSelector(selectCompany);
  const { integrations, loading: integrationsLoading } = useIntegrations();
  const [viewMode, setViewMode] = useState<'summary' | 'report'>('summary');
  const [isExporting, setIsExporting] = useState(false);

  // Mock data - replace with actual data fetching
  const platformData = {
    overview: {
      followers: 12500,
      engagement: 8.5,
      reach: 45000,
      posts: 24,
    },
    metrics: {
      impressions: 125000,
      clicks: 3200,
      shares: 890,
      comments: 456,
    },
    recentPosts: [
      { id: 1, content: "Exciting news about our latest product launch!", engagement: 1250, date: "2024-01-15" },
      { id: 2, content: "Behind the scenes of our team meeting", engagement: 890, date: "2024-01-14" },
      { id: 3, content: "Customer success story", engagement: 2100, date: "2024-01-13" },
    ],
  };

  // Chart data
  const engagementChartOptions = {
    chart: {
      type: 'line' as const,
      height: 300,
      toolbar: { show: false }
    },
    colors: ['#0a1759'],
    stroke: {
      curve: 'smooth' as const,
      width: 3
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    },
    yaxis: {
      title: { text: 'Engagement Rate (%)' }
    },
    grid: {
      borderColor: '#f1f1f1'
    }
  };

  const engagementChartSeries = [{
    name: 'Engagement Rate',
    data: [6.2, 7.1, 8.3, 7.8, 8.9, 8.5]
  }];

  const handleExport = async () => {
    setIsExporting(true);
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsExporting(false);
    // Here you would implement actual export functionality
    alert('Report exported successfully!');
  };

  const handleBack = () => {
    router.push('/reports');
  };

  if (router.isFallback || integrationsLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  const platformKey = platform as string;
  const platformName = platformNames[platformKey] || 'Platform';
  const platformIcon = platformIcons[platformKey];

  return (
    <div className="platform-report-page">
      <BreadcrumbItem 
        mainTitle="Reports" 
        subTitle={`${company?.name}`}
        subTitle2={`${platformName}`}
        showPageHeader={false} 
      />
      
      {/* Header Section */}
      <Row className="mb-4">
        <Col xs={12}>
          <div className="d-flex align-items-center justify-content-between report-header">
            <div className="d-flex align-items-center">
              <div className="d-flex align-items-center">
                {platformIcon && (
                  <div className="me-3 platform-icon">
                    <Image 
                      src={platformIcon} 
                      alt={platformName} 
                      width={40} 
                      height={40}
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                )}
                <div>
                  <h2 className="mb-0">{platformName} Report</h2>
                  <small className="text-muted">Last updated: {new Date().toLocaleDateString()}</small>
                  <div className="mt-1">
                    <small className="text-info">Current View: <strong>{viewMode}</strong></small>
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex gap-2 action-buttons">
              <Button variant="outline-primary" size="sm">
                <Share2 size={16} className="me-1" />
                Share
              </Button>
              <Button variant="outline-secondary" size="sm">
                <MoreVertical size={16} />
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {viewMode === 'summary' ? (
        <>
          {/* Overview Cards */}
          <Row className="mb-4">
        <Col md={3} sm={6} className="mb-3">
          <Card className="h-100 border-0 shadow-sm overview-card metrics-card">
            <Card.Body className="text-center">
              <h6 className="text-muted mb-2 metric-label">Followers</h6>
              <h3 className="mb-0 text-primary metric-value">{platformData.overview.followers.toLocaleString()}</h3>
              <small className="text-success metric-change positive">+12.5% from last month</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="h-100 border-0 shadow-sm overview-card metrics-card">
            <Card.Body className="text-center">
              <h6 className="text-muted mb-2 metric-label">Engagement Rate</h6>
              <h3 className="mb-0 text-success metric-value">{platformData.overview.engagement}%</h3>
              <small className="text-success metric-change positive">+2.1% from last month</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="h-100 border-0 shadow-sm overview-card metrics-card">
            <Card.Body className="text-center">
              <h6 className="text-muted mb-2 metric-label">Reach</h6>
              <h3 className="mb-0 text-info metric-value">{platformData.overview.reach.toLocaleString()}</h3>
              <small className="text-success metric-change positive">+8.3% from last month</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="h-100 border-0 shadow-sm overview-card metrics-card">
            <Card.Body className="text-center">
              <h6 className="text-muted mb-2 metric-label">Posts This Month</h6>
              <h3 className="mb-0 text-warning metric-value">{platformData.overview.posts}</h3>
              <small className="text-muted metric-change">+3 from last month</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts Section */}
      <Row className="mb-4">
        <Col lg={8} className="mb-4">
          <Card className="h-100 border-0 shadow-sm chart-section">
            <Card.Header className="bg-white border-0 pb-0 chart-header">
              <h5 className="mb-0">Engagement Trends</h5>
            </Card.Header>
            <Card.Body>
              <div className="chart-container">
                <Chart
                  options={engagementChartOptions}
                  series={engagementChartSeries}
                  type="line"
                  height={300}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4} className="mb-4">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Header className="bg-white border-0 pb-0">
              <h5 className="mb-0">Top Metrics</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span>Impressions</span>
                <strong>{platformData.metrics.impressions.toLocaleString()}</strong>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span>Clicks</span>
                <strong>{platformData.metrics.clicks.toLocaleString()}</strong>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span>Shares</span>
                <strong>{platformData.metrics.shares.toLocaleString()}</strong>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span>Comments</span>
                <strong>{platformData.metrics.comments.toLocaleString()}</strong>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Posts */}
      <Row>
        <Col xs={12}>
          <Card className="border-0 shadow-sm recent-posts">
            <Card.Header className="bg-white border-0 pb-0">
              <h5 className="mb-0">Recent Posts</h5>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Content</th>
                      <th>Engagement</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {platformData.recentPosts.map((post) => (
                      <tr key={post.id}>
                        <td>
                          <div className="text-truncate post-content">
                            {post.content}
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-success engagement-badge">{post.engagement.toLocaleString()}</span>
                        </td>
                        <td>{new Date(post.date).toLocaleDateString()}</td>
                        <td>
                          <Button variant="outline-primary" size="sm" className="action-btn">
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
        </>
      ) : (
        /* PDF Report View */
        <div className="pdf-report-view">
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0 pb-0">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="mb-1">{platformName} Analytics Report</h4>
                  <p className="text-muted mb-0">Generated on {new Date().toLocaleDateString()}</p>
                </div>
                <div className="d-flex gap-2">
                  <Button variant="outline-primary" size="sm">
                    <i className="ph-duotone ph-download me-1"></i>
                    Download PDF
                  </Button>
                  <Button variant="outline-secondary" size="sm">
                    <i className="ph-duotone ph-printer me-1"></i>
                    Print
                  </Button>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              {/* Executive Summary */}
              <div className="mb-5">
                <h5 className="mb-3 text-primary">
                  <i className="ph-duotone ph-chart-line me-2"></i>
                  Executive Summary
                </h5>
                <div className="row">
                  <div className="col-md-4">
                    <div className="text-center p-3 border rounded">
                      <h3 className="text-primary mb-1">{platformData.overview.followers.toLocaleString()}</h3>
                      <p className="text-muted mb-0">Total Followers</p>
                      <small className="text-success">+12.5% vs last month</small>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="text-center p-3 border rounded">
                      <h3 className="text-success mb-1">{platformData.overview.engagement}%</h3>
                      <p className="text-muted mb-0">Engagement Rate</p>
                      <small className="text-success">+2.1% vs last month</small>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="text-center p-3 border rounded">
                      <h3 className="text-info mb-1">{platformData.overview.reach.toLocaleString()}</h3>
                      <p className="text-muted mb-0">Total Reach</p>
                      <small className="text-success">+8.3% vs last month</small>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Insights */}
              <div className="mb-5">
                <h5 className="mb-3 text-primary">
                  <i className="ph-duotone ph-lightbulb me-2"></i>
                  Key Insights & Interpretations
                </h5>
                <div className="row">
                  <div className="col-md-6">
                    <div className="p-3 border rounded h-100">
                      <h6 className="text-success mb-2">
                        <i className="ph-duotone ph-trend-up me-1"></i>
                        Positive Trends
                      </h6>
                      <ul className="mb-0">
                        <li>{platformName} engagement increased by 15% due to video content strategy</li>
                        <li>Story content shows 23% higher completion rates</li>
                        <li>User-generated content drives 40% more engagement</li>
                        <li>Cross-platform campaigns show 35% better performance</li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-3 border rounded h-100">
                      <h6 className="text-warning mb-2">
                        <i className="ph-duotone ph-warning me-1"></i>
                        Areas for Improvement
                      </h6>
                      <ul className="mb-0">
                        <li>Posting frequency could be optimized for better reach</li>
                        <li>Video content needs better optimization for mobile</li>
                        <li>Consider increasing engagement with interactive content</li>
                        <li>User-generated content campaigns show potential</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Analysis */}
              <div className="mb-5">
                <h5 className="mb-3 text-primary">
                  <i className="ph-duotone ph-chart-bar me-2"></i>
                  Performance Analysis
                </h5>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>Metric</th>
                        <th>Current</th>
                        <th>Previous</th>
                        <th>Growth</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Followers</td>
                        <td>{platformData.overview.followers.toLocaleString()}</td>
                        <td>{(platformData.overview.followers * 0.9).toLocaleString()}</td>
                        <td className="text-success">+12.5%</td>
                        <td><span className="badge bg-success">Excellent</span></td>
                      </tr>
                      <tr>
                        <td>Engagement Rate</td>
                        <td>{platformData.overview.engagement}%</td>
                        <td>{(platformData.overview.engagement - 2.1).toFixed(1)}%</td>
                        <td className="text-success">+2.1%</td>
                        <td><span className="badge bg-success">Excellent</span></td>
                      </tr>
                      <tr>
                        <td>Reach</td>
                        <td>{platformData.overview.reach.toLocaleString()}</td>
                        <td>{(platformData.overview.reach * 0.92).toLocaleString()}</td>
                        <td className="text-success">+8.3%</td>
                        <td><span className="badge bg-success">Excellent</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recommendations */}
              <div className="mb-4">
                <h5 className="mb-3 text-primary">
                  <i className="ph-duotone ph-target me-2"></i>
                  Strategic Recommendations
                </h5>
                <div className="row">
                  <div className="col-md-4">
                    <div className="card border-0 bg-light">
                      <div className="card-body">
                        <h6 className="card-title text-primary">Content Strategy</h6>
                        <p className="card-text small">Focus on video content and user-generated content. Increase posting frequency by 25%.</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card border-0 bg-light">
                      <div className="card-body">
                        <h6 className="card-title text-primary">Timing Optimization</h6>
                        <p className="card-text small">Post during peak engagement hours: 2-4 PM for maximum reach and engagement.</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card border-0 bg-light">
                      <div className="card-body">
                        <h6 className="card-title text-primary">Growth Strategy</h6>
                        <p className="card-text small">Implement cross-platform campaigns and influencer partnerships for accelerated growth.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center text-muted small border-top pt-3">
                <p className="mb-0">This report was generated automatically by Ballo Analytics Dashboard</p>
                <p className="mb-0">For questions or support, contact your account manager</p>
              </div>
            </Card.Body>
          </Card>
        </div>
      )}

      {/* Floating Toggle Button */}
      <div className="floating-toggle-btn" style={{ 
        position: 'fixed', 
        top: '50%', 
        right: '20px', 
        transform: 'translateY(-50%)', 
        zIndex: 1050,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: '10px',
        borderRadius: '15px'
      }}>
        <div className="btn-group-vertical shadow-lg" role="group">
          <Button
            variant={viewMode === 'summary' ? 'primary' : 'outline-primary'}
            onClick={() => {
              console.log('Switching to summary view');
              setViewMode('summary');
            }}
            className="d-flex align-items-center justify-content-center fw-semibold"
            size="lg"
          >
            <i className="ph-duotone ph-chart-bar me-2"></i>
            Summary
          </Button>
          <Button
            variant={viewMode === 'report' ? 'primary' : 'outline-primary'}
            onClick={() => {
              console.log('Switching to report view');
              setViewMode('report');
            }}
            className="d-flex align-items-center justify-content-center fw-semibold"
            size="lg"
          >
            <i className="ph-duotone ph-file-pdf me-2"></i>
            PDF Report
          </Button>
        </div>
      </div>

      {/* Floating Export Button */}
      <div className="floating-export-btn">
        <Button
          variant="primary"
          size="lg"
          className="rounded-circle shadow-lg"
          onClick={handleExport}
          disabled={isExporting}
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            width: '60px',
            height: '60px',
            zIndex: 1000,
          }}
        >
          {isExporting ? (
            <Spinner animation="border" size="sm" />
          ) : (
            <Download size={24} />
          )}
        </Button>
      </div>
    </div>
  );
};

PlatformReport.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default PlatformReport;
