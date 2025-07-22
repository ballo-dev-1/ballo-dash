import React,{ReactElement} from 'react'
import Layout from '@layout/index'
import BreadcrumbItem from '@common/BreadcrumbItem'
import { CourseData } from '@views/Courses/Courses/CoursesData'
import { Card, CardBody, CardHeader, Col, Row } from 'react-bootstrap'
import Image from 'next/image'

const CourseView = () => {
    return (
        <React.Fragment>
            <BreadcrumbItem mainTitle="Online Courses" subTitle="Courses View" />
            <Row>
                <div className="col-12">
                    <Card>
                        <CardHeader>
                            <div className="d-flex align-items-center justify-content-between">
                                <h5 className="mb-0">Course</h5>
                                <div>
                                    <a href="/admins/course-course-add" className="btn btn-primary">Add Student</a>
                                </div>
                            </div>
                        </CardHeader>
                        <CardBody>
                            <Row className="row">
                                {(CourseData || []).map((item, key: any) => (
                                    <Col sm={6} lg={4} xxl={3} key={key}>
                                        <Card className="border">
                                            <CardBody className="p-2">
                                                <div className="position-relative">
                                                    <Image src={item.img} alt="img" className="img-fluid w-100" />
                                                    <div className="position-absolute top-0 end-0 p-2">
                                                        <span className="badge text-bg-light text-uppercase">{item.price}</span>
                                                    </div>
                                                </div>
                                                <ul className="list-group list-group-flush my-2">
                                                    <li className="list-group-item px-0 py-2">
                                                        <div className="d-flex align-items-center">
                                                            <div className="flex-grow-1 me-2">
                                                                <h6 className="mb-1">{item.course}</h6>
                                                                <p className="mb-0 f-w-600"><i className="fas fa-star text-warning"></i>&nbsp;{item.ratting}</p>
                                                            </div>
                                                            <div className="flex-shrink-0">
                                                                <a href="#" className="avtar avtar-xs btn-link-secondary">
                                                                    <i className="ti ti-edit f-20"></i>
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="list-group-item px-0 py-2">
                                                        <div className="d-flex align-items-center">
                                                            <div className="flex-grow-1 me-2">
                                                                <p className="mb-0">Duration</p>
                                                            </div>
                                                            <div className="flex-shrink-0">
                                                                <p className="text-muted mb-0">10 Months</p>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="list-group-item px-0 py-2">
                                                        <div className="d-flex align-items-center">
                                                            <div className="flex-grow-1 me-2">
                                                                <p className="mb-0">Teacher</p>
                                                            </div>
                                                            <div className="flex-shrink-0">
                                                                <p className="text-muted mb-0">{item.teacher}</p>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="list-group-item px-0 py-2">
                                                        <div className="d-flex align-items-center">
                                                            <div className="flex-grow-1 me-2">
                                                                <p className="mb-0">Students</p>
                                                            </div>
                                                            <div className="flex-shrink-0">
                                                                <p className="text-muted mb-0">{item.students}</p>
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>
                                                <button className="btn btn-sm btn-outline-primary mb-2">Read More</button>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </CardBody>
                    </Card>
                </div>
            </Row>
        </React.Fragment>
    )
}
CourseView.getLayout = (page: ReactElement) => {
    return (
        <Layout>
            {page}
        </Layout>
    )
}
export default CourseView