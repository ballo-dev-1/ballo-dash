import React, { useState,ReactElement } from 'react';
import Layout from '@layout/index';
import { PricingData } from '@views/Courses/CoursePricing';
import bulb from '@assets/images/admin/img-bulb.svg';
import BreadcrumbItem from '@common/BreadcrumbItem';
import { Card, CardBody, CardHeader, Col, Row } from 'react-bootstrap';
import Image from 'next/image';

const Pricing = () => {
    const [selectedTab, setSelectedTab] = useState('FREE');

    const handleTabChange = (tab: any) => {
        setSelectedTab(tab);
    };

    return (
        <React.Fragment>
            <BreadcrumbItem mainTitle="Online Courses" subTitle="Pricing" />
            <Row>
                <div className="col-12">
                    <Card>
                        <CardHeader>
                            <h5 className="mb-0">Pricing</h5>
                        </CardHeader>
                        <CardBody>
                            <Row className="justify-content-center">
                                <Col md={10} lg={8} xxl={6}>
                                    <Card className="border">
                                        <CardBody>
                                            <Row>
                                                <Col sm={5}>
                                                    <Image src={bulb} alt="images" className="img-fluid" />
                                                    <ul className="d-flex flex-column gap-2 mt-3">
                                                        <li>Unlimited Students</li>
                                                        <li>No Transaction Fees</li>
                                                        <li>Course Product</li>
                                                        <li>5 Admin-level user</li>
                                                        <li>Priority Product Support</li>
                                                        <li>Advanced Reports</li>
                                                    </ul>
                                                </Col>
                                                <Col sm={7}>
                                                    <div className="course-price">
                                                        {(PricingData || []).map((item: any, key: any) => (
                                                            <div className="form-check p-0" key={key}>
                                                                <input
                                                                    type="radio"
                                                                    name="pricing"
                                                                    className="form-check-input input-primary"
                                                                    id={item.id}
                                                                    checked={selectedTab === 'FREE'}
                                                                    onChange={() => handleTabChange('FREE')}
                                                                />
                                                                <label className="form-check-label d-block" htmlFor={item.id}>
                                                                    <span className="d-flex align-items-center">
                                                                        <span className="flex-grow-1 me-3">
                                                                            <span className="h5 d-block">{item.title}</span>
                                                                            <span className="badge"><i className={item.icon}>&nbsp;</i>{item.badge}</span>
                                                                        </span>
                                                                        <span className="flex-shrink-0">
                                                                            <span className="h3 mb-0">{item.price}$/<span className="text-sm">mo</span></span>
                                                                        </span>
                                                                    </span>
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </div>
            </Row>
        </React.Fragment>
    );
};
Pricing.getLayout = (page: ReactElement) => {
    return (
        <Layout>
            {page}
        </Layout>
    )
}
export default Pricing;
