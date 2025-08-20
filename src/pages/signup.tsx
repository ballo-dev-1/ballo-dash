"use client";

import { signIn } from "next-auth/react";
import NavBar from "@views/Landing/Navbar";
import React, { useEffect, useState } from "react";
import "@assets/scss/login.scss";
import { UserRound, Mail, Phone } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { firstNames, lastNames } from "drizzle-seed";

const Signup = () => {
  const [firstName, setFirstname] = useState("");
  const [lastName, setLastname] = useState("");
  const [email, setUsername] = useState("");
  const [phone, setPhonenumber] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl") || "/";

  // Prefill personal info when returning from company step
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("signup_personal");
      if (!raw) return;
      const p = JSON.parse(raw);
      if (p.firstName) setFirstname(p.firstName);
      if (p.lastName) setLastname(p.lastName);
      if (p.email) setUsername(p.email);
      if (p.phone) setPhonenumber(p.phone);
    } catch {}
  }, []);

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!firstName || !lastName || !email || !phone) {
        toast.error("Please fill in all personal details.");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        toast.error("Please enter a valid email address.");
        return;
      }
      sessionStorage.setItem(
        "signup_personal",
        JSON.stringify({ firstName, lastName, email, phone })
      );
      router.push("/signup/company");
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
        <div className="home-content-wrapper"> {/*start here*/}
          <div className="login-container">
            <h2 className="login-title">Sign Up</h2>
            <form className="login-form" onSubmit={handleNext}>
              <div className="form-grid">
                <div className="form-col">
                  {/* First Name field */}
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <div className="form-input-wrapper gap-2">
                      <UserRound color="white" size={20} />
                      <input
                        type="text"
                        placeholder="First Name"
                        className="form-input"
                        value={firstName}
                        onChange={(e) => setFirstname(e.target.value)}
                      />
                    </div>
                  </div>
                  {/* Email field */}
                  <div className="form-group">
                    <label className="form-label">Email </label>
                    <div className="form-input-wrapper gap-2">
                      <Mail color="white" size={20} />
                      <input
                        type="email"
                        placeholder="Email"
                        className="form-input"
                        value={email}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-col">
                  {/* Last Name field */}
                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <div className="form-input-wrapper gap-2">
                      <UserRound color="white" size={20} />
                      <input
                        type="text"
                        placeholder="Last Name"
                        className="form-input"
                        value={lastName}
                        onChange={(e) => setLastname(e.target.value)}
                      />
                    </div>
                  </div>
                  {/* Phone Number field */}
                  <div className="form-group">
                    <label className="form-label">Phone number </label>
                    <div className="form-input-wrapper gap-2">
                      <Phone color="white" size={20} />
                      <input
                        type="int"
                        placeholder="Phone Number"
                        className="form-input"
                        value={phone}
                        onChange={(e) => setPhonenumber(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-options form-span">
                <span></span>
                <span></span>
              </div>
              <button
                type="submit"
                disabled={loading}
                style={loading ? { opacity: 0.5, cursor: "not-allowed" } : {}}
                className="login-button form-span"
              >
                Next
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
