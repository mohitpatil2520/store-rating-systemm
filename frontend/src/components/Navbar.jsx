import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      {/* LEFT SIDE - Logo */}
      <div className="nav-left">
        <Link to="/" style={{ fontWeight: 700, textDecoration: "none", color: "#111" }}>
          StoreRatings
        </Link>
      </div>

      {/* RIGHT SIDE */}
      <div className="nav-right">
        <Link to="/">Home</Link>

        {/* When NOT logged in */}
        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}

        {/* Owner Route */}
        {user?.role === "owner" && (
          <Link to="/owner">Owner</Link>
        )}

        {/* Admin Route */}
        {user?.role === "admin" && (
          <Link to="/admin">Admin</Link>
        )}

        {/* Logout */}
        {user && (
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
