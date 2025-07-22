import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { ResponsiveData } from '@common/JsonData/table/ResponsiveData';
import TableContainer from '@common/TableContainer';

const NewConstructor = () => {

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
                                <h5>New Constructor</h5>
                                <small>The third way of initialising Responsive is by manually creating a new instance using the $.fn.dataTable.Responsive class, as shown in this example (the other two methods are provided using this constructor)</small>
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

export default NewConstructor;
