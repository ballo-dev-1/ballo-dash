import React,{ReactElement} from 'react'
import Layout from '@layout/index'
import BreadcrumbItem from '@common/BreadcrumbItem'
import { Row } from 'react-bootstrap'
import AutoFillTable from '@views/Table/DTExtention/Autofill'
import KeyTable from '@views/Table/DTExtention/KeyTable'
import ScrollingTable from '@views/Table/DTExtention/ScrollingTable'
import ColumnSelector from '@views/Table/DTExtention/Button/ColumnSelector'

const Autofill = () => {
    return (
        <React.Fragment>
            <BreadcrumbItem mainTitle="DataTable" subTitle="AutoFill" />
            <Row>
                <AutoFillTable />
                <KeyTable />
                <ColumnSelector />
                <ScrollingTable />
            </Row>
        </React.Fragment>
    )
}

Autofill.getLayout = (page: ReactElement) => {
    return (
        <Layout>
            {page}
        </Layout>
    )
}

export default Autofill