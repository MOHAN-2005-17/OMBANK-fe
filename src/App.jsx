import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ModernLogin from "./components/ModernLogin";
import AdminDashboard from "./components/AdminDashboard";
import UserDashboard from "./components/UserDashboard";

function App() {
  const [notif, setNotif] = useState(null);

  const handleLogin = (token, isAdmin, username) => {
    localStorage.setItem("token", token);
    localStorage.setItem("isAdmin", isAdmin);
    localStorage.setItem("username", username);
  };

  return (
    <Router>
      <Routes>
        {/* Login Page */}
        <Route
          path="/"
          element={<ModernLogin onLogin={handleLogin} setNotif={setNotif} />}
        />

        {/* Admin */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* User */}
        <Route path="/dashboard" element={<UserDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
