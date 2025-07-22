import React, { useState } from 'react'
import { TeamMemberData } from '@common/JsonData/Application/Team';
import { Col, Form, Row } from 'react-bootstrap'
import Image from 'next/image';

const TeamMember = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);

    const handleSearchChange = (e: any) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset page to 1 when search query changes
    };

    const handleEntriesPerPageChange = (e: any) => {
        setEntriesPerPage(parseInt(e.target.value));
        setCurrentPage(1); // Reset page to 1 when entries per page changes
    };

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const filteredData = TeamMemberData.filter((item) =>
        item.field.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredData.length / entriesPerPage);
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentEntries = filteredData.slice(indexOfFirstEntry, indexOfLastEntry);

    const goToPreviousPage = () => {
        setCurrentPage((prevPage) => prevPage - 1);
    };

    const goToNextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    return (
        <React.Fragment>
            <div className="d-sm-flex align-items-center mb-2">
                <ul className="list-inline me-auto my-1 ms-4">
                    <li className="list-inline-item">
                        <select className="form-select" style={{ paddingRight: "80px" }} onChange={handleEntriesPerPageChange}>
                            <option>10</option>
                            <option>25</option>
                            <option>50</option>
                            <option>100</option>
                        </select>
                    </li>
                    <span> entries per page</span>
                </ul>
                <ul className="list-inline ms-auto my-1 me-4">
                    <li className="list-inline-item">
                        <form className="form-search">
                            <Form.Control type="search"
                                placeholder="Search Products"
                                onChange={handleSearchChange}
                            />
                        </form>
                    </li>
                </ul>
            </div>
            <div className="card-body table-card">
                <table className="table tbl-product" id="pc-dt-simple">
                    <thead>
                        <tr>
                            <th className="text-end">id</th>
                            <th>Name</th>
                            <th>Organization</th>
                            <th>Team Leader</th>
                            <th>Members</th>
                            <th>Location</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            currentEntries.map((item: any, index: any) => {
                                return (
                                    <tr key={index}>
                                        <td className="text-end">{item.id}</td>
                                        <td>
                                            <Row>
                                                <div className="col-auto pe-0">
                                                    <div className={`${item.logoColor}`}>
                                                        <i className={`${item.logo}`}></i>
                                                    </div>
                                                </div>
                                                <Col>
                                                    <h6 className="mb-1">{item.field}</h6>
                                                    <a className="text-muted f-12 text-hover-primary" href="mailto:demo@mail.com">{item.email}</a>
                                                </Col>
                                            </Row>
                                        </td>
                                        <td><a className="text-muted text-hover-primary" href="#">{item.organization}</a></td>
                                        <td>
                                            <Row className="align-items-center">
                                                <div className="col-auto pe-0">
                                                    <Image src={item.teamLeaderImg} alt="user-image" className="wid-40 rounded setImage" />
                                                </div>
                                                <Col>
                                                    <h6 className="mb-0">Carson Darrin</h6>
                                                </Col>
                                            </Row>
                                        </td>
                                        <td>
                                            <div className="user-group">
                                                <Image src={item.teamMemberImg.img1} alt="user-image" className="avtar setImage" data-bs-toggle="tooltip" data-bs-title="John Doe" />
                                                <Image src={item.teamMemberImg.img2} alt="user-image" className="avtar setImage" data-bs-toggle="tooltip" data-bs-title="Keefs" />
                                                <Image src={item.teamMemberImg.img3} alt="user-image" className="avtar setImage" data-bs-toggle="tooltip" data-bs-title="Lazaro" />
                                                <Image src={item.teamMemberImg.img1} alt="user-image" className="avtar setImage" data-bs-toggle="tooltip" data-bs-title="Adeline" />
                                                <span className="avtar rounded-circle bg-light-primary text-primary">{item.teamMemberImg.add}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span>{item.location}</span>
                                            <div className="prod-action-links">
                                                <ul className="list-inline me-auto mb-0">
                                                    <li className="list-inline-item align-bottom" data-bs-toggle="tooltip" title="View">
                                                        <a
                                                            href="#"
                                                            className="avtar avtar-xs btn-link-warning btn-pc-default"
                                                            data-bs-toggle="offcanvas"
                                                            data-bs-target="#productOffcanvas"
                                                        >
                                                            <i className="ti ti-eye f-18"></i>
                                                        </a>
                                                    </li>
                                                    <li className="list-inline-item align-bottom" data-bs-toggle="tooltip" title="Edit">
                                                        <a href="#!" className="avtar avtar-xs btn-link-success btn-pc-default">
                                                            <i className="ti ti-edit-circle f-18"></i>
                                                        </a>
                                                    </li>
                                                    <li className="list-inline-item align-bottom" data-bs-toggle="tooltip" title="Delete">
                                                        <a href="#" className="avtar avtar-xs btn-link-danger btn-pc-default">
                                                            <i className="ti ti-trash f-18"></i>
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        }

                    </tbody>
                </table>
            </div>
            <nav>
                <ul className="pagination justify-content-end me-3">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={goToPreviousPage}>
                            Previous
                        </button>
                    </li>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                                {index + 1}
                            </button>
                        </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={goToNextPage}>
                            Next
                        </button>
                    </li>
                </ul>
            </nav>
        </React.Fragment>
    )
}

export default TeamMember
