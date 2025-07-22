import dynamic from "next/dynamic";
import React from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
const ReCAPTCHA = dynamic(() => import('react-google-recaptcha') as Promise<{ default: any }>, {
    ssr: false,
}) as any;

const FormReCaptcha = () => {
    return (
        <React.Fragment>
            <Card>
                <Card.Body>
                    <Form>
                        <Row className="form-group mb-0">
                            <label className="col-form-label col-lg-3 col-sm-12 text-lg-end">reCaptcha</label>
                            <Col lg={4} md={9} sm={12}>
                                <ReCAPTCHA sitekey="6LdnLwgUAAAAAAIb9L3PQlHQgvSCi16sYgbMIMFR" />
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>

        </React.Fragment>
    );
}

export default FormReCaptcha;