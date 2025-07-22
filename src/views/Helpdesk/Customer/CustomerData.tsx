import React, { useState } from 'react';
import { Data } from './Data';
import Link from 'next/link';
import { Form } from 'react-bootstrap';

const CustomerData = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState(null);
    const [entriesPerPage, setEntriesPerPage] = useState(10); // State to manage number of entries per page

    // Function to handle sorting
    const handleSort = (key:any) => {
        if (sortBy === key) {
            setSortBy(null);
        } else {
            setSortBy(key);
        }
    };

    // Function to perform search filtering
    const filteredData = Data.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.account.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply sorting if sortBy is not null
    const sortedData = sortBy ? filteredData.slice().sort((a, b) => {
        if (a[sortBy] < b[sortBy]) return -1;
        if (a[sortBy] > b[sortBy]) return 1;
        return 0;
    }) : filteredData;

    // Get data for the current page based on entriesPerPage
    const paginatedData = sortedData.slice(0, entriesPerPage);

    return (
        <React.Fragment>
            <div className="d-sm-flex align-items-center mt-4">
                <ul className="list-inline me-auto my-1 ms-4">
                    <li className="list-inline-item">
                        <select 
                            className="form-select" 
                            value={entriesPerPage}
                            onChange={(e) => setEntriesPerPage(parseInt(e.target.value))}
                        >
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
                                className="ps-2 pe-3 pt-2 pb-3"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </form>
                    </li>
                </ul>
            </div>
            <div className="card-body border-0">
                <div className="table-responsive">
                    <table id="report-table" className="table table-bordered table-striped mb-0">
                        <thead>
                            <tr>
                                <th className="border-top-0" onClick={() => handleSort('name')}>Name</th>
                                <th className="border-top-0" onClick={() => handleSort('email')}>Email</th>
                                <th className="border-top-0" onClick={() => handleSort('account')}>Account</th>
                                <th className="border-top-0" onClick={() => handleSort('lastLogin')}>Last Login</th>
                                <th className="border-top-0"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.name}</td>
                                    <td><a href="#" className="link-secondary">{item.email}</a></td>
                                    <td>{item.account}</td>
                                    <td>{item.lastLogin}</td>
                                    <td>
                                        <Link href="#" className="btn btn-sm btn-light-success me-1"><i className="feather icon-edit"></i></Link>
                                        <Link href="#" className="btn btn-sm btn-light-danger"><i className="feather icon-trash-2"></i></Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </React.Fragment>
    );
}

export default CustomerData;
