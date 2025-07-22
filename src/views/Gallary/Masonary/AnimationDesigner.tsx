import React from 'react'
import gallaryGrid3 from '@assets/images/gallery-grid/img-grd-gal-3.jpg'
import gallaryGrid8 from '@assets/images/gallery-grid/img-grd-gal-8.jpg'
import gallaryGrid13 from '@assets/images/gallery-grid/img-grd-gal-13.jpg'
import avatar3 from '@assets/images/user/avatar-3.jpg'
import Link from 'next/link';
import Image from 'next/image';
import Masonry from "react-masonry-css";



const AnimationDesigner = () => {

    const breakpointColumnsObj = {
        default: 4,
        768: 2,
    };

    return (
        <React.Fragment>
            <Masonry breakpointCols={breakpointColumnsObj} className="grid g-3 row" columnClassName="!w-full">
                <div className="col-xxl-3 col-md-4 col-sm-6 element-item animation" style={{ width: "auto", padding: "8px" }}>
                    <Link className="card-gallery" data-fslightbox="gallery" href='../../../assets/images/gallery-grid/img-grd-gal-3.jpg'>
                        <Image className="img-fluid" src={gallaryGrid3} alt="Card image" />
                        <div className="gallery-hover-data card-body">
                            <div className="position-relative text-end">
                                <div className="form-check prod-likes d-inline-block">

                                    <i data-feather="heart" className="prod-likes-icon"></i>
                                </div>
                            </div>
                            <div className="d-flex align-items-center">
                                <div className="flex-shrink-0">
                                    <div className="chat-avtar">
                                        <Image className="rounded-circle img-fluid wid-30" src={avatar3} alt="User image" />
                                    </div>
                                </div>
                                <div className="flex-grow-1 mx-2 text-white">
                                    <p className="mb-0 text-truncate w-100">Alexander</p>
                                    <span className="mb-0 text-sm text-truncate w-100">Photographer artist</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
                <div className="col-xxl-3 col-md-4 col-sm-6 element-item animation" style={{ width: "auto", padding: "8px" }}>
                    <Link className="card-gallery" data-fslightbox="gallery" href='../../../assets/images/gallery-grid/img-grd-gal-8.jpg'>
                        <Image className="img-fluid" src={gallaryGrid8} alt="Card image" />
                        <div className="gallery-hover-data card-body">
                            <div className="position-relative text-end">
                                <div className="form-check prod-likes d-inline-block">

                                    <i data-feather="heart" className="prod-likes-icon"></i>
                                </div>
                            </div>
                            <div className="d-flex align-items-center">
                                <div className="flex-shrink-0">
                                    <div className="chat-avtar">
                                        <Image className="rounded-circle img-fluid wid-30" src={avatar3} alt="User image" />
                                    </div>
                                </div>
                                <div className="flex-grow-1 mx-2 text-white">
                                    <p className="mb-0 text-truncate w-100">Alexander</p>
                                    <span className="mb-0 text-sm text-truncate w-100">Photographer artist</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
                <div className="col-xxl-3 col-md-4 col-sm-6 element-item animation" style={{ width: "auto", padding: "8px" }}>
                    <Link className="card-gallery" data-fslightbox="gallery" href="../../../assets/images/gallery-grid/img-grd-gal-13.jpg">
                        <Image className="img-fluid" src={gallaryGrid13} alt="Card image" />
                        <div className="gallery-hover-data card-body">
                            <div className="position-relative text-end">
                                <div className="form-check prod-likes d-inline-block">

                                    <i data-feather="heart" className="prod-likes-icon"></i>
                                </div>
                            </div>
                            <div className="d-flex align-items-center">
                                <div className="flex-shrink-0">
                                    <div className="chat-avtar">
                                        <Image className="rounded-circle img-fluid wid-30" src={avatar3} alt="User image" />
                                    </div>
                                </div>
                                <div className="flex-grow-1 mx-2 text-white">
                                    <p className="mb-0 text-truncate w-100">Alexander</p>
                                    <span className="mb-0 text-sm text-truncate w-100">Photographer artist</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            </Masonry>
        </React.Fragment>
    )
}

export default AnimationDesigner
