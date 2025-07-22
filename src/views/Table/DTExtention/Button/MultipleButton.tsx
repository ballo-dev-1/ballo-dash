import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Col, Form } from 'react-bootstrap';
import { data } from '@common/JsonData';

const MultipleButton = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const handleSearchChange = (e: any) => {
        setSearchQuery(e.target.value);
    };
    const filteredData = data.filter((item) =>
        item.Name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const Alert: any = () => {
        alert('Button 1 clicked on')
    };

    return (
        <React.Fragment>
            <Col sm={12}>
                <Card>
                    <CardHeader>
                        <h5>Multiple Button Groups</h5>
                        <small>Buttons' ability to have new instances constructed arbitrarily gives it the ability to have multiple button instances created for a single DataTable.</small>
                    </CardHeader>
                    <CardBody>
                        <div className="d-sm-flex align-items-center mb-2">
                            <button className='btn btn-secondary' type='button' data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={Alert}>
                                Button 1
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

export default MultipleButton;
