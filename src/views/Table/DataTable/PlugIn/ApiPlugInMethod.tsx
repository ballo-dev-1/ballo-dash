import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { data } from '@common/JsonData';
import TableContainer from '@common/TableContainer';

const ApiPlugInMethod = () => {
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
                            <h5>API Plug-in Methods</h5>
                            <small>This example simply shows a table with selectable rows. For examples that actually do something with those selected rows, please see the other examples in this section!</small>
                        </Card.Header>
                        <div className="dt-plugin-buttons mt-4" style={{ marginLeft: "30px" }}>
                            <button className="btn  btn-primary m-r-10 m-b-10">sum of age of visible rows</button>
                            <button className="btn  btn-primary m-b-10">sum of age in all rows</button>
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
export default ApiPlugInMethod;