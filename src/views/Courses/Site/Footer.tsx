import React, { useState } from 'react'

const Footer = () => {
    return (
        <React.Fragment>
            <div className="d-sm-flex wizard justify-content-between mt-3">
                <div className="#first">
                    <a href="#" className="btn btn-secondary">
                        First
                    </a>
                </div>
                <div className="d-sm-flex ">
                    <div className="previous me-2">
                        <a href="#" className="btn btn-secondary mt-3 mt-md-0">
                            Back To Previous
                        </a>
                    </div>
                    <div className="next">
                        <a href="#" className="btn btn-secondary mt-3 mt-md-0">
                            Next Step
                        </a>
                    </div>
                </div>
                <div className="last">
                    <a href="#" className="btn btn-secondary mt-3 mt-md-0">
                        Finish
                    </a>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Footer