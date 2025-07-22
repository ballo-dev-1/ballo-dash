import Layout from "@layout/index";
// import EmailSidebarMenu from "@views/Application/Mail/EmailSidebarMenu";
import MailContent from "@views/Application/Mail/MailContent";
import Head from "next/head";
import React, { ReactElement, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";

const Mail = () => {
  const [miniMailList, setMiniMailList] = useState<boolean>(false);
  const [displayCategorys, setCategorys] = useState<any>("Inbox");
  const [displayTypes, setTypes] = useState<any>("all");
  const [displayLables, setLable] = useState<any>("all");

  const [activeTab, setActiveTab] = useState("Inbox");
  const [siteBarToggle, setSiteBarToggle] = useState<any>(false);

  const toggleTab = (ncategory: any, ntype: any, nlabel: any) => {
    console.log(
      "ncategory ::",
      ncategory,
      "ntype ::",
      ntype,
      "nlabel ::",
      nlabel
    );
    setCategorys(ncategory);
    setTypes(ntype);
    setLable(nlabel);

    if (activeTab !== ncategory) {
      setActiveTab(ncategory);
    }
  };

  return (
    <React.Fragment>
      <Head>
        <title>Mail | Light Able NextJs Dashboard Template</title>
      </Head>
      <Row>
        <Col sm={12}>
          <Card>
            <Card.Body>
              <div
                className={`mail-wrapper ${
                  miniMailList ? "mini-mail-list" : ""
                }`}
              >
                {/* <EmailSidebarMenu
                                        toggleTab={toggleTab}
                                        activeTab={activeTab}
                                        siteBarToggle={siteBarToggle}
                                        setSiteBarToggle={setSiteBarToggle} /> */}

                <MailContent
                  setMiniMailList={setMiniMailList}
                  miniMailList={miniMailList}
                  displayCategorys={displayCategorys}
                  displayTypes={displayTypes}
                  displayLables={displayLables}
                  siteBarToggle={siteBarToggle}
                  setSiteBarToggle={setSiteBarToggle}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

Mail.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default Mail;
