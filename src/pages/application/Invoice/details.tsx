import React,{ReactElement} from 'react'
import Layout from '@layout/index';
import { Row } from 'react-bootstrap';
import BreadcrumbItem from '@common/BreadcrumbItem';
import DetailInvoicePage from '@views/Invoice/Details/DetailInvoicePage';

const Details = () => {
  return (
    <React.Fragment>
      <BreadcrumbItem mainTitle="Invoice" subTitle="Detail" />
      <Row>
      <DetailInvoicePage/>
      </Row>
      
    </React.Fragment>
  )
}
Details.getLayout = (page: ReactElement) => {
  return (
      <Layout>
          {page}
      </Layout>
  )
};
export default Details;
