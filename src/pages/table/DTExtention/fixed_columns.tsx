import React,{ReactElement} from 'react'
import Layout from '@layout/index'
import BreadcrumbItem from '@common/BreadcrumbItem'
import { Row } from 'react-bootstrap'
import LeftTable from '@views/Table/DTExtention/FixedColumns/LeftTable'
import RightTable from '@views/Table/DTExtention/FixedColumns/RightTable'

const FixedColumns = () => {
    return (
        <React.Fragment>
            <BreadcrumbItem mainTitle="DataTable" subTitle="FixedColumns" />
            <Row>
                <LeftTable />
                <RightTable />
            </Row>
        </React.Fragment>
    )
}
FixedColumns.getLayout = (page: ReactElement) => {
    return (
        <Layout>
            {page}
        </Layout>
    )
}
export default FixedColumns