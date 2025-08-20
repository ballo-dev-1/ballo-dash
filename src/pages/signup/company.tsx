"use client";

import NavBar from "@views/Landing/Navbar";
import React, { useEffect, useState } from "react";
import "@assets/scss/login.scss";
import { Building2, Globe, Briefcase, Lock, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type Personal = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

const SignupCompany = () => {
  const router = useRouter();
  const [company, setCompanyname] = useState("");
  const [site, setSitename] = useState("");
  const [industry, setIndustryname] = useState("");
  const [size, setSizename] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [personal, setPersonal] = useState<Personal | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("signup_personal");
      if (!raw) {
        router.replace("/signup");
        return;
      }
      setPersonal(JSON.parse(raw));
    } catch {
      router.replace("/signup");
    }
  }, [router]);

  const handleBack = () => {
    router.push("/signup");
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!personal) return;
    setLoading(true);
    try {
      if (!company || !site || !industry || !password || !confirmPassword) {
        toast.error("Please fill in all company details.");
        return;
      }
      if (password !== confirmPassword) {
        toast.error("Passwords do not match.");
        return;
      }

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: personal.firstName,
          lastName: personal.lastName,
          email: personal.email,
          phone: personal.phone,
          company,
          site,
          industry,
          size,
          password,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data?.message || "Sign up failed");
        return;
      }

      toast.success("Account created. Please log in.");
      sessionStorage.removeItem("signup_personal");
      router.push("/login");
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
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
            <h2 className="login-title">Company Details</h2>
            <form className="login-form" onSubmit={handleSignup}>
              <div className="form-grid">
                <div className="form-col">
                  {/* Company Name field */}
                  <div className="form-group">
                    <label className="form-label">Company Name</label>
                    <div className="form-input-wrapper gap-2">
                      <Building2 color="white" size={20} />
                      <input
                        type="text"
                        placeholder="Company Name"
                        className="form-input"
                        value={company}
                        onChange={(e) => setCompanyname(e.target.value)}
                      />
                    </div>
                  </div>
                  {/* Industry field */}
                  <div className="form-group">
                    <label className="form-label">Industry</label>
                    <div className="form-input-wrapper gap-2">
                      <Briefcase color="white" size={20} />
                      <input
                        type="text"
                        placeholder="Industry"
                        className="form-input"
                        value={industry}
                        onChange={(e) => setIndustryname(e.target.value)}
                      />
                    </div>
                  </div>
                  {/* Password fields */}
                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <div className="form-input-wrapper gap-2" style={{ position: "relative" }}>
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
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff size={20} color="white" /> : <Eye size={20} color="white" />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="form-col">
                  {/* Website field */}
                  <div className="form-group">
                    <label className="form-label">Company Website</label>
                    <div className="form-input-wrapper gap-2">
                      <Globe color="white" size={20} />
                      <input
                        type="text"
                        placeholder="Website"
                        className="form-input"
                        value={site}
                        onChange={(e) => setSitename(e.target.value)}
                      />
                    </div>
                  </div>
                  {/* Company Size field */}
                  <div className="form-group">
                    <label className="form-label">Company Size</label>
                    <div className="form-input-wrapper gap-2">
                      <Briefcase color="white" size={20} />
                      <input
                        type="text"
                        placeholder="Number of Employees"
                        className="form-input"
                        value={size}
                        onChange={(e) => setSizename(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm Password</label>
                    <div className="form-input-wrapper gap-2">
                      <Lock color="white" size={20} />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        className="form-input"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-options form-span" style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
                <button type="button" className="login-button" onClick={handleBack} style={{ padding: "0.75rem 2rem" }}>
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={loading ? { opacity: 0.5, cursor: "not-allowed" } : {}}
                  className="login-button"
                >
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignupCompany;


