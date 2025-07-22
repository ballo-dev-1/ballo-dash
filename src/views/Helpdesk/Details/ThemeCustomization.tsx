import React from 'react'
const SyntaxHighlighter = dynamic(() => import('react-syntax-highlighter') as Promise<{ default: any }>, {
    ssr: false,
}) as any;
// import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import avatar4 from '@assets/images/user/avatar-4.jpg'
import avatar5 from '@assets/images/user/avatar-5.jpg'
import lightBox1 from '@assets/images/light-box/sl1.jpg'
import lightBox2 from '@assets/images/light-box/sl2.jpg'
import lightBox5 from '@assets/images/light-box/sl5.jpg'
import lightBox6 from '@assets/images/light-box/sl6.jpg'
import { Card, CardBody, CardHeader, Col, Row } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const ThemeCustomization = () => {
    const code = `
    <pre>
        <code className="language-css">
        p {
        color: #1abc9c;
        }
        </code>
</pre>
    `
    return (
        <React.Fragment>
            <Col lg={8}>
                <Card>
                    <CardHeader>
                        <h5><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-lock icon-svg-primary wid-20"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg><span className="p-l-5">Private Ticket
                            #1831786</span></h5>
                    </CardHeader>
                    <CardBody className="border-bottom py-2">
                        <Row className="align-items-center">
                            <Col md={8}>
                                <h4 className="d-inline-block mb-0">Theme customization issue</h4>
                            </Col>
                            <Col md={4} className="text-md-end">
                                <div className="btn-star">
                                    <Link href="#!" className="btn btn-light-success btn-sm">Mark as unread</Link>
                                    <Link href="#!"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-star icon-svg-warning wid-20"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> </Link>
                                </div>
                            </Col>
                        </Row>
                    </CardBody>
                    <div className="border-bottom card-body py-2">
                        <Row className="align-items-center">
                            <Col md={12}>
                                <button type="button" className="btn btn-sm my-2 me-1 btn-light-success"><i
                                    className="mx-1 feather icon-message-square"></i>Post a reply</button>
                                <button type="button" className="btn btn-sm my-2 me-1 btn-light-warning"><i
                                    className="mx-1 feather icon-edit"></i>Post a Note</button>
                                <button type="button" className="btn btn-sm my-2 btn-light-danger">
                                    <i className="mx-1 feather icon-user-check"></i>Customer Notes</button>
                            </Col>
                        </Row>
                    </div>
                    <div className="border-bottom card-body">
                        <Row>
                            <div className="col-sm-auto mb-3 mb-sm-0">
                                <div className="d-sm-inline-block d-flex align-items-center">
                                    <Image className="wid-60 img-radius mb-2" src={avatar5}
                                        alt="Generic placeholder image " style={{ height: "60px" }} />
                                    <div className="ms-3 ms-sm-0  text-sm-center">
                                        <p><i className="material-icons-two-tone f-18 text-primary">thumb_up</i> 4</p>
                                    </div>
                                </div>
                            </div>
                            <Col>
                                <Row>
                                    <Col>
                                        <div className="">
                                            <h4 className="d-inline-block me-1">You</h4>
                                            <span className="badge bg-light-secondary">replied</span>
                                            <p className="text-muted">1 day ago on Wednesday at 8:18am</p>
                                        </div>
                                    </Col>
                                    <div className="col-auto">
                                        <ul className="list-unstyled mb-0">
                                            <li className="d-inline-block f-20 me-1">
                                                <a href="#" data-bs-toggle="tooltip" title="Edit">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit icon-svg-success wid-20"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                                </a>
                                            </li>
                                            <li className="d-inline-block f-20">
                                                <a href="#" data-bs-toggle="tooltip" title="Delete">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2 icon-svg-danger wid-20"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </Row>
                                <div className="">
                                    <p><b>hello john doe,</b></p>
                                    <p>you need to create <strong>"toolbar-options" div only once</strong> in a page in your code, this
                                        div fill found
                                        <strong>every "td"</strong> tag in your page, just remove those things.
                                    </p>
                                    <p>and also, in option button add <strong>"p-0" className in "I" tag</strong> to</p>
                                    <p>Thanks...</p>
                                </div>

                                <div className="language-markup">

                                    <SyntaxHighlighter language='Javascript'
                                    // style={docco}
                                    >
                                        {code.trim()}
                                    </SyntaxHighlighter>
                                </div>


                            </Col>
                        </Row>
                    </div>
                    <CardBody className="border-bottom">
                        <Row>
                            <div className="col-sm-auto mb-3 mb-sm-0">
                                <div className="d-sm-inline-block d-flex align-items-center">
                                    <Image className="wid-60 img-radius mb-2" style={{ height: "60px" }} src={avatar4} alt="Generic placeholder image " />
                                    <div className="ms-3 ms-sm-0  text-sm-center">
                                        <p><span className="badge bg-light-danger">1</span> Ticket</p>
                                    </div>
                                </div>
                            </div>
                            <Col>
                                <Row>
                                    <Col>
                                        <div className="">
                                            <h4 className="d-inline-block me-1">User</h4>
                                            <span className="badge bg-light-secondary">replied</span>
                                            <p className="text-muted">1 day ago on Wednesday at 8:18am</p>
                                        </div>
                                    </Col>
                                    <div className="col-auto">
                                        <ul className="list-unstyled mb-0">
                                            <li className="d-inline-block f-20 me-1">
                                                <a href="#" data-bs-toggle="tooltip" title="Edit">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit icon-svg-success wid-20"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                                </a>
                                            </li>
                                            <li className="d-inline-block f-20">
                                                <a href="#" data-bs-toggle="tooltip" title="Delete">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2 icon-svg-danger wid-20"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </Row>
                                <div className="">
                                    <p><b>hello john doe,</b></p>
                                    <p>you need to create <strong>"toolbar-options" div only once</strong> in a page in your code, this
                                        div fill found
                                        <strong>every "td"</strong> tag in your page, just remove those things.
                                    </p>
                                    <p>and also</p>
                                    <p>in option button add <strong>"p-0" className in "I" tag</strong> to</p>
                                    <p>Thanks...</p>
                                </div>
                                <Row className="text-center mb-2">
                                    <div className="col-xl-2 col-lg-3 col-sm-4 col-xs-12">
                                        <Image src={lightBox1} className="img-fluid m-b-10" alt="" />
                                    </div>
                                    <div className="col-xl-2 col-lg-3 col-sm-4 col-xs-12">
                                        <Image src={lightBox2} className="img-fluid m-b-10" alt="" />
                                    </div>
                                    <div className="col-xl-2 col-lg-3 col-sm-4 col-xs-12">
                                        <Image src={lightBox5} className="img-fluid m-b-10" alt="" />
                                    </div>
                                    <div className="col-xl-2 col-lg-3 col-sm-4 col-xs-12">
                                        <Image src={lightBox6} className="img-fluid m-b-10" alt="" />
                                    </div>
                                    <div className="col-xl-2 col-lg-3 col-sm-4 col-xs-12">
                                        <Image src={lightBox1} className="img-fluid m-b-10" alt="" />
                                    </div>
                                </Row>
                                <button type="button" className="btn btn-light-danger btn-sm"><i data-feather="thumbs-up"
                                    className="me-1"></i> Like</button>
                            </Col>
                        </Row>
                    </CardBody>
                    <CardBody className="border-bottom">
                        <Row>
                            <div className="col-sm-auto mb-3 mb-sm-0">
                                <div className="d-sm-inline-block d-flex align-items-center">
                                    <Image className="wid-60 img-radius mb-2" src={avatar5}
                                        alt="Generic placeholder image " style={{ height: "60px" }} />
                                    <div className="ms-3 ms-sm-0  text-sm-center">
                                        <p><i className="material-icons-two-tone f-18 text-primary">thumb_up</i> 4</p>
                                    </div>
                                </div>
                            </div>
                            <Col>
                                <Row>
                                    <Col>
                                        <div className="">
                                            <h4 className="d-inline-block me-1">You</h4>
                                            <span className="badge bg-light-secondary">replied</span>
                                            <p className="text-muted">1 day ago on Wednesday at 8:18am</p>
                                        </div>
                                    </Col>
                                    <div className="col-auto">
                                        <ul className="list-unstyled mb-0">
                                            <li className="d-inline-block f-20 me-1">
                                                <a href="#" data-bs-toggle="tooltip" title="Edit">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit icon-svg-success wid-20"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                                </a>
                                            </li>
                                            <li className="d-inline-block f-20">
                                                <a href="#" data-bs-toggle="tooltip" title="Delete">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2 icon-svg-danger wid-20"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </Row>
                                <div className="">
                                    <p><b>hello john doe,</b></p>
                                    <p>you need to create <strong>"toolbar-options" div only once</strong> in a page in your code, this
                                        div fill found
                                        <strong>every "td"</strong> tag in your page, just remove those things.
                                    </p>
                                    <p>and also, in option button add <strong>"p-0" className in "I" tag</strong> to</p>
                                    <p>Thanks...</p>
                                </div>
                                <div className="language-markup">

                                    <SyntaxHighlighter language='Javascript'
                                    // style={docco}
                                    >
                                        {code.trim()}
                                    </SyntaxHighlighter>
                                </div>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Col>
        </React.Fragment>
    )
}

export default ThemeCustomization
