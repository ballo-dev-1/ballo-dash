import React from 'react'
import Masonry from "react-masonry-css";
import Image from 'next/image';

import gallaryGrid1 from '@assets/images/gallery-grid/img-grd-gal-1.jpg'
import gallaryGrid2 from '@assets/images/gallery-grid/img-grd-gal-2.jpg'
import gallaryGrid3 from '@assets/images/gallery-grid/img-grd-gal-3.jpg'
import gallaryGrid4 from '@assets/images/gallery-grid/img-grd-gal-4.jpg'
import gallaryGrid5 from '@assets/images/gallery-grid/img-grd-gal-5.jpg'
import gallaryGrid6 from '@assets/images/gallery-grid/img-grd-gal-6.jpg'
import gallaryGrid7 from '@assets/images/gallery-grid/img-grd-gal-7.jpg'
import gallaryGrid8 from '@assets/images/gallery-grid/img-grd-gal-8.jpg'
import gallaryGrid9 from '@assets/images/gallery-grid/img-grd-gal-9.jpg'
import gallaryGrid10 from '@assets/images/gallery-grid/img-grd-gal-10.jpg'
import gallaryGrid11 from '@assets/images/gallery-grid/img-grd-gal-11.jpg'
import gallaryGrid12 from '@assets/images/gallery-grid/img-grd-gal-12.jpg'
import gallaryGrid13 from '@assets/images/gallery-grid/img-grd-gal-13.jpg'
import gallaryGrid14 from '@assets/images/gallery-grid/img-grd-gal-14.jpg'
import gallaryGrid15 from '@assets/images/gallery-grid/img-grd-gal-15.jpg'
import gallaryGrid16 from '@assets/images/gallery-grid/img-grd-gal-16.jpg'

import avatar1 from '@assets/images/user/avatar-1.jpg'
import avatar2 from '@assets/images/user/avatar-2.jpg'
import avatar3 from '@assets/images/user/avatar-3.jpg'
import avatar4 from '@assets/images/user/avatar-4.jpg'
import avatar5 from '@assets/images/user/avatar-5.jpg'



