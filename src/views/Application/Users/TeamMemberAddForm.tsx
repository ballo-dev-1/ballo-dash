import React from 'react'
import { CardBody, Col, Row } from 'react-bootstrap'


const TeamMemberAddForm = () => {
    return (
        <React.Fragment>
            <CardBody className="p-4">
                <Row className="mb-3">
                    <label className="col-form-label col-sm-3 text-sm-end">Team name</label>
                    <Col lg={6} sm={8}>
                        <input type="text" className="form-control" placeholder="Enter team name" />
                    </Col>
                </Row>
                <Row className="mb-3">
                    <label className="col-form-label col-sm-3 text-sm-end">Team Email ID</label>
                    <div className="col-lg-6 col-sm-8">
                        <input type="email" className="form-control" placeholder="Enter email id" />
                    </div>
                </Row>
                <Row className="mb-3">
                    <label className="col-form-label col-sm-3 text-sm-end">Organization</label>
                    <Col lg={6} sm={8}>
                        <select className="form-select" aria-label="Default select example">
                            <option>Select Organization</option>
                            <option>SR.Pvt.Ltd</option>
                            <option>JCBK.Pvt.Ltd</option>
                            <option>SMT.Pvt.Ltd</option>
                            <option>DDMS.Pvt.Ltd</option>
                        </select>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <label className="col-form-label col-sm-3 text-sm-end">Location</label>
                    <Col lg={6} sm={8}>
                        <select className="form-select" aria-label="Default select example">
                            <option>Select Location</option>
                            <option>India</option>
                            <option>Australia</option>
                            <option>Indonasia</option>
                            <option>Malaysia</option>
                        </select>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <label className="col-form-label col-sm-3 text-sm-end">Team Member</label>
                    <Col lg={6} sm={8}>
                        <select className="form-select" multiple>
                            <option>Select Team Member</option>
                            <option>user One</option>
                            <option>user Two</option>
                            <option>user Three</option>
                            <option>user Four</option>
                            <option>user Five</option>
                            <option>user Six</option>
                        </select>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <label className="col-form-label col-sm-3 text-sm-end">Team leader</label>
                    <Col lg={6} sm={8}>
                        <select className="form-select" aria-label="Default select example">
                            <option>Select Team leader</option>
                            <option>user One</option>
                            <option>user Two</option>
                            <option>user Three</option>
                        </select>
                    </Col>
                </Row>
                <Row className="mb-0">
                    <span className="col-form-label col-sm-3 text-sm-end"></span>
                    <div className="col-lg-6 col-sm-8">
                        <button className="btn btn-primary me-2">Create Team</button>
                        <button className="btn btn-outline-secondary">Cancel</button>
                    </div>
                </Row>
            </CardBody>

        </React.Fragment>
    )
}

export default TeamMemberAddForm
