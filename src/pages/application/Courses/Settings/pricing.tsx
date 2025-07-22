import React, { useState,ReactElement } from 'react'
import Layout from '@layout/index'
import { Card, CardBody, Col, Row } from 'react-bootstrap'
import BreadcrumbItem from '@common/BreadcrumbItem'

const Pricing = () => {

    const [activeTab, setActiveTab] = useState('pills-home-tab');

    const handleTabClick = (tab: any, e: any) => {
        setActiveTab(tab);
        e.preventDefault();
    };

    return (
        <React.Fragment>
            <BreadcrumbItem mainTitle="Online Courses" subTitle="Pricing" />
            <Row>
                <Col>
                    <Card className='border-0 shadow-none bg-transparent mb-1'>
                        <CardBody className='p-2'>
                            <Row className="align-items-center mb-3">
                                <Col>
                                    <h5>Plans & Pricing</h5>
                                    <p>Every paid plan comes with educational resources and training to support you on your journey, along with a 30-day money-back guarantee.</p>
                                </Col>
                                <Col className="col-auto">
                                    <ul className="nav nav-pills nav-price" id="pills-tab" role="tablist">
                                        <li className="nav-item" role="presentation">
                                            <a className={`nav-link ${activeTab === 'pills-home-tab' ? 'active' : ''}`} id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true" onClick={(e) => handleTabClick('pills-home-tab', e)}>Monthly</a>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <a className={`nav-link ${activeTab === 'pills-profile-tab' ? 'active' : ''}`} id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false" onClick={(e) => handleTabClick('pills-profile-tab', e)}>Yearly <span className="badge bg-primary ms-2">Save 30%</span></a>
                                        </li>
                                    </ul>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                    <div className="tab-content" id="pills-tabContent">
                        {activeTab === 'pills-home-tab' && (
                            <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab" tabIndex={0}>
                                <Row className="justify-content-center align-items-center">
                                    <Col lg={4} md={6}>
                                        <Card className="price-card">
                                            <CardBody>
                                                <div className="price-head v2">
                                                    <h5 className="mb-0">Basic</h5>
                                                    <p className="text-muted">03 Services</p>
                                                    <div className="price-price mt-4">$69 <span className="text-muted"> Lifetime</span></div>
                                                    <div className="d-grid"><a className="btn btn-outline-secondary mt-4" href="#">Buy Now</a></div>
                                                </div>
                                                <ul className="list-group list-group-flush product-list">
                                                    <li className="list-group-item enable">One End Product</li>
                                                    <li className="list-group-item enable">No attribution required</li>
                                                    <li className="list-group-item enable">TypeScript</li>
                                                    <li className="list-group-item">Figma Design Resources</li>
                                                    <li className="list-group-item">Create Multiple Products</li>
                                                    <li className="list-group-item">Create a SaaS Project</li>
                                                    <li className="list-group-item">Resale Product</li>
                                                    <li className="list-group-item">Separate sale of our UI Elements?</li>
                                                </ul>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                    <Col lg={4} md={6}>
                                        <Card className="price-card price-popular">
                                            <CardBody>
                                                <div className="price-head v2">
                                                    <span className="badge f-12 bg-success mb-3">Popular</span>
                                                    <h5 className="mb-0">Standard</h5>
                                                    <p className="text-muted">05 Services</p>
                                                    <div className="price-price mt-4">$129 <span className="text-muted"> Lifetime</span></div>
                                                    <div className="d-grid"><a className="btn btn-primary mt-4" href="#">Buy Now</a></div>
                                                </div>
                                                <ul className="list-group list-group-flush product-list">
                                                    <li className="list-group-item enable">One End Product</li>
                                                    <li className="list-group-item enable">No attribution required</li>
                                                    <li className="list-group-item enable">TypeScript</li>
                                                    <li className="list-group-item enable">Figma Design Resources</li>
                                                    <li className="list-group-item enable">Create Multiple Products</li>
                                                    <li className="list-group-item">Create a SaaS Project</li>
                                                    <li className="list-group-item">Resale Product</li>
                                                    <li className="list-group-item">Separate sale of our UI Elements?</li>
                                                </ul>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                    <Col lg={4} md={6}>
                                        <Card className="price-card">
                                            <CardBody>
                                                <div className="price-head v2">
                                                    <h5 className="mb-0">Premium</h5>
                                                    <p className="text-muted">08 Services</p>
                                                    <div className="price-price mt-4">$599 <span className="text-muted"> Lifetime</span></div>
                                                    <div className="d-grid"><a className="btn btn-outline-secondary mt-4" href="#">Buy Now</a></div>
                                                </div>
                                                <ul className="list-group list-group-flush product-list">
                                                    <li className="list-group-item enable">One End Product</li>
                                                    <li className="list-group-item enable">No attribution required</li>
                                                    <li className="list-group-item enable">TypeScript</li>
                                                    <li className="list-group-item enable">Figma Design Resources</li>
                                                    <li className="list-group-item enable">Create Multiple Products</li>
                                                    <li className="list-group-item enable">Create a SaaS Project</li>
                                                    <li className="list-group-item enable">Resale Product</li>
                                                    <li className="list-group-item enable">Separate sale of our UI Elements?</li>
                                                </ul>
                                            </CardBody>
                                        </Card>
                                    </Col>

                                </Row>
                            </div>
                        )}
                        {activeTab === 'pills-profile-tab' && (
                            <div className="tab-pane fade show active" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab" tabIndex={0}>
                                <Row className="justify-content-center align-items-center">

                                    <Col lg={4} md={6}>
                                        <Card className="price-card">
                                            <CardBody>
                                                <div className="price-head v2">
                                                    <h5 className="mb-0">Basic</h5>
                                                    <p className="text-muted">03 Services</p>
                                                    <div className="price-price mt-4">$269 <span className="text-muted"> Lifetime</span></div>
                                                    <div className="d-grid"><a className="btn btn-outline-secondary mt-4" href="#">Buy Now</a></div>
                                                </div>
                                                <ul className="list-group list-group-flush product-list">
                                                    <li className="list-group-item enable">One End Product</li>
                                                    <li className="list-group-item enable">No attribution required</li>
                                                    <li className="list-group-item enable">TypeScript</li>
                                                    <li className="list-group-item">Figma Design Resources</li>
                                                    <li className="list-group-item">Create Multiple Products</li>
                                                    <li className="list-group-item">Create a SaaS Project</li>
                                                    <li className="list-group-item">Resale Product</li>
                                                    <li className="list-group-item">Separate sale of our UI Elements?</li>
                                                </ul>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                    <Col lg={4} md={6}>
                                        <Card className="price-card price-popular">
                                            <CardBody>
                                                <div className="price-head v2">
                                                    <span className="badge f-12 bg-success mb-3">Popular</span>
                                                    <h5 className="mb-0">Standard</h5>
                                                    <p className="text-muted">05 Services</p>
                                                    <div className="price-price mt-4">$529 <span className="text-muted"> Lifetime</span></div>
                                                    <div className="d-grid"><a className="btn btn-primary mt-4" href="#">Buy Now</a></div>
                                                </div>
                                                <ul className="list-group list-group-flush product-list">
                                                    <li className="list-group-item enable">One End Product</li>
                                                    <li className="list-group-item enable">No attribution required</li>
                                                    <li className="list-group-item enable">TypeScript</li>
                                                    <li className="list-group-item enable">Figma Design Resources</li>
                                                    <li className="list-group-item enable">Create Multiple Products</li>
                                                    <li className="list-group-item">Create a SaaS Project</li>
                                                    <li className="list-group-item">Resale Product</li>
                                                    <li className="list-group-item">Separate sale of our UI Elements?</li>
                                                </ul>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                    <Col lg={4} md={6}>
                                        <Card className="price-card">
                                            <CardBody>
                                                <div className="price-head v2">
                                                    <h5 className="mb-0">Premium</h5>
                                                    <p className="text-muted">08 Services</p>
                                                    <div className="price-price mt-4">$1299 <span className="text-muted"> Lifetime</span></div>
                                                    <div className="d-grid"><a className="btn btn-outline-secondary mt-4" href="#">Buy Now</a></div>
                                                </div>
                                                <ul className="list-group list-group-flush product-list">
                                                    <li className="list-group-item enable">One End Product</li>
                                                    <li className="list-group-item enable">No attribution required</li>
                                                    <li className="list-group-item enable">TypeScript</li>
                                                    <li className="list-group-item enable">Figma Design Resources</li>
                                                    <li className="list-group-item enable">Create Multiple Products</li>
                                                    <li className="list-group-item enable">Create a SaaS Project</li>
                                                    <li className="list-group-item enable">Resale Product</li>
                                                    <li className="list-group-item enable">Separate sale of our UI Elements?</li>
                                                </ul>
                                            </CardBody>
                                        </Card>
                                    </Col>

                                </Row>
                            </div>
                        )}
                    </div>
                </Col>
            </Row>
        </React.Fragment>
    )
}
Pricing.getLayout = (page: ReactElement) => {
    return (
        <Layout>
            {page}
        </Layout>
    )
  };
export default Pricing