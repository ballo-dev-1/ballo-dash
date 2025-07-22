import React, { ReactElement } from "react";
import Layout from "@layout/index";
import { Card, CardBody, Col, Row } from "react-bootstrap";
import BreadcrumbItem from "@common/BreadcrumbItem";
// import MyQuillEditor from '@views/Helpdesk/MyQuillEditor'

const Create = () => {
  return (
    <React.Fragment>
      <BreadcrumbItem mainTitle="Helpdesk" subTitle="Create Ticket" />
      <Row>
        <Col sm={12}>
          <Card>
            <CardBody>
              <div className="container">
                <Row>
                  <Col sm={6}>
                    <div className="mb-3">
                      <label className="form-label">Customer</label>
                      <select className="mb-3 form-select">
                        <option>Default select</option>
                      </select>
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="mb-3">
                      <label className="form-label">Category</label>
                      <select className="mb-3 form-select">
                        <option>Default select</option>
                      </select>
                    </div>
                  </Col>
                </Row>
                <div className="mb-3">
                  <label className="form-label" htmlFor="exampleInputPassword1">
                    Subject
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputPassword1"
                    placeholder="Enter Subject"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="exampleInputPassword1">
                    Description
                  </label>
                  <div id="tinymce-editor" style={{ height: "150px" }}>
                    {/* <MyQuillEditor /> */}
                  </div>
                </div>
                <form
                  action="../assets/json/file-upload.php"
                  className="dropzone"
                >
                  <div className="fallback">
                    <input name="file" type="file" multiple />
                  </div>
                </form>
                <div className="text-end mt-4">
                  <button
                    type="submit"
                    className="btn btn-outline-secondary me-1"
                  >
                    Clear
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};
Create.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};
export default Create;
