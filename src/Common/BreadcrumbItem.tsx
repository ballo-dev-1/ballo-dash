// import UpdateIntegrationModal from "@/views/Dashboard/UpdateIntegrations";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import { Row, Col } from "react-bootstrap";

interface BreadcrumbItemProps {
  mainTitle: string;
  subTitle: string;
  showPageHeader?: boolean;
  subTitle2?: string;
}

const BreadcrumbItem: React.FC<BreadcrumbItemProps> = ({
  mainTitle,
  subTitle,
  subTitle2,
  showPageHeader = true,
}) => {
  return (
    <React.Fragment>
      <Head>
        <title>Ballo | Dashboard</title>
      </Head>
      <div className="page-header">
        <div className="page-block">
          <Row className="row align-items-center">
            <Col md={12}>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link href="/dashboard">Home</Link>
                </li>
                {mainTitle && (
                  <li className="breadcrumb-item">
                    <Link href="#">{mainTitle}</Link>
                  </li>
                )}
                {subTitle && (
                  <li className="breadcrumb-item" aria-current="page">
                    {subTitle}
                  </li>
                )}
                {subTitle2 && (
                  <li className="breadcrumb-item" aria-current="page">
                    {subTitle2}
                  </li>
                )}
              </ul>
            </Col>
            {showPageHeader && (
              <Col md={12}>
              <div className="page-header-title d-flex gap-3 align-items-center">
                <h2 className="mb-0">{subTitle2 || subTitle}</h2>
                {/* <UpdateIntegrationModal /> */}
              </div>
            </Col>
            )}
          </Row>
        </div>
      </div>
    </React.Fragment>
  );
};

export default BreadcrumbItem;
