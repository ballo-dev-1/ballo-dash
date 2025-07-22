import React, { useState,ReactElement } from 'react'
import Layout from '@layout/index'
import BreadcrumbItem from '@common/BreadcrumbItem'
import payment from '@assets/images/admin/img-payment-1.png'
import payment2 from '@assets/images/admin/img-payment-2.png'
import { Tabs, Tab, Card, Button, Form, Row, Col, InputGroup, CardHeader, CardBody } from 'react-bootstrap';
import Image from 'next/image';

const Payments = () => {

  const [activeKey, setActiveKey] = useState('auth-1');

  const [key, setKey] = useState('auth-1');

  const changeTab = (tabKey: any) => {
    setKey(tabKey);
  };

  return (
    <React.Fragment>
      <BreadcrumbItem mainTitle="Online Courses" subTitle="Setting Payment" />
      <Row>
        <div className="col-12">
          <Card>
            <CardHeader>
              <h5 className="mb-0">Payment</h5>
            </CardHeader>
            <CardBody>
              <Tabs activeKey={key} onSelect={(k: any) => setKey(k)} id="myTab" className='border-0 paymenttab'>
                <Tab eventKey="auth-1" title="">
                  <Row className="justify-content-center">
                    <Col md={10} lg={8} xxl={6}>
                      <Card className="border text-center">
                        <CardBody>
                          <Image src={payment} alt="images" className="img-fluid mb-4" />
                          <h5>Establish your payment gateway</h5>
                          <p className="text-muted">
                            Able Pro: pay streamlines your payout process, facilitating faster payments while managing author and affiliate payouts on your behalf.
                          </p>
                          <div className="mb-3 text-start">
                            <label className="form-label">Mobile Phone</label>
                            <div className="d-flex align-items-center">
                              <div className="flex-grow-1 me-3">
                                <div className="input-group">
                                  <span className="input-group-text">+91</span>
                                  <input type="text" className="form-control" placeholder="https://admin123-20" />
                                </div>
                              </div>
                              <div className="flex-shrink-0">
                                <button className="btn btn-primary" onClick={() => changeTab('auth-2')}>Confirm</button>
                              </div>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                </Tab>
                <Tab eventKey="auth-2" title="">
                  <button className="btn btn-link-secondary d-flex align-items-center" onClick={() => changeTab('auth-1')}>
                    <i className="ti ti-chevron-left"></i> Back Step
                  </button>
                  <Row className="justify-content-center">
                    <Col md={10} lg={8} xxl={6}>
                      <Card className="border text-center">
                        <CardBody>
                          <Image src={payment} alt="images" className="img-fluid mb-4" />
                          <h5>Let's begin from the start</h5>
                          <p className="text-muted">What is your current tax filing situation?</p>
                          <Row className="g-3 justify-content-center">
                            <div className="col-auto">
                              <button className="btn btn-primary" onClick={() => changeTab('auth-3')}>Confirm</button>
                            </div>
                            <div className="col-auto">
                              <button className="btn btn-primary" onClick={() => changeTab('auth-3')}>Confirm</button>
                            </div>
                          </Row>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                </Tab>
                <Tab eventKey="auth-3" title="">
                  <button className="btn btn-link-secondary d-flex align-items-center" onClick={() => changeTab('auth-2')}>
                    <i className="ti ti-chevron-left"></i> Back Step
                  </button>
                  <Row className="justify-content-center">
                    <Col md={10} lg={8} xxl={6}>
                      <Card className="border text-center">
                        <CardBody>
                          <Image src={payment2} alt="images" className="img-fluid mb-4" />
                          <h5 className="mb-4">Inform us about your enterprise</h5>
                          <Row className="justify-content-center text-start">
                            <Col sm={10} md={8} xxl={6}>
                              <div className="mb-3">
                                <label className="form-label">What is your current tax filing situation?</label>
                                <select className="form-select">
                                  <option defaultValue="LLc">LLC</option>
                                  <option value="1">LLC 1</option>
                                  <option value="2">LLC 2</option>
                                  <option value="3">LLC 3</option>
                                </select>
                              </div>
                              <div className="mb-3">
                                <label className="form-label">What were your total sales for the previous year?</label>
                                <select className="form-select">
                                  <option defaultValue="$100-$1000">$100-$1000</option>
                                  <option value="1">$101-$2000</option>
                                  <option value="2">$2001-$3000</option>
                                  <option value="3">$3001-$4000</option>
                                </select>
                              </div>
                              <div className="mb-3">
                                <label className="form-label">What is your business name?</label>
                                <input type="email" className="form-control" placeholder="Business name" />
                              </div>
                            </Col>
                          </Row>
                          <button className="btn btn-primary" onClick={() => changeTab('auth-4')}>Confirm</button>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                </Tab>
                <Tab eventKey="auth-4" title="">
                  <button className="btn btn-link-secondary d-flex align-items-center" onClick={() => changeTab('auth-3')}>
                    <i className="ti ti-chevron-left"></i> Back Step
                  </button>
                  <Row className="justify-content-center">
                    <Col md={10} lg={8} xxl={6}>
                      <Card className="border text-center">
                        <CardBody>
                          <Image src={payment2} alt="images" className="img-fluid mb-4" />
                          <h5 className="mb-2">Inform us about your enterprise</h5>
                          <p className="text-muted mb-4">What is your current tax filing situation?</p>
                          <button className="btn btn-primary">Confirm</button>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                </Tab>
              </Tabs>
            </CardBody>
          </Card>
        </div>
      </Row>
    </React.Fragment>
  )
}
Payments.getLayout = (page: ReactElement) => {
  return (
      <Layout>
          {page}
      </Layout>
  )
};

export default Payments