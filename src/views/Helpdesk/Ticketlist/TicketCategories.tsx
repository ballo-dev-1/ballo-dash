import React from 'react'
import { TicketCategoriesData } from './TickeListData'
import SupportAggent from './SupportAggent'
import { Card, CardHeader, Col } from 'react-bootstrap'
import Link from 'next/link'
import Image from 'next/image'

const TicketCategories = () => {
    return (
        <React.Fragment>
            <Col xl={4} lg={12}>
                <div className="right-side">
                    <Card className="mb-3">
                        <CardHeader>
                            <h5>Ticket Categories</h5>
                        </CardHeader>
                        <ul className="list-group list-group-flush pb-2">
                            {
                                TicketCategoriesData.map((item:any,index:any) => {
                                    return (
                                        <li key={index} className="list-group-item">
                                            <div className="d-inline-block">
                                                <Image src={item.img} alt="" className="wid-20 rounded me-1 img-fluid" />&nbsp;
                                                    <Link href="#" className="link-secondary">{item.lable}</Link>
                                            </div>
                                            <div className="float-end">
                                                <Link href="#" className="badge bg-light-danger rounded-circle me-1" data-bs-toggle="tooltip"
                                                    data-bs-placement="top" title="" data-original-title="tooltip on top">{item.number1}</Link>&nbsp;
                                                <Link href="#" className="badge bg-light-secondary rounded-circle me-0 " data-bs-toggle="tooltip"
                                                    data-bs-placement="top" title="" data-original-title="tooltip on top">{item.number2}</Link>
                                            </div>
                                        </li>
                                    )
                                })
                            }
                        </ul>

                    </Card>
                <SupportAggent/>
                </div>
            </Col>
        </React.Fragment>
    )
}

export default TicketCategories
