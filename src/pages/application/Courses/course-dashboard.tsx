import React, { useState, useRef, useEffect, ReactElement } from 'react'
import Layout from '@layout/index'
import BreadcrumbItem from '@common/BreadcrumbItem'
import { Card, CardBody, Col, Row } from 'react-bootstrap'
import RevenueChart from '@views/Courses/Dashboard/FloatChart'
import InvitesGoalChart from '@views/Courses/Dashboard/InvitesGoalChart'
import UpcomingCourse from '@views/Courses/Dashboard/UpcomingCourse'
import Courses from '@views/Courses/Dashboard/Courses'
import TotalRevenue1 from '@views/Courses/Dashboard/TotalRevenue1'
import TotalRevenue2 from '@views/Courses/Dashboard/TotalRevenue2'
import StudentStatesChart from '@views/Courses/Dashboard/StudentStates'
import StudentQueries from '@views/Courses/Dashboard/StudentQueries'
import Activity from '@views/Courses/Dashboard/Activity'
import Datepicker from '@views/Courses/Dashboard/Datepickr'
import UserActivity from '@views/Courses/Dashboard/UserActivity'
import TrendingCourses from '@views/Courses/Dashboard/TrendingCourses'
import VisitorsBarChart from '@views/Courses/Dashboard/Visitors'
import EarningsChart from '@views/Courses/Dashboard/EarningCourses'
import Notifications from '@views/Courses/Dashboard/Notifications'
import CourseStates from '@views/Courses/Dashboard/CourseStates'
import Link from 'next/link'


