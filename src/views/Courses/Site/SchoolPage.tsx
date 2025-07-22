import React, { useState } from 'react'
import { PagesData, ProductPages } from './PagesData'
import { Card, CardBody, CardHeader } from 'react-bootstrap'

const SchoolPage = () => {

    const [activeTab, setActiveTab] = useState('contactDetail');

    const handleTabClick = (tab: any, e: any) => {
        setActiveTab(tab);
        e.preventDefault();
    };

    return (
        <React.Fragment>
            <div className="tab-pane" id="finish">
                <Card className="table-card border shadow-none">
                    <CardHeader className="pb-0 pt-2">
                        <ul className="nav nav-tabs profile-tabs" id="myTab" role="tablist">
                            <li className="nav-item" role="presentation" data-target-form="#home-tab-pane">
                                <a className={`nav-link ${activeTab === 'home-tab' ? 'active' : ''}`} id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true" onClick={(e) => handleTabClick('home-tab', e)}>School Pages</a>
                            </li>
                            <li className="nav-item" role="presentation" data-target-form="#profile-tab-pane">
                                <a className={`nav-link ${activeTab === 'profile-tab' ? 'active' : ''}`} id='profile-tab' data-bs-toggle="tab" data-bs-target="#profile-tab-pane" type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false" onClick={(e) => handleTabClick('profile-tab', e)}>Product Pages</a>
                            </li>
                        </ul>
                    </CardHeader>
                    <CardBody className="pb-0">
                        <div className="tab-content" id="myTabContent">
                            {activeTab === 'home-tab' && (
                                <div className="tab-pane fade show active" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabIndex={0}>
                                    <div className="table-responsive">
                                        <table className="table table-hover mb-0">
                                            <thead>
                                                <tr>
                                                    <th>Page Title</th>
                                                    <th>URL</th>
                                                    <th>State</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(PagesData || []).map((item: any, key: any) => (
                                                    <tr key={key}>
                                                        <td>{item.title}</td>
                                                        <td>{item.url}</td>
                                                        <td><span className={item.color}>{item.state}</span></td>
                                                        <td>
                                                            <a href="#" className="avtar avtar-xs btn-link-secondary">
                                                                <i className="ti ti-eye f-20"></i>
                                                            </a>
                                                            <a href="#" className="avtar avtar-xs btn-link-secondary">
                                                                <i className="ti ti-edit f-20"></i>
                                                            </a>
                                                            <a href="#" className="avtar avtar-xs btn-link-secondary">
                                                                <i className="ti ti-trash f-20"></i>
                                                            </a>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                            {activeTab === 'profile-tab' && (
                                <div className="tab-pane fade show active" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabIndex={0}>
                                    <div className="table-responsive">
                                        <table className="table table-hover mb-0">
                                            <thead>
                                                <tr>
                                                    <th>Page Title</th>
                                                    <th>URL</th>
                                                    <th>State</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(ProductPages || []).map((item: any, key: any) => (
                                                    <tr key={key}>
                                                        <td>{item.title}</td>
                                                        <td>{item.url}</td>
                                                        <td><span className={item.color}>{item.state}</span></td>
                                                        <td>
                                                            <a href="#" className="avtar avtar-xs btn-link-secondary">
                                                                <i className="ti ti-eye f-20"></i>
                                                            </a>
                                                            <a href="#" className="avtar avtar-xs btn-link-secondary">
                                                                <i className="ti ti-edit f-20"></i>
                                                            </a>
                                                            <a href="#" className="avtar avtar-xs btn-link-secondary">
                                                                <i className="ti ti-trash f-20"></i>
                                                            </a>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardBody>
                </Card>
            </div>
        </React.Fragment>
    )
}



export default SchoolPage