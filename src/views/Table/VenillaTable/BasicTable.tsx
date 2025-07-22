import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { tableData } from '@common/JsonData';
import TableContainer from '@common/TableContainer';

const BasicTable = () => {
    const columns = [
        { header: "Name", accessorKey: "name", enableColumnFilter: false },
        { header: "ext", accessorKey: "ext", enableColumnFilter: false },
        { header: "city", accessorKey: "city", enableColumnFilter: false },
        { header: "date", accessorKey: "date", enableColumnFilter: false },
        { header: "completion", accessorKey: "completion", enableColumnFilter: false },
    ];
    return (
            <React.Fragment>
                <Row>
                    <Col md={12}>
                        <Card>
                            <Card.Header>
                                <h5>Basic Table</h5>
                                <small>use class table inside table element</small>
                            </Card.Header>
                            <Card.Body className="table-border-style">
                                <div id="pc-dt-export">
                                    <TableContainer
                                        columns={columns || []}
                                        data={tableData || []}
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
export default BasicTable;