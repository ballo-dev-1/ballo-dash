import React from "react";
import Link from "next/link";
import Image from "next/image";
//import images
import navCardBg from "../assets/images/layout/nav-card-bg.svg";
import avatar1 from "../assets/images/user/avatar-1.jpg";
import SimpleBar from "simplebar-react";
import { menuItems } from "./MenuData";
import { useDynamicMenu } from "@/hooks/useDynamicMenu";
import NestedMenu from "@/Layouts/Moduler/NestedMenu";
import { Dropdown } from "react-bootstrap";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/toolkit/hooks";
import { fetchCompany, selectCompany } from "@/toolkit/Company/reducer";
import UploadPopup from "@/views/ImageUpload";
import { selectUsers } from "@/toolkit/User/reducer";
import { useSession } from "next-auth/react";
import balloLogo from "@/assets/images/logos/Ballo logo white.png";
import { Play } from "lucide-react";
import Skeleton from "@mui/material/Skeleton";

const Header = ({ themeMode }: any) => {
  const dispatch = useAppDispatch();
  const company = useAppSelector(selectCompany);
  const { data: session } = useSession();
  const { reportsMenuItem } = useDynamicMenu();

  // Create dynamic menu items by replacing the reports item with the dynamic one
  const dynamicMenuItems = React.useMemo(() => {
    return menuItems.map((item: any) => {
      if (item.id === "reports") {
        return reportsMenuItem;
      }
      return item;
    });
  }, [reportsMenuItem]);

  useEffect(() => {
    dispatch(fetchCompany());
  }, [dispatch]);

  // useEffect(() => {
  //   console.log("user:", session?.user);
  // }, [session]);

  return (
    <React.Fragment>
      <nav className="pc-sidebar" id="pc-sidebar-hide">
        <div className="navbar-wrapper">
          <div className="m-header position-relative">
            <Image
              src={balloLogo}
              alt="logo image"
              className="logo-lg landing-logo"
              style={{
                width: "100%",
                height: "3rem",
                objectFit: "contain",
              }}
            />
          </div>
          <div className="m-header position-relative">
            <Link
              href="/"
              className="b-brand text-primary d-flex justify-content-between align-items-center w-100 border border-2 rounded-pill p-1"
              style={{ width: "fit-content", borderColor: "#cbcccf" }}
            >
              <div className="sidebar-company-logo-container m-1">
                <div className="sidebar-company-logo">
                  {company?.logoUrl ? (
                    <img
                      src={company.logoUrl}
                      alt="logo image"
                      className="sidebar-company-logo logo-lg landing-logo"
                    />
                  ) : (
                    <svg
                      className="sidebar-company-logo"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      strokeMiterlimit="2"
                      strokeLinejoin="round"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    >
                      <path
                        fillRule="nonzero"
                        fill="whitesmoke"
                        d="m2 19v-14c0-.552.447-1 1-1 .542 0 4.418 2.028 9 2.028 4.593 0 8.456-2.028 9-2.028.55 0 1 .447 1 1v14c0 .553-.45 1-1 1-.544 0-4.407-2.028-9-2.028-4.582 0-8.458 2.028-9 2.028-.553 0-1-.448-1-1zm1.5-.791 6.449-7.691c.289-.344.879-.338 1.16.012 0 0 1.954 2.434 1.954 2.434l1.704-1.283c.319-.24.816-.168 1.054.154l4.679 6.335v-12.44c-1.58.58-4.819 1.798-8.5 1.798-3.672 0-6.918-1.218-8.5-1.799zm2.657-.834c1.623-.471 3.657-.903 5.843-.903 2.309 0 4.444.479 6.105.98l-3.041-4.117-1.065.802.275.344c.259.323.206.796-.117 1.054-.323.259-.795.207-1.054-.117l-2.591-3.236zm.698-9.534c-1.051 0-1.905.854-1.905 1.905s.854 1.904 1.905 1.904 1.904-.853 1.904-1.904-.853-1.905-1.904-1.905zm0 1.3c.333 0 .604.271.604.605 0 .333-.271.604-.604.604-.334 0-.605-.271-.605-.604 0-.334.271-.605.605-.605z"
                      ></path>
                    </svg>
                  )}
                </div>
              </div>

              {company?.name ? (
                <span className="text-light fs-5 fw-medium">
                  {company.name}
                </span>
              ) : (
                <Skeleton className="logo-skeleton" animation="wave" />
              )}

              <Play
                size={16}
                color="#ffffff"
                fill="white"
                style={{ transform: "rotate(90deg)" }}
                className="me-2"
              />
              {/* {company?.logoUrl &&
                (session?.user.role == "ADMIN" ||
                  session?.user.role == "MANAGER") && <UploadPopup />} */}
            </Link>
          </div>
          {/* <div className="navbar-content"> */}
          <SimpleBar className="navbar-content" style={{ maxHeight: "100vh" }}>
            <ul className="pc-navbar" id="pc-navbar">
              {/* Sidebar  */}
              <NestedMenu menuItems={dynamicMenuItems} />
            </ul>
            <div className="card nav-action-card bg-brand-color-4">
              <div
                className="card-body"
                style={{ backgroundImage: `url(${navCardBg})` }}
              >
                <h5 className="text-dark">Help Center</h5>
                <p className="text-dark text-opacity-75">
                  Please contact us for more questions.
                </p>
                <Link
                  href="https://phoenixcoded.support-hub.io/"
                  className="btn btn-primary"
                  target="_blank"
                >
                  Go to help Center
                </Link>
              </div>
            </div>
          </SimpleBar>
          {/* </div> */}
          {/* <div className="card pc-user-card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="user-avtar bg-light">
                    {session?.user.name[0]}
                  </div>
                </div>
                <div className="flex-grow-1 ms-3 me-2">
                  <h6 className="mb-0">{session?.user.name}</h6>
                  <small className="text-capitalize">
                    {session?.user.role === "ADMIN"
                      ? "Administrator"
                      : session?.user.role === "USER"
                      ? ""
                      : session?.user.role}
                  </small>
                </div>
                <Dropdown>
                  <Dropdown.Toggle
                    variant="a"
                    className="btn btn-icon btn-link-secondary avtar arrow-none"
                    data-bs-offset="0,20"
                  >
                    <i className="ph-duotone ph-windows-logo"></i>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <ul>
                      <li>
                        <Dropdown.Item className="pc-user-links">
                          <i className="ph-duotone ph-user"></i>
                          <span>My Account</span>
                        </Dropdown.Item>
                      </li>
                      <li>
                        <Dropdown.Item className="pc-user-links">
                          <i className="ph-duotone ph-gear"></i>
                          <span>Settings</span>
                        </Dropdown.Item>
                      </li>
                      <li>
                        <Dropdown.Item className="pc-user-links">
                          <i className="ph-duotone ph-lock-key"></i>
                          <span>Lock Screen</span>
                        </Dropdown.Item>
                      </li>
                      <li>
                        <Dropdown.Item className="pc-user-links">
                          <i className="ph-duotone ph-power"></i>
                          <span>Logout</span>
                        </Dropdown.Item>
                      </li>
                    </ul>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </div> */}
        </div>
      </nav>
    </React.Fragment>
  );
};

export default Header;