const CourseDashboard = () => {

    const [display, setDisplay] = useState(null)
    const dropdownRef = useRef(null)

    const handleDropDown = (id: any) => {
        if (display === id) {
            setDisplay(null)
        } else {
            setDisplay(id)
        }
    }
    const handleClickOutside = (event: any) => {
        if (
            dropdownRef.current &&
            !event.target.closest('.dropdown')
        ) {
            setDisplay(null);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const DashWidgets = [
        {
            id: 1,
            icon: "ti ti-users f-24",
            iconColor: "bg-light-primary",
            title: "New Students",
            user: "400+",
            per: "30.6%",
            perColor: "text-success",
        },
        {
            id: 2,
            icon: "ti ti-notebook f-24",
            iconColor: "bg-light-warning",
            title: "Total Course",
            user: "520+",
            per: "30.6%",
            perColor: "text-warning",
        },
        {
            id: 3,
            icon: "ti ti-eye f-24",
            iconColor: "bg-light-success",
            title: "New Visitor",
            user: "800+",
            per: "30.6%",
            perColor: "text-success",
        },
        {
            id: 4,
            icon: "ti ti-credit-card f-24",
            iconColor: "bg-light-danger",
            title: "Total sale",
            user: "1,065",
            per: "30.6%",
            perColor: "text-danger",
        },
    ]
    return (
        <React.Fragment>
            <BreadcrumbItem mainTitle="Online Courses" subTitle="Dashboard" />
            <Row>
                {(DashWidgets || []).map((item, key) => (
                    <Col lg={3} md={6} key={key}>
                        <Card>
                            <CardBody>
                                <div className="d-flex align-items-center">
                                    <div className="flex-shrink-0">
                                        <div className={"avtar " + item.iconColor}>
                                            <i className={item.icon}></i>
                                        </div>
                                    </div>
                                    <div className="flex-grow-1 ms-3">
                                        <p className="mb-1">{item.title}</p>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <h4 className="mb-0">{item.user}</h4>
                                            <span className={item.perColor + " fw-medium"}>{item.per}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                ))}
                <Col lg={7} md={12}>
                    <Card >
                        <CardBody>
                            <div className="d-flex align-items-start justify-content-between">
                                <div>
                                    <h5 className="mb-1">Statistics</h5>
                                    <p className="text-muted mb-2">Revenue and Sales</p>
                                </div>
                                <select className="form-select rounded-3 form-select-sm w-auto">
                                    <option>Today</option>
                                    <option>Weekly</option>
                                    <option defaultValue="Monthly">Monthly</option>
                                </select>
                            </div>
                            <div id="revenue-sales-chart">
                                <RevenueChart />
                            </div>
                        </CardBody>
                    </Card>
                </Col>
                <Col lg={5} md={12}>
                    <Card>
                        <CardBody>
                            <div className="d-flex align-items-center justify-content-between">
                                <h5 className="mb-0">Invites goal</h5>
                                <div className="dropdown">
                                    <Link
                                        ref={dropdownRef}
                                        className={`avtar avtar-s btn-link-secondary dropdown-toggle arrow-none ${display === 31 ? 'show' : ""}`} href="#"
                                        data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" onClick={() => handleDropDown(31)}>
                                        <i className="ti ti-dots-vertical f-18"></i>
                                    </Link>
                                    <div className={`dropdown-menu dropdown-menu-end ${display === 31 ? "show show2" : ""}`}>
                                        <Link className="dropdown-item" href="#" onClick={handleDropDown}>Today</Link>
                                        <Link className="dropdown-item" href="#" onClick={handleDropDown}>Weekly</Link>
                                        <Link className="dropdown-item" href="#" onClick={handleDropDown}>Monthly</Link>
                                    </div>
                                </div>
                            </div>
                            <div id="invites-goal-chart"><InvitesGoalChart /></div>
                            <div className="text-center">
                                <span className="badge bg-light-success rounded-pill f-12 py-2 px-3">+10%</span>
                                <p className="text-muted mb-1">You succeed earn $240 today, its higher than yesterday</p>

                                <Row>
                                    <div className="col-4">
                                        <div className="text-center d-inline-block px-md-3">
                                            <p className="mb-1 text-muted">Target</p>
                                            <h5 className="d-inline-flex align-items-center gap-1 mb-0">
                                                $20k <i className="ti ti-arrow-narrow-down text-danger"></i>
                                            </h5>
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div className="text-center d-inline-block px-md-3">
                                            <p className="mb-1 text-muted">Revenue</p>
                                            <h5 className="d-inline-flex align-items-center gap-1 mb-0">
                                                $16k <i className="ti ti-arrow-narrow-up text-success"></i>
                                            </h5>
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div className="text-center d-inline-block px-md-3">
                                            <p className="mb-1 text-muted">Today</p>
                                            <h5 className="d-inline-flex align-items-center gap-1 mb-0">
                                                $1.5k <i className="ti ti-arrow-narrow-down text-danger"></i>
                                            </h5>
                                        </div>
                                    </div>
                                </Row>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
                {/* ------------upcoming course----------- */}
                <UpcomingCourse />

                <Col lg={7} md={12}>
                    <Card>
                        <CardBody>
                            <div className="d-flex align-items-center justify-content-between">
                                <h5 className="mb-0">Courses</h5>
                                <button className="btn btn-sm btn-link-primary">View Report</button>
                            </div>
                            <h4 className="mb-1">$7,860</h4>
                            <p className="d-inline-flex align-items-center text-success gap-1 mb-0">
                                <i className="ti ti-arrow-narrow-up"></i> 2.1%
                            </p>
                            <p className="text-muted mb-1">Sales from 1-12 Dec, 2023</p>
                            <div id="course-report-bar-chart">
                                <Courses />
                            </div>
                        </CardBody>
                    </Card>
                </Col>
                <Col lg={4} md={6}>
                    <Card>
                        <CardBody>
                            <p className="text-muted mb-1">Total Revenue</p>
                            <div className="d-flex align-items-center justify-content-between">
                                <h4 className="mb-0">7,265</h4>
                                <p className="d-inline-flex align-items-center gap-1 mb-0">
                                    +11.02% <i className="ti ti-arrow-up-right text-success"></i>
                                </p>
                            </div>
                            <div id="total-revenue-line-1-chart"><TotalRevenue1 /></div>
                        </CardBody>
                    </Card>
                    <Card>
                        <CardBody>
                            <p className="text-muted mb-1">Total Subscription</p>
                            <div className="d-flex align-items-center justify-content-between">
                                <h4 className="mb-0">5,326</h4>
                                <p className="d-inline-flex align-items-center gap-1 mb-0">
                                    +12.02% <i className="ti ti-arrow-down-right text-danger"></i>
                                </p>
                            </div>
                            <div id="total-revenue-line-2-chart"><TotalRevenue2 /></div>
                        </CardBody>
                    </Card>
                </Col>
                <Col lg={4} md={6}>
                    <Card>
                        <CardBody>
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <h5 className="mb-0">Student States</h5>
                                <div className="dropdown">
                                    <Link className={`avtar avtar-s btn-link-secondary dropdown-toggle arrow-none ${display === 32 ? 'show' : ""}`} href="#"
                                        data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" onClick={() => handleDropDown(32)}>
                                        <i className="ti ti-dots-vertical f-18"></i>
                                    </Link>
                                    <div className={`dropdown-menu dropdown-menu-end ${display === 32 ? 'show show2' : ""}`}>
                                        <Link className="dropdown-item" href="#" onClick={handleDropDown}>Today</Link>
                                        <Link className="dropdown-item" href="#" onClick={handleDropDown}>Weekly</Link>
                                        <Link className="dropdown-item" href="#" onClick={handleDropDown}>Monthly</Link>
                                    </div>
                                </div>
                            </div>
                            <div id="student-states-chart"><StudentStatesChart /></div>
                        </CardBody>
                    </Card>
                </Col>
                <StudentQueries
                    display={display}
                    dropdownRef={dropdownRef}
                    handleDropDown={handleDropDown}
                    handleClickOutside={handleClickOutside}
                />
                <Col lg={8} md={12}>
                    <Card>
                        <CardBody>
                            <div className="d-flex align-items-start justify-content-between">
                                <div>
                                    <h5 className="mb-1">Activity</h5>
                                </div>
                                <select className="form-select rounded-3 form-select-sm w-auto">
                                    <option>Today</option>
                                    <option>Weekly</option>
                                    <option defaultValue="Monthly">Monthly</option>
                                </select>
                            </div>
                            <div id="activity-line-chart"><Activity /></div>
                        </CardBody>
                    </Card>
                </Col>
                {/* ------Datepicker-------- */}
                <Col lg={4} className="col-md-12">
                    <Card>
                        <CardBody>
                            <div className="widget-calender" id="pc-datepicker-6">
                                <Datepicker />
                            </div>
                        </CardBody>
                    </Card>
                </Col>
                {/* ---------user activity------- */}
                <UserActivity />
                {/* -------trending courses-------- */}
                <TrendingCourses />
                {/* ------visitors---- */}
                <Col lg={4} md={6}>
                    <Card>
                        <CardBody>
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <h5 className="mb-0">Visitors</h5>
                                <div className="dropdown">
                                    <Link className={`avtar avtar-s btn-link-secondary dropdown-toggle arrow-none ${display === 34 ? "show" : ""}`} href="#"
                                        data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" onClick={() => handleDropDown(34)}>
                                        <i className="ti ti-dots-vertical f-18"></i>
                                    </Link>
                                    <div className={`dropdown-menu dropdown-menu-end ${display === 34 ? "show show2" : ""}`}>
                                        <Link className="dropdown-item" href="#">Today</Link>
                                        <Link className="dropdown-item" href="#">Weekly</Link>
                                        <Link className="dropdown-item" href="#">Monthly</Link>
                                    </div>
                                </div>
                            </div>
                            <div id="visitors-bar-chart">
                                <VisitorsBarChart />
                            </div>
                        </CardBody>
                    </Card>
                </Col>
                {/* ------earning courses------- */}
                <Col lg={4} md={6}>
                    <Card>
                        <CardBody>
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <h5 className="mb-0">Earning Courses</h5>
                                <select className="form-select rounded-3 form-select-sm w-auto">
                                    <option>Day</option>
                                    <option>Month</option>
                                    <option defaultValue="Year">Year</option>
                                </select>
                            </div>
                            <div id="earning-courses-line-chart">
                                <EarningsChart />
                            </div>
                        </CardBody>
                    </Card>
                </Col>
                {/* -----notifications------ */}
                <Notifications
                    display={display}
                    dropdownRef={dropdownRef}
                    handleDropDown={handleDropDown}
                    handleClickOutside={handleClickOutside}
                />
                {/* ----course states----- */}
                <CourseStates />
            </Row>
        </React.Fragment>
    )
}

CourseDashboard.getLayout = (page: ReactElement) => {
    return (
        <Layout>
            {page}
        </Layout>
    )
}

export default CourseDashboard