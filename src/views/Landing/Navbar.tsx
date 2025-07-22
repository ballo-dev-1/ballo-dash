import React, { useEffect } from "react";
import Image from "next/image";
import { Navbar, Nav, NavDropdown, Container, Button } from "react-bootstrap";
import { changeThemeMode } from "src/toolkit/thunk";
import { useDispatch, useSelector } from "react-redux";
// images
import logoDark from "@assets/images/Ballo logo new copy white.png";
import logoLight from "@assets/images/Ballo logo new copy white.png";
import { createSelector } from "reselect";
import Link from "next/link";

const NavBar = () => {
  const dispatch = useDispatch<any>();

  const windowScroll = () => {
    const pageTopbar = document.getElementById("top-nav");
    if (pageTopbar) {
      if (
        document.body.scrollTop >= 50 ||
        document.documentElement.scrollTop >= 50
      ) {
        pageTopbar.classList.remove("top-nav-collapse");
      } else {
        pageTopbar.classList.add("top-nav-collapse");
      }
    }
  };

  if (typeof document !== "undefined") {
    document.onscroll = function () {
      windowScroll();
    };
  }

  useEffect(() => {
    document.body.classList.add("landing-page");
  }, []);

  const selectLayoutProperties = createSelector(
    (state: any) => state.Theme,
    (layout: any) => ({
      themeMode: layout.themeMode,
    })
  );
  // Inside your component
  const { themeMode } = useSelector(selectLayoutProperties);

  /*
      layout settings
      */
  useEffect(() => {
    if (themeMode) {
      dispatch(changeThemeMode(themeMode));
    }
  }, [themeMode, dispatch]);

  return (
    <>
      <nav
        id="top-nav"
        className="navbar navbar-expand-md navbar-light default"
      >
        <Container>
          <Link href="/dashboard" className="pc-navbar-brand">
            {themeMode === "dark" ? (
              <Image src={logoLight} alt="logo" className="nav-logo w-10" />
            ) : (
              <Image src={logoDark} alt="logo" className="nav-logo w-10" />
            )}
          </Link>
          <Navbar.Toggle aria-controls="navbarTogglerDemo01" />
          <Navbar.Collapse id="navbarTogglerDemo01">
            <Nav
              as="ul"
              className="navbar-nav ms-auto mt-lg-0 mt-2 mb-2 mb-lg-0 align-items-start"
            >
              <Nav.Item as="li" className="px-1">
                <Nav.Link href="/dashboard" style={{ color: "white" }}>
                  Dashboard
                </Nav.Link>
              </Nav.Item>

              <Nav.Item as="li" className="px-1">
                <Nav.Link
                  href="https://light-able-react-components.vercel.app/"
                  style={{ color: "white" }}
                >
                  About Us
                </Nav.Link>
              </Nav.Item>

              <Nav.Item as="li" className="px-1">
                <Nav.Link
                  href="https://pcoded.gitbook.io/light-able/"
                  target="_blank"
                  style={{ color: "white" }}
                >
                  Contact
                </Nav.Link>
              </Nav.Item>

              <Nav.Item as="li" className="px-1">
                <Nav.Link
                  href="https://pcoded.gitbook.io/light-able/"
                  target="_blank"
                  className="active-link"
                  style={{ color: "white" }}
                >
                  Log In
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </nav>
    </>
  );
};

export default NavBar;
