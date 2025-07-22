import React,{ReactElement} from 'react'
import Layout from '@layout/index'
import BreadcrumbItem from '@common/BreadcrumbItem'
import { Row,Col, Card } from 'react-bootstrap'
import SettingTop from '@views/Membership/Setting/SettingTop'

const Setting = () => {
  return (
    <React.Fragment>
        <BreadcrumbItem mainTitle="Membership" subTitle="Setting" />
        <Row>
            <Col>
                <Card>
                    <SettingTop/>
                </Card>
            </Col>
        </Row>
    </React.Fragment>
  )
}
Setting.getLayout = (page: ReactElement) => {
  return (
      <Layout>
          {page}
      </Layout>
  )
}
export default Setting
