import React,{useState} from 'react';
import { Card, CardBody, CardHeader, Col, Form } from 'react-bootstrap';
import { data } from '@common/JsonData';

const KeyboardActivation = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const handleSearchChange = (e: any) => {
        setSearchQuery(e.target.value);
    };
    const filteredData = data.filter((item) =>
        item.Name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <React.Fragment>
            <Col sm={12}>
                <Card>
                    <CardHeader>
                        <h5>Keyboard Activation</h5>
                        <small>Keyboard navigation is essential for fast navigation of a table operations and also for good accessibility. Buttons provides the ability to give each button a key binding</small>
                    </CardHeader>
                    <CardBody>
                        <div className="d-sm-flex align-items-center mb-2">
                            <button className='btn btn-secondary rounded-end-0' type='button' data-bs-toggle="modal" data-bs-target="#exampleModal">
                                Button1
                            </button>
                            <button className='btn btn-secondary rounded-start-0' type='button' data-bs-toggle="modal" data-bs-target="#exampleModal">
                                Button alt2
                            </button>
                            <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            ...
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                            <button type="button" className="btn btn-primary">Save changes</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
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

export default KeyboardActivation;
