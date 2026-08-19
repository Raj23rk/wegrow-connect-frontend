import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // =====================================================
  // API BASE URL
  // =====================================================

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // =====================================================
  // LOGIN API
  // =====================================================

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loading) return;

    // ===================================================
    // BASIC VALIDATION
    // ===================================================

    if (!email.trim()) {
      alert("Please enter your email.");
      return;
    }

    if (!password.trim()) {
      alert("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      console.log("====================================");
      console.log("LOGIN API");
      console.log("====================================");
      console.log("API URL:", `${API_BASE_URL}api/v1/auth/login`);
      console.log("Email:", email.trim());

      // =================================================
      // API REQUEST
      // =================================================

      const response = await fetch(
        `${API_BASE_URL}api/v1/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: email.trim(),
            password: password,
          }),
        }
      );

      // =================================================
      // RESPONSE
      // =================================================

      const data = await response.json();

      console.log("Login Response:", data);
      console.log("Status:", response.status);

      // =================================================
      // LOGIN SUCCESS
      // =================================================

      if (response.ok && data?.success) {
        const accessToken = data?.data?.accessToken;
        const user = data?.data?.user;

        // -----------------------------------------------
        // CHECK TOKEN
        // -----------------------------------------------

        if (!accessToken) {
          console.error(
            "Access token missing from response:",
            data
          );

          alert(
            "Login successful, but access token was not received."
          );

          return;
        }

        // =================================================
        // SAVE TO CONTEXT AND LOCALSTORAGE
        // =================================================

        login(accessToken, user);

        // =================================================
        // DEBUG
        // =================================================

        console.log("====================================");
        console.log("LOGIN SUCCESS");
        console.log("====================================");
        console.log("Access Token:", accessToken);
        console.log("User:", user);
        console.log("Role (Normalized):", user?.role?.toLowerCase());

        // =================================================
        // REDIRECT TO HOME PAGE
        // =================================================

        navigate("/home");
      } else {
        // =================================================
        // LOGIN FAILED
        // =================================================

        console.error(
          "Login failed:",
          data
        );

        alert(
          data?.message ||
            data?.error ||
            "Invalid email or password."
        );
      }
    } catch (error) {
      // =================================================
      // NETWORK ERROR
      // =================================================

      console.error(
        "Login API Error:",
        error
      );

      alert(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // BACK BUTTON
  // =====================================================

  const handleBackClick = () => {
    navigate("/home");
  };

  // =====================================================
  // REGISTER
  // =====================================================

  const handleRegisterClick = (e) => {
    e.preventDefault();

    navigate("/home/login/option");
  };

  // =====================================================
  // FORGOT PASSWORD
  // =====================================================

  const handleForgotPasswordClick = (e) => {
    e.preventDefault();

    navigate("/home/login/forgotpassword");
  };

  return (
    <>
      <style>{`
        @keyframes pageFadeIn {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.98);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .page-fade {
          animation: pageFadeIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .login-btn {
          background-color: #104288;
          transition: all 0.25s ease;
        }

        .login-btn:hover:not(:disabled) {
          background-color: #f97316 !important;
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(249, 115, 22, 0.4) !important;
        }

        .back-btn:hover {
          background-color: #f1f5f9 !important;
          border-color: #104288 !important;
          color: #104288 !important;
        }

        .auth-link {
          text-decoration: none !important;
          transition: color 0.2s ease;
        }

        .auth-link:hover {
          color: #f97316 !important;
          text-decoration: none !important;
        }
      `}</style>

      {/* =====================================================
          MAIN CONTAINER
      ===================================================== */}

      <div className="w-full max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-6 lg:gap-10 page-fade">

        {/* =====================================================
            LEFT SIDE CONTENT
        ===================================================== */}

        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">

          <div
            className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-extrabold tracking-widest uppercase mb-4 shadow-sm"
            style={{ color: "#104288" }}
          >
            ✨ Welcome Back to WeGrow
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.2] tracking-tight">

            <span style={{ color: "#104288" }}>
              Empowering Your
            </span>

            <br />

            <span style={{ color: "#f97316" }}>
              Learning Journey,
            </span>

            <br />

            <span style={{ color: "#104288" }}>
              Building Your Future.
            </span>

          </h2>

          <p className="mt-5 text-sm sm:text-base font-semibold text-gray-700 max-w-lg leading-relaxed">
            Gain practical industry skills, connect with top mentors,
            and achieve your professional dreams with WeGrow.
          </p>

        </div>

        {/* =====================================================
            RIGHT SIDE LOGIN FORM CARD
        ===================================================== */}

        <div className="w-full md:w-1/2 max-w-md bg-white/95 backdrop-blur-2xl border border-gray-200/90 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center">

          {/* =====================================================
              WEGROW LOGO
          ===================================================== */}

          <div className="flex items-center justify-center mb-6">

            <img
              src="/login/logo.jpg"
              alt="Logo Icon"
              className="w-12 h-12 object-contain relative z-10"
            />

            <img
              src="/login/wegrow-logo.png"
              alt="WeGrow Text Logo"
              className="w-[160px] h-[48px] object-contain -ml-6 relative z-0"
            />

          </div>

          {/* =====================================================
              LOGIN FORM
          ===================================================== */}

          <form
            onSubmit={handleLogin}
            className="w-full flex flex-col items-center"
          >

            <div className="w-full flex flex-col gap-4 mb-5">

              {/* EMAIL */}

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
                autoComplete="email"
                disabled={loading}
                className="w-full rounded-full border-2 border-blue-500 focus:border-[#f97316] focus:ring-2 focus:ring-orange-100 outline-none text-[15px] font-semibold text-gray-800 bg-white px-5 py-3.5 transition-all duration-200 shadow-sm"
              />

              {/* PASSWORD */}

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
                autoComplete="current-password"
                disabled={loading}
                className="w-full rounded-full border-2 border-blue-500 focus:border-[#f97316] focus:ring-2 focus:ring-orange-100 outline-none text-[15px] font-semibold text-gray-800 bg-white px-5 py-3.5 transition-all duration-200 shadow-sm"
              />

            </div>

            {/* =================================================
                LOGIN + BACK BUTTON
            ================================================= */}

            <div className="w-full flex flex-row gap-3 mb-4">

              {/* LOGIN */}

              <button
                type="submit"
                disabled={loading}
                className="login-btn w-1/2 py-3.5 rounded-full font-extrabold text-white text-base border-none cursor-pointer shadow-md"
                style={{
                  opacity: loading ? 0.7 : 1,
                  cursor: loading
                    ? "not-allowed"
                    : "pointer",
                }}
              >
                {loading
                  ? "LOGGING IN..."
                  : "LOGIN"}
              </button>

              {/* BACK */}

              <button
                type="button"
                onClick={handleBackClick}
                disabled={loading}
                className="back-btn w-1/2 py-3.5 rounded-full font-bold text-gray-700 text-sm border-2 border-gray-300 cursor-pointer bg-white transition-all duration-200 shadow-sm"
              >
                ← BACK
              </button>

            </div>

          </form>

          {/* =====================================================
              LINKS
          ===================================================== */}

          <div className="w-full flex items-center justify-between text-xs font-bold px-2 pt-2">

            <a
              href="/home/login/forgotpassword"
              onClick={handleForgotPasswordClick}
              className="auth-link text-gray-600 cursor-pointer"
            >
              Forgot Password?
            </a>

            <a
              href="/home/login/option"
              onClick={handleRegisterClick}
              className="auth-link text-gray-600 cursor-pointer"
            >
              New User? Register Now
            </a>

          </div>

        </div>

      </div>
    </>
  );
}