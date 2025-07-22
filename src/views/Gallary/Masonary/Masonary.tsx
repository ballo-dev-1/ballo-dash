import React, { useState } from 'react'
import ShowAll from './ShowAll'
import WebDesigner from './WebDesigner';
import GraphicDesigner from './GraphicDesigner';
import AnimationDesigner from './AnimationDesigner';
import UXDesigner from './UXDesigner';
import ProductDesigner from './ProductDesigner';
import Link from 'next/link';
import { Card, CardBody, Col, Row } from 'react-bootstrap';

const Masonary = () => {
    const [activeTab, setActiveTab] = useState('showall');

    const handledisplay = (catagory: any) => {
        setActiveTab(catagory)
    }

    return (
        <React.Fragment>
            <Row>
                <Col>
                    <Card>
                        <CardBody className="border-bottom">
                            <Row className="align-items-center justify-content-between g-3">
                                <div className="col-auto">
                                    <div id="filters" className="btn-filter btns-gallery">
                                        <button className={`btn my-1 btn-sm btn-light-primary me-1 ${activeTab === 'showall' ? 'active' : ''}`} data-filter="*" onClick={() => handledisplay('showall')}>Show all</button>
                                        <button className={`btn my-1 btn-sm btn-light-primary me-1 ${activeTab === 'webdesigner' ? "active" : ""}`} data-filter=".web" onClick={() => handledisplay('webdesigner')}>Web Designer</button>
                                        <button className={`btn my-1 btn-sm btn-light-primary me-1 ${activeTab === 'graphicdesigner' ? 'active' : ''}`} data-filter=".graphic" onClick={() => handledisplay('graphicdesigner')}>Graphic Designer</button>
                                        <button className={`btn my-1 btn-sm btn-light-primary me-1 ${activeTab === 'animationdesigner'}`} data-filter=".animation" onClick={() => handledisplay('animationdesigner')}>Animation Designer</button>
                                        <button className={`btn my-1 btn-sm btn-light-primary me-1 ${activeTab === 'uiuxdesigner'}`} data-filter=".uiux" onClick={() => handledisplay('uiuxdesigner')}>UI/UX Designer</button>
                                        <button className={`btn my-1 btn-sm btn-light-primary me-1 ${activeTab === 'productdesigner'}`} data-filter=".product" onClick={() => handledisplay('productdesigner')}>Product Designer</button>
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <ul className="list-inline d-flex align-items-center ms-auto my-1">
                                        <li className="list-inline-item">
                                            <select className="form-select">
                                                <option>Sort By : Newest</option>
                                                <option>Sort By : Newest</option>
                                            </select>
                                        </li>
                                        <li className="list-inline-item align-bottom">
                                            <Link href="#" className="btn btn-primary">My Collection</Link>
                                        </li>
                                    </ul>
                                </div>
                            </Row>
                        </CardBody>

                        <CardBody>
                            {/* <Row className="grid g-3"> */}
                            {activeTab === 'showall' ? <ShowAll /> : ""}
                            {activeTab === 'webdesigner' ? <WebDesigner /> : ""}
                            {activeTab === 'graphicdesigner' ? <GraphicDesigner /> : ""}
                            {activeTab === 'animationdesigner' ? <AnimationDesigner /> : ""}
                            {activeTab === 'uiuxdesigner' ? <UXDesigner /> : ""}
                            {activeTab === 'productdesigner' ? <ProductDesigner /> : ""}
                            {/* </Row> */}
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    )
}

export default Masonary
