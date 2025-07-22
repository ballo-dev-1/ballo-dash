import React, { ReactElement } from 'react'
import Layout from '@layout/index'
import { Row, Col } from 'react-bootstrap'
import BreadcrumbItem from '@common/BreadcrumbItem'
import InvoiceCreate from '@views/Invoice/Create/InvoiceCreate'
const Create = () => {
    return (
        <React.Fragment>
            <BreadcrumbItem mainTitle="Invoice" subTitle="Create" />
            <Row>
                <Col sm={12}>
                    {/* <InvoiceDetails /> */}
                    <InvoiceCreate />
                </Col>
            </Row>
        </React.Fragment>
    )
}
Create.getLayout = (page: ReactElement) => {
    return (
        <Layout>
            {page}
        </Layout>
    )
};
export default Create