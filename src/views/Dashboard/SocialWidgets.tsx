import Image from "next/image";
import React from "react";
import { Card, Col, Row } from "react-bootstrap";

interface socialWidgetsDataProps {
  socialWidgetsData: Array<object>;
}

const SocialWidgets: React.FC<socialWidgetsDataProps> = ({
  socialWidgetsData,
}) => {
  return (
    <>
      {(socialWidgetsData || []).map((item: any, key: number) => (
        <Col md={6} xl={4} key={key}>
          <Card className="statistics-card-1">
            <Card.Body>
              <Image src={item.bgImg} alt="img" className="img-fluid img-bg" />
              <div className="d-flex align-items-center">
                <Image
                  src={item.img}
                  alt="img"
                  className="img-fluid"
                  style={{ width: "46px", height: "45px" }}
                />
                <div className="flex-grow-1 ms-3">
                  <p className="mb-0 text-muted">Total Likes</p>
                  <div className="d-inline-flex align-items-center">
                    <h5 className="f-w-300 d-flex align-items-center m-b-0">
                      159
                    </h5>
                    <span className="badge bg-success ms-2">
                      +{item.percentage}%
                    </span>
                  </div>
                </div>
              </div>
              <Row className="g-3 mt-5 text-center">
                <div className="col-6">
                  <p className="mb-0 text-muted">Target</p>
                  <h5 className="mb-0">5,000</h5>
                </div>
                <div className="col-6 border-start">
                  <p className="mb-0 text-muted">Duration</p>
                  <h5 className="mb-0">6 Months</h5>
                </div>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </>
  );
};

export default SocialWidgets;
