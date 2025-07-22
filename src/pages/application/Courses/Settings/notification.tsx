import React, { useState,ReactElement } from 'react'
import Layout from '@layout/index';
import BreadcrumbItem from '@common/BreadcrumbItem';
import { Card, CardBody, CardHeader, Row } from 'react-bootstrap';

const Notification = () => {

    // Initialize state for each switch
    const [notifications, setNotifications] = useState({
        notify1: true,
        notify2: true,
        notify3: false,
        notify4: true,
        notify5: false,
        notify6: true,
        notify7: true,
        notify8: true,
    });

    // Handle switch change
    const handleSwitchChange = (event: any) => {
        const { id, checked } = event.target;
        setNotifications((prev: any) => ({
            ...prev,
            [id]: checked,
        }));
    };

    return (
        <React.Fragment>
            <BreadcrumbItem mainTitle="Online Courses" subTitle="Notifications" />
            <Row>
                <div className="col-12">
                    <Card>
                        <CardHeader>
                            <h5>Notifications</h5>
                        </CardHeader>
                        <CardBody>
                            <h6>Enrollment Notifications</h6>
                            <p className="text-muted">Get notified via email whenever a student enrolls in your school and/or courses.</p>
                            <Card className="shadow-none border">
                                <CardBody className="p-3">
                                    <div className="form-check form-switch form-check-reverse text-start mb-2">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="notify1"
                                            checked={notifications.notify1}
                                            onChange={handleSwitchChange}
                                        />
                                        <label className="form-check-label" htmlFor="notify1">
                                            When a new student joins the school
                                        </label>
                                    </div>
                                    <div className="form-check form-switch form-check-reverse text-start mb-2">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="notify2"
                                            checked={notifications.notify2}
                                            onChange={handleSwitchChange}
                                        />
                                        <label className="form-check-label" htmlFor="notify2">
                                            When a student enrolls in a paid course
                                        </label>
                                    </div>
                                    <div className="form-check form-switch form-check-reverse text-start mb-0">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="notify3"
                                            checked={notifications.notify3}
                                            onChange={handleSwitchChange}
                                        />
                                        <label className="form-check-label" htmlFor="notify3">
                                            When a student enrolls in a free course
                                        </label>
                                    </div>
                                </CardBody>
                            </Card>

                            <h6 className="mt-3 mt-md-5">Comment Notifications</h6>
                            <p className="text-muted">Get alerted via email whenever someone engages in a commenting action.</p>
                            <Card className="shadow-none border">
                                <CardBody className="p-3">
                                    <div className="form-check form-switch form-check-reverse text-start mb-2">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="notify4"
                                            checked={notifications.notify4}
                                            onChange={handleSwitchChange}
                                        />
                                        <label className="form-check-label" htmlFor="notify4">
                                            When a new comment is posted that requires moderation
                                        </label>
                                    </div>
                                    <div className="form-check form-switch form-check-reverse text-start mb-2">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="notify5"
                                            checked={notifications.notify5}
                                            onChange={handleSwitchChange}
                                        />
                                        <label className="form-check-label" htmlFor="notify5">
                                            When a new comment is posted on one of your courses
                                        </label>
                                    </div>
                                    <div className="form-check form-switch form-check-reverse text-start mb-0">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="notify6"
                                            checked={notifications.notify6}
                                            onChange={handleSwitchChange}
                                        />
                                        <label className="form-check-label" htmlFor="notify6">
                                            When a new comment is posted in a thread you've commented on
                                        </label>
                                    </div>
                                </CardBody>
                            </Card>

                            <h6 className="mt-3 mt-md-5">Subscription Notifications</h6>
                            <p className="text-muted">Get email notifications for specific subscription events.</p>
                            <Card className="shadow-none border">
                                <CardBody className="p-3">
                                    <div className="form-check form-switch form-check-reverse text-start mb-2">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="notify7"
                                            checked={notifications.notify7}
                                            onChange={handleSwitchChange}
                                        />
                                        <label className="form-check-label" htmlFor="notify7">
                                            When a subscription payment fails or a subscription is canceled due to non-payment
                                        </label>
                                    </div>
                                    <div className="form-check form-switch form-check-reverse text-start mb-2">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="notify8"
                                            checked={notifications.notify8}
                                            onChange={handleSwitchChange}
                                        />
                                        <label className="form-check-label" htmlFor="notify8">
                                            When a student cancels their subscription to one of your courses
                                        </label>
                                    </div>
                                </CardBody>
                            </Card>

                        </CardBody>
                    </Card>
                </div>
            </Row>
        </React.Fragment>
    )
}
Notification.getLayout = (page: ReactElement) => {
    return (
        <Layout>
            {page}
        </Layout>
    )
  };
export default Notification