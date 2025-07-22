import Image from "next/image";
import React, { useState } from "react";
import { Card, Col, Collapse, Row, Tab,CardBody,CardHeader } from "react-bootstrap";
import ProcesstoCheckout from "./ProcesstoCheckout";
import Link from "next/link";

const ShippingInformation = () => {
    const [addNewAddress, setAddNewAddress] = useState<boolean>(true);
    const [showForm, setShowForm] = useState<boolean>(false);

    const toggleForm = () => {
        setShowForm(!showForm);
    };


    return (
        <React.Fragment>
            <Tab.Pane eventKey="ecomtab-2" id="ecomtab-2" role="tabpanel" aria-labelledby="ecomtab-tab-2">
                <Row className="row">
                    <Col xl={8}>
                        <Card>
                            <CardHeader>
                                <Row className="align-items-center">
                                    <Col>
                                        <div className="progress" style={{ height: "6px" }}>
                                            <div className="progress-bar bg-primary" style={{ width: "66%" }}></div>
                                        </div>
                                    </Col>
                                    <div className="col-auto">
                                        <p className="mb-0 h6">Step 2</p>
                                    </div>
                                </Row>
                            </CardHeader>
                            <div className={`collapse multi-collapse ${addNewAddress && !showForm ? 'show' : ''}`} id="multiCollapseExample1">
                                <CardBody className="card-body border-bottom">
                                    <div className="row align-items-center">
                                        <div className="col">
                                            <h5 className="mb-0">Shipping Information</h5>
                                        </div>
                                        <div className="col-auto">
                                            <button
                                                className={`btn btn-primary ${showForm ? 'collapsed' : ''}`}
                                                type="button"
                                                onClick={toggleForm}
                                            >
                                                Add new Address
                                            </button>
                                        </div>
                                    </div>
                                </CardBody>
                                <CardBody>
                                    <div className="address-check-block">
                                        <div className="address-check border rounded p-3">
                                            <div className="form-check">
                                                <input type="radio" name="radio1" className="form-check-input input-primary"
                                                    id="address-check-1" />
                                                <label className="form-check-label d-block" htmlFor="address-check-1">
                                                    <span className="h6 mb-0 d-block">Ian Carpenter <small
                                                        className="text-muted">(Home)</small></span>
                                                    <span className="text-muted address-details">1754 Ureate Path, 695 Newga View, Seporcus,
                                                        Rhode Island, Belgium - SA5 5BO</span>
                                                    <span className="row align-items-center justify-content-between">
                                                        <span className="col-6">
                                                            <span className="text-muted mb-0">+91 1234567890</span>
                                                        </span>
                                                        <span className="col-6 text-end">
                                                            <span className="address-btns d-flex align-items-center justify-content-end gap-2">
                                                                <Link href="#" className="avtar avtar-s btn-link-danger btn-pc-default">
                                                                    <i className="ti ti-trash f-20"></i>
                                                                </Link>
                                                                <span className="btn btn-sm btn-outline-primary">Deliver to this address</span>
                                                            </span>
                                                        </span>
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="address-check border rounded p-3">
                                            <div className="form-check">
                                                <input type="tadio" name='radio1' className="form-check-input input-primary" id='address-check-2' />
                                                <label className="form-check-label d-block" htmlFor="address-check-2">
                                                    <span className="h6 mb-0 d-block">Ian Carpenter <small
                                                        className="text-muted">(Home)</small></span>
                                                    <span className="text-muted address-details">1754 Ureate Path, 695 Newga View, Seporcus,
                                                        Rhode Island, Belgium - SA5 5BO</span>
                                                    <span className="row align-items-center justify-content-between">
                                                        <span className="col-6">
                                                            <span className="text-muted mb-0">+91 1234567890</span>
                                                        </span>
                                                        <span className="col-6 text-end">
                                                            <span className="address-btns d-flex align-items-center justify-content-end gap-2">
                                                                <Link href="#" className="avtar avtar-s btn-link-danger btn-pc-default">
                                                                    <i className="ti ti-trash f-20"></i>
                                                                </Link>
                                                                <span className="btn btn-sm btn-outline-primary">Deliver to this address</span>
                                                            </span>
                                                        </span>
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="address-check border rounded p-3">
                                            <div className="form-check">
                                                <input type="radio" name="radio1" className="form-check-input input-primary"
                                                    id="address-check-3" />
                                                <label className="form-check-label d-block" htmlFor="address-check-3">
                                                    <span className="h6 mb-0 d-block">Ian Carpenter <small
                                                        className="text-muted">(Home)</small></span>
                                                    <span className="text-muted address-details">1754 Ureate Path, 695 Newga View, Seporcus,
                                                        Rhode Island, Belgium - SA5 5BO</span>
                                                    <span className="row align-items-center justify-content-between">
                                                        <span className="col-6">
                                                            <span className="text-muted mb-0">+91 1234567890</span>
                                                        </span>
                                                        <span className="col-6 text-end">
                                                            <span className="address-btns d-flex align-items-center justify-content-end gap-2">
                                                                <Link href="#" className="avtar avtar-s btn-link-danger btn-pc-default">
                                                                    <i className="ti ti-trash f-20"></i>
                                                                </Link>
                                                                <span className="btn btn-sm btn-outline-primary">Deliver to this address</span>
                                                            </span>
                                                        </span>
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="address-check border rounded p-3">
                                            <div className="form-check">
                                                <input type="radio" name="radio1" className="form-check-input input-primary"
                                                    id="address-check-4" />
                                                <label className="form-check-label d-block" htmlFor="address-check-4">
                                                    <span className="h6 mb-0 d-block">Ian Carpenter <small
                                                        className="text-muted">(Home)</small></span>
                                                    <span className="text-muted address-details">1754 Ureate Path, 695 Newga View, Seporcus,
                                                        Rhode Island, Belgium - SA5 5BO</span>
                                                    <span className="row align-items-center justify-content-between">
                                                        <span className="col-6">
                                                            <span className="text-muted mb-0">+91 1234567890</span>
                                                        </span>
                                                        <span className="col-6 text-end">
                                                            <span className="address-btns d-flex align-items-center justify-content-end gap-2">
                                                                <Link href="#" className="avtar avtar-s btn-link-danger btn-pc-default">
                                                                    <i className="ti ti-trash f-20"></i>
                                                                </Link>
                                                                <span className="btn btn-sm btn-outline-primary">Deliver to this address</span>
                                                            </span>
                                                        </span>
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </CardBody>
                            </div>
                            {showForm && (
                                <div className={`collapse multi-collapse ${addNewAddress && showForm ? 'show' : ''}`} id="multiCollapseExample2">
                                    <div className="card-body border-bottom">
                                        <div className="row align-items-center">
                                            <div className="col">
                                                <h5 className="mb-0">Add new address</h5>
                                            </div>
                                            <div className="col-auto">
                                            </div>
                                        </div>
                                    </div>
                                    <CardBody>
                                        <Row>
                                            <Col>
                                                <Row className="mb-3 align-items-center g-2">
                                                    <label className="col-lg-4 col-form-label py-0">Address Type :<small
                                                        className="text-muted d-block">Enter Add Type</small></label>
                                                    <Col lg={8}>
                                                        <div className="form-check form-check-inline">
                                                            <input className="form-check-input" type="radio" name="flexRadioDefault"
                                                                id="addtypecheck1" />
                                                            <label className="form-check-label" htmlFor="addtypecheck1">
                                                                Home (All day Delivery)
                                                            </label>
                                                        </div>
                                                        <div className="form-check form-check-inline">
                                                            <input className="form-check-input" type="radio" name="flexRadioDefault"
                                                                id="addtypecheck2" />
                                                            <label className="form-check-label" htmlFor="addtypecheck2">
                                                                Work (Between 10 AM to 5 PM)
                                                            </label>
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Row className="mb-3 align-items-center g-2">
                                                    <label className="col-lg-4 col-form-label py-0">First Name :<small className="text-muted d-block">Enter
                                                        your first name</small></label>
                                                    <div className="col-lg-8">
                                                        <input type="text" className="form-control" />
                                                    </div>
                                                </Row>
                                                <Row className="mb-3 align-items-center g-2">
                                                    <label className="col-lg-4 col-form-label py-0">Last Name :<small className="text-muted d-block">Enter
                                                        your last name</small></label>
                                                    <div className="col-lg-8">
                                                        <input type="text" className="form-control" />
                                                    </div>
                                                </Row>
                                                <Row className="mb-3 align-items-center g-2">
                                                    <label className="col-lg-4 col-form-label py-0">Email Id :<small className="text-muted d-block">Enter
                                                        Email id</small></label>
                                                    <div className="col-lg-8">
                                                        <input type="email" className="form-control" />
                                                    </div>
                                                </Row>
                                                <Row className="mb-3 align-items-center g-2">
                                                    <label className="col-lg-4 col-form-label py-0">Date of Birth :<small
                                                        className="text-muted d-block">Enter
                                                        the date of birth</small></label>
                                                    <div className="col-lg-8">
                                                        <input type="date" className="form-control" />
                                                    </div>
                                                </Row>
                                                <Row className="mb-3 align-items-center g-2">
                                                    <label className="col-lg-4 col-form-label py-0">Phone number :<small
                                                        className="text-muted d-block">Enter
                                                        Phone number</small></label>
                                                    <div className="col-lg-8">
                                                        <input type="text" className="form-control" />
                                                    </div>
                                                </Row>
                                                <Row className="mb-3 align-items-center g-2">
                                                    <label className="col-lg-4 col-form-label py-0">City :<small className="text-muted d-block">Enter
                                                        City name</small></label>
                                                    <div className="col-lg-8">
                                                        <input type="text" className="form-control" />
                                                    </div>
                                                </Row>
                                                <div className="mb-3">
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="checkbox" id="checkaddres" />
                                                        <label className="form-check-label" htmlFor="checkaddres">
                                                            Save this new address for future shipping
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="text-end btn-page mb-0 mt-4">
                                                    <button
                                                        className={`btn btn-outline-secondary`}
                                                        type="button"
                                                        onClick={toggleForm}
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button className="btn btn-primary">Save & Deliver to this
                                                        Address</button>
                                                </div>
                                            </Col>
                                        </Row>
                                    </CardBody>

                                </div>
                            )}
                        </Card>
                        <div className="d-flex justify-content-end mb-3">
                            <button className="btn btn-link-primary"><i className="ti ti-arrow-narrow-left align-text-bottom me-2"></i>Back to Cart</button>
                        </div>
                    </Col>
                    <ProcesstoCheckout isCardSummary={true} isPayment={false} />
                </Row>
            </Tab.Pane>
        </React.Fragment>
    );
}

export default ShippingInformation;