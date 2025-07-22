import React from 'react'
import { Card, CardBody } from 'react-bootstrap'
import { Swiper,SwiperSlide } from 'swiper/react';
import 'swiper/css';
const Calendar = () => {
    return (
        <React.Fragment>
            <div className="col-lg-5 col-md-12">
                <div className="card">
                    <div className="card-body">
                        <h5 className="mb-2">Calendar</h5>
                        <Swiper>
                            <SwiperSlide>
                                <div className="active">
                                    <p>Aug 10, Mon <span className="badge text-bg-primary">TODAY</span></p>
                                    <Card className="overflow-hidden mb-2">
                                        <CardBody className="px-3 py-2 border-start border-4 border-success">
                                            <h6>Realize offers!</h6>
                                            <p className="mb-0">16:00</p>
                                        </CardBody>
                                    </Card>
                                    <Card className="overflow-hidden mb-2">
                                        <CardBody className="px-3 py-2 border-start border-4 border-warning">
                                            <h6>Add new members.</h6>
                                            <p className="mb-0">14:00</p>
                                        </CardBody>
                                    </Card>
                                    <Card className="overflow-hidden mb-2">
                                        <CardBody className="px-3 py-2 border-start border-4 border-primary">
                                            <h6>Add new benefit list.</h6>
                                            <p className="mb-0">13:00</p>
                                        </CardBody>
                                    </Card>
                                    <Card className="overflow-hidden mb-2">
                                        <CardBody className="px-3 py-2 border-start border-4 border-danger">
                                            <h6>Second offer is end!</h6>
                                            <p className="mb-0">09:00</p>
                                        </CardBody>
                                    </Card>
                                </div>
                            </SwiperSlide>

                            <SwiperSlide>
                                <p>Aug 9, Mon</p>
                                <Card className="overflow-hidden mb-2">
                                    <CardBody className="px-3 py-2 border-start border-4 border-warning">
                                        <h6>Add new members.</h6>
                                        <p className="mb-0">14:00</p>
                                    </CardBody>
                                </Card>
                                <Card className="overflow-hidden mb-2">
                                    <CardBody className="px-3 py-2 border-start border-4 border-success">
                                        <h6>Realize offers!</h6>
                                        <p className="mb-0">16:00</p>
                                    </CardBody>
                                </Card>
                                <Card className="overflow-hidden mb-2">
                                    <CardBody className="px-3 py-2 border-start border-4 border-primary">
                                        <h6>Add new benefit list.</h6>
                                        <p className="mb-0">13:00</p>
                                    </CardBody>
                                </Card>
                                <Card className="overflow-hidden mb-2">
                                    <CardBody className="px-3 py-2 border-start border-4 border-danger">
                                        <h6>Second offer is end!</h6>
                                        <p className="mb-0">09:00</p>
                                    </CardBody>
                                </Card>
                            </SwiperSlide>

                            <SwiperSlide>
                                    <p>Aug 8, Mon</p>
                                    <Card className="overflow-hidden mb-2">
                                        <CardBody className="px-3 py-2 border-start border-4 border-primary">
                                            <h6>Add new benefit list.</h6>
                                            <p className="mb-0">13:00</p>
                                        </CardBody>
                                    </Card>
                                    <Card className="overflow-hidden mb-2">
                                        <CardBody className="px-3 py-2 border-start border-4 border-warning">
                                            <h6>Add new members.</h6>
                                            <p className="mb-0">14:00</p>
                                        </CardBody>
                                    </Card>
                                    <Card className="overflow-hidden mb-2">
                                        <CardBody className="px-3 py-2 border-start border-4 border-success">
                                            <h6>Realize offers!</h6>
                                            <p className="mb-0">16:00</p>
                                        </CardBody>
                                    </Card>
                                    <Card className="overflow-hidden mb-2">
                                        <CardBody className="px-3 py-2 border-start border-4 border-danger">
                                            <h6>Second offer is end!</h6>
                                            <p className="mb-0">09:00</p>
                                        </CardBody>
                                    </Card>
                            </SwiperSlide>
                        </Swiper>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Calendar
