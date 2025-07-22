import React, { useState, useEffect, useRef } from 'react'
import avatar1 from '@assets/images/user/avatar-1.jpg'
import avatar5 from '@assets/images/user/avatar-5.jpg'
import p1 from '@assets/images/admin/p1.jpg'
import ToggleContent from './ToggleContent'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardBody, Col, Row } from 'react-bootstrap'

const MemberTicketList = () => {
    const [theme, setTheme] = useState(false);
    const [viewSize, setViewSize] = useState('sm');
    const handleViewSizeChange = (size: any) => {
        setViewSize(size);
    };

    useEffect(() => {
        const demo = document.documentElement
        demo.setAttribute('class', theme ? 'modal-open' : '')
    }, [theme])

    const [display, setDisplay] = useState(null)
    const dropdownRef = useRef(null)

    const handleDropDown = (id: any) => {
        if (display === id) {
            setDisplay(null)
        } else {
            setDisplay(id)
        }
    }
    const handleClickOutside = (event: any) => {
        if (
            dropdownRef.current &&
            !event.target.contains(event.target)
        ) {
            setDisplay(null);
        }
    };
    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
    
        return () => {
          document.removeEventListener('click', handleClickOutside);
        };
      }, []);

    return (
        <React.Fragment>
        <Col lg={12} xl={8} className={`help-main ${viewSize}-view`}>
            <Card >
                <CardBody>
                    <div className="d-flex justify-content-between p-0 align-items-center">
                        <h5>Ticket List</h5>
                        <div className="btn-group btn-group-sm help-filter" role="group" aria-label="button groups sm">
                            <a className={`btn btn-light-secondary  ${viewSize === 'sm' ? 'active' : ""}`} onClick={() => handleViewSizeChange('sm')}><i className="feather icon-align-justify m-0"></i></a>
                            <a className={`btn btn-light-secondary ${viewSize === 'md' ? 'active' : ""}`} onClick={() => handleViewSizeChange('md')}><i className="feather icon-menu m-0"></i></a>
                            <a className={`btn btn-light-secondary ${viewSize === 'lg' ? 'active' : ""}`} onClick={() => handleViewSizeChange('lg')}><i className="feather icon-grid m-0"></i></a>
                        </div>
                    </div>
                </CardBody>
            </Card>

            <Card className="ticket-card">
                <CardBody>
                    <Row onClick={() => handleDropDown(25)}>
                        <div className="col-sm-auto mb-3 mb-sm-0">
                            <div className="d-sm-inline-block d-flex align-items-center">
                                <Image className="media-object wid-60 img-radius" src={avatar1}
                                    alt="Generic placeholder image " style={{width:"60px", height:"60px"}}/>
                                <div className="ms-3 ms-sm-0">
                                    <ul className=" text-sm-center list-unstyled mt-2 mb-0 d-inline-block">
                                        <li className="list-unstyled-item"><Link href="#" className="link-secondary">1 Ticket</Link></li>
                                        <li className="list-unstyled-item"><Link href="#" className="link-danger"><i className="fas fa-heart"></i>&nbsp;3</Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <Col>
                            <div className="popup-trigger">
                                <div className="h5 font-weight-bold">John lui <small
                                    className="badge bg-light-secondary ms-2">Replied</small></div>
                                <div className="help-sm-hidden">
                                    <ul className="list-unstyled mt-2 mb-0 text-muted">
                                        <li className="d-sm-inline-block d-block mt-1"><Image src={p1} alt=""
                                            className="wid-20 rounded me-2 img-fluid" style={{width:"20px", height:"20px"}}/>Piaf able</li>
                                        <li className="d-sm-inline-block d-block mt-1" ><Image src={avatar5} alt=""
                                            className="wid-20 rounded ms-1 me-1 img-fluid" style={{width:"20px",height:"20px"}}/>&nbsp;Assigned to <b>Robert alia</b></li>&nbsp;
                                        <li className="d-sm-inline-block d-block mt-1"><i
                                            className="wid-20 material-icons-two-tone text-center f-14 me-2">calendar_today</i>Updated
                                            22 hours ago</li>&nbsp;
                                        <li className="d-sm-inline-block d-block mt-1"><i
                                            className="wid-20 material-icons-two-tone text-center f-14 me-2">chat</i>9
                                        </li>
                                    </ul>
                                </div>
                                <div className="h5 mt-3"><i className="material-icons-two-tone f-16 me-1">lock</i> Theme customisation issue
                                </div>
                                <div
                                    className="help-md-hidden" >
                                    <div className="bg-body mb-3 p-3">
                                        <h6><Image src={avatar5} alt=""
                                            className="wid-20 avatar med-2 rounded" style={{width:"20px",height:"20px"}}/>Last comment from <a href="#"
                                                className="link-secondary" >Robert alia:</a></h6>
                                        <p className="mb-0"><b>hello John lui,<br /></b>you need to create
                                            <b> "toolbar-options" div only</b> once in a page&nbsp;in your code,<br />
                                            this div fill found every "td" tag in your page <br />just remove those
                                            things
                                            and also in option button add
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-2">
                                <Link href="/admins/helpdesk-ticket-details" className="me-2 btn btn-sm btn-light-primary"><i
                                    className="feather icon-eye me-1"></i>View Ticket</Link>&nbsp;
                                <Link href="#" className="me-3 btn btn-sm btn-light-danger"><i
                                    className="feather icon-trash-2 me-1"></i>Delete</Link>
                            </div>
                        </Col>
                    </Row>
                </CardBody>
            </Card>

            <Card className="ticket-card open-ticket">
                <CardBody>
                    <Row>
                        <div className="col-sm-auto mb-3 mb-sm-0">
                            <div className="d-sm-inline-block d-flex align-items-center">
                                <Image className="media-object wid-60 img-radius" src={avatar1}
                                    alt="Generic placeholder image " style={{width:"60px",height:"60px"}}/>
                                <div className="ms-3 ms-sm-0 mb-3 mb-sm-0">
                                    <ul className=" text-sm-center list-unstyled mt-2 mb-0 d-inline-block">
                                        <li className="list-unstyled-item"><a href="#" className="link-secondary">1 Ticket</a></li>
                                        <li className="list-unstyled-item"><a href="#" className="link-danger"><i className="fas fa-heart"></i>
                                            &nbsp;3</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <Col>
                            <div className="popup-trigger">
                                <div className="h5 font-weight-bold">John lui <small
                                    className="badge bg-light-secondary ms-2">Replied</small></div>
                                <div className="help-sm-hidden">
                                    <ul className="list-unstyled mt-2 mb-0 text-muted">
                                        <li className="d-sm-inline-block d-block mt-1"><Image src={p1} alt=""
                                            className="wid-20 rounded me-2 img-fluid" style={{width:"20px",height:"20px"}}/>Piaf able</li>
                                        <li className="d-sm-inline-block d-block mt-1" ><Image src={avatar5} alt=""
                                            className="wid-20 rounded ms-1 me-1 img-fluid" style={{width:"20px",height:"20px"}}/>&nbsp;Assigned to <b>Robert alia</b></li>&nbsp;
                                        <li className="d-sm-inline-block d-block mt-1"><i
                                            className="wid-20 material-icons-two-tone text-center f-14 me-2">calendar_today</i>Updated 22
                                            hours ago</li>&nbsp;
                                        <li className="d-sm-inline-block d-block mt-1"><i
                                            className="wid-20 material-icons-two-tone text-center f-14 me-2">chat</i>9
                                        </li>
                                    </ul>
                                </div>
                                <div className="h5 mt-3"><i className="material-icons-two-tone f-16 me-1">lock</i> Theme customisation issue
                                </div>
                                <div className="help-md-hidden">
                                    <div className="bg-body mb-3 p-3">
                                        <h6><Image src={avatar5} alt="" className="wid-20 avatar me-2 rounded" style={{width:"20px",height:"20px"}}/>Last comment from <a href="#" className="link-secondary">Robert alia:</a></h6>
                                        <p className="mb-0"><b>hello John lui,<br /></b>you need to create
                                            <b> "toolbar-options" div only</b> once in a page&nbsp;in your code,<br />
                                            this div fill found every "td" tag in your page <br />just remove those
                                            things
                                            and also in option button add
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-2">
                                <Link href="/admins/helpdesk-ticket-details" className="me-2 btn btn-sm btn-light-primary"><i
                                    className="feather icon-eye me-1"></i>View Ticket</Link>&nbsp;
                                <Link href="#" className="me-3 btn btn-sm btn-light-danger"><i
                                    className="feather icon-trash-2 me-1"></i>Delete</Link>
                            </div>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
            <Card className="ticket-card close-ticket">
                <CardBody>
                    <Row>
                        <div className="col-sm-auto mb-3 mb-sm-0">
                            <div className="d-sm-inline-block d-flex align-items-center">
                                <Image className="media-object wid-60 img-radius" src={avatar1}
                                    alt="Generic placeholder image" style={{width:"60px",height:"60px"}}/>
                                <div className="ms-3 ms-sm-0 mb-3 mb-sm-0">
                                    <ul className=" text-sm-center list-unstyled mt-2 mb-0 d-inline-block">
                                        <li className="list-unstyled-item"><a href="#" className="link-secondary">1 Ticket</a></li>
                                        <li className="list-unstyled-item"><a href="#" className="link-danger"><i className="fas fa-heart"></i>&nbsp;3</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <Col>
                            <div className="popup-trigger">
                                <div className="h5 font-weight-bold">John lui <small
                                    className="badge bg-light-secondary ms-2">Replied</small></div>
                                <div className="help-sm-hidden">
                                    <ul className="list-unstyled mt-2 mb-0 text-muted">
                                        <li className="d-sm-inline-block d-block mt-1"><Image src={p1} alt=""
                                            className="wid-20 rounded me-2 img-fluid" style={{width:"20px",height:"20px"}}/>Piaf able</li>
                                        <li className="d-sm-inline-block d-block mt-1"><Image src={avatar5} alt=""
                                            className="wid-20 rounded ms-1 me-1 img-fluid" style={{width:"20px",height:"20px"}}/>&nbsp;Assigned to <b>Robert alia</b>
                                        </li>&nbsp;
                                        <li className="d-sm-inline-block d-block mt-1"><i
                                            className="wid-20 material-icons-two-tone text-center f-14 me-2">calendar_today</i>Updated
                                            22 hours ago</li>&nbsp;
                                        <li className="d-sm-inline-block d-block mt-1"><i
                                            className="wid-20 material-icons-two-tone text-center f-14 me-2">chat</i>9
                                        </li>
                                    </ul>
                                </div>
                                <div className="h5 mt-3"><i className="material-icons-two-tone f-16 me-1">lock</i> Theme
                                    customisation issue</div>
                                <div className="help-md-hidden">
                                    <div className="bg-body mb-3 p-3">
                                        <h6><Image src={avatar5} alt="" className="wid-20 avatar me-2 rounded" style={{width:"20px",height:"20px"}}/>Last  comment from <a href="#" className="link-secondary">Robert alia:</a></h6>
                                        <p className="mb-0"><b>hello John lui,<br /></b>you need to create
                                            <b>"toolbar-options" div only</b> once in a page&nbsp;in your code,<br />
                                            this div fill found every "td" tag in your page <br />just remove those
                                            things
                                            and also in option button add
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-2">
                                <Link href="/admins/helpdesk-ticket-details" className="me-2 btn btn-sm btn-light-primary"><i className="feather icon-eye me-1"></i>View Ticket</Link>&nbsp;
                                <Link href="#" className="me-3 btn btn-sm btn-light-danger"><i className="feather icon-trash-2 me-1"></i>Delete</Link>
                            </div>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </Col>
        <ToggleContent
            display={display}
            handleDropDown={handleDropDown}
            handleClickOutside={handleClickOutside}
            dropdownRef={dropdownRef}
        />
    </React.Fragment>
    )
}

export default MemberTicketList
