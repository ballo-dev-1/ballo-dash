import React,{ReactElement} from 'react'
import Layout from '@layout/index'
import BreadcrumbItem from '@common/BreadcrumbItem'
import { Row } from 'react-bootstrap'
import Config from '@views/Table/DTExtention/Responsive/Config'
import NewConstructor from '@views/Table/DTExtention/Responsive/NewConstructor'
import Immediately from '@views/Table/DTExtention/Responsive/Immediately'

const Responsive = () => {
    return (
        <React.Fragment>
            <BreadcrumbItem mainTitle="DataTable" subTitle="Responsive" />
            <Row>
                <Config />
                <NewConstructor />
                <Immediately />
            </Row>
        </React.Fragment>
    )
}
Responsive.getLayout = (page: ReactElement) => {
    return (
        <Layout>
            {page}
        </Layout>
    )
  }
export default Responsive