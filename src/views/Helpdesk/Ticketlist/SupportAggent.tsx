import React from 'react'
import avatar1 from '@assets/images/user/avatar-1.jpg'
import avatar2 from '@assets/images/user/avatar-2.jpg'
import avatar3 from '@assets/images/user/avatar-3.jpg'
import avatar4 from '@assets/images/user/avatar-4.jpg'
import avatar5 from '@assets/images/user/avatar-5.jpg'
import { Card, CardHeader } from 'react-bootstrap'
import Link from 'next/link'
import Image from 'next/image'

const SupportAggent = () => {
    return (
        <React.Fragment>
            <Card>
                <CardHeader className="pt-4 pb-4">
                    <h5>Support Aggent</h5>
                </CardHeader>
                <ul className="list-group list-group-flush pb-2">


                    <li className="list-group-item">
                        <div className="d-inline-block">
                            <Image src={avatar5} alt="" className="wid-20 rounded me-1 img-fluid" />&nbsp;
                            <Link href="#" className="link-secondary">Tom Cook</Link>
                        </div>
                        <div className="float-end">
                            <Link href="#" className="badge bg-light-danger rounded-circle me-1" data-bs-toggle="tooltip"
                                data-bs-placement="top" title="" data-original-title="tooltip on top">1</Link>&nbsp;
                            <Link href="#" className="badge bg-light-secondary rounded-circle me-0 " data-bs-toggle="tooltip"
                                data-bs-placement="top" title="" data-original-title="tooltip on top">3</Link>
                        </div>
                    </li>
                    <li className="list-group-item">
                        <div className="d-inline-block">
                            <Image src={avatar4} alt="" className="wid-20 rounded me-1 img-fluid" />&nbsp;
                            <Link href="#" className="link-secondary">Brad Larry</Link>
                        </div>
                        <div className="float-end">
                            <Link href="#" className="badge bg-light-danger rounded-circle me-1" data-bs-toggle="tooltip"
                                data-bs-placement="top" title="" data-original-title="tooltip on top">1</Link>&nbsp;
                            <Link href="#" className="badge bg-light-secondary rounded-circle me-0 " data-bs-toggle="tooltip"
                                data-bs-placement="top" title="" data-original-title="tooltip on top">3</Link>
                        </div>
                    </li>
                    <li className="list-group-item">
                        <div className="d-inline-block">
                            <Image src={avatar3} alt="" className="wid-20 rounded me-1 img-fluid" />&nbsp;
                            <Link href="#" className="link-secondary">Jhon White</Link>
                        </div>
                        <div className="float-end">
                            <Link href="#" className="badge bg-light-secondary rounded-circle me-0 " data-bs-toggle="tooltip"
                                data-bs-placement="top" title="" data-original-title="tooltip on top">3</Link>
                        </div>
                    </li>
                    <li className="list-group-item">
                        <div className="d-inline-block">
                            <Image src={avatar2} alt="" className="wid-20 rounded me-1 img-fluid" />&nbsp;
                            <Link href="#" className="link-secondary">Mark Jobs</Link>
                        </div>
                        <div className="float-end">
                            <Link href="#" className="badge bg-light-secondary rounded-circle me-0 " data-bs-toggle="tooltip"
                                data-bs-placement="top" title="" data-original-title="tooltip on top">3</Link>
                        </div>
                    </li>
                    <li className="list-group-item">
                        <div className="d-inline-block">
                            <Image src={avatar1} alt="" className="wid-20 rounded me-1 img-fluid" />&nbsp;
                            <Link href="#" className="link-secondary">Able Pro</Link>
                        </div>
                        <div className="float-end">
                            <Link href="#" className="badge bg-light-secondary rounded-circle me-0 " data-bs-toggle="tooltip"
                                data-bs-placement="top" title="" data-original-title="tooltip on top">3</Link>
                        </div>
                    </li>
                </ul>
            </Card>
        </React.Fragment>
    )
}

export default SupportAggent
