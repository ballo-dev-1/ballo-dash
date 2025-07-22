import React,{ReactElement} from 'react'
import Layout from '@layout/index'
import BreadcrumbItem from '@common/BreadcrumbItem'
import { Row } from 'react-bootstrap'
import BasicInitialization from '@views/Table/DTExtention/FixedHeader/BasicInitialization'
import HeaderAndFooter from '@views/Table/DTExtention/FixedHeader/HeaderAndFooter'
import ColReorder from '@views/Table/DTExtention/FixedHeader/ColReorder'

const FixedHeader = () => {
  return (
    <React.Fragment>
        <BreadcrumbItem mainTitle="DataTable" subTitle="Fixed Header" />
                <Row>
                    <BasicInitialization />
                    <HeaderAndFooter />
                    <ColReorder />
                </Row>
    </React.Fragment>
  )
}
FixedHeader.getLayout = (page: ReactElement) => {
  return (
      <Layout>
          {page}
      </Layout>
  )
}
export default FixedHeader