import BreadcrumbItem from "@common/BreadcrumbItem";
import Layout from "@layout/index";
import React, { ReactElement, useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import "@/assets/scss/loading.scss";
import logo from "@/assets/images/logos/Ballo logo new-06.png";
import Image from "next/image";

const Loading = ({subContainer}: {subContainer: boolean}) => {
  return (
    <div className={`loader-container position-relative ${subContainer ? 'sub-container' : ''}`}>
      <Image
        src={logo}
        className="center-item"
        style={{ height: "9rem", width: "9rem", zIndex: 3 }}
        alt="Ballo Innovations"
        priority={true}
      />
      <div className="spinner center-round-item">
        <div className="spinner1" />
      </div>
    </div>
  );
};

export default Loading;
