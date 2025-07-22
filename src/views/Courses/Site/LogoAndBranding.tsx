import React, { useState } from 'react'
import { Col, Row } from 'react-bootstrap';
import Dropzone from 'react-dropzone';

const LogoAndBranding = () => {
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
            <p className="text-muted mb-4">Incorporate a custom logo and favicon, and fine-tune your school
                thumbnail to enhance its appearance and branding</p>
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
        </React.Fragment>
    )
}

export default LogoAndBranding