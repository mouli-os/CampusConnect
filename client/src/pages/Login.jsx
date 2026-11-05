

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setMessageType("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      // Save the authentication token
      sessionStorage.setItem("token", data.token);

     // Save the logged-in student's information
      sessionStorage.setItem("user", JSON.stringify(data.user));

      // Save login information
sessionStorage.setItem("token", data.token);
sessionStorage.setItem("user", JSON.stringify(data.user));

// Show success message
setMessage(`Welcome back, ${data.user.name}!`);
setMessageType("success");

// Navigate to Dashboard
navigate("/dashboard");

    } catch (error) {
      setMessage(error.message || "Something went wrong.");
      setMessageType("error");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <Link to="/" className="auth-brand">
          <span className="brand-icon">C</span>
          Campus<span>Connect</span>
        </Link>

        <div className="auth-heading">
          <span className="eyebrow">WELCOME BACK</span>
          <h1>Login to your account.</h1>
          <p>Continue your campus journey with us.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="email">College email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your college email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">Password</label>

          <div className="password-wrapper">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {message && (
            <p className={`auth-message ${messageType}`} role="status">
              {message}
            </p>
          )}

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login to Campus Connect →"}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account?{" "}
          <Link to="/register">Create account</Link>
        </p>

        <Link to="/" className="back-home">
          ← Back to home
        </Link>

      </div>
    </div>
  );
}

export default Login;

