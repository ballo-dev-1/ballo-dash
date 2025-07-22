import React from 'react'
import Image from 'next/image'
import avatar1 from '@assets/images/user/avatar-1.jpg'
import avatar2 from '@assets/images/user/avatar-2.jpg'
import avatar3 from '@assets/images/user/avatar-3.jpg'
import avatar4 from '@assets/images/user/avatar-4.jpg'
import avatar5 from '@assets/images/user/avatar-5.jpg'
import { Card, CardBody, CardHeader, Col } from 'react-bootstrap'

const UserActivity = () => {
  return (
    <React.Fragment>
      <Col lg={6} md={12}>
        <Card className="table-card">
          <CardHeader>
            <div className="d-flex align-items-center justify-content-between">
              <h5 className="mb-0">Activity</h5>
              <button className="btn btn-sm btn-link-primary">View All</button>
            </div>
          </CardHeader>
          <CardBody>
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Qualification</th>
                    <th>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0">
                          <Image src={avatar4} alt="user image" className="img-radius wid-40 align-top m-r-15 setImage" />
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h6 className="mb-0">Airi Satou</h6>
                        </div>
                      </div>
                    </td>
                    <td>Developer</td>
                    <td className="f-w-600">
                      <i className="fas fa-star text-warning"></i> 5.0
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0">
                          <Image src={avatar1} alt="user image" className="img-radius wid-40 align-top m-r-15 setImage" />
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h6 className="mb-0">Ashton Cox</h6>
                        </div>
                      </div>
                    </td>
                    <td>Junior Technical</td>
                    <td className="f-w-600">
                      <i className="fas fa-star text-warning"></i> 4.5
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0">
                          <Image src={avatar2} alt="user image" className="img-radius wid-40 align-top m-r-15 setImage" />
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h6 className="mb-0">Bradley Greer</h6>
                        </div>
                      </div>
                    </td>
                    <td>Sales Assistant</td>
                    <td className="f-w-600">
                      <i className="fas fa-star text-warning"></i> 4.3
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0">
                          <Image src={avatar3} alt="user image" className="img-radius wid-40 align-top m-r-15 setImage" />
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h6 className="mb-0">Brielle Williamson</h6>
                        </div>
                      </div>
                    </td>
                    <td>JavaScript Developer</td>
                    <td className="f-w-600">
                      <i className="fas fa-star text-warning"></i> 4.9
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0">
                          <Image src={avatar5} alt="user image" className="img-radius wid-40 align-top m-r-15 setImage" />
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h6 className="mb-0">Colleen Hurst</h6>
                        </div>
                      </div>
                    </td>
                    <td>Software Engineer</td>
                    <td className="f-w-600">
                      <i className="fas fa-star text-warning"></i> 4.9
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  )
}

export default UserActivity