import React from 'react'
import Masonry from "react-masonry-css";
import gallaryGrid5 from '@assets/images/gallery-grid/img-grd-gal-5.jpg'
import gallaryGrid10 from '@assets/images/gallery-grid/img-grd-gal-10.jpg'
import gallaryGrid15 from '@assets/images/gallery-grid/img-grd-gal-15.jpg'
import avatar5 from '@assets/images/user/avatar-5.jpg'
import Link from 'next/link';
import Image from 'next/image';
import { Col } from 'react-bootstrap';

const ProductDesigner = () => {

    const breakpointColumnsObj = {
        default: 4,
        768: 2,
    };

    return (
        <React.Fragment>
            <Masonry breakpointCols={breakpointColumnsObj} className="grid g-3 row" columnClassName="!w-full">
                <Col xxl={3} md={4} sm={6} className="element-item product" style={{ width: "auto", padding: "8px" }}>
                    <Link className="card-gallery" data-fslightbox="gallery" href='../.././assets/images/gallery-grid/img-grd-gal-5.jpg'>
                        <Image className="img-fluid" src={gallaryGrid5} alt="Card image" />
                        <div className="gallery-hover-data card-body">
                            <div className="position-relative text-end">
                                <div className="form-check prod-likes d-inline-block">

                                    <i data-feather="heart" className="prod-likes-icon"></i>
                                </div>
                            </div>
                            <div className="d-flex align-items-center">
                                <div className="flex-shrink-0">
                                    <div className="chat-avtar">
                                        <Image className="rounded-circle img-fluid wid-30" src={avatar5} alt="User image" />
                                    </div>
                                </div>
                                <div className="flex-grow-1 mx-2 text-white">
                                    <p className="mb-0 text-truncate w-100">Alexander</p>
                                    <span className="mb-0 text-sm text-truncate w-100">Photographer artist</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                </Col>
                <Col xxl={3} md={4} sm={6} className="element-item product" style={{ width: "auto", padding: "8px" }}>
                    <Link className="card-gallery" data-fslightbox="gallery" href='../../../assets/images/gallery-grid/img-grd-gal-10.jpg'>
                        <Image className="img-fluid" src={gallaryGrid10} alt="Card image" />
                        <div className="gallery-hover-data card-body">
                            <div className="position-relative text-end">
                                <div className="form-check prod-likes d-inline-block">

                                    <i data-feather="heart" className="prod-likes-icon"></i>
                                </div>
                            </div>
                            <div className="d-flex align-items-center">
                                <div className="flex-shrink-0">
                                    <div className="chat-avtar">
                                        <Image className="rounded-circle img-fluid wid-30" src={avatar5} alt="User image" />
                                    </div>
                                </div>
                                <div className="flex-grow-1 mx-2 text-white">
                                    <p className="mb-0 text-truncate w-100">Alexander</p>
                                    <span className="mb-0 text-sm text-truncate w-100">Photographer artist</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                </Col>
                <Col xxl={3} md={4} sm={6} className="col-xxl-3 col-md-4 col-sm-6 element-item product" style={{ width: "auto", padding: "8px" }}>
                    <Link className="card-gallery" data-fslightbox="gallery" href='../../../assets/images/gallery-grid/img-grd-gal-15.jpg'>
                        <Image className="img-fluid" src={gallaryGrid15} alt="Card image" />
                        <div className="gallery-hover-data card-body">
                            <div className="position-relative text-end">
                                <div className="form-check prod-likes d-inline-block">

                                    <i data-feather="heart" className="prod-likes-icon"></i>
                                </div>
                            </div>
                            <div className="d-flex align-items-center">
                                <div className="flex-shrink-0">
                                    <div className="chat-avtar">
                                        <Image className="rounded-circle img-fluid wid-30" src={avatar5} alt="User image" />
                                    </div>
                                </div>
                                <div className="flex-grow-1 mx-2 text-white">
                                    <p className="mb-0 text-truncate w-100">Alexander</p>
                                    <span className="mb-0 text-sm text-truncate w-100">Photographer artist</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                </Col>
            </Masonry>
        </React.Fragment>
    )
}

export default ProductDesigner
