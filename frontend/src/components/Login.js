import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PrimaryButton, GhostButton } from "./common/AnimatedButton";
import PageTransition from "./common/PageTransition";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { login, register, loading } = useAuth();

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isLoginMode) {
        const result = await login(formData.email, formData.password);
        if (result.success) {
          navigate("/dashboard");
        } else {
          setError(result.message);
        }
      } else {
        const result = await register({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        });
        if (result.success) {
          navigate("/dashboard");
        } else {
          setError(result.message);
        }
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError("");
    setFormData({
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    });
  };

  return (
    <PageTransition transitionKey={`login-${isLoginMode}`} type="scale" duration={350}>
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>Builtrix Energy Dashboard</h1>
            <h2>{isLoginMode ? "Sign In" : "Create Account"}</h2>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            {!isLoginMode && (
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required={!isLoginMode}
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required={!isLoginMode}
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Enter your password"
                minLength={6}
              />
            </div>

            <PrimaryButton
              type="submit"
              loading={loading}
              size="large"
              className="login-button"
            >
              {isLoginMode ? "Sign In" : "Create Account"}
            </PrimaryButton>
          </form>

          <div className="login-footer">
            <p>
              {isLoginMode
                ? "Don't have an account? "
                : "Already have an account? "}
              <GhostButton
                onClick={toggleMode}
                disabled={loading}
                className="toggle-button"
              >
                {isLoginMode ? "Sign Up" : "Sign In"}
              </GhostButton>
            </p>
          </div>

          {isLoginMode && (
            <div className="demo-credentials">
              <p>
                <strong>Demo Credentials:</strong>
              </p>
              <p>Email: admin@builtrix.tech</p>
              <p>Password: admin123</p>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default Login;
