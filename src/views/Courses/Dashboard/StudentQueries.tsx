import React from 'react'
import { Card, CardBody, Col } from 'react-bootstrap'
import avatar1 from '@assets/images/user/avatar-1.jpg'
import avatar2 from '@assets/images/user/avatar-2.jpg'
import avatar3 from '@assets/images/user/avatar-3.jpg'
import avatar4 from '@assets/images/user/avatar-4.jpg'
import Link from 'next/link'
import Image from 'next/image'

const StudentQueries = ({display,dropdownRef,handleDropDown}:any) => {
    return (
        <React.Fragment>
            <Col lg={4} md={12}>
                <Card>
                    <CardBody>
                        <div className="d-flex align-items-center justify-content-between mb-3">
                            <h5 className="mb-0">Student Queries</h5>
                            <div className="dropdown">
                                <Link 
                                ref={dropdownRef}
                                className={`avtar avtar-s btn-link-secondary dropdown-toggle arrow-none ${display===33 ? "show":""}`} href="#"
                                    data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" onClick={()=>handleDropDown(33)}>
                                    <i className="ti ti-dots-vertical f-18"></i>
                                </Link>
                                <div className={`dropdown-menu dropdown-menu-end ${display===33 ? "show show2":""}`}>
                                    <Link className="dropdown-item" href="#" onClick={handleDropDown}>Today</Link>
                                    <Link className="dropdown-item" href="#" onClick={handleDropDown}>Weekly</Link>
                                    <Link className="dropdown-item" href="#" onClick={handleDropDown}>Monthly</Link>
                                </div>
                            </div>
                        </div>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item px-0 py-2">
                                <div className="d-flex align-items-center">
                                    <div className="flex-shrink-0">
                                        <Image src={avatar2} alt="img" className="wid-40 rounded-circle setImage" />
                                    </div>
                                    <div className="flex-grow-1 mx-3">
                                        Python $ Data Manage
                                    </div>
                                    <div className="flex-shrink-0">
                                        <a href="#" className="avtar avtar-xs btn-light-secondary">
                                            <i className="ti ti-eye f-20"></i>
                                        </a>&nbsp;
                                        <a href="#" className="avtar avtar-xs btn-light-secondary">
                                            <i className="ti ti-trash f-20"></i>
                                        </a>
                                    </div>
                                </div>
                            </li>
                            <li className="list-group-item px-0 py-2">
                                <div className="d-flex align-items-center">
                                    <div className="flex-shrink-0">
                                        <Image src={avatar1} alt="img" className="wid-40 rounded-circle setImage" />
                                    </div>
                                    <div className="flex-grow-1 mx-3">
                                        Website Error
                                    </div>
                                    <div className="flex-shrink-0">
                                        <a href="#" className="avtar avtar-xs btn-light-secondary">
                                            <i className="ti ti-eye f-20"></i>
                                        </a>&nbsp;
                                        <a href="#" className="avtar avtar-xs btn-light-secondary">
                                            <i className="ti ti-trash f-20"></i>
                                        </a>
                                    </div>
                                </div>
                            </li>
                            <li className="list-group-item px-0 py-2">
                                <div className="d-flex align-items-center">
                                    <div className="flex-shrink-0">
                                        <Image src={avatar3} alt="img" className="wid-40 rounded-circle setImage" />
                                    </div>
                                    <div className="flex-grow-1 mx-3">
                                        How to Illustrate
                                    </div>
                                    <div className="flex-shrink-0">
                                        <a href="#" className="avtar avtar-xs btn-light-secondary">
                                            <i className="ti ti-eye f-20"></i>
                                        </a>&nbsp;
                                        <a href="#" className="avtar avtar-xs btn-light-secondary">
                                            <i className="ti ti-trash f-20"></i>
                                        </a>
                                    </div>
                                </div>
                            </li>
                            <li className="list-group-item px-0 py-2">
                                <div className="d-flex align-items-center">
                                    <div className="flex-shrink-0"> 
                                        <Image src={avatar4} alt="img" className="wid-40 rounded-circle setImage" />
                                    </div>
                                    <div className="flex-grow-1 mx-3">
                                        PHP Learning
                                    </div>
                                    <div className="flex-shrink-0">
                                        <a href="#" className="avtar avtar-xs btn-light-secondary">
                                            <i className="ti ti-eye f-20"></i>
                                        </a>&nbsp;
                                        <a href="#" className="avtar avtar-xs btn-light-secondary">
                                            <i className="ti ti-trash f-20"></i>
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

export default StudentQueries