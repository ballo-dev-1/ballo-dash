import React from 'react'
import domain from '@assets/images/admin/img-domain.png'
import { Card, CardBody, Col, Row } from 'react-bootstrap'
import Image from 'next/image'

const Domain = () => {
    return (
        <React.Fragment>
                <div id="jobDetail">
                    <Row className="justify-content-center">
                        <Col md={10} lg={8} xxl={6}>
                            <Card className="border text-center">
                                <CardBody>
                                    <h5>Confirm your domain</h5>
                                    <p className="text-muted">If you edit this domain, your school URL will update the next time you
                                        log out.</p>
                                    <Image src={domain} alt="images" className="img-fluid mb-4" />
                                    <div className="mb-3 text-start">
                                        <label className="form-label">URL</label>
                                        <div className="d-flex align-items-center">
                                            <div className="flex-grow-1 me-3">
                                                <div className="input-group">
                                                    <input type="text" className="form-control" placeholder="https://admin123-20" />
                                                    <span className="input-group-text">.ablepro.com</span>
                                                </div>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <button className="btn btn-primary">Confirm</button>
                                            </div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
        </React.Fragment>
    )
}

export default Domain