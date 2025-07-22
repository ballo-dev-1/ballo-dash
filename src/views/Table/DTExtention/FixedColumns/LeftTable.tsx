import React from 'react'
import { Card, CardBody, CardHeader, Col, Table } from 'react-bootstrap'
import { FixedData } from './FixedData'

const LeftTable = () => {
    return (
        <React.Fragment>
            <Col xxl={6}>
                <Card>
                    <CardHeader>
                        <h5>Left and Right Fixed Columns</h5>
                        <small>FixedColumns allows columns to be fixed from both the left and the right hand sides of the table.</small>
                    </CardHeader>
                    <CardBody id='left-right-fix'>
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
                                {(FixedData || []).map((item:any, key:any) => (
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

export default LeftTable