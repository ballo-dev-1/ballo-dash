import React from 'react'
import Image from 'next/image'
import img1 from '@assets/images/admin/img-bootstrap.svg'
import img2 from '@assets/images/admin/img-php.svg'
import img3 from '@assets/images/admin/img-ux.svg'
import img4 from '@assets/images/admin/img-web.svg'
import { Card, CardBody, CardHeader, Col } from 'react-bootstrap'

const UpcomingCourse = () => {
    return (
        <React.Fragment>
            <Col lg={5} md={12}>
                <Card>
                    <CardHeader>
                        <h5>Upcoming Course</h5>
                    </CardHeader>
                    <CardBody className="px-0 py-2">
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">
                                <div className="d-flex align-items-center">
                                    <div className="flex-shrink-0">
                                        <Image src={img1} alt="img" className="wid-40 rounded setImage" />
                                    </div>
                                    <div className="flex-grow-1 mx-3">
                                        Bootstrap 5 Beginner Course
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
                                        <Image src={img2} alt="img" className="wid-40 rounded setImage" />
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
                                        <Image src={img3} alt="img" className="wid-40 rounded setImage" />
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
                                        <Image src={img4} alt="img" className="wid-40 rounded setImage" />
                                    </div>
                                    <div className="flex-grow-1 mx-3">
                                        Web Designing Course
                                    </div>
                                    <div className="flex-shrink-0">
                                        <a href="#" className="avtar avtar-s btn-link-secondary ">
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

export default UpcomingCourse