import React,{ReactElement} from 'react'
import Layout from '@layout/index'
import BreadcrumbItem from '@common/BreadcrumbItem'
import Masonary1 from '@views/Gallary/Masonary/Masonary'

const Masonary = () => {
  return (
    <React.Fragment>
            <BreadcrumbItem mainTitle="Gallery" subTitle="Masonry" />
            <Masonary1/>
    </React.Fragment>
  )
}
Masonary.getLayout = (page: ReactElement) => {
  return (
      <Layout>
          {page}
      </Layout>
  )
};
export default Masonary
