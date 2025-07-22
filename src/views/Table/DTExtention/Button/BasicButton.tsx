import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Col, Form } from 'react-bootstrap';
import { data } from '@common/JsonData';

const BasicButton = () => {
    const [searchQuery, setSearchQuery] = useState('');

    // Function to handle search query change
    const handleSearchChange = (e:any) => {
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
                        <h5>Custom Button</h5>
                        <small>The Buttons extension for DataTables provides a common set of options,</small>
                    </CardHeader>
                    <CardBody>
                        <div className="d-sm-flex align-items-center mb-2">
                            <button className='btn btn-secondary' type='button' data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={Alert}>
                                My Custom button
                            </button>
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
                                    {filteredData.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.Name}</td>
                                            <td>{item.position}</td>
                                            <td>{item.office}</td>
                                            <td>{item.age}</td>
                                            <td>{item.startDate}</td>
                                            <td>{item.salary}</td>
                                        </tr>
                                    ))}
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

export default BasicButton;
