import NavBar from "@views/Landing/Navbar";
import HomeSection from "@views/LivePreview/HomeSection";
import React from "react";

// css
import "@assets/scss/landing.scss";

const LivePreview = () => {
  return (
    <>
      <header id="home">
        <NavBar />
        <HomeSection />
      </header>
    </>
  );
};

export default LivePreview;
