import React from 'react'
import { OldPublishData } from './GridData'
import { Col } from 'react-bootstrap'
import Link from 'next/link'
import Image from 'next/image'

const OldPublish = () => {
    return (
        <React.Fragment>
            <div className="card">
                <div className="card-header">
                    <h5>Old Publish</h5>
                </div>
                <div className="card-body">
                    <div className="grid row g-3">
                        {OldPublishData.map((items: any, index: any) => {
                            return (
                                <Col key={index} xl={3} md={4}>
                                    <Link className="card-gallery" data-fslightbox="gallery" href={items.img}>
                                        <Image className="img-fluid" src={items.img} alt="Card image" />
                                        <div className="gallery-hover-data card-body justify-content-end">
                                            <div>
                                                <p className="text-white mb-0 text-truncate w-100">{items.type}</p>
                                                <span className="text-white text-opacity-75 mb-0 text-sm text-truncate w-100">{items.type}</span>
                                            </div>
                                        </div>
                                    </Link>
                                </Col>
                            )
                        })}
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default OldPublish
