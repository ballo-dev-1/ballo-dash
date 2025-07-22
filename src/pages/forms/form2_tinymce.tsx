import BreadcrumbItem from "@common/BreadcrumbItem";
import Layout from "@layout/index";
import React, { ReactElement } from "react";
import { Row } from "react-bootstrap";
import BasicTinymce from "@views/Forms/FormTinymce/BasicTinymce";
import ToolbarTinymce from "@views/Forms/FormTinymce/ToolbarTinymce";
import PluginsTinymce from "@views/Forms/FormTinymce/PluginsTinymce";
import TinymceAllFeatures from "@views/Forms/FormTinymce/TinymceAllFeatures";
import Link from "next/link";

const form2_tinymce = () => {
    return (
        <React.Fragment>
            <BreadcrumbItem mainTitle="Forms" subTitle="TinyMCE" />
            <div className="row">
                <div className="col-md-10 col-xxl-9 mb-4">
                    <h5>TinyMCE</h5>
                    <p className="text-muted">Familiar content tools ready to use out-of-the-box, TinyMCE to add a fully-featured, sleek and intuitive rich text editor to your app in just a few lines of code.</p>
                    <div>
                        <Link className="btn btn-sm btn-light-dark rounded-pill px-2" role="button" target="_blank" href="https://www.tiny.cloud/">
                            <i className="ti ti-external-link me-1"></i>
                            Reference
                        </Link>
                    </div>
                </div>

            </div>
            <Row>
                <BasicTinymce />
                <ToolbarTinymce />
                <PluginsTinymce />
                <TinymceAllFeatures />
            </Row>
        </React.Fragment >
    );
}

form2_tinymce.getLayout = (page: ReactElement) => {

    return (
        <Layout>
            {page}
        </Layout>
    )
}

export default form2_tinymce;