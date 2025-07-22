import Link from 'next/link';
import React from 'react'
import Image from 'next/image';

import invoice from '@assets/images/landing/preview-app-invoice.jpg';
import social from '@assets/images/landing/preview-app-social.jpg';
import inbox from '@assets/images/landing/preview-app-inbox.jpg';
import ecommerce from '@assets/images/landing/preview-app-ecommerce.jpg';
import chat from '@assets/images/landing/preview-app-chat.jpg';
import calendar from '@assets/images/landing/preview-app-calendar.jpg';
import gellery from '@assets/images/landing/preview-app-gallery.jpg'
import { Row, Col, Card, CardBody } from 'react-bootstrap';

const AppsPage = () => {
  return (
    <>
      <section className="pt-0">
        <div className="container">
          <Row className="justify-content-center text-center">
            <div className="col-md-8 col-xl-6">
              <h2 className="wow animate__fadeInUp section-title" data-wow-delay="0.2s">Apps</h2>
              <p className="mt-lg-4 mt-2 mb-4 mb-md-5 wow animate__fadeInUp" data-wow-delay="0.4s">Unveil the diversity of page layouts within Light Able, including Vertical, Horizontal, and Tab Layouts, each offering unique design options to suit your preferences and project requirements.</p>
            </div>
          </Row>
          <Row className="g-4 text-center ">
            <Col lg={4} md={6}>
              <Card className="layout-card">
                <CardBody>
                  <Link href="/application/invoice-list" target="_blank">
                    <Image src={invoice} alt="img" className="img-fluid border" />
                  </Link>
                </CardBody>
              </Card>
              <Link href="/application/invoice-list" target="_blank" className="h5 d-flex align-items-center justify-content-center gap-2">Invoice <i className="ti ti-link text-primary f-22"></i></Link>
            </Col>
            <Col lg={4} md={6}>
              <Card className="layout-card">
                <CardBody>
                  <Link href="/application/social-media" target="_blank">
                    <Image src={social} alt="img" className="img-fluid border" />
                  </Link>
                </CardBody>
              </Card>
              <Link href="/application/social-media" target="_blank" className="h5 d-flex align-items-center justify-content-center gap-2">Social <i className="ti ti-link text-primary f-22"></i></Link>
            </Col>
            <Col lg={4} md={6}>
              <Card className="layout-card">
                <CardBody>
                  <Link href="/application/mail" target="_blank">
                    <Image src={inbox} alt="img" className="img-fluid border" />
                  </Link>
                </CardBody>
              </Card>
              <Link href="/application/mail" target="_blank" className="h5 d-flex align-items-center justify-content-center gap-2">Inbox <i className="ti ti-link text-primary f-22"></i></Link>
            </Col>
            <Col lg={4} md={6}>
              <Card className="layout-card">
                <CardBody>
                  <Link href="/application/ecom_product" target="_blank">
                    <Image src={ecommerce} alt="img" className="img-fluid border" />
                  </Link>
                </CardBody>
              </Card>
              <Link href="/application/ecom_product" target="_blank" className="h5 d-flex align-items-center justify-content-center gap-2">E-commerce <i className="ti ti-link text-primary f-22"></i></Link>
            </Col>
            <Col lg={4} md={6}>
              <Card className="layout-card">
                <CardBody>
                  <Link href="/application/calendar" target="_blank">
                    <Image src={gellery} alt="img" className="img-fluid border" />
                  </Link>
                </CardBody>
              </Card>
              <Link href="/application/calendar" target="_blank" className="h5 d-flex align-items-center justify-content-center gap-2">Gallery <i className="ti ti-link text-primary f-22"></i></Link>
            </Col>
            <Col lg={4} md={6}>
              <Card className="layout-card">
                <CardBody>
                  <Link href="/application/chat" target="_blank">
                    <Image src={calendar} alt="img" className="img-fluid border" />
                  </Link>
                </CardBody>
              </Card>
              <Link href="/application/chat" target="_blank" className="h5 d-flex align-items-center justify-content-center gap-2">Calendar <i className="ti ti-link text-primary f-22"></i></Link>
            </Col>
            <Col lg={4} md={6}>
              <Card className="layout-card">
                <CardBody>
                  <Link href="/application/chat" target="_blank">
                    <Image src={chat} alt="img" className="img-fluid border" />
                  </Link>
                </CardBody>
              </Card>
              <Link href="/application/chat" target="_blank" className="h5 d-flex align-items-center justify-content-center gap-2">Chat <i className="ti ti-link text-primary f-22"></i></Link>
            </Col>
          </Row>
        </div>
      </section>
    </>
  )
}

export default AppsPage