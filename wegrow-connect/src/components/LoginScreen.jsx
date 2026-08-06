import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginScreen() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);

    console.log("Login button clicked");

    try {
      const response = await fetch(
        "http://13.239.234.181:4000/api/v1/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      console.log(data);

      if (response.ok && data.success) {
        localStorage.setItem("accessToken", data.data.accessToken);
        localStorage.setItem("user", JSON.stringify(data.data.user));

        alert("Login Successful");

        navigate("/home");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("API Error");
    } finally {
      setLoading(false);
    }
  };
  const handleBackClick = () => {
    navigate('/home');
  };

  return (
    <div
      className="min-h-screen w-full m-0 bg-white overflow-x-hidden flex items-center justify-center relative animate-fade-in"
      style={{
        backgroundImage: "url('/login/bg.png')",
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fadeIn 3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .login-btn:hover {
          opacity: 0.95;
          transform: translateY(-1px);
          box-shadow: 0 6px 12px rgba(249, 115, 22, 0.3) !important;
        }

        .back-btn:hover {
          background-color: #f8fafc !important;
          border-color: #f97316 !important;
          color: #f97316 !important;
        }

        .auth-link:hover {
          color: #104288 !important;
          text-decoration: none !important;
        }
      `}</style>

      {/* Heading */}
      <div
        style={{
          position: 'absolute',
          left: '380px',
          top: '250px',
          width: '48%',
          zIndex: 10
        }}
      >
        <h2
          style={{
            fontSize: '25px',
            fontWeight: 600,
            color: '#242222',
            lineHeight: 1.4
          }}
        >
          Start Your Journey of Skill,
          <br />
          Grow Your Future,
          <br />
          Succeed Forever.
        </h2>
      </div>

      <div
        style={{
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          padding: '40px'
        }}
      >
        {/* Left Side */}
        <div style={{ width: '48%' }}></div>

        {/* Right Side */}
        <div
          style={{
            position: 'relative',
            left: '80px',
            top: '-30px',
            width: '52%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          {/* Logo */}
          <div
            style={{
              position: 'relative',
              display: 'inline-flex',
              alignItems: 'center',
              marginBottom: '20px'
            }}
          >
            <img
              src="/login/wegrow-logo.png"
              alt="WeGrow"
              style={{
                width: '240px',
                height: '75px',
                objectFit: 'contain'
              }}
            />

            <img
              src="/login/logo.jpg"
              alt="Logo"
              style={{
                position: 'absolute',
                left: '-35px',
                top: '2px',
                width: '75px',
                height: '75px',
                objectFit: 'contain'
              }}
            />
          </div>

          {/* Login Form */}
          <form
            onSubmit={handleLogin}
            style={{
              width: '100%',
              maxWidth: '390px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                marginBottom: '16px'
              }}
            >
              {/* <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-full border-2 border-[#104288] focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                style={{ padding: '14px 22px' }}
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-full border-2 border-[#104288] focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                style={{ padding: '14px 22px' }}
              /> */}

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  console.log(e.target.value);
                  setEmail(e.target.value);
                }}
                style={{
                  width: "100%",
                  padding: "15px",
                  border: "2px solid blue",
                  borderRadius: "30px",
                  background: "#fff",
                  position: "relative",
                  zIndex: 9999
                }}
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  console.log(e.target.value);
                  setPassword(e.target.value);
                }}
                style={{
                  width: "100%",
                  padding: "15px",
                  border: "2px solid blue",
                  borderRadius: "30px",
                  background: "#fff",
                  position: "relative",
                  zIndex: 9999
                }}
              />
            </div>

            <div
              style={{
                display: 'flex',
                gap: '10px',
                marginBottom: '16px'
              }}
            >
              <button
                type="button"
                onClick={handleLogin}
                disabled={loading}
                className="login-btn"
                style={{
                  width: "50%",
                  padding: "14px",
                  borderRadius: "9999px",
                  border: "none",
                  cursor: "pointer",
                  color: "#fff",
                  fontWeight: "bold",
                  background: "linear-gradient(90deg, #f97316 0%, #104288 100%)",
                  opacity: loading ? 0.7 : 1,
                  position: "relative",
                  zIndex: 99999,
                }}
              >
                {loading ? "LOGGING IN..." : "LOGIN"}
              </button>

              <button
                type="button"
                onClick={handleBackClick}
                className="back-btn"
                style={{
                  width: '50%',
                  padding: '14px',
                  borderRadius: '9999px',
                  border: '2px solid #104288',
                  cursor: 'pointer',
                  color: '#104288',
                  background: '#fff'
                }}
              >
                ← BACK
              </button>
            </div>
          </form>

          {/* Links */}
          <div
            style={{
              width: '100%',
              maxWidth: '390px',
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '12px',
              fontWeight: 700
            }}
          >
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="auth-link"
            >
              Forgot Password?
            </a>

            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="auth-link"
            >
              New User? Register Now
            </a>
          </div>

          {/* Tagline */}
          <div
            style={{
              position: 'absolute',
              left: '55px',
              top: '365px',
              width: '390px',
              textAlign: 'center'
            }}
          >
            <p
              style={{
                fontSize: '11px',
                fontWeight: 800,
                color: '#104288',
                textTransform: 'uppercase'
              }}
            >
              Shape Your Future With The Right Skills !
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}