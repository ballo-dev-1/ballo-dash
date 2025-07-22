import React, { useState,ReactElement } from 'react'
import Layout from '@layout/index'
import BreadcrumbItem from '@common/BreadcrumbItem'
import { TeachersListData } from '@views/Courses/Teachers/TeachersListData'
import { Card, CardBody, CardHeader, Form } from 'react-bootstrap'
import Image from 'next/image'

const StudentList = () => {
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
            <BreadcrumbItem mainTitle="Online Courses" subTitle="Student List" />
            <div className="col-12 my-4">
                <Card>
                    <CardHeader>
                        <div className="d-sm-flex align-items-center justify-content-between">
                            <h5 className="mb-3 mb-sm-0">Student list</h5>
                            <div>
                                <a href="../admins/course-teacher-apply.html" className="btn btn-outline-secondary">Apply Teacher List</a>&nbsp;
                                <a href="../admins/course-teacher-add.html" className="btn btn-primary">Add Teacher</a>
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
                    <CardBody>
                        <div className="table-responsive">
                            <table className="table table-hover" id="pc-dt-simple">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Departments</th>
                                        <th>Qualification</th>
                                        <th>Email</th>
                                        <th>Addmision Date</th>
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
                                            <td>{item.email}</td>
                                            <td>{item.date}</td>
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
StudentList.getLayout = (page: ReactElement) => {
    return (
        <Layout>
            {page}
        </Layout>
    )
}
export default StudentList;