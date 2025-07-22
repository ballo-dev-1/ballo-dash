import React from 'react'
import { Card, CardBody, CardHeader, Col, Table } from 'react-bootstrap'
import { FixedData } from './FixedData'

const RightTable = () => {
    return (
        <React.Fragment>
            <Col xxl={6}>
                <Card>
                    <CardHeader>
                        <h5>Right Fixed Column</h5>
                        <small>FixedColumns has the ability to freeze columns on both the left and the right hand sides of the table. By default it will fix the first column on the left, but using the initialization parameters</small>
                    </CardHeader>
                    <CardBody id='right-fix'>
                        <Table className="table stripe row-border order-column">
                            <thead>
                                <tr>
                                    <th>First name</th>
                                    <th>Last name</th>
                                    <th>Position</th>
                                    <th>Office</th>
                                    <th>Age</th>
                                    <th>Start date</th>
                                    <th>Salary</th>
                                    <th>Extn.</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(FixedData || []).map((item, key) => (
                                    <tr key={key}>
                                        <td>{item.fname}</td>
                                        <td>{item.lname}</td>
                                        <td>{item.position}</td>
                                        <td>{item.office}</td>
                                        <td>{item.age}</td>
                                        <td>{item.date}</td>
                                        <td>{item.salary}</td>
                                        <td>{item.extn}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </CardBody>
                </Card>
            </Col>
        </React.Fragment>
    )
}

export default RightTable