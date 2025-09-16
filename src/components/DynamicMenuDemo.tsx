import React from 'react';
import { useDynamicMenu } from '@/hooks/useDynamicMenu';
import { Card, Badge, ListGroup } from 'react-bootstrap';

/**
 * Demo component to show how the dynamic menu works
 * This component displays the current dynamic menu items based on integrations
 */
const DynamicMenuDemo: React.FC = () => {
  const { reportsMenuItem, dynamicReportItems, integrationsLoading } = useDynamicMenu();

  if (integrationsLoading) {
    return (
      <Card>
        <Card.Header>
          <h5>Dynamic Menu Demo</h5>
        </Card.Header>
        <Card.Body>
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading integrations...</p>
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Header>
        <h5>Dynamic Menu Demo</h5>
        <small className="text-muted">
          This shows how the menu dynamically updates based on connected integrations
        </small>
      </Card.Header>
      <Card.Body>
        <div className="mb-3">
          <h6>Reports Menu Item:</h6>
          <div className="d-flex align-items-center">
            <i className={`${reportsMenuItem.icon} me-2`}></i>
            <span>{reportsMenuItem.label}</span>
            {reportsMenuItem.submenu && (
              <Badge bg="info" className="ms-2">
                {reportsMenuItem.submenu.length} items
              </Badge>
            )}
          </div>
        </div>

        {reportsMenuItem.submenu && reportsMenuItem.submenu.length > 0 && (
          <div>
            <h6>Submenu Items:</h6>
            <ListGroup variant="flush">
              {reportsMenuItem.submenu.map((item: any, index: number) => (
                <ListGroup.Item key={index} className="d-flex align-items-center">
                  <i className={`${item.icon} me-2`}></i>
                  <span className="flex-grow-1">{item.label}</span>
                  <Badge bg="secondary" className="ms-2">
                    {item.link}
                  </Badge>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        )}

        <div className="mt-3">
          <h6>Dynamic Report Items ({dynamicReportItems.length}):</h6>
          {dynamicReportItems.length > 0 ? (
            <ListGroup variant="flush">
              {dynamicReportItems.map((item: any, index: number) => (
                <ListGroup.Item key={index} className="d-flex align-items-center">
                  <i className={`${item.icon} me-2`}></i>
                  <span className="flex-grow-1">{item.label}</span>
                  <Badge bg="success" className="ms-2">
                    {item.link}
                  </Badge>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <p className="text-muted">No connected integrations found</p>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default DynamicMenuDemo;
