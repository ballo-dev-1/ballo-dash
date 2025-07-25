import BreadcrumbItem from "@common/BreadcrumbItem";
import Layout from "@layout/index";
import React, { ReactElement, useEffect, useRef, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";

const EditDocument = () => {
  // CK Editor
  const editorRef = useRef<any>();
  const [editor, setEditor] = useState(false);
  const { CKEditor, ClassicEditor }: any = editorRef.current || {};

  // useEffect(() => {
  //   editorRef.current = {
  //     CKEditor: require("@ckeditor/ckeditor5-react").CKEditor,
  //     ClassicEditor: require("@ckeditor/ckeditor5-build-decoupled-document"),
  //   };
  //   setEditor(true);
  // }, []);

  const editorConfig = {
    placeholder: "Type your text here...",
  };

  return (
    <React.Fragment>
      <BreadcrumbItem mainTitle="Forms" subTitle="Document Editor" />
      {/* <Row>
        <Col sm={12}>
          <Card>
            <Card.Header>
              <h5>Document Editor</h5>
            </Card.Header>
            <Card.Body>
              {editor ? (
                <CKEditor
                  editor={ClassicEditor}
                  config={editorConfig}
                  data={`
                                <h2 style="text-align: center">The Flavorful Tuscany Meetup</h2>
                                <h3 style="text-align: center">Welcome letter</h3>
                                <p>Dear Guest,</p>
                                <p
                                  >We are delighted to welcome you to the annual <i>Flavorful Tuscany Meetup</i> and hope you will enjoy the
                                  programmer as well as your stay at the <a href="http://ckeditor.com">Bilancino Hotel</a>.</p
                                >
                                <p>Please find below the full schedule of the event.</p>
                                <figure class="table ck-widget ck-widget_selectable" contenteditable="false">
                                  <table>
                                    <thead>
                                      <tr>
                                        <th class="ck-editor__editable ck-editor__nested-editable" contenteditable="true" colspan="2"
                                          >Saturday, July 14</th
                                        >
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td class="ck-editor__editable ck-editor__nested-editable" contenteditable="true"
                                          >9:30&nbsp;AM&nbsp;-&nbsp;11:30&nbsp;AM
                                        </td>
                                        <td class="ck-editor__editable ck-editor__nested-editable" contenteditable="true"
                                          >Americano vs. Brewed - “know coffee” with <strong>Stefano Garau</strong></td
                                        >
                                      </tr>
                                      <tr>
                                        <td class="ck-editor__editable ck-editor__nested-editable" contenteditable="true"
                                          >1:00&nbsp;PM&nbsp;-&nbsp;3:00&nbsp;PM
                                        </td>
                                        <td class="ck-editor__editable ck-editor__nested-editable" contenteditable="true"
                                          >Pappardelle al pomodoro - <mark class="marker-yellow">live cooking</mark> with
                                          <strong>Rita</strong>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td class="ck-editor__editable ck-editor__nested-editable" contenteditable="true"
                                          >5:00&nbsp;PM&nbsp;-&nbsp;8:00&nbsp;PM
                                        </td>
                                        <td class="ck-editor__editable ck-editor__nested-editable" contenteditable="true"
                                          >Tuscan vineyards at a glancewith <strong>Frederico Riscoli</strong></td
                                        >
                                      </tr>
                                    </tbody>
                                  </table>
                                </figure>
                                <blockquote>
                                  <p
                                    >The annual Flavorful Tuscany meetups are always a culinary discovery. You get the best of Tuscan flavors during
                                    an intense one-day stay at one of the top hotels of the region. All the sessions are lead by top chefs passionate
                                    about their profession. I would certainly recommend to save the date in your calendar for this one!</p
                                  >
                                  <p>Angelina Calvino, food journalist</p>
                                </blockquote>
                                <p
                                  >Please arrive at the <a href="http://ckeditor.com">Bilancino Hotel</a> reception desk
                                  <mark class="marker-yellow">at least half an hour earlier</mark> to make sure that the registration process goes as
                                  smoothly as possible.
                                </p>
                                <p>We look forward to welcoming you to the event.</p>
                                <p><strong>Victoria Valc</strong></p>
                                <p><strong>Event Manager</strong></p>
                                <p><strong>Bilancino Hotel</strong></p>`}
                  onReady={(editor: any) => {
                    // You can store the "editor" and use when it is needed.
                  }}
                  onChange={(event: any, editor: any) => {
                    // const data = editor.getData();
                    // setData(data);
                  }}
                />
              ) : (
                <p>ckeditor5</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row> */}
    </React.Fragment>
  );
};

EditDocument.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default EditDocument;
