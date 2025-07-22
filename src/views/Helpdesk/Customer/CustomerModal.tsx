import React, { useState,} from 'react'
import {  CardHeader, Modal } from 'react-bootstrap'

const CustomerModal = () => {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <React.Fragment>
            <CardHeader>
                <h5>Customers</h5>
                <div className="card-header-right">
                    <button type="button" className="btn btn-light-warning m-0" onClick={handleShow}>
                        New Customer
                    </button>
                    <div className="dropdown customer-body" >
                        <Modal show={show} onHide={handleClose}>

                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel"><i data-feather="user"
                                    className="icon-svg-primary wid-20 me-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-user icon-svg-primary wid-20 me-2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></i>Add Customer</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleClose}>
                                </button>
                            </div>
                            <form>
                                <div className="modal-body ">
                                    <small id="emailHelp" className="form-text text-muted mb-2 mt-0">We'll never share your email with
                                        anyone else.</small>
                                    <div className="mb-3">
                                        <label className="form-label">First Name</label>
                                        <input type="text" className="form-control" id="fname" aria-describedby="emailHelp"
                                            placeholder="Enter First Name" />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Last Name</label>
                                        <input type="email" className="form-control" id="lname" aria-describedby="emailHelp"
                                            placeholder="Enter Last Name" />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Email address</label>
                                        <input type="email" className="form-control" id="emial" aria-describedby="emailHelp"
                                            placeholder="Enter email" />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Password</label>
                                        <input type="password" className="form-control" id="passwd" placeholder="Password" />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Confirm Password</label>
                                        <input type="password" className="form-control" id="cnpasswd" placeholder="Confirm Password" />
                                    </div>
                                </div>

                            </form>
                            <div className="modal-footer">
                                <button className="btn btn-light-danger" onClick={handleClose}>Close</button>
                                <button type="button" className="btn btn-light-primary">Save changes</button>
                            </div>
                        </Modal>
                    </div>
                </div>
            </CardHeader>
        </React.Fragment>
    )
}

export default CustomerModal
