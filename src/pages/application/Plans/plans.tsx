import React, { useState, ReactElement } from 'react'
import Layout from '@layout/index'
import { Row, Col, Card, CardBody } from 'react-bootstrap'
import BreadcrumbItem from '../../../Common/BreadcrumbItem'
import { PlansDataPerMonth, PlansDataPerYear } from '../../../data/PlansData'

const Plans = () => {

    const [show, setShow] = useState(false)

    const handleSwitch = () => {
        setShow(!show)
    }

    return (
        <React.Fragment>
            <BreadcrumbItem mainTitle="Applications" subTitle="Plans" />
            <Row>
                <Col sm={12}>
                    <Row className="align-items-center justify-content-center mb-4">
                        <div className="col-auto">
                            <label htmlFor="swc-price" className="h4 mb-0">Annual</label>
                        </div>
                        <div className="col-auto">
                            <div className="form-check form-switch p-0 m-0">
                                <input className="form-check-input f-20 m-0 postion-relative" type="checkbox" role="switch" id="swc-price" onClick={handleSwitch} />
                            </div>
                        </div>
                        <div className="col-auto">
                            <label htmlFor="swc-price" className="h4 mb-0">Monthly</label>
                        </div>
                    </Row>
                    <div className={`multi-collapse collapse ${show === true ? "show" : ""}`}>
                        <Row>
                            {
                                PlansDataPerMonth.map((items: any, index: number) => {
                                    return (
                                        <Col md={6} xxl={3} key={index}>
                                            <Card className="price-card">
                                                <CardBody className={`price-head ${items.iconColor}`}>
                                                    <h5 className={items.textColor}>{items.type}</h5>
                                                    <h2 className={`price-price ${items.textColor}`}>{items.price} <span>{items.duration}</span></h2>
                                                    <div className={`price-icon ${items.iconColor}`}>
                                                        <i className={`${items.icon}`}></i>
                                                    </div>
                                                </CardBody>
                                                <CardBody>
                                                    <ul className="list-unstyled product-list">
                                                        <li className="enable"><i className="ph-duotone ph-check-circle"></i>{items.points.point1}</li>
                                                        <li className="enable"><i className="ph-duotone ph-check-circle"></i>{items.points.point2}</li>
                                                        <li className="enable"><i className="ph-duotone ph-check-circle"></i>{items.points.point3}</li>
                                                        <li>{items.points.point4}</li>
                                                        <li>{items.points.point5}</li>
                                                        <li>{items.points.point6}</li>
                                                        <li>{items.points.point7}</li>
                                                        <li>{items.points.point8}</li>
                                                        <li>{items.points.point9}</li>
                                                        <li>{items.points.point10}</li>
                                                    </ul>
                                                    <div className="d-grid">
                                                        <button className={`btn ${items.buttonColor}`}>{items.plan}</button>
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    )
                                })
                            }

                        </Row>
                    </div>
                    <div className={`multi-collapse collapse ${show === true ? "" : "show"}`}>
                        <Row>
                            {
                                PlansDataPerYear.map((items: any, index: number) => {
                                    return (
                                        <Col md={6} xxl={3} key={index}>
                                            <Card className="price-card">
                                                <CardBody className={`price-head ${items.iconColor}`}>
                                                    <h5 className={items.textColor}>{items.type}</h5>
                                                    <h2 className={`price-price ${items.textColor}`}>{items.price} <span>{items.duration}</span></h2>
                                                    <div className={`price-icon ${items.iconColor}`}>
                                                        <i className={`${items.icon}`}></i>
                                                    </div>
                                                </CardBody>
                                                <CardBody>
                                                    <ul className="list-unstyled product-list">
                                                        <li className="enable"><i className="ph-duotone ph-check-circle"></i>{items.points.point1}</li>
                                                        <li className="enable"><i className="ph-duotone ph-check-circle"></i>{items.points.point2}</li>
                                                        <li className="enable"><i className="ph-duotone ph-check-circle"></i>{items.points.point3}</li>
                                                        <li>{items.points.point4}</li>
                                                        <li>{items.points.point5}</li>
                                                        <li>{items.points.point6}</li>
                                                        <li>{items.points.point7}</li>
                                                        <li>{items.points.point8}</li>
                                                        <li>{items.points.point9}</li>
                                                        <li>{items.points.point10}</li>
                                                    </ul>
                                                    <div className="d-grid">
                                                        <button className={`btn ${items.buttonColor}`}>{items.plan}</button>
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    )
                                })
                            }

                        </Row>
                    </div>
                </Col>
            </Row>
        </React.Fragment>
    )
}
Plans.getLayout = (page: ReactElement) => {
    return (
        <Layout>
            {page}
        </Layout>
    )
}
export default Plans
