import React, { ReactElement, useState } from "react";
import { Row, Col, Card, CardHeader, CardBody } from "react-bootstrap";
import BreadcrumbItem from "../../../Common/BreadcrumbItem";
import Theme from "../../../views/Courses/Site/Theme";
import Domain from "../../../views/Courses/Site/Domain";
// import Bio from '../../../views/Courses/Site/Bio';
import SchoolPage from "../../../views/Courses/Site/SchoolPage";
import Footer from "../../../views/Courses/Site/Footer";
import Layout from "@layout/index";

const CourseWizard = () => {
  const [activeTab, setActiveTab] = useState("contactDetail");

  const handleTabClick = (tab: any, e: any) => {
    setActiveTab(tab);
    e.preventDefault();
  };

  return (
    <React.Fragment>
      <BreadcrumbItem mainTitle="Online Courses" subTitle="Site" />
      <Row>
        <Col sm={12}>
          <Card>
            <CardHeader>
              <h5>Site</h5>
            </CardHeader>
            <CardBody>
              <div
                id="basicwizard"
                className="form-wizard row justify-content-center"
              >
                <ul className="nav nav-pills justify-content-center course-wizard">
                  <li
                    className="nav-item"
                    data-target-form="#contactDetailForm"
                  >
                    <a
                      href="#contactDetail"
                      data-bs-toggle="tab"
                      data-toggle="tab"
                      className={`nav-link ${
                        activeTab === "contactDetail" ? "active" : ""
                      }`}
                      onClick={(e) => handleTabClick("contactDetail", e)}
                    >
                      <div className="course-wizard-num">
                        <span>1</span>
                      </div>
                      <span className="d-none d-sm-inline">Theme</span>
                    </a>
                  </li>
                  <li className="nav-item" data-target-form="#jobDetailForm">
                    <a
                      href="#jobDetail"
                      data-bs-toggle="tab"
                      data-toggle="tab"
                      className={`nav-link ${
                        activeTab === "jobDetail" ? "active" : ""
                      }`}
                      onClick={(e) => handleTabClick("jobDetail", e)}
                    >
                      <div className="course-wizard-num">
                        <span>2</span>
                      </div>
                      <span className="d-none d-sm-inline">Domain</span>
                    </a>
                  </li>
                  <li
                    className="nav-item"
                    data-target-form="#educationDetailForm"
                  >
                    <a
                      href="#educationDetail"
                      data-bs-toggle="tab"
                      data-toggle="tab"
                      className={`nav-link ${
                        activeTab === "educationDetail" ? "active" : ""
                      }`}
                      onClick={(e) => handleTabClick("educationDetail", e)}
                    >
                      <div className="course-wizard-num">
                        <span>3</span>
                      </div>
                      {/* <span className="d-none d-sm-inline">Bio</span> */}
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      href="#finish"
                      data-bs-toggle="tab"
                      data-toggle="tab"
                      className={`nav-link ${
                        activeTab === "finish" ? "active" : ""
                      }`}
                      onClick={(e) => handleTabClick("finish", e)}
                    >
                      <div className="course-wizard-num">
                        <span>4</span>
                      </div>
                      <span className="d-none d-sm-inline">Page</span>
                    </a>
                  </li>
                </ul>
                <div className="tab-content">
                  {activeTab === "contactDetail" && (
                    <div
                      id="contactDetail"
                      className="tab-pane fade show active"
                    >
                      <Theme />
                    </div>
                  )}
                  {activeTab === "jobDetail" && (
                    <div id="jobDetail" className="tab-pane fade show active">
                      <Domain />
                    </div>
                  )}
                  {activeTab === "educationDetail" && (
                    <div
                      id="educationDetail"
                      className="tab-pane fade show active"
                    >
                      {/* <Bio /> */}
                    </div>
                  )}
                  {activeTab === "finish" && (
                    <div id="finish" className="tab-pane fade show active">
                      <SchoolPage />
                    </div>
                  )}
                </div>
              </div>
              <Footer />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

CourseWizard.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default CourseWizard;
