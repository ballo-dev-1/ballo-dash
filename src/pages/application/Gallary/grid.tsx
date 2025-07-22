import React,{ReactElement} from 'react'
import Layout from '@layout/index'
import BreadcrumbItem from '@common/BreadcrumbItem'
import { Row, Col } from 'react-bootstrap'
import NewPublish from '@views/Gallary/Grid/NewPublish'
import OldPublish from '@views/Gallary/Grid/OldPublish'
const Grid = () => {
    return (
        <React.Fragment>
            <BreadcrumbItem mainTitle="Gallery" subTitle="Grid" />
            <Row>
                <Col>
                    <NewPublish/>
                    <OldPublish/>
                </Col>
            </Row>
        </React.Fragment>
    )
}
Grid.getLayout = (page: ReactElement) => {
    return (
        <Layout>
            {page}
        </Layout>
    )
};
export default Grid
