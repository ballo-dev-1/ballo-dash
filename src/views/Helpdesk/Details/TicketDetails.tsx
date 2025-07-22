import React from 'react'
import avatar5 from '@assets/images/user/avatar-5.jpg'
import avatar4 from '@assets/images/user/avatar-4.jpg'
import admin from '@assets/images/admin/p1.jpg'
import { Card, CardBody, CardHeader, Col } from 'react-bootstrap'
import Link from 'next/link'
import Image from 'next/image'

const TicketDetails = () => {
    return (
        <React.Fragment>
            <Col lg={4}>
                <Card>
                    <CardHeader>
                        <h5>Ticket Details</h5>
                    </CardHeader>
                    <CardBody>
                        <div className="alert alert-success d-block text-center text-uppercase"><i
                            className="feather icon-check-circle me-2"></i>Verified Purchase</div>
                        <div className="select-block">
                            <div className="mb-2">
                                <select className="form-control col-sm-12">
                                    <option>Open</option>
                                    <option>Close</option>
                                    <option>CLosed Forever</option>
                                </select>
                            </div>
                            <div className="mb-2">
                                <select className="form-control col-sm-12">
                                    <option value="avatar-5">Jack Pall</option>
                                    <option value="avatar-4">Liza Mac</option>
                                    <option value="avatar-3">Lina Hop</option>
                                    <option value="avatar-2">Sam Hunk</option>
                                    <option value="avatar-1">Jhon White</option>
                                </select>
                            </div>
                            <div className="mb-2">
                                <select className="form-control col-sm-12">
                                    <option value="prod-1">Able Admin</option>
                                    <option value="prod-2">Guru Dash</option>
                                    <option value="prod-3">Able pro</option>
                                    <option value="prod-4">Able Dash</option>
                                    <option value="prod-5">Dash Able</option>
                                </select>
                            </div>
                        </div>
                    </CardBody>
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item">
                            <div className="d-flex align-items-center">
                                <div className="flex-shrink-0">
                                    <label className="mb-0 wid-100">Customer</label>
                                </div>
                                <div className="flex-grow-1 ms-3">
                                    <p className="mb-0"> <Image src={avatar5} alt=""className="wid-20 rounded me-1 img-fluid"/><Link href="#" className="link-secondary">Jack Pall</Link></p>
                                </div>
                            </div>
                        </li>
                        <li className="list-group-item">
                            <div className="d-flex align-items-center">
                                <div className="flex-shrink-0">
                                    <label className="mb-0 wid-100">Contact</label>
                                </div>
                                <div className="flex-grow-1 ms-3">
                                    <p className="mb-0"><i className="feather icon-mail me-1"></i><Link href="#"
                                        className="link-secondary">mail@mail.com</Link></p>
                                </div>
                            </div>
                        </li>
                        <li className="list-group-item">
                            <div className="d-flex align-items-center">
                                <div className="flex-shrink-0">
                                    <label className="mb-0 wid-100">Category</label>
                                </div>
                                <div className="flex-grow-1 ms-3">
                                    <p className="mb-0"><Image src={admin} alt=""className="wid-20 rounded me-1 img-fluid"/><Link href="#" className="link-secondary">Alpha pro</Link></p>
                                </div>
                            </div>
                        </li>
                        <li className="list-group-item">
                            <div className="d-flex align-items-center">
                                <div className="flex-shrink-0">
                                    <label className="mb-0 wid-100">Assigned</label>
                                </div>
                                <div className="flex-grow-1 ms-3">
                                    <p className="mb-0"><Image src={avatar4} alt=""className="wid-20 rounded me-1 img-fluid" /><Link href="#" className="link-secondary">Lina Hop</Link></p>
                                </div>
                            </div>
                        </li>
                        <li className="list-group-item">
                            <div className="d-flex align-items-center">
                                <div className="flex-shrink-0">
                                    <label className="mb-0 wid-100">Created</label>
                                </div>
                                <div className="flex-grow-1 ms-3">
                                    <p className="mb-0"><i className="feather icon-calendar me-1"></i><label className="mb-0">Date</label></p>
                                </div>
                            </div>
                        </li>
                        <li className="list-group-item">
                            <div className="d-flex align-items-center">
                                <div className="flex-shrink-0">
                                    <label className="mb-0 wid-100">Response</label>
                                </div>
                                <div className="flex-grow-1 ms-3">
                                    <p className="mb-0"><i className="feather icon-clock me-1"></i><label className="mb-0">Time</label></p>
                                </div>
                            </div>
                        </li>
                        <li className="list-group-item py-3">
                            <button type="button" className="btn btn-sm btn-light-warning me-2"><i
                                className="me-2 feather icon-thumbs-up"></i>Make Private</button>
                            <button type="button" className="btn btn-sm btn-light-danger"><i
                                className="me-2 feather icon-trash-2"></i>Delete</button>
                        </li>
                    </ul>
                </Card>
            </Col>
        </React.Fragment>
    )
}

export default TicketDetails
