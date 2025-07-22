import React,{ReactElement} from 'react'
import Layout from '@layout/index'
import BreadcrumbItem from '@common/BreadcrumbItem'
import { Card, CardBody, CardHeader, Col, Row } from 'react-bootstrap'

const StudentAdd = () => {
    return (
        <React.Fragment>
            <BreadcrumbItem mainTitle="Online Courses" subTitle="Student Add" />
            <Row>
                <div className="col-12">
                    <Card>
                        <CardHeader>
                            <h5 className="mb-0">Basic Information</h5>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col md={6}>
                                    <div className="mb-3">
                                        <label className="form-label">First Name</label>
                                        <input type="text" className="form-control" placeholder="Enter first name" />
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="mb-3">
                                        <label className="form-label">Last Name</label>
                                        <input type="text" className="form-control" placeholder="Enter last name" />
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="mb-3">
                                        <label className="form-label">Email</label>
                                        <input type="email" className="form-control" placeholder="Enter email" />
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="mb-3">
                                        <label className="form-label">Registration Date</label>
                                        <input type="date" className="form-control" />
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="mb-3">
                                        <label className="form-label">ID Number</label>
                                        <input type="password" className="form-control" placeholder="Enter ID number" />
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="mb-3">
                                        <label className="form-label">Course</label>
                                        <select className="form-select">
                                            <option>Course</option>
                                            <option>Course 1</option>
                                            <option>Course 2</option>
                                        </select>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="mb-3">
                                        <label className="form-label">Mobile Number</label>
                                        <input type="number" className="form-control" placeholder="Enter Mobile number" />
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="mb-3">
                                        <label className="form-label">Gender</label>
                                        <select className="form-select">
                                            <option>Female</option>
                                            <option>Male</option>
                                        </select>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="mb-3">
                                        <label className="form-label">Parents Name</label>
                                        <input type="text" className="form-control" placeholder="Enter parents name" />
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="mb-3">
                                        <label className="form-label">Parents Mobile Number</label>
                                        <input type="number" className="form-control" placeholder="Enter parents mobile number" />
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="mb-3">
                                        <label className="form-label">Date of Birth</label>
                                        <input type="date" className="form-control" />
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="mb-3">
                                        <label className="form-label">Blood Group</label>
                                        <input type="text" className="form-control" placeholder="Enter blood group" />
                                    </div>
                                </Col>
                                <Col md={12}>
                                    <div className="mb-3">
                                        <label className="form-label">Shipping Address</label>
                                        <textarea className="form-control" rows= {2} placeholder="Enter address"></textarea>
                                    </div>
                                </Col>
                                <Col md={12}>
                                    <div className="mb-3">
                                        <input className="form-control" type="file" />
                                    </div>
                                </Col>
                                <Col md={12} className="text-end">
                                    <button className="btn btn-primary">Submit</button>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </div>
            </Row>
        </React.Fragment>
    )
}
StudentAdd.getLayout = (page: ReactElement) => {
    return (
        <Layout>
            {page}
        </Layout>
    )
}
export default StudentAdd