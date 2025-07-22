import React, { useState, useEffect, useRef } from 'react'
import { LatestActivityData } from './LatestActivityData'
import Link from 'next/link'
import { Card, CardBody, CardFooter, CardHeader, Col, Row } from 'react-bootstrap'

const LatestActivity = () => {
    const [display, setDisplay] = useState(false)
    const dropdownRef = useRef(null)

    const handleDropDown = () => {
        setDisplay(!display)
    }
    const handleClickOutside = (event: any) => {
        if (
            dropdownRef.current &&
            !event.target.closest('.dropdown')
        ) {
            setDisplay(false);
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
            <Col xl={5} md={6}>
                <Card className="feed-card">
                    <CardHeader>
                        <h5>Latest Activity</h5>
                        <div className="card-header-right">
                            <div className="btn-group card-option dropdown">
                                <button
                                    ref={dropdownRef}
                                    type="button" className={`btn dropdown-toggle ${display === true ? "show" : ""}`} data-bs-toggle="dropdown" aria-haspopup="true"
                                    aria-expanded="false" onClick={handleDropDown}>
                                    <i className="feather icon-more-horizontal"></i>
                                </button>
                                <ul className={`list-unstyled card-option dropdown-menu dropdown-menu-end ${display === true ? "show show2" : ""}`}>
                                    <li className="dropdown-item full-card"><Link href="#!" onClick={handleDropDown}><span><i className="feather icon-maximize"></i>
                                        maximize</span><span style={{ display: "none" }}><i className="feather icon-minimize"></i>
                                            Restore</span></Link>
                                    </li>
                                    <li className="dropdown-item minimize-card"><Link href="#!" onClick={handleDropDown}><span><i className="feather icon-minus"></i>
                                        collapse</span><span style={{ display: "none" }}><i className="feather icon-plus"></i> expand</span></Link>
                                    </li>
                                    <li className="dropdown-item reload-card"><Link href="#!" onClick={handleDropDown}><i className="feather icon-refresh-cw"></i>
                                        reload</Link></li>
                                    <li className="dropdown-item close-card"><Link href="#!" onClick={handleDropDown}><i className="feather icon-trash"></i> remove</Link></li>
                                </ul>
                            </div>
                        </div>
                    </CardHeader>
                    <div style={{ overflowY: 'auto', maxHeight: '400px', position: "relative" }}>
                        <div className="card-body">
                            {
                                LatestActivityData.map((item: any, index: number) => {
                                    return (
                                        <div key={index} className="row align-items-center m-b-30">
                                            <div className="col-auto p-r-0">
                                                <i className={item.icon}></i>
                                            </div>
                                            <div className="col">
                                                <Link href="#!">
                                                    <h6>{item.status} <span className="text-muted float-end f-13">{item.button}</span></h6>
                                                </Link>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <CardFooter className="text-center">
                        <Link href="#!" className="b-b-primary text-primary">View all Feeds</Link>
                    </CardFooter>
                </Card>
                <Card className="feed-card">
                    <CardBody className="p-t-0 p-b-0">
                        <Row >
                            <div className="col-4 bg-primary border-feed">
                                <i className="material-icons-two-tone d-block f-46">menu_book</i>
                            </div>
                            <div className="col-8">
                                <div className="p-t-25 p-b-25">
                                    <h2 className="f-w-400 m-b-10">379</h2>
                                    <p className="text-muted m-0">Tickets <span className="text-primary f-w-400">Answered</span></p>
                                </div>
                            </div>
                        </Row>
                    </CardBody>
                </Card>
            </Col>
        </React.Fragment >
    )
}

export default LatestActivity
