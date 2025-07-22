import React, { ReactElement } from 'react'
import Layout from '@layout/index'
import BreadcrumbItem from '@common/BreadcrumbItem'
import { Row } from 'react-bootstrap'
import BasicTableScroll from '@views/Table/DTExtention/Scroller/BasicTableScroll'
import StateSaving from '@views/Table/DTExtention/Scroller/StateSaving'
import Api from '@views/Table/DTExtention/Scroller/Api'

const Scroller = () => {
    return (
        <React.Fragment>
            <BreadcrumbItem mainTitle="DataTable" subTitle="Scroller" />
            <Row>
                <BasicTableScroll />
                <StateSaving />
                <Api />
            </Row>
        </React.Fragment>
    )
}
Scroller.getLayout = (page: ReactElement) => {
    return (
        <Layout>
            {page}
        </Layout>
    )
}
export default Scroller