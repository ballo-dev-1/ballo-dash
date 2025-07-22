import React,{ReactElement} from 'react'
import Layout from '@layout/index'
import { Card, Col, Row } from 'react-bootstrap'
import BreadcrumbItem from '@common/BreadcrumbItem'
import CustomerData from '@views/Helpdesk/Customer/CustomerData'
import CustomerModal from '@views/Helpdesk/Customer/CustomerModal'

const Customer = () => {
    return (
        <React.Fragment>
            <BreadcrumbItem mainTitle="Helpdesk" subTitle="Customers" />
            <Row>
                <Col lg={12}>
                    <Card className="shadow-none">
                        <CustomerModal/>
                        <CustomerData/>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    )
}
Customer.getLayout = (page: ReactElement) => {
    return (
        <Layout>
            {page}
        </Layout>
    )
};
export default Customer
