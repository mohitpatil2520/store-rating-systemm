import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StoreList from "./pages/StoreList";
import StoreDetails from "./pages/StoreDetails";
import OwnerDashboard from "./pages/OwnerDashboard";
import AdminDashboard from "./pages/AdminDashboard";

import AdminCreateStore from "./pages/AdminCreateStore";   
import AdminEditStore from "./pages/AdminEditStore";       // <-- added

export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* Public */}
        <Route path="/" element={<StoreList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/store/:id" element={<StoreDetails />} />

        {/* Owner (owner OR admin allowed) */}
        <Route
          path="/owner"
          element={
            <ProtectedRoute roles={["owner", "admin"]}>
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin only */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin Create Store Page */}
        <Route
          path="/admin/create-store"
          element={
            <ProtectedRoute roles="admin">
              <AdminCreateStore />
            </ProtectedRoute>
          }
        />

        {/* Admin Edit Store Page */}
        <Route
          path="/admin/edit-store/:id"
          element={
            <ProtectedRoute roles="admin">
              <AdminEditStore />
            </ProtectedRoute>
          }
        />

        {/* (Optional) 404 route */}
      </Routes>
    </>
  );
}
