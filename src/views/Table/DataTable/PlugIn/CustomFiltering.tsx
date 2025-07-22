import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { data } from '@common/JsonData';
import TableContainer from '@common/TableContainer';

const CustomeFiltering = () => {
    const columns = [
        { header: "Name", accessorKey: "Name", enableColumnFilter: false },
        { header: "Position", accessorKey: "position", enableColumnFilter: false },
        { header: "Office", accessorKey: "office", enableColumnFilter: false },
        { header: "Age", accessorKey: "age", enableColumnFilter: false },
        { header: "Start Date", accessorKey: "startDate", enableColumnFilter: false },
        { header: "Salary", accessorKey: "salary", enableColumnFilter: false },
    ];
    return (
        <React.Fragment>
            <Row>
                <Col md={12}>
                    <Card>
                        <Card.Header>
                            <h5>Custom Filtering - Range Search</h5>
                            <small>There may be occasions when you wish to search data presented to the end user in your own manner, common examples are number range searches (in between two numbers) and date range searches</small>
                        </Card.Header>
                        <div className="dt-responsive table-responsive mt-3 ms-4">
                            <table className="m-b-20">
                                <tbody>
                                    <tr>
                                        <td>Minimum age:</td>
                                        <td>
                                            <input className="form-control" type="text" id="min" name="min" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Maximum age:</td>
                                        <td>
                                            <input className="form-control" type="text" id="max" name="max" />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <Card.Body className="table-border-style">
                            <div id="pc-dt-export">
                                <TableContainer
                                    columns={columns || []}
                                    data={data || []}
                                    isGlobalFilter={true}
                                    isBordered={false}
                                    customPageSize={10}
                                    isPagination={true}
                                />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    );
};
export default CustomeFiltering;