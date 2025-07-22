import React from 'react'
import Image from 'next/image'
import { Card, CardBody, CardHeader, Col, Row, Tab } from 'react-bootstrap'
import gallery1 from '@assets/images/application/img-gallery-1.jpg'
import gallery2 from '@assets/images/application/img-gallery-2.jpg'
import gallery3 from '@assets/images/application/img-gallery-3.jpg'
import gallery4 from '@assets/images/application/img-gallery-4.jpg'
import gallery5 from '@assets/images/application/img-gallery-5.jpg'
import gallery6 from '@assets/images/application/img-gallery-6.jpg'
import gallery7 from '@assets/images/application/img-gallery-7.jpg'
import gallery8 from '@assets/images/application/img-gallery-8.jpg'


const GalleryRequest = () => {
    return (
        <React.Fragment>
            <Tab.Pane eventKey="galleryRequest" id="profile" role="tabpanel">
                <Card className="card">
                    <CardHeader className="card-header">
                        <h5>Gallery</h5>
                    </CardHeader>
                        <CardBody className="card-body">
                            <Row className="g-2">
                                <Col  md={6}>
                                    <a className="img-post card social-gallery-card" data-lightbox={gallery1}>
                                        <Image src={gallery1} alt="img" className="card-img" />
                                        <div className="card-img-overlay">
                                            <i className="ti ti-cloud-download"></i>
                                        </div>
                                    </a>
                                </Col>
                                <Col md={6}>
                                    <Row className="g-2">
                                        <Col md={12}style={{width:"auto"}}>
                                            <a className="img-post card social-gallery-card" data-lightbox={gallery2} >
                                                <Image src={gallery2} alt="img" className="card-img" />
                                                <div className="card-img-overlay">
                                                    <i className="ti ti-cloud-download"></i>
                                                </div>
                                            </a>
                                        </Col>
                                        <Col md={12}>
                                            <a className="img-post card social-gallery-card" data-lightbox={gallery3}>
                                                <Image src={gallery3} alt="img" className="card-img" />
                                                <div className="card-img-overlay">
                                                    <i className="ti ti-cloud-download"></i>
                                                </div>
                                            </a>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col md={4}>
                                    <a className="img-post card social-gallery-card" data-lightbox={gallery5}>
                                        <Image src={gallery5} alt="img" className="card-img" />
                                        <div className="card-img-overlay">
                                            <i className="ti ti-cloud-download"></i>
                                        </div>
                                    </a>
                                </Col>
                                <Col md={4}>
                                    <a className="img-post card social-gallery-card" data-lightbox={gallery6}>
                                        <Image src={gallery6} alt="img" className="card-img" />
                                        <div className="card-img-overlay">
                                            <i className="ti ti-cloud-download"></i>
                                        </div>
                                    </a>
                                </Col>
                                <Col md={4}>
                                    <a className="img-post card social-gallery-card" data-lightbox={gallery4}>
                                        <Image src={gallery4} alt="img" className="card-img" />
                                        <div className="card-img-overlay">
                                            <i className="ti ti-cloud-download"></i>
                                        </div>
                                    </a>
                                </Col>
                                <Col md={6}>
                                    <a className="img-post card social-gallery-card" data-lightbox={gallery8}>
                                        <Image src={gallery8} alt="img" className="card-img" />
                                        <div className="card-img-overlay">
                                            <i className="ti ti-cloud-download"></i>
                                        </div>
                                    </a>
                                </Col>
                                <Col md={6}>
                                    <a className="img-post card social-gallery-card" data-lightbox={gallery7}>
                                        <Image src={gallery7} alt="img" className="card-img" />
                                        <div className="card-img-overlay">
                                            <i className="ti ti-cloud-download"></i>
                                        </div>
                                    </a>
                                </Col>
                            </Row>
                        </CardBody>
                </Card>
            </Tab.Pane>
        </React.Fragment>
    )
}

export default GalleryRequest