const ShowAll = () => {


    const breakpointColumnsObj = {
        default: 4,
        768: 2,
    };

    return (
        <React.Fragment>
            <Masonry breakpointCols={breakpointColumnsObj} className="grid g-3 row" columnClassName="!w-full">
                <div className="col-xxl-3 col-md-4 col-sm-6 element-item web" style={{ width: "auto", padding: "5px" }}>
                    <a className="card-gallery" data-fslightbox="gallery" href='../../../assets/images/gallery-grid/img-grd-gal-1.jpg'>
                        <Image className="img-fluid" src={gallaryGrid1} alt="Card image" />
                        <div className="gallery-hover-data card-body">
                            <div className="position-relative text-end">
                                <div className="form-check prod-likes d-inline-block">

                                    <i data-feather="heart" className="prod-likes-icon"></i>
                                </div>
                            </div>
                            <div className="d-flex align-items-center">
                                <div className="flex-shrink-0">
                                    <div className="chat-avtar">
                                        <Image className="rounded-circle img-fluid wid-30" src={avatar1} alt="User image" />
                                    </div>
                                </div>
                                <div className="flex-grow-1 mx-2 text-white">
                                    <p className="mb-0 text-truncate w-100">Alexander</p>
                                    <span className="mb-0 text-sm text-truncate w-100">Photographer artist</span>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
                <div className="col-xxl-3 col-md-4 col-sm-6 element-item graphic" style={{ width: "auto", padding: "8px" }}>
                    <a className="card-gallery" data-fslightbox="gallery" href='../.././assets/images/gallery-grid/img-grd-gal-2.jpg'>
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
                    </a>
                </div>
                <div className="col-xxl-3 col-md-4 col-sm-6 element-item animation" style={{ width: "auto", padding: "8px" }}>
                    <a className="card-gallery" data-fslightbox="gallery" href='../../../assets/images/gallery-grid/img-grd-gal-3.jpg'>
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
                    </a>
                </div>
                <div className="col-xxl-3 col-md-4 col-sm-6 element-item uiux" style={{ width: "auto", padding: "8px" }}>
                    <a className="card-gallery" data-fslightbox="gallery" href='../../../assets/images/gallery-grid/img-grd-gal-4.jpg'>
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
                </div>
                <div className="col-xxl-3 col-md-4 col-sm-6 element-item product" style={{ width: "auto", padding: "8px" }}>
                    <a className="card-gallery" data-fslightbox="gallery" href='../../../assets/images/gallery-grid/img-grd-gal-5.jpg'>
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
                    </a>
                </div>
                <div className="col-xxl-3 col-md-4 col-sm-6 element-item web" style={{ width: "auto", padding: "8px" }}>
                    <a className="card-gallery" data-fslightbox="gallery" href='../.././assets/images/gallery-grid/img-grd-gal-6.jpg'>
                        <Image className="img-fluid" src={gallaryGrid6} alt="Card image" />
                        <div className="gallery-hover-data card-body">
                            <div className="position-relative text-end">
                                <div className="form-check prod-likes d-inline-block">

                                    <i data-feather="heart" className="prod-likes-icon"></i>
                                </div>
                            </div>
                            <div className="d-flex align-items-center">
                                <div className="flex-shrink-0">
                                    <div className="chat-avtar">
                                        <Image className="rounded-circle img-fluid wid-30" src={avatar1} alt="User image" />
                                    </div>
                                </div>
                                <div className="flex-grow-1 mx-2 text-white">
                                    <p className="mb-0 text-truncate w-100">Alexander</p>
                                    <span className="mb-0 text-sm text-truncate w-100">Photographer artist</span>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
                <div className="col-xxl-3 col-md-4 col-sm-6 element-item graphic" style={{ width: "auto", padding: "8px" }}>
                    <a className="card-gallery" data-fslightbox="gallery" href='@assets/images/gallery-grid/img-grd-gal-7.jpg'>
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
                    </a>
                </div>
                <div className="col-xxl-3 col-md-4 col-sm-6 element-item animation" style={{ width: "auto", padding: "8px" }}>
                    <a className="card-gallery" data-fslightbox="gallery" href='@assets/images/gallery-grid/img-grd-gal-8.jpg'>
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
                    </a>
                </div>
                <div className="col-xxl-3 col-md-4 col-sm-6 element-item uiux" style={{ width: "auto", padding: "8px" }}>
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
                </div>
                <div className="col-xxl-3 col-md-4 col-sm-6 element-item product" style={{ width: "auto", padding: "8px" }}>
                    <a className="card-gallery" data-fslightbox="gallery" href='@assets/images/gallery-grid/img-grd-gal-10.jpg'>
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
                    </a>
                </div>
                <div className="col-xxl-3 col-md-4 col-sm-6 element-item web" style={{ width: "auto", padding: "8px" }}>
                    <a className="card-gallery" data-fslightbox="gallery" href='@assets/images/gallery-grid/img-grd-gal-11.jpg'>
                        <Image className="img-fluid" src={gallaryGrid11} alt="Card image" />
                        <div className="gallery-hover-data card-body">
                            <div className="position-relative text-end">
                                <div className="form-check prod-likes d-inline-block">

                                    <i data-feather="heart" className="prod-likes-icon"></i>
                                </div>
                            </div>
                            <div className="d-flex align-items-center">
                                <div className="flex-shrink-0">
                                    <div className="chat-avtar">
                                        <Image className="rounded-circle img-fluid wid-30" src={avatar1} alt="User image" />
                                    </div>
                                </div>
                                <div className="flex-grow-1 mx-2 text-white">
                                    <p className="mb-0 text-truncate w-100">Alexander</p>
                                    <span className="mb-0 text-sm text-truncate w-100">Photographer artist</span>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
                <div className="col-xxl-3 col-md-4 col-sm-6 element-item graphic" style={{ width: "auto", padding: "8px" }}>
                    <a className="card-gallery" data-fslightbox="gallery" href='@assets/images/gallery-grid/img-grd-gal-12.jpg'>
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
                    </a>
                </div>
                <div className="col-xxl-3 col-md-4 col-sm-6 element-item animation" style={{ width: "auto", padding: "8px" }}>
                    <a className="card-gallery" data-fslightbox="gallery" href='@assets/images/gallery-grid/img-grd-gal-13.jpg'>
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
                    </a>
                </div>
                <div className="col-xxl-3 col-md-4 col-sm-6 element-item uiux" style={{ width: "auto", padding: "8px" }}>
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
                </div>
                <div className="col-xxl-3 col-md-4 col-sm-6 element-item product" style={{ width: "auto", padding: "8px" }}>
                    <a className="card-gallery" data-fslightbox="gallery" href='@assets/images/gallery-grid/img-grd-gal-15.jpg'>
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
                    </a>
                </div>
                <div className="col-xxl-3 col-md-4 col-sm-6 element-item web" style={{ width: "auto", padding: "8px" }}>
                    <a className="card-gallery" data-fslightbox="gallery" href='@assets/images/gallery-grid/img-grd-gal-16.jpg'>
                        <Image className="img-fluid" src={gallaryGrid16} alt="Card image" />
                        <div className="gallery-hover-data card-body">
                            <div className="position-relative text-end">
                                <div className="form-check prod-likes d-inline-block">

                                    <i data-feather="heart" className="prod-likes-icon"></i>
                                </div>
                            </div>
                            <div className="d-flex align-items-center">
                                <div className="flex-shrink-0">
                                    <div className="chat-avtar">
                                        <Image className="rounded-circle img-fluid wid-30" src={avatar1} alt="User image" />
                                    </div>
                                </div>
                                <div className="flex-grow-1 mx-2 text-white">
                                    <p className="mb-0 text-truncate w-100">Alexander</p>
                                    <span className="mb-0 text-sm text-truncate w-100">Photographer artist</span>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
            </Masonry>
        </React.Fragment>
    )
}

export default ShowAll
