import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Col, Dropdown, Form } from 'react-bootstrap';
import { data } from '@common/JsonData';

const ColumnSelect = () => {

    const [searchQuery, setSearchQuery] = useState('');

    // Function to handle search query change
    const handleSearchChange = (e: any) => {
        setSearchQuery(e.target.value);
    };

    // Filter data based on search query
    const filteredData = data.filter((item) =>
        item.Name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const Alert: any = () => {
        alert('Button activated')
    };

    return (
        <React.Fragment>
            <Col sm={12}>
                <Card>
                    <CardHeader>
                        <h5>Column Selectors</h5>
                        <small>All of the data export buttons have an exportOptions option which can be used to specify information about what data should be exported and how.</small>
                    </CardHeader>
                    <CardBody>
                        <div className="d-sm-flex align-items-center mb-2">
                            <button className='btn btn-secondary rounded-end-0' type='button' data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={Alert}>
                                Copy
                            </button>
                            <button className='btn btn-secondary rounded-0' type='button' data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={Alert}>
                                Excel
                            </button>
                            <button className='btn btn-secondary rounded-0' type='button' data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={Alert}>
                                PDF
                            </button>
                            <Dropdown>
                                <Dropdown.Toggle variant="secondary" id="dropdown-basic" className='rounded-start-0'>
                                    Dropdown Button
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item href="#/action-1">Name</Dropdown.Item>
                                    <Dropdown.Item href="#/action-2">Position</Dropdown.Item>
                                    <Dropdown.Item href="#/action-3">Office</Dropdown.Item>
                                    <Dropdown.Item href="#/action-3">Age</Dropdown.Item>
                                    <Dropdown.Item href="#/action-3">Start date</Dropdown.Item>
                                    <Dropdown.Item href="#/action-3">Salary</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            <ul className="list-inline ms-auto my-1">
                                <li className="list-inline-item">
                                    <form className="form-search">
                                        <i className="ph-duotone ph-magnifying-glass icon-search"></i>
                                        <Form.Control
                                            type="search"
                                            placeholder="Search Products"
                                            value={searchQuery}
                                            onChange={handleSearchChange}
                                        />
                                    </form>
                                </li>
                            </ul>
                        </div>
                        <div className="dt-responsive table-responsive">
                            <table id="autofill" className="table table-striped table-bordered nowrap">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Position</th>
                                        <th>Office</th>
                                        <th>Age</th>
                                        <th>Start date</th>
                                        <th>Salary</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        filteredData.map((item: any, index: any) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{item.Name}</td>
                                                    <td>{item.position}</td>
                                                    <td>{item.office}</td>
                                                    <td>{item.age}</td>
                                                    <td>{item.startDate}</td>
                                                    <td>{item.salary}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th>Name</th>
                                        <th>Position</th>
                                        <th>Office</th>
                                        <th>Age</th>
                                        <th>Start date</th>
                                        <th>Salary</th>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </CardBody>
                </Card>
            </Col>

        </React.Fragment>
    );
};

export default ColumnSelect;
