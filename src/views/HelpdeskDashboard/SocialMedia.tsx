import React from 'react'
import { Card, CardBody, CardHeader, Col, Row } from 'react-bootstrap'

const SocialMedia = () => {
  return (
    <React.Fragment>
         <Row>
                <Col xl={6} md={12}>
                    <Card className="social-res-card">
                        <CardHeader>
                            <h5>Facebook Source</h5>
                        </CardHeader>
                        <CardBody >
                            <p className="m-b-10">Page Profile</p>
                            <div className="progress m-b-25" style={{height:"6px"}}>
                                <div className="progress-bar bg-primary" style={{width:"25%"}}></div>
                            </div>
                            <p className="m-b-10">Favorite</p>
                            <div className="progress m-b-25" style={{height:"6px"}}>
                                <div className="progress-bar bg-primary" style={{width:"85%"}}></div>
                            </div>
                            <p className="m-b-10">Like Story</p>
                            <div className="progress" style={{height:"6px"}}>
                                <div className="progress-bar bg-primary" style={{width:"65%"}}></div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
                <Col xl={6} md={12}>
                    <Card className="social-res-card">
                        <CardHeader>
                            <h5>Twitter Source</h5>
                        </CardHeader>
                        <CardBody>
                            <p className="m-b-10">Wall Profile</p>
                            <div className="progress m-b-25" style={{height:"6px"}}>
                                <div className="progress-bar bg-danger"style={{width:"85%"}}></div>
                            </div>
                            <p className="m-b-10">Favorite</p>
                            <div className="progress m-b-25" style={{height:"6px"}}>
                                <div className="progress-bar bg-danger" style={{width:"25%"}}></div>
                            </div>
                            <p className="m-b-10">Like Tweets</p>
                            <div className="progress" style={{height:"6px"}}>
                                <div className="progress-bar bg-danger"style={{width:"65%"}}></div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
    </React.Fragment>
  )
}

export default SocialMedia