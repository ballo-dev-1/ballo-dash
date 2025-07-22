import React,{ReactElement} from 'react'
import Layout from '@layout/index'
import BreadcrumbItem from '@common/BreadcrumbItem'
import { Row } from 'react-bootstrap'
import BasicRow from '@views/Table/DTExtention/RowReorder/BasicRow'
import FullRow from '@views/Table/DTExtention/RowReorder/FullRow'
import ResponsiveInti from '@views/Table/DTExtention/RowReorder/ResponsiveInti'
import ReorderEvent from '@views/Table/DTExtention/RowReorder/ReorderEvent'

const RowReorder = () => {
    return (
        <React.Fragment>
            <BreadcrumbItem mainTitle="DataTable" subTitle="RowReorder" />
            <Row>
                <BasicRow />
                <FullRow />
                <ResponsiveInti />
                <ReorderEvent />
            </Row>
        </React.Fragment>
    )
}
RowReorder.getLayout = (page: ReactElement) => {
    return (
        <Layout>
            {page}
        </Layout>
    )
  }
export default RowReorder