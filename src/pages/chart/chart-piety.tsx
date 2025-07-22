import React,{ReactElement} from 'react'
import Layout from '@layout/index'
import { Row } from 'react-bootstrap'
import BreadcrumbItem from '@common/BreadcrumbItem'
import SimpleChart from '@views/ChartPeity/SimpleChart'
import OtherOptionChart from '@views/ChartPeity/OtherOptionChart'
import FullWidthChart from '@views/ChartPeity/FullWidthChart'

const ChartPiety = () => {
  return (
    <React.Fragment>
      <Row>
        <BreadcrumbItem mainTitle="Charts" subTitle="Peity Charts" />
        <SimpleChart />
        <OtherOptionChart />
        <FullWidthChart />
      </Row>
    </React.Fragment>
  )
}
ChartPiety.getLayout = (page: ReactElement) => {

  return (
      <Layout>
          {page}
      </Layout>
  )
}
export default ChartPiety
