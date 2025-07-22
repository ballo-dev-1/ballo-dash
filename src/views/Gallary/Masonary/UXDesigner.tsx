import React from 'react'
import Masonry from "react-masonry-css";
import Image from 'next/image';
import gallaryGrid4 from '@assets/images/gallery-grid/img-grd-gal-4.jpg'
import gallaryGrid9 from '@assets/images/gallery-grid/img-grd-gal-9.jpg'
import gallaryGrid14 from '@assets/images/gallery-grid/img-grd-gal-14.jpg'
import avatar4 from '@assets/images/user/avatar-4.jpg'
import { Col } from 'react-bootstrap';

const UXDesigner = () => {

    const breakpointColumnsObj = {
        default: 4,
        768: 2,
    };

    return (
        <React.Fragment>
            <Masonry breakpointCols={breakpointColumnsObj} className="grid g-3 row" columnClassName="">
                <Col xxl={3} md={4} sm={6} className="element-item uiux" style={{ width: "auto", padding: "8px" }}>
                    <a className="card-gallery" data-fslightbox="gallery" href='@assets/images/gallery-grid/img-grd-gal-4.jpg'>
                        <Image className="img-fluid" src={gallaryGrid4} alt="Card image" />
                        <div className="gallery-hover-data card-body">
                            <div className="position-relative text-end">
                                <div className="form-check prod-likes d-inline-block">

                                    <i data-feather="heart" className="prod-likes-icon"></i>
                                </div>
                            </div>
                            <div className="d-flex align-items-center">
                                <div className="flex-shrink-0">
                                    <div className="chat-avtar">
                                        <Image className="rounded-circle img-fluid wid-30" src={avatar4} alt="User image" />
                                    </div>
                                </div>
                                <div className="flex-grow-1 mx-2 text-white">
                                    <p className="mb-0 text-truncate w-100">Alexander</p>
                                    <span className="mb-0 text-sm text-truncate w-100">Photographer artist</span>
                                </div>
                            </div>
                        </div>
                    </a>
                </Col>
                <Col xxl={3} md={4} sm={6} className="element-item uiux" style={{ width: "auto", padding: "8px" }}>
                    <a className="card-gallery" data-fslightbox="gallery" href='@assets/images/gallery-grid/img-grd-gal-9.jpg'>
                        <Image className="img-fluid" src={gallaryGrid9} alt="Card image" />
                        <div className="gallery-hover-data card-body">
                            <div className="position-relative text-end">
                                <div className="form-check prod-likes d-inline-block">

                                    <i data-feather="heart" className="prod-likes-icon"></i>
                                </div>
                            </div>
                            <div className="d-flex align-items-center">
                                <div className="flex-shrink-0">
                                    <div className="chat-avtar">
                                        <Image className="rounded-circle img-fluid wid-30" src={avatar4} alt="User image" />
                                    </div>
                                </div>
                                <div className="flex-grow-1 mx-2 text-white">
                                    <p className="mb-0 text-truncate w-100">Alexander</p>
                                    <span className="mb-0 text-sm text-truncate w-100">Photographer artist</span>
                                </div>
                            </div>
                        </div>
                    </a>
                </Col>
                <Col xxl={3} md={4} sm={6} className="element-item uiux" style={{ width: "auto", padding: "8px" }}>
                    <a className="card-gallery" data-fslightbox="gallery" href='@assets/images/gallery-grid/img-grd-gal-14.jpg'>
                        <Image className="img-fluid" src={gallaryGrid14} alt="Card image" />
                        <div className="gallery-hover-data card-body">
                            <div className="position-relative text-end">
                                <div className="form-check prod-likes d-inline-block">

                                    <i data-feather="heart" className="prod-likes-icon"></i>
                                </div>
                            </div>
                            <div className="d-flex align-items-center">
                                <div className="flex-shrink-0">
                                    <div className="chat-avtar">
                                        <Image className="rounded-circle img-fluid wid-30" src={avatar4} alt="User image" />
                                    </div>
                                </div>
                                <div className="flex-grow-1 mx-2 text-white">
                                    <p className="mb-0 text-truncate w-100">Alexander</p>
                                    <span className="mb-0 text-sm text-truncate w-100">Photographer artist</span>
                                </div>
                            </div>
                        </div>
                    </a>
                </Col>
            </Masonry>
        </React.Fragment>
    )
}

export default UXDesigner
