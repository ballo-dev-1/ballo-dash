// import React, { useEffect, useRef, useState } from "react";
// import { BioData } from "./ColorData";
// import { Button, Card, CardBody, Modal } from "react-bootstrap";
// // import "react-quill/dist/quill.snow.css";
// import addUser from "../../../assets/images/admin/img-add-user.png";
// // import ReactQuill from 'react-quill';
// const ReactQuill = dynamic(() => import("react-quill"), {
//   ssr: false, // Disable SSR for react-quill
// });
// import Image from "next/image";
// import dynamic from "next/dynamic";

// const Bio = () => {
//   const [showModal, setShowModal] = useState(false);

//   const handleClose = () => setShowModal(false);
//   const handleShow = () => setShowModal(true);

//   const [isClient, setIsClient] = useState(false);
//   const quillRef = useRef<any>(null);

//   useEffect(() => {
//     setIsClient(true); // Set isClient to true when component mounts on the client
//   }, []);

//   return (
//     <React.Fragment>
//       <div>
//         <div className="tab-pane" id="educationDetail">
//           <div className="text-end mb-3">
//             <button
//               type="button"
//               className="btn btn-primary"
//               data-bs-toggle="modal"
//               data-bs-target="#exampleModal"
//               onClick={handleShow}
//             >
//               Add Bio
//             </button>
//           </div>
//           <Modal show={showModal} onHide={handleClose} centered>
//             <Modal.Header closeButton>
//               <Modal.Title>Add Bio</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//               <div className="d-flex flex-column gap-3 align-items-center mb-4">
//                 <Image src={addUser} alt="img" />
//                 <Button variant="outline-secondary" size="sm">
//                   Add Image
//                 </Button>
//               </div>
//               <ReactQuill
//                 id="pc-quil-1"
//                 style={{ height: "125px", border: "1px solid #ced4da" }}
//                 placeholder="Type your text here..."
//                 className="mb-5 border-0"
//               />
//               <div className="mt-3 text-center">
//                 <Button variant="primary" onClick={handleClose}>
//                   Add Bio
//                 </Button>
//               </div>
//             </Modal.Body>
//           </Modal>
//           <Card className="table-card border shadow-none">
//             <CardBody className=" pb-0">
//               <div className="table-responsive">
//                 <table className="table table-hover mb-0" id="pc-dt-simple">
//                   <thead>
//                     <tr>
//                       <th>Name</th>
//                       <th>Date/Time</th>
//                       <th>Action</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {(BioData || []).map((item, key) => (
//                       <tr key={key}>
//                         <td>
//                           <div className="d-flex align-items-center">
//                             <div className="flex-shrink-0">
//                               <Image
//                                 src={item.img}
//                                 alt="user image"
//                                 className="img-radius wid-40 setImage"
//                               />
//                             </div>
//                             <div className="flex-grow-1 ms-3">
//                               <h6 className="mb-0">{item.name}</h6>
//                             </div>
//                           </div>
//                         </td>
//                         <td>
//                           {item.date}{" "}
//                           <span className="text-muted text-sm d-block">
//                             09:05 PM
//                           </span>
//                         </td>
//                         <td>
//                           <a
//                             href="#"
//                             className="avtar avtar-xs btn-link-secondary"
//                           >
//                             <i className="ti ti-eye f-20"></i>
//                           </a>
//                           <a
//                             href="#"
//                             className="avtar avtar-xs btn-link-secondary"
//                           >
//                             <i className="ti ti-edit f-20"></i>
//                           </a>
//                           <a
//                             href="#"
//                             className="avtar avtar-xs btn-link-secondary"
//                           >
//                             <i className="ti ti-trash f-20"></i>
//                           </a>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </CardBody>
//           </Card>
//         </div>
//       </div>
//     </React.Fragment>
//   );
// };

// export default Bio;
