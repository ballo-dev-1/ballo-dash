import React, { ReactElement } from 'react';
import Layout from '@layout/index';
import { Card, Col, Row } from 'react-bootstrap';
import { AddData } from '@common/JsonData/table/AddRow';
import TableContainer from '@common/TableContainer';
import BreadcrumbItem from '@common/BreadcrumbItem';

const BasicTable = () => {
    const columns = [
        { header: "Name", accessorKey: "name", enableColumnFilter: false },
        { header: "ext", accessorKey: "ext", enableColumnFilter: false },
        { header: "city", accessorKey: "city", enableColumnFilter: false },
        { header: "date", accessorKey: "startData", enableColumnFilter: false },
        { header: "completion", accessorKey: "completion", enableColumnFilter: false },
    ];
    return (
        <React.Fragment>
            <BreadcrumbItem mainTitle="Table" subTitle="Add Row" />
            <Row>
                <Col md={12}>
                    <Card>
                        <Card.Header>
                            <h5>Add Rows</h5>
                        </Card.Header>

                        <Card.Body className="table-border-style">
                            <div id="pc-dt-export">
                                <TableContainer
                                    columns={columns || []}
                                    data={AddData || []}
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
BasicTable.getLayout = (page: ReactElement) => {
    return (
        <Layout>
            {page}
        </Layout>
    )

};
export default BasicTable;
