import React,{ReactElement} from 'react'
import Layout from '@layout/index'
import BreadcrumbItem from '@common/BreadcrumbItem'
import { Row } from 'react-bootstrap'
import HtmlSourceData from '@views/Table/DataTable/SourceData/HtmlSourceData'
import JavascriptSourcedData from '@views/Table/DataTable/SourceData/JavascriptSourcedData'

const DataSources = () => {
    return (
        <React.Fragment>
            <BreadcrumbItem mainTitle="DataTable" subTitle="Source Data" />
            <Row>
               <HtmlSourceData/>
               <JavascriptSourcedData/>
            </Row>
        </React.Fragment>
    )
}
DataSources.getLayout = (page: ReactElement) => {
    return <Layout>{page}</Layout>;
  };
export default DataSources
