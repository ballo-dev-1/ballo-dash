import React,{ReactElement} from 'react'
import Layout from '@layout/index'
import GMapInfo from '@views/ChartPeity/GMapInfo'
import BreadcrumbItem from '@common/BreadcrumbItem'

const GMaps = () => {
  return (
    <React.Fragment>
         <BreadcrumbItem mainTitle="Maps" subTitle="Gmap" />
        <GMapInfo/>
    </React.Fragment>
  )
}
GMaps.getLayout = (page: ReactElement) => {

  return (
      <Layout>
          {page}
      </Layout>
  )
}
export default GMaps
