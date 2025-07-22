import React from 'react'
import { Card, CardBody, CardHeader } from 'react-bootstrap'

const CourseStates = () => {
    
    return (
        <React.Fragment>
            <div className="col-12">
                <Card className="table-card">
                    <CardHeader>
                        <div className="d-flex align-items-center justify-content-between">
                            <h5 className="mb-0">Course States</h5>
                            <button className="btn btn-sm btn-link-primary">View All</button>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Teacher</th>
                                        <th>Rating</th>
                                        <th>Earring</th>
                                        <th>Sale</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Web Designing Course</td>
                                        <td>Airi Satou</td>
                                        <td className="f-w-600">
                                            <i className="fas fa-star text-warning"></i> 4.8
                                        </td>
                                        <td>$200</td>
                                        <td><span className="donut">5/7</span></td>
                                        <td>
                                            <a href="#" className="avtar avtar-xs btn-link-secondary">
                                                <i className="ti ti-eye f-20"></i>
                                            </a>
                                            <a href="#" className="avtar avtar-xs btn-link-secondary">
                                                <i className="ti ti-edit f-20"></i>
                                            </a>
                                            <a href="#" className="avtar avtar-xs btn-link-secondary">
                                                <i className="ti ti-trash f-20"></i>
                                            </a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>UI/UX Training Course</td>
                                        <td>Ashton Cox</td>
                                        <td className="f-w-600">
                                            <i className="fas fa-star text-warning"></i> 5.0
                                        </td>
                                        <td>$100</td>
                                        <td><span className="donut">4/7</span></td>
                                        <td>
                                            <a href="#" className="avtar avtar-xs btn-link-secondary">
                                                <i className="ti ti-eye f-20"></i>
                                            </a>
                                            <a href="#" className="avtar avtar-xs btn-link-secondary">
                                                <i className="ti ti-edit f-20"></i>
                                            </a>
                                            <a href="#" className="avtar avtar-xs btn-link-secondary">
                                                <i className="ti ti-trash f-20"></i>
                                            </a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>PHP Training Course</td>
                                        <td>Bradley Greer</td>
                                        <td className="f-w-600">
                                            <i className="fas fa-star text-warning"></i> 4.9
                                        </td>
                                        <td>$80</td>
                                        <td><span className="donut">2/7</span></td>
                                        <td>
                                            <a href="#" className="avtar avtar-xs btn-link-secondary">
                                                <i className="ti ti-eye f-20"></i>
                                            </a>
                                            <a href="#" className="avtar avtar-xs btn-link-secondary">
                                                <i className="ti ti-edit f-20"></i>
                                            </a>
                                            <a href="#" className="avtar avtar-xs btn-link-secondary">
                                                <i className="ti ti-trash f-20"></i>
                                            </a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Bootstrap 5 Course</td>
                                        <td>Brielle Williamson</td>
                                        <td className="f-w-600">
                                            <i className="fas fa-star text-warning"></i> 4.4
                                        </td>
                                        <td>$150</td>
                                        <td><span className="donut">6/7</span></td>
                                        <td>
                                            <a href="#" className="avtar avtar-xs btn-link-secondary">
                                                <i className="ti ti-eye f-20"></i>
                                            </a>
                                            <a href="#" className="avtar avtar-xs btn-link-secondary">
                                                <i className="ti ti-edit f-20"></i>
                                            </a>
                                            <a href="#" className="avtar avtar-xs btn-link-secondary">
                                                <i className="ti ti-trash f-20"></i>
                                            </a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>C Training Course</td>
                                        <td>Cedric Kelly</td>
                                        <td className="f-w-600">
                                            <i className="fas fa-star text-warning"></i> 4.3
                                        </td>
                                        <td>$50</td>
                                        <td><span className="donut">3/7</span></td>
                                        <td>
                                            <a href="#" className="avtar avtar-xs btn-link-secondary">
                                                <i className="ti ti-eye f-20"></i>
                                            </a>
                                            <a href="#" className="avtar avtar-xs btn-link-secondary">
                                                <i className="ti ti-edit f-20"></i>
                                            </a>
                                            <a href="#" className="avtar avtar-xs btn-link-secondary">
                                                <i className="ti ti-trash f-20"></i>
                                            </a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </React.Fragment>
    )
}

export default CourseStates