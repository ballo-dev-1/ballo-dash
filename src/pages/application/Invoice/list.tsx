import React,{ReactElement} from 'react'
import Layout from '@layout/index'
import BreadcrumbItem from '@common/BreadcrumbItem'
import Overview from '@views/Invoice/List/Overview'
import InvoiceMemberInfo from '@views/Invoice/List/InvoiceMemberInfo'
import { Row } from 'react-bootstrap'

const List = () => {
  return (
    <React.Fragment>
         <BreadcrumbItem mainTitle="Invoice" subTitle="List" />
            <Row>
                <Overview/>
                <InvoiceMemberInfo/>
            </Row>
    </React.Fragment>
  )
}
List.getLayout = (page: ReactElement) => {
  return (
      <Layout>
          {page}
      </Layout>
  )
};
export default List
