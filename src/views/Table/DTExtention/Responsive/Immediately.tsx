import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { ResponsiveData } from '@common/JsonData/table/ResponsiveData';
import TableContainer from '@common/TableContainer';

const Immediately = () => {

    const columns = [
        { header: "First Name", accessorKey: "fname", enableColumnFilter: false },
        { header: "Last Name", accessorKey: "lname", enableColumnFilter: false },
        { header: "Position", accessorKey: "position", enableColumnFilter: false },
        { header: "Office", accessorKey: "office", enableColumnFilter: false },
        { header: "Age", accessorKey: "age", enableColumnFilter: false },
        { header: "Start Date", accessorKey: "startDate", enableColumnFilter: false },
        { header: "Salary", accessorKey: "salary", enableColumnFilter: false },
        { header: "Extn.", accessorKey: "extn", enableColumnFilter: false },
        { header: "E-mail", accessorKey: "email", enableColumnFilter: false },
    ];

    return (
            <React.Fragment>
                <Row>
                    <Col md={12}>
                        <Card>
                            <Card.Header>
                                <h5>Immediately Show Hidden Details</h5>
                                <small>Responsive has the ability to display the details that it has hidden in a variety of different ways. Its default is to allow the end user to toggle the the display by clicking on a row and showing the information in a DataTables child row</small>
                            </Card.Header>
                            <Card.Body className="table-border-style">
                                <div id="pc-dt-export">
                                    <TableContainer
                                        columns={columns || []}
                                        data={ResponsiveData || []}
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

export default Immediately;
