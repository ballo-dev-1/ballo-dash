import React from 'react'
import Masonry from "react-masonry-css";
import gallaryGrid2 from '@assets/images/gallery-grid/img-grd-gal-2.jpg'
import gallaryGrid7 from '@assets/images/gallery-grid/img-grd-gal-7.jpg'
import gallaryGrid12 from '@assets/images/gallery-grid/img-grd-gal-12.jpg'
import avatar2 from '@assets/images/user/avatar-2.jpg'
import Link from 'next/link';
import Image from 'next/image';


const GraphicDesigner = () => {

    const breakpointColumnsObj = {
        default: 4,
        768: 2,
    };

    return (
        <React.Fragment>
            <React.Fragment>
                <Masonry breakpointCols={breakpointColumnsObj} className="grid g-3 row" columnClassName="!w-full">
                    <div className="col-xxl-3 col-md-4 col-sm-6 element-item graphic" style={{ width: "auto", padding: "8px" }}>
                        <Link className="card-gallery" data-fslightbox="gallery" href='../../../assets/images/gallery-grid/img-grd-gal-2.jpg'>
                            <Image className="img-fluid" src={gallaryGrid2} alt="Card image" />
                            <div className="gallery-hover-data card-body">
                                <div className="position-relative text-end">
                                    <div className="form-check prod-likes d-inline-block">

                                        <i data-feather="heart" className="prod-likes-icon"></i>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center">
                                    <div className="flex-shrink-0">
                                        <div className="chat-avtar">
                                            <Image className="rounded-circle img-fluid wid-30" src={avatar2} alt="User image" />
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
                    <div className="col-xxl-3 col-md-4 col-sm-6 element-item graphic" style={{ width: "auto", padding: "8px" }}>
                        <Link className="card-gallery" data-fslightbox="gallery" href='../../../assets/images/gallery-grid/img-grd-gal-7.jpg'>
                            <Image className="img-fluid" src={gallaryGrid7} alt="Card image" />
                            <div className="gallery-hover-data card-body">
                                <div className="position-relative text-end">
                                    <div className="form-check prod-likes d-inline-block">

                                        <i data-feather="heart" className="prod-likes-icon"></i>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center">
                                    <div className="flex-shrink-0">
                                        <div className="chat-avtar">
                                            <Image className="rounded-circle img-fluid wid-30" src={avatar2} alt="User image" />
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
                    <div className="col-xxl-3 col-md-4 col-sm-6 element-item graphic" style={{ width: "auto", padding: "8px" }}>
                        <Link className="card-gallery" data-fslightbox="gallery" href='../../../assets/images/gallery-grid/img-grd-gal-12.jpg'>
                            <Image className="img-fluid" src={gallaryGrid12} alt="Card image" />
                            <div className="gallery-hover-data card-body">
                                <div className="position-relative text-end">
                                    <div className="form-check prod-likes d-inline-block">

                                        <i data-feather="heart" className="prod-likes-icon"></i>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center">
                                    <div className="flex-shrink-0">
                                        <div className="chat-avtar">
                                            <Image className="rounded-circle img-fluid wid-30" src={avatar2} alt="User image" />
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
        </React.Fragment>
    )
}

export default GraphicDesigner
