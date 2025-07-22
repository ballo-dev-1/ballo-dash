import React, { useEffect } from 'react'
import { ExpensTypeData } from './FinaceData'
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardBody, Col, Row } from 'react-bootstrap';

const ExpensType = ({display,handleDropDown,handleClickOutside,dropdownRef}:any) => {

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);


    return (
        <React.Fragment>
            <Card>
                <CardBody>
                    <div className="d-flex align-items-center justify-content-between mb-3">
                        <h5 className="mb-0">Where your money go ?</h5>
                        <button className="btn btn-sm btn-primary">+ Add New</button>
                    </div>
                    <Row className="g-3">
                        {
                            ExpensTypeData.map((item: any, index: number) => {
                                return (
                                    <Col md={6} xxl={3} key={index} className="col-md-6 col-xxl-3">
                                        <Card className="shadow-none border mb-0">
                                            <CardBody className="p-3">
                                                <div className="d-flex align-items-center justify-content-between mb-3">
                                                    <Image src={item.img} alt="img" className="img-fluid" />
                                                    <div className="dropdown">
                                                        <Link
                                                            ref={dropdownRef}
                                                            className={`avtar avtar-xs btn-link-secondary dropdown-toggle arrow-none ${display === item.id ? "show" : ""}`} href="#"
                                                            data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" onClick={() => handleDropDown(item.id)}>
                                                            <i className="ti ti-dots-vertical f-18"></i>
                                                        </Link>
                                                        <div className={`dropdown-menu dropdown-menu-end ${display === item.id ? "show show2" : ""}`}>
                                                            <Link className="dropdown-item" href="#" onClick={handleDropDown}>Today</Link>
                                                            <Link className="dropdown-item" href="#" onClick={handleDropDown}>Weekly</Link>
                                                            <Link className="dropdown-item" href="#" onClick={handleDropDown}>Monthly</Link>
                                                        </div>
                                                    </div>
                                                </div>
                                                <h6 className="mb-3">Food & Drink</h6>
                                                <div className="bg-dark p-3 pt-4 rounded-4">
                                                    <div className="progress bg-white bg-opacity-25" style={{ height: "6px" }}>
                                                        <div className="progress-bar bg-white" style={{ width: `${item.percentage}` }}></div>
                                                    </div>
                                                    <div className="d-flex align-items-center justify-content-between mt-2">
                                                        <p className="mb-0 text-white text-opacity-75 text-sm">{item.percentage}</p>
                                                        <p className="mb-0 text-white text-opacity-75 text-sm">{item.total_amount}</p>
                                                    </div>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                )
                            })
                        }
                    </Row>
                </CardBody>
            </Card>
        </React.Fragment>
    )
}

export default ExpensType
