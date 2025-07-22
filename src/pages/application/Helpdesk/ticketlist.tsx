import React, { ReactElement } from 'react'
import Layout from '@layout/index'
import BreadcrumbItem from '@common/BreadcrumbItem'
import { Row } from 'react-bootstrap'
import MemberTicketList from '@views/Helpdesk/Ticketlist/MemberTicketList'
import TicketCategories from '@views/Helpdesk/Ticketlist/TicketCategories'
import ToggleContent from '@views/Helpdesk/Ticketlist/ToggleContent'

const Ticketlist = () => {

  return (
    <React.Fragment>
      <BreadcrumbItem mainTitle="Helpdesk" subTitle="Ticket list" />
      <Row>
        <MemberTicketList />
        <ToggleContent />
        <TicketCategories />
      </Row>
    </React.Fragment>
  )
};
Ticketlist.getLayout = (page: ReactElement) => {
  return (
    <Layout>
      {page}
    </Layout>
  )
};
export default Ticketlist
