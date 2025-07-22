import React,{useState} from 'react'
import { data } from '@common/JsonData'
import { Card, CardBody, CardHeader, Col } from 'react-bootstrap'

const LiveOrdering = () => {
    const [liveData,setLiveData]=useState({
        age:"",
        position:"",
       }) 
       const handLiveData=(e:any)=>{
        setLiveData({...liveData,[e.target.name]:e.target.value})
       }
    return (
        <React.Fragment>
            <Col sm={12}>
                <Card>
                    <CardHeader>
                        <h5>Live DOM Ordering</h5>
                        <small
                        >This example shows how you can use information available in the DOM to order columns. Typically DataTables will read
                            information to be ordered during its initialization phase</small>
                    </CardHeader>
                    <CardBody>
                        <div className="dt-responsive table-responsive">
                            <table id="dt-live-dom" className="table table-striped table-bordered nowrap">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Age</th>
                                        <th>Position</th>
                                        <th>Office</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data.map((item:any,index:any) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{item.Name}</td>
                                                    <td>
                                                        <input className="form-control" type="text"  id="row-1-age" name="age" value={liveData.age} onChange={handLiveData}/>
                                                    </td>
                                                    <td>
                                                        <input className="form-control" type="text" id="row-1-position" name="position" value={liveData.position} onChange={handLiveData}/>
                                                    </td>
                                                    <td>
                                                        <select className="form-select" size={1} id="row-1-office" name="row-1-office">
                                                            <option value="Edinburgh" selected> Edinburgh </option>
                                                            <option value="London"> London </option>
                                                            <option value="New York"> New York </option>
                                                            <option value="San Francisco"> San Francisco </option>
                                                            <option value="Tokyo"> Tokyo </option>
                                                        </select>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }

                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th>Name</th>
                                        <th>Age</th>
                                        <th>Position</th>
                                        <th>Office</th>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </CardBody>
                </Card>
            </Col>
        </React.Fragment>
    )
}

export default LiveOrdering
