import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import "../modern.css";

const ModernLogin = ({ onLogin, setNotif }) => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let data;

      if (isSignUp) {
        data = await authAPI.register(username, password);
        setNotif({ message: "Account created successfully!", type: "success" });
      } else {
        data = await authAPI.login(username, password);
        setNotif({ message: "Welcome back!", type: "success" });
      }

      onLogin(data.token, data.isAdmin, username);

      if (data.isAdmin) navigate("/admin");
      else navigate("/dashboard");

    } catch (error) {
      setNotif({
        message: error.message || "Authentication failed",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="login-container">
        <div className="login-card">
          <div className="logo">
            <h1>🏦 Om Bank</h1>
            <p>Modern Banking Experience</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                className="form-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type={showPassword ? "text" : "password"}
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                id="showPass"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <label htmlFor="showPass">Show password</label>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Processing..." : isSignUp ? "Create Account" : "Login"}
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp
                ? "Already have an account? Login"
                : "New user? Sign Up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModernLogin;
