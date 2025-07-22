import React from "react";
import "swiper/css";
import { Lock, UserRound } from "lucide-react";

const HomeSection = () => {
  return (
    <div className="home container-fluid">
      <video
        className="home-bg-video"
        muted
        loop
        autoPlay
        playsInline
        src="/videos/background.mp4"
      />
      <div className="home-content-wrapper">
        <div className="login-container">
          <h2 className="login-title">Log in</h2>
          <form className="login-form">
            <div className="form-group">
              <label className="form-label">Username</label>
              <div className="form-input-wrapper gap-2">
                <UserRound color="white" size={20} />
                <input
                  type="text"
                  placeholder="Username"
                  className="form-input"
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="form-input-wrapper gap-2">
                <Lock color="white" size={20} />
                <input
                  type="password"
                  placeholder="Password"
                  className="form-input"
                />
              </div>
            </div>
            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                Remember Me
              </label>
              <a href="#" className="forgot-link">
                Forgot Password?
              </a>
            </div>
            <button type="submit" className="login-button">
              Log in
            </button>
            <p className="signup-text">
              or{" "}
              <a href="#" className="signup-link">
                Sign up
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HomeSection;
