import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import vertical from "@assets/images/landing/lay-vertical.jpg"
import authpage from "@assets/images/landing/preview-important-auth-page.jpg"
import accountprofile from '@assets/images/landing/preview-important-account-profile.jpg'
import widgets from "@assets/images/landing/preview-important-widgets.jpg"
import wizard from '@assets/images/landing/preview-important-wizard.jpg'
import datatable from "@assets/images/landing/preview-important-data-table.jpg"
import form from "@assets/images/landing/preview-important-form.jpg"
import error from "@assets/images/landing/preview-important-error.jpg"
import coming from "@assets/images/landing/preview-important-coming-soon.jpg"
import contact from "@assets/images/landing/preview-important-contact.jpg"
import { Card, CardBody, Col, Row } from 'react-bootstrap'

const ImportantPage = () => {
  return (
    <React.Fragment>
      <section className="pt-0">
        <div className="container">
          <Row className="justify-content-center text-center">
            <Col md={8} xl={6}>
              <h2 className="wow animate__fadeInUp section-title" data-wow-delay="0.2s">Important Pages</h2>
              <p className="mt-lg-4 mt-2 mb-4 mb-md-5 wow animate__fadeInUp" data-wow-delay="0.4s">Unveil the diversity of page layouts within Light Able, including Vertical, Horizontal, and Tab Layouts, each offering unique design options to suit your preferences and project requirements.</p>
            </Col>
          </Row>
          <Row className="g-4 text-center ">
            <Col lg={4} md={6}>
              <Card className="layout-card">
                <CardBody>
                  <Link href="https://light-able-react-components.vercel.app/" target="_blank">
                    <Image src={vertical} alt="img" className="img-fluid border" />
                  </Link>
                </CardBody>
              </Card>
              <Link href="https://light-able-react-components.vercel.app/" target="_blank" className="h5 d-flex align-items-center justify-content-center gap-2">Components <i className="ti ti-link text-primary f-22"></i></Link>
            </Col>
            <Col lg={4} md={6}>
              <Card className="layout-card">
                <CardBody>
                  <Link href="/pages/login-v1" target="_blank">
                    <Image src={authpage} alt="img" className="img-fluid border" />
                  </Link>
                </CardBody>
              </Card>
              <Link href="/pages/login-v1" target="_blank" className="h5 d-flex align-items-center justify-content-center gap-2">Auth Pages <i className="ti ti-link text-primary f-22"></i></Link>
            </Col>
            <Col lg={4} md={6}>
              <Card className="layout-card">
                <CardBody>
                  <Link href="/widget/w_chart" target="_blank">
                    <Image src={widgets} alt="img" className="img-fluid border" />
                  </Link>
                </CardBody>
              </Card>
              <Link href="/widget/w_chart" target="_blank" className="h5 d-flex align-items-center justify-content-center gap-2">Widgets <i className="ti ti-link text-primary f-22"></i></Link>
            </Col>
            <Col lg={4} md={6}>
              <Card className="layout-card">
                <CardBody>
                  <Link href="/application/account-profile" target="_blank">
                    <Image src={wizard} alt="img" className="img-fluid border" />
                  </Link>
                </CardBody>
              </Card>
              <Link href="/application/account-profile" target="_blank" className="h5 d-flex align-items-center justify-content-center gap-2">Wizard <i className="ti ti-link text-primary f-22"></i></Link>
            </Col>
            <Col lg={4} md={6}>
              <Card className="layout-card">
                <CardBody>
                  <Link href="/table/dt_advance" target="_blank">
                    <Image src={accountprofile} alt="img" className="img-fluid border" />
                  </Link>
                </CardBody>
              </Card>
              <Link href="/table/dt_advance" target="_blank" className="h5 d-flex align-items-center justify-content-center gap-2">Account Profile <i className="ti ti-link text-primary f-22"></i></Link>
            </Col>
            <Col lg={4} md={6}>
              <Card className="layout-card">
                <CardBody>
                  <Link href="/table/dt_advance" target="_blank">
                    <Image src={datatable} alt="img" className="img-fluid border" />
                  </Link>
                </CardBody>
              </Card>
              <Link href="/table/dt_advance" target="_blank" className="h5 d-flex align-items-center justify-content-center gap-2">Data Tables <i className="ti ti-link text-primary f-22"></i></Link>
            </Col>
            <Col lg={4} md={6}>
              <Card className="layout-card">
                <CardBody>
                  <Link href="/forms/form_elements" target="_blank">
                    <Image src={form} alt="img" className="img-fluid border" />
                  </Link>
                </CardBody>
              </Card>
              <Link href="/forms/form_elements" target="_blank" className="h5 d-flex align-items-center justify-content-center gap-2">Forms <i className="ti ti-link text-primary f-22"></i></Link>
            </Col>
            <Col lg={4} md={6}>
              <Card className="layout-card">
                <CardBody>
                  <Link href="/pages/error-404" target="_blank">
                    <Image src={error} alt="img" className="img-fluid border" />
                  </Link>
                </CardBody>
              </Card>
              <Link href="/pages/error-404" target="_blank" className="h5 d-flex align-items-center justify-content-center gap-2">Error <i className="ti ti-link text-primary f-22"></i></Link>
            </Col>
            <Col lg={4} md={6}>
              <Card className="layout-card">
                <CardBody>
                  <Link href="/pages/coming-soon" target="_blank">
                    <Image src={coming} alt="img" className="img-fluid border" />
                  </Link>
                </CardBody>
              </Card>
              <Link href="/pages/coming-soon" target="_blank" className="h5 d-flex align-items-center justify-content-center gap-2">Coming Soon <i className="ti ti-link text-primary f-22"></i></Link>
            </Col>
            <Col lg={4} md={6}>
              <Card className="layout-card">
                <CardBody  className="card-body">
                  <Link href="/pages/contact-us" target="_blank">
                    <Image src={contact} alt="img" className="img-fluid border" />
                  </Link>
                </CardBody>
              </Card>
              <Link href="/pages/contact-us" target="_blank" className="h5 d-flex align-items-center justify-content-center gap-2">Contact <i className="ti ti-link text-primary f-22"></i></Link>
            </Col>

          </Row>
        </div>
      </section>
    </React.Fragment>
  )
}

export default ImportantPage