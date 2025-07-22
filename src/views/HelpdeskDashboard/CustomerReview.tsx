import React from 'react'
import { Card, CardBody, Col } from 'react-bootstrap'
import Link from 'next/link'
import CustomerReviewChart from './CustomerReviewChart'

const CustomerReview = () => {
    return (
        <React.Fragment>
            <Card>
                <CardBody style={{marginBottom:"70px"}}>
                    <h6>Customer Satisfaction</h6>
                    <span>It takes continuous effort to maintain high customer satisfaction levels.Internal and external
                        quality measures are often tied together.,as the opinion...</span>
                    <Link href="#!" className="text-primary d-block">Learn more..</Link>
                    <div className="row d-flex justify-content-center align-items-center">
                        <Col>
                            <div id="satisfaction-chart" style={{ height: "200px" }}><CustomerReviewChart /></div>
                        </Col>
                    </div>
                </CardBody>
            </Card>
           
        </React.Fragment>
    )
}

export default CustomerReview
