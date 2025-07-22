import React,{ReactElement} from 'react'
import Layout from '@layout/index'
import BreadcrumbItem from '@common/BreadcrumbItem'
import { Row } from 'react-bootstrap'
import Basic from '@views/Table/DTExtention/Button/BasicButton'
import ClassicButton from '@views/Table/DTExtention/Button/ClassicButton'
import KeyboardActivation from '@views/Table/DTExtention/Button/KeyboardActivation'
import MultiLevelCollection from '@views/Table/DTExtention/Button/MultiLevelConnection'
import MultipleButton from '@views/Table/DTExtention/Button/MultipleButton'

const BasicButton = () => {
    return (
        <React.Fragment>
            <BreadcrumbItem mainTitle="DataTable" subTitle="Button extension" />
            <Row>
                <Basic />
                <ClassicButton />
                <KeyboardActivation />
                <MultiLevelCollection />
                <MultipleButton />
            </Row>
        </React.Fragment>
    )
}
BasicButton.getLayout = (page: ReactElement) => {
    return (
        <Layout>
            {page}
        </Layout>
    )
}
export default BasicButton