import React,{ReactElement} from 'react'
import Layout from '@layout/index'
import BreadcrumbItem from '../../../../Common/BreadcrumbItem'
import { Card, CardBody, CardHeader, Col, Row } from 'react-bootstrap'

const TeacherAdd = () => {
    return (
        <React.Fragment>
            <BreadcrumbItem mainTitle="Online Courses" subTitle="Teacher Add" />
            <Row>
                <div className="col-12">
                    <Card>
                        <CardHeader className="card-header">
                            <h5 className="mb-0">Basic Information</h5>
                        </CardHeader>
                        <CardBody className="card-body">
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
                                        <label className="form-label">Joining Date</label>
                                        <input type="date" className="form-control" />
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="mb-3">
                                        <label className="form-label">Password</label>
                                        <input type="password" className="form-control" placeholder="Enter Password" />
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="mb-3">
                                        <label className="form-label">Confirm Password</label>
                                        <input type="password" className="form-control" placeholder="Enter confirm password" />
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
                                        <label className="form-label">Designation</label>
                                        <input type="text" className="form-control" placeholder="Designation" />
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="mb-3">
                                        <label className="form-label">Department</label>
                                        <select className="form-select">
                                            <option>Department</option>
                                            <option>Department 1</option>
                                            <option>Department 2</option>
                                        </select>
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
                                        <label className="form-label">Education</label>
                                        <input type="text" className="form-control" placeholder="Education" />
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
TeacherAdd.getLayout = (page: ReactElement) => {
    return (
        <Layout>
            {page}
        </Layout>
    )
};
export default TeacherAdd