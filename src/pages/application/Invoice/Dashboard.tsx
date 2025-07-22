import React from 'react'
import { Row } from 'react-bootstrap'
import Trading from '@views/Invoice/Dashboard/Trading'
import BreadcrumbItem from '@common/BreadcrumbItem'
import Information from '@views/Invoice/Dashboard/Information'
import RecentVoice from '@views/Invoice/Dashboard/RecentVoice'
import TotalExpenses from '@views/Invoice/Dashboard/TotalExpenses'
import Notification from '@views/Invoice/Dashboard/Notification'

function Dashboard() {
  return (
    <React.Fragment>
         <BreadcrumbItem mainTitle="Invoice" subTitle="Dashboard" />
            <Row>
                <Trading/>
                <Information/>
                <RecentVoice/>
                <TotalExpenses/>
                <Notification/>
            </Row>
    </React.Fragment>
  )
}

export default Dashboard
