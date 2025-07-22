import React, { useState,useEffect } from 'react'
import { Col, Row } from 'react-bootstrap'
import Link from 'next/link'

const CreateForm = () => {
const [display,setDisplay]=useState(false)
const [show,setShow]=useState(false)

useEffect(() => {
    if (display) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  }, [display]);

const handleDisplay=()=>{
    setDisplay(!display)
}

const handleshow=()=>{
    setShow(!show)
}

const [formData,setFormData]=useState({
    invoiceId: '',
    status: 'Please Select',
    startDate: '',
    dueDate: ''
})

const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

    return (
        <React.Fragment>
            <Col sm={6} xl={3}>
                <div className="mb-0">
                    <label className="form-label">Invoice id</label>
                    <input type="text" name='invoiceId' value={formData.invoiceId} className="form-control" placeholder="#xxxx" onChange={handleInputChange}/>
                </div>
            </Col>
            <Col sm={6} xl={3}>
                <div className="mb-0">
                    <label className="form-label">Status</label>
                    <select className="form-select" name='status' value={formData.status} id="exampleFormControlSelect1" onChange={handleInputChange}>
                        <option>Please Select</option>
                        <option>Paid</option>
                        <option>Unpaid</option>
                        <option>Partial Paid</option>
                    </select>
                </div>
            </Col>
            <Col sm={6} xl={3}>
                <div className="mb-0">
                    <label className="form-label">Start Date</label>
                    <input type="datetime-local" name='startData' value={formData.startDate} className="form-control" onChange={handleInputChange}/>
                </div>
            </Col>
            <Col sm={6} xl={3}>
                <div className="mb-0">
                    <label className="form-label">Due Date</label>
                    <input type="datetime-local" name='dueDate' value={formData.dueDate} className="form-control" onChange={handleInputChange}/>
                </div>
            </Col>
            <Col xl={6}>
                <div className="border rounded p-3 h-100">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                        <h6 className="mb-0">From:</h6>
                        <button
                            className="btn btn-sm btn-light-secondary d-flex align-items-center gap-2"
                            data-bs-toggle="modal"
                            data-bs-target="#address-edit_add-modal" onClick={handleDisplay}><i className="ph-duotone ph-pencil-simple-line"></i> Change</button>
                    </div>
                    <h5>Garcia-Cameron and Sons</h5>
                    <p className="mb-0">8534 Saunders Hill Apt. 583</p>
                    <p className="mb-0">(970) 982-3353</p>
                    <p className="mb-0">brandon07@pierce.com</p>
                </div>
            </Col>
            <Col xl={6}>
                <div className="border rounded p-3 h-100">
                    <div className="d-flex align-items-center justify-content-between">
                        <h6 className="mb-0">To:</h6>
                        <button
                            className="btn btn-sm btn-light-secondary d-flex align-items-center gap-2"
                            data-bs-toggle="modal"
                            data-bs-target="#address-edit_add-modal" onClick={handleDisplay}><i className="ph-duotone ph-plus-circle"></i> Add</button>
                    </div>
                </div>
            </Col>

            <div className={`modal fade ${display===true ? "show" : ""}`} id="address-edit_add-modal" tabIndex={-1} data-bs-keyboard="false" style={{display:`${display===true ? "block" : "none"}`}} role='dialog'>
                <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header justify-content-between">
                            <div className={`collapse multi-collapse show ${show===true ? "" : "show"}`}>
                                <h5 className="mb-0">Select address</h5>
                            </div>
                            <div className={`collapse multi-collapse ${show===true ? "show" : ""}`}>
                                <h5 className="mb-0">Add New address</h5>
                            </div>
                            <div className="d-flex align-items-center justify-content-end">
                                <div className={`collapse multi-collapse ${show===true ? "" : "show"}`} data-bs-toggle="tooltip" title="Add New">
                                    <Link href="#" className={`avtar avtar-s btn-link-secondary ${show===true ? 'collapsed' : ""}`} data-bs-toggle="collapse" data-bs-target=".multi-collapse" onClick={handleshow}>
                                        <i className="ti ti-plus f-20"></i>
                                    </Link>
                                </div>
                                <Link href="#" className="avtar avtar-s btn-link-danger" data-bs-dismiss="modal" data-bs-toggle="tooltip" title="Close" onClick={handleDisplay}>
                                    <i className="ti ti-x f-20"></i>
                                </Link>
                            </div>
                        </div>
                        <div className="modal-body">
                            <div className={`collapse multi-collapse ${show===true ? "" :"show"}`}>
                                <div className="address-check-block">
                                    <div className="address-check border rounded p-3">
                                        <div className="form-check">
                                            <input type="radio" name="radio1" className="form-check-input input-primary" id="address-check-1" />
                                            <label className="form-check-label d-block" htmlFor="address-check-1">
                                                <span className="h6 mb-0 d-block">Ian Carpenter <small className="text-muted">(Home)</small></span>
                                                <span className="text-muted address-details">1754 Ureate Path, 695 Newga View, Seporcus, Rhode Island, Belgium - SA5 5BO</span>
                                                <span className="row align-items-center justify-content-between">
                                                    <span className="col-6">
                                                        <span className="text-muted mb-0">+91 1234567890</span>
                                                    </span>
                                                    <span className="col-6 text-end">
                                                        <span className="address-btns d-flex align-items-center justify-content-end">
                                                            <Link href="#" className="avtar avtar-s btn-link-danger btn-pc-default">
                                                                <i className="ti ti-trash f-20"></i>
                                                            </Link>
                                                            <span className="btn btn-sm btn-outline-primary">Deliver to this address</span>
                                                        </span>
                                                    </span>
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="address-check border rounded p-3">
                                        <div className="form-check">
                                            <input type="radio" name="radio1" className="form-check-input input-primary" id="address-check-2" />
                                            <label className="form-check-label d-block" htmlFor="address-check-2">
                                                <span className="h6 mb-0 d-block">Ian Carpenter <small className="text-muted">(Home)</small></span>
                                                <span className="text-muted address-details">1754 Ureate Path, 695 Newga View, Seporcus, Rhode Island, Belgium - SA5 5BO</span>
                                                <span className="row align-items-center justify-content-between">
                                                    <span className="col-6">
                                                        <span className="text-muted mb-0">+91 1234567890</span>
                                                    </span>
                                                    <span className="col-6 text-end">
                                                        <span className="address-btns d-flex align-items-center justify-content-end">
                                                            <Link href="#" className="avtar avtar-s btn-link-danger btn-pc-default">
                                                                <i className="ti ti-trash f-20"></i>
                                                            </Link>
                                                            <span className="btn btn-sm btn-outline-primary">Deliver to this address</span>
                                                        </span>
                                                    </span>
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="address-check border rounded p-3">
                                        <div className="form-check">
                                            <input type="radio" name="radio1" className="form-check-input input-primary" id="address-check-3" />
                                            <label className="form-check-label d-block" htmlFor="address-check-3">
                                                <span className="h6 mb-0 d-block">Ian Carpenter <small className="text-muted">(Home)</small></span>
                                                <span className="text-muted address-details">1754 Ureate Path, 695 Newga View, Seporcus, Rhode Island, Belgium - SA5 5BO</span>
                                                <span className="row align-items-center justify-content-between">
                                                    <span className="col-6">
                                                        <span className="text-muted mb-0">+91 1234567890</span>
                                                    </span>
                                                    <span className="col-6 text-end">
                                                        <span className="address-btns d-flex align-items-center justify-content-end">
                                                            <Link href="#" className="avtar avtar-s btn-link-danger btn-pc-default">
                                                                <i className="ti ti-trash f-20"></i>
                                                            </Link>
                                                            <span className="btn btn-sm btn-outline-primary">Deliver to this address</span>
                                                        </span>
                                                    </span>
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={`collapse multi-collapse ${show===true ? "show" :""}`}>
                                <Row>
                                    <Col>
                                        <div className="mb-3 row align-items-center">
                                            <label className="col-lg-4 col-form-label">Address Type :<small className="text-muted d-block">Enter Add Type</small></label>
                                            <Col lg={8}>
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input" type="radio" name="flexRadioDefault" id="addtypecheck1" defaultChecked />
                                                    <label className="form-check-label" htmlFor="addtypecheck1"> Home (All day Delivery) </label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input" type="radio" name="flexRadioDefault" id="addtypecheck2" />
                                                    <label className="form-check-label" htmlFor="addtypecheck2"> Work (Between 10 AM to 5 PM) </label>
                                                </div>
                                            </Col>
                                        </div>
                                        <Row className="mb-3">
                                            <label className="col-lg-4 col-form-label"
                                            >First Name :<small className="text-muted d-block">Enter your first name</small></label>
                                            <div className="col-lg-8">
                                                <input type="text" className="form-control" />
                                            </div>
                                        </Row>
                                        <Row className="mb-3">
                                            <label className="col-lg-4 col-form-label">Last Name :<small className="text-muted d-block">Enter your last name</small></label>
                                            <div className="col-lg-8">
                                                <input type="text" className="form-control" />
                                            </div>
                                        </Row>
                                        <Row className="mb-3">
                                            <label className="col-lg-4 col-form-label">Email Id :<small className="text-muted d-block">Enter Email id</small></label>
                                            <div className="col-lg-8">
                                                <input type="email" className="form-control" />
                                            </div>
                                        </Row>
                                        <Row className="mb-3">
                                            <label className="col-lg-4 col-form-label"
                                            >Date of Birth :<small className="text-muted d-block">Enter the date of birth</small></label>
                                            <div className="col-lg-8">
                                                <input type="date" className="form-control" />
                                            </div>
                                        </Row>
                                        <Row className="mb-3">
                                            <label className="col-lg-4 col-form-label">Phone number :<small className="text-muted d-block">Enter Phone number</small></label>
                                            <div className="col-lg-8">
                                                <input type="text" className="form-control" />
                                            </div>
                                        </Row>
                                        <Row className="mb-3">
                                            <label className="col-lg-4 col-form-label">City :<small className="text-muted d-block">Enter City name</small></label>
                                            <div className="col-lg-8">
                                                <input type="text" className="form-control" />
                                            </div>
                                        </Row>
                                        <div className="mb-3">
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox"  id="checkaddres" defaultChecked />
                                                <label className="form-check-label" htmlFor="checkaddres"> Save this new address for future shipping </label>
                                            </div>
                                        </div>
                                        <div className="text-end btn-page mb-0 mt-4">
                                            <button className={`btn btn-outline-secondary ${show===true ? 'collapsed' :''}`} type="button" data-bs-toggle="collapse" data-bs-target=".multi-collapse" onClick={handleshow}>Cancel</button>
                                            <button className="btn btn-primary" data-bs-dismiss="modal" onClick={handleDisplay}>Save & Deliver to this Address</button>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                        <div className={`modal-footer justify-content-between collapse multi-collapse ${show===true ? "" : "show"}`}>
                            <ul className="list-inline me-auto mb-0">
                                <li className="list-inline-item align-bottom">
                                    <Link href="#" className="avtar avtar-s btn-link-danger w-sm-auto" data-bs-toggle="tooltip" title="Delete">
                                        <i className="ti ti-trash f-18"></i>
                                    </Link>
                                </li>
                            </ul>
                            <div className="flex-grow-1 text-end">
                                <button type="button" className="btn btn-link-danger" data-bs-dismiss="modal" onClick={handleDisplay}>Cancel</button>
                                <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleDisplay}>Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default CreateForm

