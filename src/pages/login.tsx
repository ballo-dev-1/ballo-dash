"use client";

import { signIn } from "next-auth/react";
import NavBar from "@views/Landing/Navbar";
import React, { useState } from "react";
import "@assets/scss/login.scss";
import { Lock, UserRound } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [Loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    const toastId = toast.loading("Logging in...");

    const res = await signIn("credentials", {
      username,
      password,
      redirect: false, // use manual redirect
    });

    if (res?.ok) {
      toast.success("Login successful!", { id: toastId });
      router.push("/dashboard");
    } else {
      toast.error("Invalid username or password", { id: toastId });
    }

    setLoading(false);
  };

  return (
    <section id="login-section">
      <NavBar />
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
            <form className="login-form" onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <div className="form-input-wrapper gap-2">
                  <UserRound color="white" size={20} />
                  <input
                    type="text"
                    placeholder="Username"
                    className="form-input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <div
                  className="form-input-wrapper gap-2"
                  style={{ position: "relative" }}
                >
                  <Lock color="white" size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="form-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="eye-button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    style={{ background: "none", border: "none" }}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={20} color="white" />
                    ) : (
                      <Eye size={20} color="white" />
                    )}
                  </button>
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
              <button
                type="submit"
                disabled={Loading}
                style={Loading ? { opacity: 0.5, cursor: "not-allowed" } : {}}
                className="login-button"
              >
                Sign in
              </button>
              {/* <p className="signup-text">
                or{" "}
                <a href="#" className="signup-link">
                  Sign up
                </a>
              </p> */}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
