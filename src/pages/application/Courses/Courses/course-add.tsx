import React, { useState,ReactElement } from 'react'
import Layout from '@layout/index'
import Image from 'next/image'
import BreadcrumbItem from '@common/BreadcrumbItem'
import { Card, CardBody, CardHeader, Col, Row } from 'react-bootstrap'
import Dropzone from 'react-dropzone'
import Link from 'next/link'

const CourseAdd = () => {

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
            <BreadcrumbItem mainTitle="Online Courses" subTitle="Course Add" />
            <Row>
                <Col className="col-12">
                    <Card className="card">
                        <CardHeader className="card-header">
                            <h5 className="mb-0">Course Add</h5>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col md={6}>
                                    <div className="mb-3">
                                        <label className="form-label">Course Name</label>
                                        <input type="text" className="form-control" placeholder="Enter first name" />
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="mb-3">
                                        <label className="form-label">Course Code</label>
                                        <input type="text" className="form-control" placeholder="Enter Course Code" />
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="mb-3">
                                        <label className="form-label">Start Form</label>
                                        <input type="date" className="form-control" />
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="mb-3">
                                        <label className="form-label">Course Duration</label>
                                        <input type="text" className="form-control" placeholder="Enter Course Duration" />
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="mb-3">
                                        <label className="form-label">Course Price</label>
                                        <input type="number" className="form-control" placeholder="Enter course price" />
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="mb-3">
                                        <label className="form-label">Teacher Name</label>
                                        <input type="text" className="form-control" placeholder="Enter Teacher name" />
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="mb-3">
                                        <label className="form-label">Maximum Students</label>
                                        <input type="number" className="form-control" placeholder="Enter maximum students" />
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="mb-3">
                                        <label className="form-label">Course Status</label>
                                        <select className="form-select">
                                            <option>Deactive</option>
                                            <option>Active</option>
                                        </select>
                                    </div>
                                </Col>
                                <Col md={6} className="col-md-6">
                                    <div className="mb-3">
                                        <label className="form-label">Course Details</label>
                                        <textarea className="form-control" rows={3} placeholder="Enter course details"></textarea>
                                    </div>
                                </Col>
                                <Col md={6} className="col-md-6">
                                    <div className="mb-3">
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
                                        <div className="list-unstyled mb-0" id="file-previews">
                                            {selectedFiles.map((f: any, i: number) => {
                                                return (
                                                    <Card
                                                        className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                                                        key={i + "-file"}
                                                    >
                                                        <div className="p-2">
                                                            <Row className="align-items-center">
                                                                <Col className="col-auto">
                                                                    <Image
                                                                        height="80"
                                                                        width="100"
                                                                        className="avatar-sm rounded bg-light"
                                                                        alt={f.name}
                                                                        src={f.preview}
                                                                    />
                                                                </Col>
                                                                <Col>
                                                                    <Link href="#" className="text-muted font-weight-bold" >
                                                                        {f.name}
                                                                    </Link>
                                                                    <p className="mb-0">
                                                                        <strong>{f.formattedSize}</strong>
                                                                    </p>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    </Card>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </Col>
                                <Col md={6} className="col-md-12 text-end">
                                    <button className="btn btn-primary">Create Course</button>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    )
}
CourseAdd.getLayout = (page: ReactElement) => {
    return (
        <Layout>
            {page}
        </Layout>
    )
}
export default CourseAdd