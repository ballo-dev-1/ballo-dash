import React from 'react';
import visitor from '../../../assets/images/widget/img-visitor.png';
import Image from 'next/image';

const OtherWidgets = () => {
  return (
    <React.Fragment>
      <div className="col-md-12 col-xl-4">
        <div className="card overflow-hidden">
          <div className="card-body bg-light-primary">
            <div className="row align-items-center">
              <div className="col-6">
                <p className="text-muted mb-1">Total Visitors</p>
                <div className="d-flex align-items-center mb-1">
                  <h4 className="mb-0">235</h4>
                  <span className="badge bg-primary ms-2">20%</span>
                </div>
                <p className="text-primary text-sm mb-0">More than last Month</p>
              </div>
              <div className="col-6">
                <Image src={visitor} alt="img" className="img-fluid" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-sm-6 col-xl-4">
        <div className="card">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between">
              <p className="mb-0">
                <i className="ph-duotone ph-circle text-warning me-2"></i> Parcel in the way
              </p>
              <i className="ph-duotone ph-info f-20 ms-1" data-bs-toggle="tooltip" data-bs-title="Parcel in the way"></i>
            </div>
            <div className="d-flex align-items-center my-2">
              <h2 className="d-flex align-items-center mb-0">25 <span className="text-muted">/40</span></h2>
            </div>
            <p className="mb-0">
              <span className="text-success">
                <i className="ph-duotone ph-caret-up f-20 align-bottom"></i> +15%
              </span> last month
            </p>
          </div>
        </div>
      </div>

      <div className="col-sm-6 col-xl-4">
        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between py-3">
            <h5>Product earn</h5>
            <div className="dropdown">
              <a
                className="avtar avtar-xs btn-link-secondary dropdown-toggle arrow-none"
                href="#"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i className="material-icons-two-tone f-18">more_vert</i>
              </a>
              <div className="dropdown-menu dropdown-menu-end">
                <a className="dropdown-item" href="#">View</a>
                <a className="dropdown-item" href="#">Edit</a>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <p className="text-muted mb-0">Sale Product</p>
                <div className="d-flex align-items-end mt-1">
                  <h4 className="mb-0">375</h4>
                  <span className="badge bg-light-success ms-2">36%</span>
                </div>
              </div>
              <div className="avtar bg-brand-color-2 text-white">
                <i className="ph-duotone ph-cube f-26"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default OtherWidgets;
  