import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { data } from '@common/JsonData';
import TableContainer from '@common/TableContainer';

const BasicRow = () => {
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
                                <h5>Basic Row Reorder</h5>
                                <small>This example simply shows a table with selectable rows. For examples that actually do something with those selected rows, please see the other examples in this section!</small>
                            </Card.Header>
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
export default BasicRow;