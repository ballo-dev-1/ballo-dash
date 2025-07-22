import React from 'react'
import { Row,Col,CardBody,Card,CardFooter } from 'react-bootstrap'
import { SupportChart1,SupportChart2,SupportChart3} from './SupportChart'

const Support = () => {
  return (
    <React.Fragment>
       <Col xl={4} md={6}>
                <Card className="support-bar">
                    <CardBody className="pb-0">
                        <h2 className="m-0">350</h2>
                        <span className="text-info">Support Requests</span>
                        <p className="mb-3 mt-3">Total number of support requests that come in.</p>
                    </CardBody>
                    <div id="support-chart" style={{ height: "100px", width: "100%" }}><SupportChart1/></div>
                    <CardFooter className="bg-info text-white">
                        <Row className="text-center">
                            <Col className="border-end">
                                <h4 className="m-0 text-white">10</h4>
                                <span>Open</span>
                            </Col>
                            <Col className="border-end">
                                <h4 className="m-0 text-white">5</h4>
                                <span>Running</span>
                            </Col>
                            <Col className="col">
                                <h4 className="m-0 text-white">3</h4>
                                <span>Solved</span>
                            </Col>
                        </Row>
                    </CardFooter>
                </Card>
            </Col>
            <Col xl={4} md={6}>
                <Card className="support-bar">
                    <CardBody className="pb-0">
                        <h2 className="m-0">500</h2>
                        <span className="text-primary">Agent Response</span>
                        <p className="mb-3 mt-3">Total number of support requests that come in.</p>
                    </CardBody>
                    <div id="support-chart1" style={{ height: "100px", width: "100%" }}><SupportChart2/> </div>
                    <CardFooter className="bg-primary text-white">
                        <Row className="text-center">
                            <Col className="border-end">
                                <h4 className="m-0 text-white">50</h4>
                                <span>Open</span>
                            </Col>
                            <Col className="border-end">
                                <h4 className="m-0 text-white">75</h4>
                                <span>Running</span>
                            </Col>
                            <Col>
                                <h4 className="m-0 text-white">30</h4>
                                <span>Solved</span>
                            </Col>
                        </Row>
                    </CardFooter>
                </Card>
            </Col>
            <Col  xl={4} md={12}>
                <Card className="support-bar">
                    <CardBody className="pb-0">
                        <h2 className="m-0">800</h2>
                        <span className="text-success">Support Resolved</span>
                        <p className="mb-3 mt-3">Total number of support requests that come in.</p>
                    </CardBody>
                    <div id="support-chart2" style={{ height: "100px", width: "100%" }}><SupportChart3/>  </div>
                    <CardFooter className="bg-success text-white">
                        <Row className="text-center">
                            <Col className="border-end">
                                <h4 className="m-0 text-white">80</h4>
                                <span>Open</span>
                            </Col>
                            <Col className="border-end">
                                <h4 className="m-0 text-white">60</h4>
                                <span>Running</span>
                            </Col>
                            <Col>
                                <h4 className="m-0 text-white">90</h4>
                                <span>Solved</span>
                            </Col>
                        </Row>
                    </CardFooter>
                </Card>
            </Col>
    </React.Fragment>
  )
}

export default Support
