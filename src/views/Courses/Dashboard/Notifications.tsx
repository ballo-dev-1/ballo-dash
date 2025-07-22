import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import avatar1 from '@assets/images/user/avatar-1.jpg'
import avatar2 from '@assets/images/user/avatar-2.jpg'
import avatar3 from '@assets/images/user/avatar-3.jpg'
import avatar4 from '@assets/images/user/avatar-4.jpg'
import { Card, CardBody, Col } from 'react-bootstrap'

const Notifications = ({ display, dropdownRef, handleDropDown }: any) => {
    return (
        <React.Fragment><Col lg={4} md={12}>
            <Card>
                <CardBody>
                    <div className="d-flex align-items-center justify-content-between mb-3">
                        <h5 className="mb-0">Notifications</h5>
                        <div className="dropdown">
                            <Link
                                ref={dropdownRef}
                                className={`avtar avtar-s btn-link-secondary dropdown-toggle arrow-none ${display===35 ? "show" :""}`} href="#"
                                data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" onClick={()=>handleDropDown(35)}>
                                <i className="ti ti-dots-vertical f-18"></i>
                            </Link>
                            <div className={`dropdown-menu dropdown-menu-end ${display===35 ? "show show2" :""}`}>
                                <a className="dropdown-item" href="#">Today</a>
                                <a className="dropdown-item" href="#">Weekly</a>
                                <a className="dropdown-item" href="#">Monthly</a>
                            </div>
                        </div>
                    </div>
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item px-0 py-2">
                            <div className="d-flex align-items-center">
                                <div className="flex-shrink-0">
                                    <Image src={avatar1} alt="img" className="wid-40 rounded-circle setImage" />
                                </div>
                                <div className="flex-grow-1 mx-3">
                                    <h6 className="mb-1">Report Successfully</h6>
                                    <p className="mb-0 text-muted">Today | 9:00 AM</p>
                                </div>
                            </div>
                        </li>
                        <li className="list-group-item px-0 py-2">
                            <div className="d-flex align-items-center">
                                <div className="flex-shrink-0">
                                    <Image src={avatar2} alt="img" className="wid-40 rounded-circle setImage" />
                                </div>
                                <div className="flex-grow-1 mx-3">
                                    <h6 className="mb-1">Reminder: Test time</h6>
                                    <p className="mb-0 text-muted">Yesterday | 6:30 PM</p>
                                </div>
                            </div>
                        </li>
                        <li className="list-group-item px-0 py-2">
                            <div className="d-flex align-items-center">
                                <div className="flex-shrink-0">
                                    <Image src={avatar3} alt="img" className="wid-40 rounded-circle setImage" />
                                </div>
                                <div className="flex-grow-1 mx-3">
                                    <h6 className="mb-1">Send course pdf</h6>
                                    <p className="mb-0 text-muted">05 Feb | 3:45 PM</p>
                                </div>
                            </div>
                        </li>
                        <li className="list-group-item px-0 py-2">
                            <div className="d-flex align-items-center">
                                <div className="flex-shrink-0">
                                    <Image src={avatar4} alt="img" className="wid-40 rounded-circle setImage" />
                                </div>
                                <div className="flex-grow-1 mx-3">
                                    <h6 className="mb-1">Report Successfully</h6>
                                    <p className="mb-0 text-muted">05 Feb | 4:00 PM</p>
                                </div>
                            </div>
                        </li>

                    </ul>

                </CardBody>
            </Card>
        </Col></React.Fragment>
    )
}

export default Notifications