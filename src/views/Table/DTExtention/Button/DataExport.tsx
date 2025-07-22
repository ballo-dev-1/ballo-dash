import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Col, Form } from 'react-bootstrap';
import { data } from '@common/JsonData';

const DataExport = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const handleSearchChange = (e: any) => {
        setSearchQuery(e.target.value);
    };
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
                        <h5>HTML5 Export Buttons</h5>
                        <small>This example demonstrates these four button types with their default options. The other examples in this section demonstrate some of the options available.</small>
                    </CardHeader>
                    <CardBody>
                        <div className="d-sm-flex align-items-center mb-2">
                            <button className='btn btn-secondary rounded-end-0' type='button' data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={Alert}>
                                Copy
                            </button>
                            <button className='btn btn-secondary rounded-0' type='button' data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={Alert}>
                                CSV
                            </button>
                            <button className='btn btn-secondary rounded-0' type='button' data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={Alert}>
                                Excel
                            </button>
                            <button className='btn btn-secondary rounded-start-0' type='button' data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={Alert}>
                                Print
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
                                    {filteredData.map((item: any, index: any) => {
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

export default DataExport;
