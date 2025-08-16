import React from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { Plus, BarChart3, TrendingUp, PieChart, Unplug } from 'lucide-react';
import Link from 'next/link';
import IntegrationManagementModal from '@/views/Dashboard/IntegrationManagementModal';

interface NoIntegrationsProps {
  variant?: 'dashboard' | 'data' | 'statistics' | 'charts';
  showSetupButton?: boolean;
  className?: string;
}

const NoIntegrations: React.FC<NoIntegrationsProps> = ({ 
  variant = 'dashboard', 
  showSetupButton = true,
  className = ''
}) => {
  const getVariantContent = () => {
    switch (variant) {
      case 'dashboard':
        return {
          icon: <Unplug size={48} className="text-muted mb-3" />,
          title: 'No Integrations Found',
          subtitle: 'Connect your social media accounts to start tracking performance',
          description: 'Set up integrations with Facebook, LinkedIn, Instagram, and other platforms to view your dashboard data.',
          features: [
            'Track social media performance',
            'Monitor engagement metrics',
            'View audience insights',
            'Generate comprehensive reports'
          ]
        };
      
      case 'data':
        return {
          icon: <BarChart3 size={48} className="text-muted mb-3" />,
          title: 'No Data Available',
          subtitle: 'Connect integrations to start collecting data',
          description: 'Once you set up integrations, you\'ll be able to view detailed analytics and performance data.',
          features: [
            'Real-time data collection',
            'Historical performance tracking',
            'Cross-platform analytics',
            'Export capabilities'
          ]
        };
      
      case 'statistics':
        return {
          icon: <TrendingUp size={48} className="text-muted mb-3" />,
          title: 'No Statistics to Display',
          subtitle: 'Set up integrations to view performance statistics',
          description: 'Connect your social media accounts to start tracking key performance indicators and trends.',
          features: [
            'Engagement rates',
            'Follower growth',
            'Content performance',
            'Audience demographics'
          ]
        };
      
      case 'charts':
        return {
          icon: <PieChart size={48} className="text-muted mb-3" />,
          title: 'No Charts Available',
          subtitle: 'Connect integrations to visualize your data',
          description: 'Set up integrations to create beautiful charts and visualizations of your social media performance.',
          features: [
            'Interactive charts',
            'Performance trends',
            'Comparative analysis',
            'Custom dashboards'
          ]
        };
      
      default:
        return {
          icon: <Unplug size={48} className="text-muted mb-3" />,
          title: 'No Integrations Found',
          subtitle: 'Get started by connecting your accounts',
          description: 'Set up integrations to unlock the full potential of your dashboard.',
          features: [
            'Social media tracking',
            'Performance analytics',
            'Data insights',
            'Automated reporting'
          ]
        };
    }
  };

  const content = getVariantContent();

  return (
    <div className={`no-integrations-container ${className}`}>
      <Card className="border-0 shadow-sm">
        <Card.Body className="text-center p-5">
          <div className="d-flex justify-content-center mb-4">
            {content.icon}
          </div>
          
          <h3 className="mb-3 fw-bold text-dark">{content.title}</h3>
          <p className="text-muted mb-4 fs-5">{content.subtitle}</p>
          
          <p className="text-muted mb-4 mx-auto" style={{ maxWidth: '600px' }}>
            {content.description}
          </p>

          <Row className="justify-content-center mb-4">
            {content.features.map((feature, index) => (
              <Col key={index} md={6} lg={3} className="mb-3 mt-1">
                <div className="d-flex align-items-center justify-content-center">
                  <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-2" 
                       style={{ width: '24px', height: '24px' }}>
                    <div className="bg-primary rounded-circle" style={{ width: '6px', height: '6px' }}></div>
                  </div>
                  <small className="text-muted">{feature}</small>
                </div>
              </Col>
            ))}
          </Row>

          {showSetupButton && (
            <div className="d-flex justify-content-center gap-3">
                             <IntegrationManagementModal 
                 text="Set Up Integrations" 
                 onIntegrationCreated={() => {
                   // Refresh the page to update integration state
                   window.location.reload();
                 }}
                 onIntegrationDeleted={() => {
                   // Refresh the page to update integration state
                   window.location.reload();
                 }}
               />
              {/*               
                <Button variant="outline-secondary" size="lg">
                  Learn More
                </Button>
               */}
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default NoIntegrations;
