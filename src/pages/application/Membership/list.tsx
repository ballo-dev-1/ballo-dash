import React, { useState,ReactElement } from 'react'
import BreadcrumbItem from '@common/BreadcrumbItem'
import ListData from '@views/Membership/List/ListData'
import { Row, Card, CardBody, CardHeader, Form } from 'react-bootstrap'
import Link from 'next/link'
import Image from 'next/image'
import Layout from '@layout/index'

const List = () => {
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

    const filteredData = ListData.filter((item) =>
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
            <BreadcrumbItem mainTitle="Membership" subTitle="Membership List" />
            <Row>
                <div className="col-12">
                    <Card className="table-card">
                        <CardHeader >
                            <h5>Membership list</h5>
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
                        <CardBody className='pt-3'>
                            <div className="table-responsive">
                                <table className="table table-hover" id="pc-dt-simple">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Mobile</th>
                                            <th>Start Date</th>
                                            <th>Status</th>
                                            <th>Plan</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentEntries.map((item: any, index: number) => {
                                            return (
                                                <tr key={index}>
                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            <div className="flex-shrink-0">
                                                                <Image src={item.images} alt="user image" className="img-radius wid-40" style={{height:"40px",width:"40px"}} />
                                                            </div>
                                                            <div className="flex-grow-1 ms-3">
                                                                <h6 className="mb-0">{item.name}</h6>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>{item.mobile_no}</td>
                                                    <td>{item.start_date} <span className="text-muted text-sm d-block">{item.time}</span></td>
                                                    <td className={item.textColor}><i className="fas fa-circle f-10 m-r-10"></i>{item.status}</td>
                                                    <td><span className={`badge ${item.color}`}>{item.plan}</span></td>
                                                    <td>
                                                        <Link href="#" className="avtar avtar-xs btn-link-secondary">
                                                            <i className="ti ti-eye f-20"></i>
                                                        </Link>
                                                        <Link href="#" className="avtar avtar-xs btn-link-secondary">
                                                            <i className="ti ti-edit f-20"></i>
                                                        </Link>
                                                        <Link href="#" className="avtar avtar-xs btn-link-secondary">
                                                            <i className="ti ti-trash f-20"></i>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            )
                                        })}
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
                        </CardBody>
                    </Card>
                </div>
            </Row>
        </React.Fragment>
    )
}
List.getLayout = (page: ReactElement) => {
    return (
        <Layout>
            {page}
        </Layout>
    )
}

export default List
