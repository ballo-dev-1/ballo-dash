import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { ScrollerData } from '@common/JsonData/table/ScrollerData';
import TableContainer from '@common/TableContainer';

const StateSaving = () => {
    const columns = [
        { header: "Id", accessorKey: "id", enableColumnFilter: false },
        { header: "FIRST NAME", accessorKey: "fname", enableColumnFilter: false },
        { header: "LAST NAME", accessorKey: "lname", enableColumnFilter: false },
        { header: "ZIP/POST CODE", accessorKey: "zip", enableColumnFilter: false },
        { header: "COUNTRY", accessorKey: "country", enableColumnFilter: false },
    ];
    return (
            <React.Fragment>
                <Row>
                    <Col md={12}>
                        <Card>
                            <Card.Header>
                                <h5>State Saving</h5>
                                <small>This example simply shows a table with selectable rows. For examples that actually do something with those selected rows, please see the other examples in this section!</small>
                            </Card.Header>
                            <Card.Body className="table-border-style">
                                <div id="pc-dt-export" className='table-container'>
                                    <TableContainer
                                        columns={columns || []}
                                        data={ScrollerData || []}
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
export default StateSaving;