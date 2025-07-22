import React,{ReactElement} from 'react'
import Layout from '@layout/index'
import BreadcrumbItem from '../Common/BreadcrumbItem'
import { Col, Row } from 'react-bootstrap'
import Support from '@views/HelpdeskDashboard/Support'
import CustomerReview from '@views/HelpdeskDashboard/CustomerReview'
import SocialMedia from '@views/HelpdeskDashboard/SocialMedia'
import LatestActivity from '@views/HelpdeskDashboard/LatestActivity'

const HelpdeskDashboard = () => {
    return (
        <React.Fragment>
            <BreadcrumbItem mainTitle="Helpdesk" subTitle="Dashboard" />
            <Row>
            <Support/>
            <Col xl={7} md={6}>
                <CustomerReview/>
                <SocialMedia/>
            </Col>
            <LatestActivity/>
        </Row>  

        </React.Fragment>
    )
}

HelpdeskDashboard.getLayout = (page: ReactElement) => {
    return (
      <Layout>
        {page}
      </Layout>
    )
  };

export default HelpdeskDashboard
