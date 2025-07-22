import React from 'react'
import bootstrap from '@assets/images/admin/img-bootstrap.svg'
import php from '@assets/images/admin/img-php.svg'
import ux from '@assets/images/admin/img-ux.svg'
import web from '@assets/images/admin/img-web.svg'
import c from '@assets/images/admin/img-c.svg'
import { Card, CardBody, CardHeader, Col } from 'react-bootstrap'
import Image from 'next/image'

const TrendingCourses = () => {
    return (
        <React.Fragment>
            <Col lg={6} md={12}>
                <Card className="table-card">
                    <CardHeader>
                        <h5>Trending Course</h5>
                    </CardHeader>
                    <CardBody className="px-0 py-2">
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">
                                <div className="d-flex align-items-center">
                                    <div className="flex-shrink-0">
                                        <Image src={bootstrap} alt="img" className="wid-40 rounded setImage" />
                                    </div>
                                    <div className="flex-grow-1 mx-3">
                                        Bootstrap 5 Beginner Course
                                    </div>
                                    <div className="flex-shrink-0">
                                        <a href="#" className="avtar avtar-s btn-link-secondary ">
                                            <i className="ti ti-chevron-right f-20"></i>
                                        </a>
                                    </div>
                                </div>
                            </li>
                            <li className="list-group-item">
                                <div className="d-flex align-items-center">
                                    <div className="flex-shrink-0">
                                        <Image src={php} alt="img" className="wid-40 rounded setImage" />
                                    </div>
                                    <div className="flex-grow-1 mx-3">
                                        PHP Training Course
                                    </div>
                                    <div className="flex-shrink-0">
                                        <a href="#" className="avtar avtar-s btn-link-secondary">
                                            <i className="ti ti-chevron-right f-20"></i>
                                        </a>
                                    </div>
                                </div>
                            </li>
                            <li className="list-group-item">
                                <div className="d-flex align-items-center">
                                    <div className="flex-shrink-0">
                                        <Image src={ux} alt="img" className="wid-40 rounded setImage"/>
                                    </div>
                                    <div className="flex-grow-1 mx-3">
                                        UI/UX Training Course
                                    </div>
                                    <div className="flex-shrink-0">
                                        <a href="#" className="avtar avtar-s btn-link-secondary">
                                            <i className="ti ti-chevron-right f-20"></i>
                                        </a>
                                    </div>
                                </div>
                            </li>
                            <li className="list-group-item">
                                <div className="d-flex align-items-center">
                                    <div className="flex-shrink-0">
                                        <Image src={web} alt="img" className="wid-40 rounded setImage"/>
                                    </div>
                                    <div className="flex-grow-1 mx-3">
                                        Web Designing Course
                                    </div>
                                    <div className="flex-shrink-0">
                                        <a href="#" className="avtar avtar-s btn-link-secondary">
                                            <i className="ti ti-chevron-right f-20"></i>
                                        </a>
                                    </div>
                                </div>
                            </li>
                            <li className="list-group-item">
                                <div className="d-flex align-items-center">
                                    <div className="flex-shrink-0">
                                        <Image src={c} alt="img" className="wid-40 rounded setImage"/>
                                    </div>
                                    <div className="flex-grow-1 mx-3">
                                        C Training Course
                                    </div>
                                    <div className="flex-shrink-0">
                                        <a href="#" className="avtar avtar-s btn-link-secondary">
                                            <i className="ti ti-chevron-right f-20"></i>
                                        </a>
                                    </div>
                                </div>
                            </li>

                        </ul>
                    </CardBody>
                </Card>
            </Col>
        </React.Fragment>
    )
}

export default TrendingCourses