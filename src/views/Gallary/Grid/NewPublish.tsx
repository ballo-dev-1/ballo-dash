import React from 'react'
import { Row, Col, Card, CardHeader, CardBody } from 'react-bootstrap'
import { NewPublishData } from './GridData'
import Link from 'next/link'
import Image from 'next/image'

const NewPublish = () => {
    return (
        <React.Fragment>
            <Card>
                <CardHeader>
                    <h5>New Publish</h5>
                </CardHeader>
                <CardBody >
                    <Row className="grid g-3">
                        {NewPublishData.map((items: any, index: number) => {
                            return (
                                <Col key={index} xl={3} md={4} sm={6}>
                                    <Link className="card-gallery" data-fslightbox="gallery" href={items.img}>
                                        <Image className="img-fluid" src={items.img} alt="Card image" />
                                        <div className="gallery-hover-data card-body justify-content-end">
                                            <div>
                                                <p className="text-white mb-0 text-truncate w-100">{items.type}</p>
                                                <span className="text-white text-opacity-75 mb-0 text-sm text-truncate w-100">{items.date}</span>
                                            </div>
                                        </div>
                                    </Link>
                                </Col>
                            )
                        })}
                    </Row>
                </CardBody>
            </Card>
        </React.Fragment>
    )
}

export default NewPublish
