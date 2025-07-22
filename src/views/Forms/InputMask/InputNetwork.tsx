import React from "react";
import { Col, Card, Form, Row } from "react-bootstrap";
const Cleave = dynamic(() => import('cleave.js/react') as Promise<{ default: any }>, {
    ssr: false,
}) as any;
import "cleave.js/dist/addons/cleave-phone.in";
import dynamic from "next/dynamic";

const InputNetwork = () => {
    return (
        <React.Fragment>
            <Col md={12}>
                <Card>
                    <Card.Header>
                        <h5>Network</h5>
                        <span className="d-block m-t-5">Add class of <code>.ip</code> with <code>data-mask</code> attribute</span>
                    </Card.Header>
                    <Card.Body>
                        <Form>
                            <Row className="mb-3">
                                <label className="col-form-label col-lg-3 col-sm-12 text-lg-end">IP Address</label>
                                <Col lg={6} md={12} sm={12}>
                                    <Cleave
                                        options={{
                                            blocks: [3, 3, 3, 3],
                                            delimiters: ['.'],
                                            numericOnly: true,
                                            uppercase: true,
                                        }}
                                        className="form-control ip"
                                    />
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <label className="col-form-label col-lg-3 col-sm-12 text-lg-end">IPV4</label>
                                <Col lg={6} md={12} sm={12}>
                                    <Cleave
                                        options={{
                                            blocks: [2, 2, 4, 2, 2, 2],
                                            delimiters: ['/', '/', ' ', ':', ':', ''],
                                            numericOnly: true,
                                            uppercase: true,
                                        }}
                                        className="form-control ipv4"
                                    />
                                </Col>
                            </Row>
                            <Row className="mb-0">
                                <label className="col-form-label col-lg-3 col-sm-12 text-lg-end">IPV6</label>
                                <Col lg={6} md={12} sm={12}>
                                    <Cleave
                                        options={{
                                            blocks: [4, 4, 4, 1, 3, 4, 4, 4],
                                            delimiters: [':'],
                                            numericOnly: true,
                                            uppercase: true,
                                        }}
                                        className="form-control ipv6"
                                    />
                                </Col>
                            </Row>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
        </React.Fragment>
    );
}

export default InputNetwork;