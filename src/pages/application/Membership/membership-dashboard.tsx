import React,{ReactElement} from 'react'
import Layout from '@layout/index'
import SimpleData from '@views/Membership/Dashboard/SimpleData'
import BreadcrumbItem from '@common/BreadcrumbItem'
import { Card, CardBody, Col, Row } from 'react-bootstrap'
import RevenueAnalitics from '@views/Membership/Dashboard/RevenueAnalytics'
import Calendar from '@views/Membership/Dashboard/Calendar'
import MembershipStateChart from '@views/Membership/Dashboard/MembershipStateChart'
import ActivityLineChart from '@views/Membership/Dashboard/ActivityLineChart'
import LatestSignupList from '@views/Membership/Dashboard/LatestSignupList'
import Notification from '@views/Membership/Dashboard/Notification'

const Dashboard = () => {
    return (
        <React.Fragment>
            <BreadcrumbItem mainTitle="Membership" subTitle="Dashboard" />
            <Row>
                <SimpleData />
                <Col lg={7} md={12}>
                    <Card>
                        <CardBody>
                            <div className="d-flex align-items-start justify-content-between">
                                <h5 className="mb-0">Revenue analytics</h5>
                                <select className="form-select rounded-3 form-select-sm w-auto">
                                    <option value="today">Today</option>
                                    <option value="weekly">Weekly</option>
                                    <option defaultValue="Monthly">Monthly</option>
                                </select>
                            </div>
                            <div id="revenue-analytics-chart"><RevenueAnalitics /></div>
                        </CardBody>
                    </Card>
                </Col>
                <Calendar />
                <Col lg={6} md={12}>
                    <Card>
                        <CardBody>
                            <div className="d-flex align-items-start justify-content-between mb-3">
                                <h5 className="mb-0">Membership State</h5>
                                <select className="form-select rounded-3 form-select-sm w-auto">
                                    <option>Today</option>
                                    <option>Weekly</option>
                                    <option defaultValue="Monthly">Monthly</option>
                                </select>
                            </div>
                            <Row>
                                <Col md={6}>
                                    <div id="membership-state-chart"><MembershipStateChart /></div>
                                </Col>
                                <Col md={6}>
                                    <div className="rounded border p-3 mb-2">
                                        <span className="d-block"><i className="fas fa-circle text-primary f-10 m-r-10"></i>New Membership</span>
                                    </div>
                                    <div className="rounded border p-3">
                                        <span className="d-block"><i className="fas fa-circle text-primary text-opacity-25 f-10 m-r-10"></i>Repeat Membership</span>
                                    </div>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>

                <Col lg={6} md={12}>
                    <Card>
                        <CardBody>
                            <div className="d-flex align-items-start justify-content-between mb-3">
                                <h5 className="mb-0">Activity</h5>
                                <select className="form-select rounded-3 form-select-sm w-auto">
                                    <option>Today</option>
                                    <option>Weekly</option>
                                    <option defaultValue="Monthly">Monthly</option>
                                </select>
                            </div>
                            <div id="activity-line-chart"><ActivityLineChart /></div>
                        </CardBody>
                    </Card>
                </Col>
                <LatestSignupList />
                <Notification />
            </Row>
        </React.Fragment>
    )
}

Dashboard.getLayout = (page: ReactElement) => {
    return (
        <Layout>
            {page}
        </Layout>
    )
}

export default Dashboard
