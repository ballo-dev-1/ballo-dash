import React, { useState } from "react";
import "./loader_light.scss";

const LoaderLight = ({ show }: { show: boolean }) => {
  if (show) {
    console.log(show);
  }
  const [isLoading, setIsLoading] = useState(true);
  return (
    <div className="loader-container">
      <span />
      <span />
      <span />
      <span />
    </div>
  );
};

export default LoaderLight;
