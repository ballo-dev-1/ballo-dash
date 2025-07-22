import React,{ReactElement} from 'react'
import BreadcrumbItem from '@common/BreadcrumbItem'
import Link from 'next/link'
import Layout from '@layout/index'
import { Card, CardBody, Col, Row } from 'react-bootstrap'

const Princing = () => {
  return (
    <React.Fragment>
      <BreadcrumbItem mainTitle="Membership" subTitle="Princing" />

      <Row>
        <div className="col-12">
          <Row className="g-4">
            <Col md={6} lg={4}>
              <Card className="price-card p-4 border border-success border-2 h-100">
                <CardBody className="bg-success bg-opacity-10 rounded v3">
                  <div className="price-head v3">
                    <h4 className="mb-0 text-success">Casual</h4>
                    <div className="price-price mt-3">$50 <span className="text-muted"> month</span></div>
                  </div>
                  <ul className="list-group list-group-flush product-list v3">
                    <li className="list-group-item enable"><i className="ti ti-check text-success"></i> Full Facility Access</li>
                    <li className="list-group-item enable"><i className="ti ti-check text-success"></i> Meals plans</li>
                    <li className="list-group-item enable"><i className="ti ti-check text-success"></i> 10% Discounts</li>
                    <li className="list-group-item enable"><i className="ti ti-check text-success"></i> Cancel anytime</li>
                  </ul>
                  <div className="d-grid"><Link className="btn btn-dark mt-4" href="#">Buy Now</Link></div>
                </CardBody>
              </Card>
            </Col>
            <Col md={6} lg={4}>
              <Card className="price-card p-4 border border-primary border-2 h-100">
                <CardBody className="bg-primary bg-opacity-10 rounded v3">
                  <div className="price-head v3">
                    <h4 className="mb-0 text-primary">Addicted</h4>
                    <div className="price-price mt-3">$150 <span className="text-muted"> month</span></div>
                  </div>
                  <ul className="list-group list-group-flush product-list v3">
                    <li className="list-group-item enable"><i className="ti ti-check text-primary"></i> Full Facility Access</li>
                    <li className="list-group-item enable"><i className="ti ti-check text-primary"></i> Meals plans</li>
                    <li className="list-group-item enable"><i className="ti ti-check text-primary"></i> 50% Discounts</li>
                    <li className="list-group-item enable"><i className="ti ti-check text-primary"></i> Cancel anytime</li>
                    <li className="list-group-item enable"><i className="ti ti-check text-primary"></i> Basic feature</li>
                  </ul>
                  <div className="d-grid"><Link className="btn btn-dark mt-4" href="#">Buy Now</Link></div>
                </CardBody>
              </Card>
            </Col>
            <Col md={6} lg={4}>
              <Card className="price-card p-4 border border-warning border-2 h-100">
                <CardBody className="bg-warning bg-opacity-10 rounded v3">
                  <div className="price-head v3">
                    <h4 className="mb-0 text-warning">Diehard</h4>
                    <div className="price-price mt-3">$250 <span className="text-muted"> month</span></div>
                  </div>
                  <ul className="list-group list-group-flush product-list v3">
                    <li className="list-group-item enable"><i className="ti ti-check text-warning"></i> Full Facility Access</li>
                    <li className="list-group-item enable"><i className="ti ti-check text-warning"></i> Meals plans</li>
                    <li className="list-group-item enable"><i className="ti ti-check text-warning"></i> 75% Discounts</li>
                    <li className="list-group-item enable"><i className="ti ti-check text-warning"></i> Primmum feature</li>
                    <li className="list-group-item enable"><i className="ti ti-check text-warning"></i> Cancel anytime</li>
                    <li className="list-group-item enable"><i className="ti ti-check text-warning"></i> Online booking</li>
                  </ul>
                  <div className="d-grid"><Link className="btn btn-dark mt-4" href="#">Buy Now</Link></div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </Row>
    </React.Fragment>
  )
}
Princing.getLayout = (page: ReactElement) => {
  return (
      <Layout>
          {page}
      </Layout>
  )
}

export default Princing
