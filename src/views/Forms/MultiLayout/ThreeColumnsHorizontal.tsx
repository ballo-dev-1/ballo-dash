import React from "react";
import { Row, Card, Form, Col, InputGroup } from 'react-bootstrap';

const ThreeColumnsHorizontal = () => {
    return (
        <React.Fragment>
            <Card>
                <Card.Header>
                    <h5>3 Columns Horizontal Form Layout</h5>
                </Card.Header>
                <Card.Body>
                    <Form>
                        <Row>
                            <Col lg={4}>
                                <div className="mb-3">
                                    <Row>
                                        <Form.Label className="col-lg-3 col-form-label text-lg-end px-lg-0">Name:</Form.Label>
                                        <Col lg={9}>
                                            <Form.Control type="text" placeholder="Full name" />
                                            <Form.Text className="text-muted">Please enter your full name</Form.Text>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                            <Col lg={4}>
                                <div className="mb-3">
                                    <Row>
                                        <Form.Label className="col-lg-3 col-form-label text-lg-end px-lg-0">Email:</Form.Label>
                                        <Col lg={9}>
                                            <Form.Control type="email" placeholder="Enter email" />
                                            <Form.Text className="text-muted">Please enter your email</Form.Text>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                            <Col lg={4}>
                                <div className="mb-3">
                                    <Row>
                                        <Form.Label className="col-lg-3 col-form-label text-lg-end px-lg-0">Password:</Form.Label>
                                        <Col lg={9}>
                                            <InputGroup>
                                                <InputGroup.Text><i className="feather icon-lock"></i></InputGroup.Text>
                                                <Form.Control type="password" placeholder="Enter Password" />
                                            </InputGroup>
                                            <Form.Text className="text-muted">Please enter your Password</Form.Text>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        </Row>
                        <hr className="my-3" />
                        <Row>
                            <Col lg={4}>
                                <div className="mb-3">
                                    <Row>
                                        <Form.Label className="col-lg-3 col-form-label text-lg-end px-lg-0">Contact:</Form.Label>
                                        <Col lg={9}>
                                            <Form.Control type="text" placeholder="Enter contact number" />
                                            <Form.Text className="text-muted">Please enter your contact</Form.Text>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                            <Col lg={4}>
                                <Row>
                                    <div className="mb-3">
                                        <Form.Label className="col-lg-3 col-form-label text-lg-end px-lg-0">Profile URL:</Form.Label>
                                        <Col lg={9}>
                                            <div className="input-group search-form">
                                                <Form.Control type="text" placeholder="Fax Profile URL" />
                                                <InputGroup.Text className="bg-transparent"><i className="feather icon-alert-circle"></i></InputGroup.Text>
                                            </div>
                                            <Form.Text className="text-muted">Please enter Profile URL</Form.Text>
                                        </Col>
                                    </div>
                                </Row>
                            </Col>
                            <Col lg={4}>
                                <Row>
                                    <Form.Label className="col-lg-3 col-form-label text-lg-end px-lg-0">Pin code:</Form.Label>
                                    <Col lg={9}>
                                        <Form.Control type="text" placeholder="Enter your Pin code" />
                                        <Form.Text className="text-muted">Please enter your Pin code</Form.Text>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <hr className="my-3" />
                        <Row>
                            <Col lg={4}>
                                <div className="mb-3">
                                    <Row>
                                        <Form.Label className="col-lg-3 col-form-label text-lg-end px-lg-0">Address:</Form.Label>
                                        <Col lg={9}>
                                            <Form.Control type="text" placeholder="Enter your address" />
                                            <Form.Text className="text-muted">Please enter your address</Form.Text>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                            <Col lg={4}>
                                <div className="mb-3">
                                    <div className="row">
                                        <Form.Label className="col-lg-3 col-form-label text-lg-end px-lg-0 pt-0">User Type:</Form.Label>
                                        <Col lg={9}>
                                            <div>
                                                <Form.Check className=" form-check-inline">
                                                    <Form.Check.Input type="radio" id="customRadioInline1" name="customRadioInline1" defaultChecked />
                                                    <Form.Check.Label htmlFor="customRadioInline1">Administrator</Form.Check.Label>
                                                </Form.Check>

                                                <Form.Check className="form-check-inline">
                                                    <Form.Check.Input type="radio" id="customRadioInline2" name="customRadioInline2" />
                                                    <Form.Check.Label htmlFor="customRadioInline2">Author</Form.Check.Label>
                                                </Form.Check>
                                            </div>
                                            <Form.Text>Please select User Type</Form.Text>
                                        </Col>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>
        </React.Fragment>
    );
}

export default ThreeColumnsHorizontal;