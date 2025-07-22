import React,{ReactElement} from 'react'
import Layout from '@layout/index'
import { Row,Col,Card,CardBody } from 'react-bootstrap'
import EditInvoiceForm from '@views/Invoice/Edit/EditInvoiceForm'
import BreadcrumbItem from '@common/BreadcrumbItem'
import EditDetailInvoice from '@views/Invoice/Edit/EditDetailInvoice'

const Edit = () => {
  return (
    <React.Fragment>
        <BreadcrumbItem mainTitle="Invoice" subTitle="Edit" />
            <Row>
                <Col sm={12}>
                    <Card>
                        <CardBody>
                                <Row className='g-3'>
                                    <EditInvoiceForm/>
                                    <EditDetailInvoice/>
                                </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
    </React.Fragment>
  )
}
Edit.getLayout = (page: ReactElement) => {
    return (
        <Layout>
            {page}
        </Layout>
    )
  };
export default Edit
