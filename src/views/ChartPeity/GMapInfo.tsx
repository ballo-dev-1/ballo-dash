import React from 'react'
import { Card, CardBody, CardHeader, Col, Row } from 'react-bootstrap'

const GMapInfo = () => {
    return (
        <React.Fragment>
            <Row>
                <Col sm={12}>
                    <Card>
                        <CardHeader>
                            <h5>Gmap</h5>
                        </CardHeader>
                        <CardBody>
                            <div id="map" style={{ height: "260px" }}></div>
                        </CardBody>
                    </Card>
                    <Card>
                        <CardBody>
                            <iframe width="600" height="450" style={{ border: 0 }} loading="lazy"
                                src="https://www.google.com/maps/embed/v1/place?key=
    &q=Space+Needle,Seattle+WA">
                            </iframe>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    )
}

export default GMapInfo
