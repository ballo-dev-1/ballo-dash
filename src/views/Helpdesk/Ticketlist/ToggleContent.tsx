import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import p1 from '@assets/images/admin/p1.jpg'
import avatar1 from '@assets/images/user/avatar-1.jpg'
import avatar5 from '@assets/images/user/avatar-5.jpg'
import lightBox1 from '@assets/images/light-box/sl1.jpg'
import lightBox2 from '@assets/images/light-box/sl2.jpg'
import lightBox5 from '@assets/images/light-box/sl5.jpg'
import lightBox6 from '@assets/images/light-box/sl6.jpg'
const SyntaxHighlighter = dynamic(() => import('react-syntax-highlighter') as Promise<{ default: any }>, {
    ssr: false,
}) as any;
// import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import dynamic from 'next/dynamic'

const ToggleContent = ({ display, handleDropDown, handleClickOutside, dropdownRef }: any) => {

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const code = `
    p {
        color: #1abc9c
    }
    `

    return (
        <React.Fragment>
            <div id="qviewModal" className={`modal fade  ${display === 25 ? "show" : ""}`} style={{ display: `${display === 25 ? 'block' : 'none'}`, zIndex: "9999" }} tabIndex={-1} role="dialog" aria-hidden="true"  >
                <div className="modal-dialog q-view-modal" role="document" ref={dropdownRef}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Chrome bug The page uses a roller to slide under a black block<span
                                className="badge bg-light-danger text-uppercase ms-2 f-12">Private</span></h5>
                            <button type="button" className={`btn-close ${display === 25 ? "show" : ""} `} style={{ display: `${display === 25 ? 'block' : 'none'}` }} data-bs-dismiss="modal" aria-label="Close" onClick={() => handleDropDown(null)}></button>
                        </div>
                        <div className="scroll-div position-relative" style={{ height: "calc(100vh - 90px)" }}>
                            <div className="modal-body border-bottom px-4">
                                <div className="row">
                                    <div className="col-md-7">
                                        <input type="button" className="badge bg-light-success me-1" /><i className="feather icon-check me-1"></i>
                                        Closed
                                        <p className="list-inline-item mb-0"><Image src={p1} alt=""
                                            className="wid-20 rounded me-1 img-fluid ms-2" />Alpha pro</p>
                                    </div>
                                    <div className="col-md-5 text-end">
                                        <p className="d-inline-block mb-0"><i
                                            className="wid-20 material-icons-two-tone text-center f-16 me-2">calendar_today</i><label
                                                className="mb-0">Jan,1st,2019</label></p>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-body border-bottom px-4">
                                <div className="row">
                                    <div className="col-auto">
                                        <Image className="media-object wid-60 img-radius" src={avatar5}
                                            alt="Generic placeholder image " style={{ height: "60px" }} />
                                    </div>
                                    <div className="col">
                                        <div className="alert alert-warning alert-dismissible fade show" role="alert">
                                            <strong>Note!</strong> This ticket is closed. If you want to re-open it, just post a
                                            reply below.
                                            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                        </div>
                                        <div id="tinymce-editor" style={{ height: "150px" }}>
                                            <p>hello..</p>
                                        </div>
                                        <div className="btn-block mt-3">
                                            <div className="btn-group me-2">
                                                <button type="button" className="btn btn-sm btn-light-primary">Primary</button>
                                                <button type="button" className="btn btn-sm btn-light-primary dropdown-toggle dropdown-toggle-split"
                                                    data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span className="sr-only">Toggle
                                                        Dropdown</span></button>
                                                <div className="dropdown-menu">
                                                    <a className="dropdown-item" href="#!">Action</a>
                                                    <a className="dropdown-item" href="#!">Another action</a>
                                                    <a className="dropdown-item" href="#!">Something else here</a>
                                                    <div className="dropdown-divider"></div>
                                                    <a className="dropdown-item" href="#!">Separated link</a>
                                                </div>
                                            </div>
                                            <label className="btn btn-sm btn-light-secondary" htmlFor="mod-flup">
                                                <i className="feather icon-paperclip me-1"></i> Add Atachment
                                            </label>
                                            <input type="file" name="file" className="d-none" id="mod-flup" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-body border-bottom px-4">
                                <div className="row align-items-center">
                                    <div className="col-auto">
                                        <Image className="media-object wid-60 img-radius" src={avatar5}
                                            alt="Generic placeholder image " style={{ height: "60px" }} />
                                    </div>
                                    <div className="col">
                                        <h6 className="mb-0">Support Agent name<span className="badge bg-light-secondary ms-2">Support
                                            Agent</span></h6>
                                        <label className="text-muted">5 Month ago</label>
                                    </div>
                                    <div className="col-auto">
                                        <ul className="list-unstyled mb-0">
                                            <li className="d-inline-block me-1"><a href="#"><i className="feather icon-edit text-muted"></i></a></li>
                                            <li className="d-inline-block"><a href="#"><i className="feather icon-trash-2 text-muted"></i></a></li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <p>hello John lui,</p>
                                    <p>you need to create <strong>"toolbar-options" div only once</strong> in a page in your code,
                                        this div fill found
                                        <strong>every "td"</strong> tag in your page, just remove those things.
                                    </p>
                                    <p>and also</p>
                                    <p>in option button add "<strong>p-0</strong>" className in "<strong>I</strong>" tag</p>
                                    <p>to</p>
                                    <p></p>
                                    <p>Thanks...</p>
                                </div>
                                <div className="code-toolbar">
                                    <pre className=" language-markup">
                                        <code className=" language-markup">
                                            <span className="token tag"><span className="token tag"><span className="token punctuation">&lt;</span>pre</span><span className="token punctuation">&gt;</span></span>
                                            <span className="token tag"><span className="token tag"><span className="token punctuation">&lt;</span>code</span> <span className="token attr-name">className</span><span className="token attr-value"><span className="token punctuation">=</span><span className="token punctuation">"</span>language-css<span className="token punctuation">"</span></span><span className="token punctuation">&gt;</span></span>
                                            <SyntaxHighlighter language='Javascript'
                                            // style={docco}
                                            >
                                                {code.trim()}
                                            </SyntaxHighlighter>
                                            <span className="token tag"><span className="token tag"><span className="token punctuation">&lt;/</span>code</span><span className="token punctuation">&gt;</span></span>
                                            <span className="token tag"><span className="token tag"><span className="token punctuation">&lt;/</span>pre</span><span className="token punctuation">&gt;</span></span>
                                        </code>
                                    </pre>
                                </div>
                            </div>
                            <div className="modal-body border-bottom px-4">
                                <div className="row align-items-center">
                                    <div className="col-auto">
                                        <Image className="media-object wid-60 img-radius" src={avatar1}
                                            alt="Generic placeholder image " style={{ height: "60px" }} />
                                    </div>
                                    <div className="col">
                                        <h6 className="mb-0">Support Agent name<span className="badge bg-light-secondary ms-2">Support
                                            Agent</span></h6>
                                        <label className="text-muted">5 Month ago</label>
                                    </div>
                                    <div className="col-auto">
                                        <ul className="list-unstyled mb-0">
                                            <li className="d-inline-block me-1"><a href="#"><i className="feather icon-edit text-muted"></i></a></li>
                                            <li className="d-inline-block"><a href="#"><i className="feather icon-trash-2 text-muted"></i></a></li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <p>hello John lui,</p>
                                    <p>you need to create <strong>"toolbar-options" div only once</strong> in a page in your code,
                                        this div fill found
                                        <strong>every "td"</strong> tag in your page, just remove those things.
                                    </p>
                                    <p>and also</p>
                                    <p>in option button add "<strong>p-0</strong>" className in "<strong>I</strong>" tag</p>
                                    <p>to</p>
                                    <p></p>
                                    <p>Thanks...</p>
                                </div>
                                <div className="row text-center mb-2">
                                    <div className="col-xl-2 col-lg-3 col-sm-4 col-6">
                                        <Image src={lightBox1} className="img-fluid m-b-10" alt="" />
                                    </div>
                                    <div className="col-xl-2 col-lg-3 col-sm-4 col-6">
                                        <Image src={lightBox2} className="img-fluid m-b-10" alt="" />
                                    </div>
                                    <div className="col-xl-2 col-lg-3 col-sm-4 col-6">
                                        <Image src={lightBox5} className="img-fluid m-b-10" alt="" />
                                    </div>
                                    <div className="col-xl-2 col-lg-3 col-sm-4 col-6">
                                        <Image src={lightBox6} className="img-fluid m-b-10" alt="" />
                                    </div>
                                    <div className="col-xl-2 col-lg-3 col-sm-4 col-6">
                                        <Image src={lightBox1} className="img-fluid m-b-10" alt="" />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-body border-bottom px-4">
                                <div className="row align-items-center">
                                    <div className="col-auto">
                                        <Image className="media-object wid-60 img-radius" src={avatar5}
                                            alt="Generic placeholder image " style={{ height: "60px" }} />
                                    </div>
                                    <div className="col">
                                        <h6 className="mb-0">Support Agent name<span className="badge bg-light-secondary ms-2">Support
                                            Agent</span></h6>
                                        <label className="text-muted">5 Month ago</label>
                                    </div>
                                    <div className="col-auto">
                                        <ul className="list-unstyled mb-0">
                                            <li className="d-inline-block me-1"><a href="#"><i className="feather icon-edit text-muted"></i></a></li>
                                            <li className="d-inline-block"><a href="#"><i className="feather icon-trash-2 text-muted"></i></a></li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <p>hello John lui,</p>
                                    <p>you need to create <strong>"toolbar-options" div only once</strong> in a page in your code,
                                        this div fill found
                                        <strong>every "td"</strong> tag in your page, just remove those things.
                                    </p>
                                    <p>and also</p>
                                    <p>in option button add "<strong>p-0</strong>" className in "<strong>I</strong>" tag</p>
                                    <p>to</p>
                                    <p></p>
                                    <p>Thanks...</p>
                                </div>
                                <div className="code-toolbar">
                                    <pre className=" language-markup">
                                        <code className=" language-markup">
                                            <span className="token tag"><span className="token tag"><span className="token punctuation">&lt;</span>pre</span><span className="token punctuation">&gt;</span></span>
                                            <span className="token tag"><span className="token tag"><span className="token punctuation">&lt;</span>code</span> <span className="token attr-name">className</span><span className="token attr-value"><span className="token punctuation">=</span><span className="token punctuation">"</span>language-css<span className="token punctuation">"</span></span><span className="token punctuation">&gt;</span></span>
                                            <SyntaxHighlighter language='Javascript'
                                            // style={docco}
                                            >
                                                {code.trim()}
                                            </SyntaxHighlighter>
                                            <span className="token tag"><span className="token tag"><span className="token punctuation">&lt;/</span>code</span><span className="token punctuation">&gt;</span></span>
                                            <span className="token tag"><span className="token tag"><span className="token punctuation">&lt;/</span>pre</span><span className="token punctuation">&gt;</span></span>
                                        </code>
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </React.Fragment>
    )
}

export default ToggleContent
