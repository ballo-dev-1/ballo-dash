import React, { ReactElement } from 'react'
import Layout from '@layout/index'
import { Row } from 'react-bootstrap'
import ThemeCustomization from '@views/Helpdesk/Details/ThemeCustomization'
import TicketDetails from '@views/Helpdesk/Details/TicketDetails'
import BreadcrumbItem from '@common/BreadcrumbItem'

const Details = () => {
  return (
    <React.Fragment>
      <BreadcrumbItem mainTitle="Helpdesk" subTitle="Ticket Details" />
      <Row>
        <ThemeCustomization />
        <TicketDetails />
      </Row>
    </React.Fragment>
  )
};

Details.getLayout = (page: ReactElement) => {
  return (
    <Layout>
      {page}
    </Layout>
  )
};
export default Details
