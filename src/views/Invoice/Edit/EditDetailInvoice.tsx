import React, { useState } from 'react'
import { Col } from 'react-bootstrap'
import Link from 'next/link'

const EditDetailInvoice = () => {

  const [data,setData]=useState({
    discount:"0.5",
    taxes:"0.2",
    note:""
  })
  const [items1, setItems1] = useState(
    { id1: 1, name1: 'Apple Series 4 GPS A38 MM Space', description1: 'Apple Watch SE Smartwatch', qty1: 3, price1: 275.00 },
    );
  const [items2, setItems2] = useState(
    { id2: 2, name2: 'Boat On-Ear Wireless', description2: 'Mic Bluetooth 4.2, Rockerz 450R', qty2: 45, price2: 81.99 },
  );

  const [items3, setItems3] = useState(
    { id3: 3, name3: 'Fitbit MX30 Smart Watch', description3: '(MX30- waterproof) watch', qty3: 70, price3: 85.00 }
  );

  const handleItems=(e:any)=>{
    setItems1({...items1,[e.target.name]:e.target.value})
    setItems2({...items2,[e.target.name]:e.target.value})
    setItems3({...items3,[e.target.name]:e.target.value})
  }

  const handleData=(e:any)=>{
    setData({...data,[e.target.name]:e.target.value})
  }

  return (


    <React.Fragment>

      <Col>
        <h5>Detail</h5>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th>#</th>
                <th><span className="text-danger">*</span>Name</th>
                <th><span className="text-danger">*</span>Description</th>
                <th><span className="text-danger">*</span>Qty</th>
                <th>Price</th>
                <th>Total Amount</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td><input type="text" className="form-control" placeholder="Name" name="name" value={items1.name1} onChange={handleItems}/></td>
                <td><input type="text" className="form-control" placeholder="Description" name="description" value={items1.description1} onChange={handleItems}/></td>
                <td><input type="number" className="form-control" placeholder="Qty" value={items1.qty1} name="qty" onChange={handleItems}/></td>
                <td><input type="number" className="form-control" placeholder="Price" value={items1.price1} name="price" onChange={handleItems}/></td>
                <td>₹825.00</td>
                <td className="text-center">
                  <Link href="#" className="avtar avtar-s btn-link-danger btn-pc-default"><i className="ti ti-trash f-20"></i></Link>
                </td>
              </tr>
              <tr>
                <td>2</td>
                <td><input type="text" className="form-control" placeholder="Name" name="name" value={items2.name2} onChange={handleItems}/></td>
                <td><input type="text" className="form-control" placeholder="Description" name="description" value={items2.description2} onChange={handleItems}/></td>
                <td><input type="number" className="form-control" placeholder="Qty" value={items2.qty2} name="qty" onChange={handleItems}/></td>
                <td><input type="number" className="form-control" placeholder="Price" value={items2.price2} name='price' onChange={handleItems}/></td>
                <td>₹3689.55</td>
                <td className="text-center">
                  <Link href="#" className="avtar avtar-s btn-link-danger btn-pc-default"><i className="ti ti-trash f-20"></i></Link>
                </td>
              </tr>
              <tr>
                <td>3</td>
                <td><input type="text" className="form-control" placeholder="Name" name="name" value={items3.name3} onChange={handleItems}/></td>
                <td><input type="text" className="form-control" placeholder="Description" name="description" value={items3.description3} onChange={handleItems}/></td>
                <td><input type="number" className="form-control" placeholder="Qty" name="qty" value={items3.qty3} onChange={handleItems}/></td>
                <td><input type="number" className="form-control" placeholder="Price" name="price" value={items3.price3} onChange={handleItems}/></td>
                <td>₹5950.00</td>
                <td className="text-center">
                  <Link href="#" className="avtar avtar-s btn-link-danger btn-pc-default"><i className="ti ti-trash f-20"></i></Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="text-start">
          <hr className="mb-4 mt-0 border-secondary border-opacity-50" />
          <button className="btn btn-light-primary d-flex align-items-center gap-2"><i className="ti ti-plus"></i> Add new item</button>
        </div>
      </Col>
      <div className="col-12">
        <div className="invoice-total ms-auto">
          <div className="row">
            <div className="col-6">
              <div className="mb-3">
                <label className="form-label">Discount(%)</label>
                <input type="text" className="form-control" name="discount" value={data.discount} onChange={handleData}/>
              </div>
            </div>
            <div className="col-6">
              <div className="mb-3">
                <label className="form-label">Taxes(%)</label>
                <input type="text" className="form-control" name="text" value={data.taxes} onChange={handleData}/>
              </div>
            </div>
            <div className="col-6"> <p className="text-muted mb-1 text-start">Sub Total :</p></div>
            <div className="col-6"> <p className="f-w-600 mb-1 text-end">$20.00</p></div>
            <div className="col-6"> <p className="text-muted mb-1 text-start">Discount :</p></div>
            <div className="col-6"> <p className="f-w-600 mb-1 text-end text-success">$10.00</p></div>
            <div className="col-6"> <p className="text-muted mb-1 text-start">Taxes :</p></div>
            <div className="col-6"> <p className="f-w-600 mb-1 text-end">$5.000</p></div>
            <div className="col-6"> <p className="f-w-600 mb-1 text-start">Grand Total :</p></div>
            <div className="col-6"> <p className="f-w-600 mb-1 text-end">$25.00</p></div>
          </div>
        </div>
      </div>
      <div className="col-12">
        <div className="mb-0">
          <label className="form-label">Note</label>
          <textarea className="form-control" name="note"  rows={3} placeholder="Note" value={data.note} onChange={handleData}></textarea>
        </div>
      </div>
      <div className="col-12">
        <div className="row align-items-end justify-content-between g-3">
          <div className="col-sm-auto">
            <label className="form-label">Set Currency*</label>
            <select className="form-select w-auto">
              <option>USD (US Dollar)</option>
              <option>INR (Rupes)</option>
            </select>
          </div>
          <div className="col-sm-auto btn-page">
            <Link href="/admins/invoice-view" className="btn btn-outline-secondary">Preview</Link>
            <button className="btn btn-primary">Update & Send</button>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default EditDetailInvoice
