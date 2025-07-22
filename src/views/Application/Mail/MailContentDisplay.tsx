import React, { useState, useRef, useEffect } from 'react'
import avatar4 from '@assets/images/user/avatar-4.jpg'
import avatar1 from '@assets/images/user/avatar-1.jpg'
import { Card, CardBody } from 'react-bootstrap'
import Link from 'next/link'
import Image from 'next/image'

const MailContentDisplay = ({ content, setContant }: any) => {
    const [display, setDisplay] = useState(null)
    const dropdownRef = useRef(null)

    const handleDropDown = (id: any) => {
        if (display === id) {
            setDisplay(null)
        } else {
            setDisplay(id)
        }
    }
    const handleClickOutside = (event: any) => {
        if (
            dropdownRef.current &&
            !event.target.closest('.dropdown')
        ) {
            setDisplay(null);
        }
    };
    useEffect(() => {
        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <React.Fragment>
            <Card className="bg-transparent shadow-none mb-0" style={{ display: `${content === true ? 'block' : "none"}` }}>
                <div className="scroll-block">
                    <Card className="border mb-3">
                        <CardBody className="p-3">
                            <div className="d-sm-flex align-items-center">
                                <ul className="list-inline me-auto my-2">
                                    <li className="list-inline-item align-bottom">
                                        <Link href="#" className="avtar avtar-s btn-link-secondary" id="mail-back_inbox" onClick={() => setContant(false)}>
                                            <i className="ti ti-chevron-left f-18"></i>
                                        </Link>
                                    </li>
                                    <li className="list-inline-item align-bottom">
                                        <div className="d-flex align-items-center">
                                            <Image
                                                src={avatar1}
                                                alt="user-image"
                                                className="img-user rounded-circle setImage"
                                            />
                                            <div className="flex-grow-1 ms-2">
                                                <h5 className="mb-0 text-truncate">Matthew Hawkins</h5>
                                                <p className="mb-0 text-muted text-sm"> From: &lt;tazeanu@company.com&gt;</p>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                                <ul className="list-inline ms-auto my-2">
                                    <li className="list-inline-item text-muted">12 Jul 23 08:23 AM</li>
                                    <li className="list-inline-item">
                                        <div className="d-flex align-items-center">
                                            <div className="form-check form-check-inline m-0 pc-icon-checkbox">
                                                <input className="form-check-input" type="checkbox" />
                                                <i className="material-icons-two-tone pc-icon-uncheck">star_outline</i>
                                                <i className="material-icons-two-tone text-warning pc-icon-check">star</i>
                                            </div>
                                            <div className="form-check form-check-inline m-0 mx-3 pc-icon-checkbox">
                                                <input className="form-check-input" type="checkbox" defaultChecked />
                                                <i className="material-icons-two-tone pc-icon-uncheck">label</i>
                                                <i className="material-icons-two-tone text-secondary pc-icon-check">label</i>
                                            </div>
                                            <div className="form-check form-check-inline m-0 pc-icon-checkbox">
                                                <input className="form-check-input" type="checkbox" />
                                                <i className="material-icons-two-tone pc-icon-uncheck">new_releases</i>
                                                <i className="material-icons-two-tone text-danger pc-icon-check">new_releases</i>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="list-inline-item">
                                        <div className="dropdown">
                                            <Link
                                                ref={dropdownRef}
                                                className={`avtar avtar-s btn-link-secondary dropdown-toggle arrow-none ${display === 1 ? 'show' : ''}`}
                                                href="#"
                                                data-bs-toggle="dropdown"
                                                aria-haspopup="true"
                                                aria-expanded="false"
                                                onClick={() => handleDropDown(1)}
                                            >
                                                <i className="ti ti-dots f-18"></i>
                                            </Link>
                                            <div className={`dropdown-menu dropdown-end ${display === 1 ? 'show show2' : ''}`}>
                                                <Link className="dropdown-item" href="#" onClick={handleDropDown}>Name</Link>
                                                <Link className="dropdown-item" href="#" onClick={handleDropDown}>Date</Link>
                                                <Link className="dropdown-item" href="#" onClick={handleDropDown}>Ratting</Link>
                                                <Link className="dropdown-item" href="#" onClick={handleDropDown}>Unread</Link>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </CardBody>
                    </Card>
                    <div className="mail-details">
                        <h4><b>Lorem Ipsum is simply dummy text</b></h4>
                        <h5 className="mt-4 mb-3">Dear Martha Jenkins,</h5>
                        <p className="text-muted indent-text">Lorem Ipsum is simply dummy text of the printing and <b>typesetting industry</b>. Lorem Ipsum has been
                            the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type
                            and scrambled it to make a type <b>specimen book</b>. It has survived not only five centuries, but also
                            the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s
                            with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
                            publishing software like
                            <abbr title="Aldus PageMaker" className="initialism">Aldus PageMaker</abbr> including versions of Lorem
                            Ipsum
                        </p>
                        <p className="text-muted indent-text">It is a long established fact that a reader will be distracted by the readable content of a page when
                            looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution
                            of letters, as opposed to using 'Content here, content here', making it look like readable English. Many
                            desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a
                            search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have
                            evolved over the years, sometimes by accident, sometimes on purpose</p>
                        <p className="mt-5 mb-0">Kind Regards,</p>
                        <h5 className="mb-4">Jean Anderson</h5>
                        <hr className="my-3" />
                        <h5 className="mb-3"><b><i className="ti ti-paperclip me-2"></i> 3 Attachments</b></h5>
                        <ul className="list-inline">
                            <li className="list-inline-item">
                                <div className="card bg-body border">
                                    <div className="card-body p-3">
                                        <div className="d-flex align-items-center">
                                            <div className="flex-grow-1 me-2">
                                                <h5 className="mb-0 text-truncate">table_denar.pdf </h5>
                                            </div>
                                            <Link href="#" className="avtar avtar-xs btn-link-secondary text-secondary">
                                                <i className="ti ti-download f-16"></i>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li className="list-inline-item">
                                <div className="card bg-body border">
                                    <div className="card-body p-3">
                                        <div className="d-flex align-items-center">
                                            <div className="flex-grow-1 me-2">
                                                <h5 className="mb-0 text-truncate">handmade.mp2</h5>
                                            </div>
                                            <Link href="#" className="avtar avtar-xs btn-link-secondary text-secondary">
                                                <i className="ti ti-download f-16"></i>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <hr className="mb-3 mt-0" />
                        <div className="bg-light rounded p-3 my-3">
                            <div className="d-flex align-items-start mb-3">
                                <Image
                                    className="rounded-circle img-fluid wid-30"
                                    src={avatar4}
                                    alt="User image"
                                />
                                <div className="flex-grow-1 ms-3">
                                    <div className="d-flex align-items-center mb-3">
                                        <h5 className="mb-0 me-3">Barney Thea</h5>
                                        <p className="mb-0 text-muted text-sm"> &lt;tazeanu@company.com&gt;</p>
                                    </div>
                                    <p className="text-primary"
                                    >On Tue, Aug 1, 2023 at 12:05 AM Sreekumar Ks &lt;tazeanu@company.com&gt; wrote:</p>
                                    <p className="text-header mb-1">It is a long established fact that a reader will be distracted</p>
                                    <p className="text-header mb-1">by the readable content</p>
                                    <p className="text-header mb-1">of a page when</p>
                                    <p className="text-header mb-1">looking at</p>
                                    <p className="text-header mb-1">its layout.</p>
                                </div>
                            </div>
                        </div>
                        <button className="btn btn-light-primary" data-bs-toggle="collapse" data-bs-target="#mailreplay"
                        ><i className="align-text-bottom me-1 ti ti-arrow-back-up"></i> Reply</button>
                        <button className="btn btn-light-primary" data-bs-toggle="collapse" data-bs-target="#mailreplay"
                        ><i className="align-text-bottom me-1 ti ti-arrow-big-right"></i> Forward</button>
                        <div className="collapse" id="mailreplay">
                            <div className="my-3">
                                <div className="card">
                                    <div className="card-body">
                                        <div id="pc-quil-2" style={{ height: "125px" }}>
                                            <p>Put your things hear...</p>
                                        </div>
                                        <div className="mt-3 d-flex">
                                            <ul className="list-inline me-auto mb-0">
                                                <li className="list-inline-item align-bottom">
                                                    <Link href="#" className="avtar avtar-s btn-link-secondary">
                                                        <i className="ti ti-file-upload f-18"></i>
                                                    </Link>
                                                </li>
                                                <li className="list-inline-item align-bottom">
                                                    <Link href="#" className="avtar avtar-s btn-link-secondary">
                                                        <i className="ti ti-paperclip f-18"></i>
                                                    </Link>
                                                </li>
                                            </ul>
                                            <div className="flex-grow-1 text-end">
                                                <button className="btn btn-link-dark" data-bs-toggle="collapse" data-bs-target="#mailreplay">Cancel</button>
                                                <button className="btn btn-primary" data-bs-toggle="collapse" data-bs-target="#mailreplay">Reply</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </React.Fragment>
    )
}

export default MailContentDisplay
