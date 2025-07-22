import React, { useState,ReactElement } from 'react'
import Layout from '@layout/index'
import BreadcrumbItem from '@common/BreadcrumbItem'
import { TeachersListData } from '@views/Courses/Teachers/TeachersListData'
import { Card, CardBody, CardHeader, Form } from 'react-bootstrap'
import Link from 'next/link'
import Image from 'next/image'

const StudentApply = () => {
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

    const filteredData = TeachersListData.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
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
            <BreadcrumbItem mainTitle="Online Courses" subTitle="Student Apply" />
            <div className="col-12 mt-4">
                <Card className="table-card">
                    <CardHeader>
                        <div className="d-sm-flex align-items-center justify-content-between">
                            <h5 className="mb-3 mb-sm-0">Apply Student list</h5>
                            <div>
                                <Link href="../admins/course-teacher-apply.html" className="btn btn-outline-secondary">Apply Student List</Link>&nbsp;
                                <Link href="../admins/course-teacher-add.html" className="btn btn-primary">Add Student</Link>
                            </div>
                        </div>
                    </CardHeader>
                    <div className="d-sm-flex align-items-center mt-4">
                        <ul className="list-inline me-auto my-1 ms-4">
                            <li className="list-inline-item">
                                <select className="form-select" onChange={handleEntriesPerPageChange}>
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="20">20</option>
                                    <option value="30">30</option>
                                    <option value="40">40</option>
                                </select>
                            </li>
                            <span> entries per page</span>
                        </ul>
                        <ul className="list-inline ms-auto my-1 me-4">
                            <li className="list-inline-item">
                                <form className="form-search">
                                    <Form.Control
                                        type="search"
                                        placeholder="Search...."
                                        onChange={handleSearchChange}
                                    />
                                </form>
                            </li>
                        </ul>
                    </div>
                    <CardBody className="pt-3">
                        <div className="table-responsive">
                            <table className="table table-hover" id="pc-dt-simple">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Departments</th>
                                        <th>Qualification</th>
                                        <th>Email</th>
                                        <th>Date/Time</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(currentEntries || []).map((item, key) => (
                                        <tr key={key}>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="flex-shrink-0">
                                                        <Image src={item.img} alt="user image" className="img-radius wid-40 setImage" />
                                                    </div>
                                                    <div className="flex-grow-1 ms-3">
                                                        <h6 className="mb-0">{item.name}</h6>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{item.department}</td>
                                            <td>{item.qualification}</td>
                                            <td>{item.mobile}</td>
                                            <td>{item.date}<span className="text-muted text-sm d-block">09:05 PM</span></td>
                                            <td>
                                                <a href="#" className="avtar avtar-xs btn-light-success">
                                                    <i className="ti ti-check f-20"></i>
                                                </a>&nbsp;
                                                <a href="#" className="avtar avtar-xs btn-light-danger">
                                                    <i className="ti ti-x f-20"></i>
                                                </a>&nbsp;
                                                <a href="#" className="avtar avtar-xs btn-light-secondary">
                                                    <i className="ti ti-dots-vertical f-20"></i>
                                                </a>&nbsp;
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
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
                    </CardBody>
                </Card>
            </div>
        </React.Fragment>
    )
}
StudentApply.getLayout = (page: ReactElement) => {
    return (
        <Layout>
            {page}
        </Layout>
    )
}
export default StudentApply