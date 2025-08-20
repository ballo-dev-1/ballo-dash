/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/no-children-prop */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable prefer-const */
/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { BarChart3, TrendingUp, PieChart, Unplug, Cable } from 'lucide-react';
import { useIntegrationModal } from '@/hooks/useIntegrationModal';

interface NoIntegrationsProps {
  variant?: 'dashboard' | 'data' | 'statistics' | 'charts';
  className?: string;
}

const NoIntegrations: React.FC<NoIntegrationsProps> = ({ 
  variant = 'dashboard', 
  className = ''
}) => {
  const { openIntegrationModal } = useIntegrationModal();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 2000); 
    return () => clearTimeout(timer);
  }, []);

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
    <div 
      className={`no-integrations-container ${className}`} 
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.5s ease-in-out'
      }}
    >
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

          <div className="d-flex justify-content-center">
            <Button
              variant="primary"
              onClick={() => openIntegrationModal('create')}
              className="d-flex align-items-center gap-2"
            >
              <Cable size={32} />
              <span className="ms-2">Set Up Integrations</span>
            </Button>
          </div> 
        </Card.Body>
      </Card>
    </div>
  );
};

export default NoIntegrations;
