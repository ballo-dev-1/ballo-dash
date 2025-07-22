import React, { useState } from 'react'
import star from '../../../assets/images/admin/img-star.png'
import { Card, CardBody, Col, Row } from 'react-bootstrap'
import { ColorData, SecColorData } from './ColorData'
import Dropzone from 'react-dropzone'
import Image from 'next/image'

const ColorPlates = () => {
    const [selectedFiles, setselectedFiles] = useState<any>([]);

    function handleAcceptedFiles(files: any) {
        files.map((file: any) =>
            Object.assign(file, {
                preview: URL.createObjectURL(file),
            })
        );
        setselectedFiles(files);
    }
    return (
        <React.Fragment>
            <h5>Logo & Branding</h5>
            <p className="text-muted mb-4">Incorporate a custom logo and favicon, and fine-tune your school thumbnail to enhance its appearance and branding</p>
            <Row className="g-3">
                <Col sm={12} md={4}>
                    <p className="mb-2">Logo & Branding</p>
                    <Dropzone
                        onDrop={acceptedFiles => {
                            handleAcceptedFiles(acceptedFiles);
                        }}
                    >
                        {({ getRootProps }) => (
                            <div className="dropzone dz-clickable text-center ">
                                <div className="dz-message needsclick"
                                    {...getRootProps()}
                                >
                                    <div className="mb-3">
                                        <i className="display-4 text-muted ri-upload-cloud-2-fill" />
                                    </div>
                                    <p className="my-4">Drop files here to upload</p>
                                </div>
                            </div>
                        )}
                    </Dropzone>
                </Col>
                <Col sm={6} md={4}>
                    <p className="mb-2">Thumbnail</p>
                    <Dropzone
                        onDrop={acceptedFiles => {
                            handleAcceptedFiles(acceptedFiles);
                        }}
                    >
                        {({ getRootProps }) => (
                            <div className="dropzone dz-clickable text-center ">
                                <div className="dz-message needsclick"
                                    {...getRootProps()}
                                >
                                    <div className="mb-3">
                                        <i className="display-4 text-muted ri-upload-cloud-2-fill" />
                                    </div>
                                    <p className="my-4">Drop files here to upload</p>
                                </div>
                            </div>
                        )}
                    </Dropzone>
                </Col>
                <Col sm={6} md={4}>
                    <p className="mb-2">Favicon</p>
                    <Dropzone
                        onDrop={acceptedFiles => {
                            handleAcceptedFiles(acceptedFiles);
                        }}
                    >
                        {({ getRootProps }) => (
                            <div className="dropzone dz-clickable text-center ">
                                <div className="dz-message needsclick"
                                    {...getRootProps()}
                                >
                                    <div className="mb-3">
                                        <i className="display-4 text-muted ri-upload-cloud-2-fill" />
                                    </div>
                                    <p className="my-4">Drop files here to upload</p>
                                </div>
                            </div>
                        )}
                    </Dropzone>
                </Col>
            </Row>
            <hr className="my-4 border-top border-secondary border-opacity-50" />
            <div className="d-flex align-items-center mb-4">
                <div className="flex-shrink-0">
                    <Image src={star} alt="img" />
                </div>
                <div className="flex-grow-1 ms-3">
                    <h6 className="mb-1">Able pro Branding</h6>
                    <p className="mb-0 text-muted">Personalize your school and eliminate Able Pro branding from your school website, emails, and products. To access this feature, upgrade to the Professional plan.</p>
                </div>
            </div>
            <h5>Font Family</h5>
            <p className="text-muted mb-4">Change the font used across your school.</p>
            <div className="card border">
                <div className="card-body">
                    <select className="form-select w-auto mb-3">
                        <option defaultValue="open sanse">Open Sans</option>
                        <option value="1">Inter</option>
                        <option value="2">Popince</option>
                        <option value="3">Roboto</option>
                    </select>
                    <p className="mb-0 text-muted">Make your school your own and remove Teachable branding from your
                        school website, emails, and all products. Upgrade to the Professional plan to use this
                        feature.</p>
                </div>
            </div>
            <h5>Color Palette</h5>
            <p className="text-muted mb-4">
                Select a predefined color scheme to establish consistency across your
                site and products. Alternatively, customize your own color palette to reflect your unique branding
                and preferences.
            </p>
            <Card className='border'>
                <CardBody>
                    <Row>
                        {(ColorData || []).map((item, key) => (
                            <Col md={6} className="col-xl-3" key={key}>
                                <div className="admin-color-block">
                                    <h6 className="mb-1">{item.title}</h6>
                                    <p className="text-muted text-sm mb-2">Theme Color</p>
                                    <div className="card border p-3 shadow-none mb-0">
                                        <div className="d-flex align-items-center justify-content-center gap-2">
                                            <i className={item.color1}></i>
                                            <i className={item.color2}></i>
                                            <i className={item.color2}></i>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row><br />
                    <Row className="g-4">
                        {(SecColorData || []).map((item, key) => (
                            <Col md={6} className="col-xl-3" key={key}>
                                <h6 className="mb-1">{item.title}</h6>
                                <p className="text-muted text-sm mb-2">{item.subtitle}</p>
                                <div className="card border p-3 shadow-none mb-0">
                                    <div className="d-flex align-items-center justify-content-start gap-2">
                                        <i className={item.color}></i>
                                        <p className="mb-0">{item.colorcode}</p>
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </CardBody>
            </Card>
        </React.Fragment>
    )
}

export default ColorPlates