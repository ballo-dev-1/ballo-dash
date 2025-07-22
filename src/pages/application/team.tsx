import React,{ReactElement} from 'react'
import Layout from '@layout/index'
import BreadcrumbItem from '@common/BreadcrumbItem'
import { Row, Col, Card } from 'react-bootstrap'
import TeamMemberAddForm from '@views/Application/Users/TeamMemberAddForm'
import TeamMember from '@views/Application/Users/TeamMember'

const Team = () => {
    return (
        <React.Fragment>
            <BreadcrumbItem mainTitle="Application" subTitle="Team" />
            <Row>
                <Col sm={12}>
                    <Card className='table-card'>
                       <TeamMemberAddForm/>
                       <TeamMember/>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    )
}
Team.getLayout = (page: ReactElement) => {
    return (
        <Layout>
            {page}
        </Layout>
    )
};
export default Team
