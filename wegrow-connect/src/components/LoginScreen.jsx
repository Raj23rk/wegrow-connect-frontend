import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginScreen() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!email.trim() || !password.trim()) {
      alert("Please enter email and password");
      return;
    }

    setLoading(true);

    console.log("Login button clicked");
    console.log("Email:", email);

    try {
      const response = await fetch(
        "http://13.239.234.181:4000/api/v1/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      console.log("Login response:", data);

      if (response.ok && data.success) {
        const accessToken = data?.data?.accessToken;
        const user = data?.data?.user;

        if (!accessToken) {
          console.error("Access token missing:", data);
          alert("Login successful, but access token was not received.");
          return;
        }

        // Store JWT token
        localStorage.setItem("accessToken", accessToken);

        // Store user information
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
        }

        console.log("Access token saved");
        console.log("User saved:", user);

        alert("Login Successful");

        navigate("/home");
      } else {
        alert(data?.message || "Invalid email or password");
      }
    } catch (error) {
      console.error("Login API Error:", error);
      alert("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    navigate("/home");
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    navigate("/home/login/option");
  };

  const handleForgotPasswordClick = (e) => {
    e.preventDefault();
    navigate("/home/login/forgotpassword");
  };

  return (
    <div
      className="login-page animate-fade-in"
      style={{
        minHeight: "100vh",
        width: "100%",
        margin: 0,
        backgroundColor: "#fff",
        overflowX: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        backgroundImage: "url('/login/bg.png')",
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <style>
        {`
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

          .animate-fade-in {
            animation: pageFadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1)
              forwards;
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
            color: #104288;
            text-decoration: none !important;
            transition: color 0.2s ease;
            cursor: pointer;
          }

          .auth-link:hover {
            color: #f97316 !important;
            text-decoration: none !important;
          }

          .login-input {
            width: 100%;
            padding: 15px 20px;
            border: 2px solid #104288;
            border-radius: 30px;
            background: #fff;
            outline: none;
            box-sizing: border-box;
            font-size: 14px;
            position: relative;
            z-index: 9999;
          }

          .login-input:focus {
            border-color: #f97316;
            box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.15);
          }

          .login-input::placeholder {
            color: #777;
          }
        `}
      </style>

      {/* Heading */}
      <div
        style={{
          position: "absolute",
          left: "380px",
          top: "250px",
          width: "48%",
          zIndex: 10,
        }}
      >
        <h2
          style={{
            fontSize: "25px",
            fontWeight: 600,
            color: "#242222",
            lineHeight: 1.4,
            margin: 0,
          }}
        >
          Start Your Journey of Skill,
          <br />
          Grow Your Future,
          <br />
          Succeed Forever.
        </h2>
      </div>

      {/* Main Container */}
      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          padding: "40px",
          boxSizing: "border-box",
        }}
      >
        {/* Left Side */}
        <div
          style={{
            width: "48%",
          }}
        />

        {/* Right Side */}
        <div
          style={{
            position: "relative",
            left: "80px",
            top: "-30px",
            width: "52%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Logo */}
          <div
            style={{
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            {/* WeGrow Logo */}
            <img
              src="/login/wegrow-logo.png"
              alt="WeGrow"
              style={{
                width: "240px",
                height: "75px",
                objectFit: "contain",
              }}
            />

            {/* Main Logo */}
            <img
              src="/login/logo.jpg"
              alt="WeGrow Logo"
              style={{
                position: "absolute",
                left: "-35px",
                top: "2px",
                width: "75px",
                height: "75px",
                objectFit: "contain",
              }}
            />
          </div>

          {/* Login Form */}
          <form
            onSubmit={handleLogin}
            style={{
              width: "100%",
              maxWidth: "390px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Inputs */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "14px",
                marginBottom: "16px",
              }}
            >
              {/* Email */}
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                required
                autoComplete="email"
                className="login-input"
              />

              {/* Password */}
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                required
                autoComplete="current-password"
                className="login-input"
              />
            </div>

            {/* Buttons */}
            <div
              style={{
                display: "flex",
                gap: "10px",
                marginBottom: "16px",
              }}
            >
              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="login-btn"
                style={{
                  width: "50%",
                  padding: "14px",
                  borderRadius: "9999px",
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  color: "#fff",
                  fontWeight: "bold",
                  background:
                    "linear-gradient(90deg, #f97316 0%, #104288 100%)",
                  opacity: loading ? 0.7 : 1,
                  position: "relative",
                  zIndex: 99999,
                  transition: "all 0.2s ease",
                }}
              >
                {loading ? "LOGGING IN..." : "LOGIN"}
              </button>

              {/* Back Button */}
              <button
                type="button"
                onClick={handleBackClick}
                className="back-btn"
                style={{
                  width: "50%",
                  padding: "14px",
                  borderRadius: "9999px",
                  border: "2px solid #104288",
                  cursor: "pointer",
                  color: "#104288",
                  background: "#fff",
                  fontWeight: "bold",
                  transition: "all 0.2s ease",
                }}
              >
                ← BACK
              </button>
            </div>
          </form>

          {/* Links */}
          <div
            style={{
              width: "100%",
              maxWidth: "390px",
              display: "flex",
              justifyContent: "space-between",
              fontSize: "12px",
              fontWeight: 700,
            }}
          >
            {/* Forgot Password */}
            <a
              href="/home/login/forgotpassword"
              onClick={handleForgotPasswordClick}
              className="auth-link"
            >
              Forgot Password?
            </a>

            {/* Register */}
            <a
              href="/home/login/option"
              onClick={handleRegisterClick}
              className="auth-link"
            >
              New User? Register Now
            </a>
          </div>

          {/* Tagline */}
          <div
            style={{
              position: "absolute",
              left: "55px",
              top: "365px",
              width: "390px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: "11px",
                fontWeight: 800,
                color: "#104288",
                textTransform: "uppercase",
                margin: 0,
              }}
            >
              Shape Your Future With The Right Skills!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}