import React, { useState } from "react";
import { authAPI } from "../services/api";

export const SignUpPage = ({ setIsSignUp, loginHandler, setNotif }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await authAPI.register(username, password);
      console.log("✅ Registration successful:", data);
      
      loginHandler(data.token, data.isAdmin, username);
      setNotif({ message: "Registration successful!", style: "success" });
    } catch (error) {
      console.error("❌ Registration error:", error);
      const message = error.message || "Registration failed";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="login-page">
      <form id="login" onSubmit={handleSubmit}>
        <h1 id="logo">KL Bank</h1>
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Sign Up</h2>

        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type={showPass ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
          <input
            type="checkbox"
            checked={showPass}
            onChange={() => setShowPass(!showPass)}
          />
          <label>Show Password</label>
        </div>

        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </button>

        <p style={{ textAlign: "center", marginTop: "10px" }}>
          Already have an account?{" "}
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => setIsSignUp(false)}
          >
            Log In
          </span>
        </p>
      </form>
    </div>
  );
};

export default SignUpPage;   // ✅ REQUIRED
