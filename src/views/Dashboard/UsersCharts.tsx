import React from "react";
import { Card, Col, Row, Dropdown } from "react-bootstrap";
import { UserChartsData } from "./DashboardCharts";
import { EllipsisVertical } from "lucide-react";

const UsersCharts = () => {
  return (
    <>
      <Col md={6} xl={5}>
        <Card>
          <Card.Header className="d-flex align-items-center justify-content-between py-3">
            <h5>Followership</h5>
            <Dropdown>
              <Dropdown.Toggle
                as="a"
                className="avtar avtar-xs btn-link-secondary dropdown-toggle arrow-none"
                href="#!"
              >
                <EllipsisVertical />
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu-end">
                <Dropdown.Item href="#">View</Dropdown.Item>
                <Dropdown.Item href="#">Edit</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Card.Header>
          <Card.Body>
            <div className="d-flex align-items-center">
              <div className="avtar avtar-s bg-light-primary flex-shrink-0">
                <i className="ph-duotone ph-money f-20"></i>
              </div>
              <div className="flex-grow-1 ms-3">
                <p className="mb-0 text-muted">Total Followers</p>
                <h5 className="mb-0">176</h5>
              </div>
            </div>
            <div id="earnings-users-chart">
              <UserChartsData />
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <Row>
              <Col xs={6}>
                <div className="d-flex">
                  <div className="avtar avtar-s bg-light-warning flex-shrink-0">
                    <i className="ph-duotone ph-lightning f-20"></i>
                  </div>
                  <div className="flex-grow-1 ms-2">
                    <p className="mb-0 text-muted">Total posts</p>
                    <h6 className="mb-0">64</h6>
                  </div>
                </div>
              </Col>
              <Col xs={6}>
                <div className="d-flex">
                  <div className="avtar avtar-s bg-light-danger flex-shrink-0">
                    <i className="ph-duotone ph-map-pin f-20"></i>
                  </div>
                  <div className="flex-grow-1 ms-2">
                    <p className="mb-0 text-muted">Total location</p>
                    <h6 className="mb-0">11</h6>
                  </div>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
};

export default UsersCharts;
