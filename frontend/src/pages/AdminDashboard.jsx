import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";  // <-- added

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Popup state
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    API.get("/admin/dashboard")
      .then((res) => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // New Delete Logic
  const handleDelete = async () => {
    try {
      await API.delete(`/stores/${deleteId}`);
      alert("Store deleted successfully!");

      const res = await API.get("/admin/dashboard");
      setStats(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete store");
    } finally {
      setShowModal(false);
      setDeleteId(null);
    }
  };

  if (loading) return <div className="container">Loading admin data…</div>;
  if (!stats) return <div className="container">Could not load admin dashboard.</div>;

  return (
    <>
      {/* Render popup if needed */}
      {showModal && (
        <ConfirmModal
          message="Are you sure you want to delete this store?"
          onConfirm={handleDelete}
          onCancel={() => setShowModal(false)}
        />
      )}

      <div className="container">
        <h2 style={{ marginBottom: "20px" }}>Admin Dashboard</h2>

        <Link to="/admin/create-store" className="btn" style={{ marginBottom: "20px", display: "inline-block" }}>
          + Create New Store
        </Link>

        {/* Summary Cards */}
        <div className="card"><strong>Total Users:</strong> {stats.totalUsers}</div>
        <div className="card"><strong>Total Stores:</strong> {stats.totalStores}</div>
        <div className="card"><strong>Total Ratings:</strong> {stats.totalRatings}</div>

        {/* Manage Stores */}
        <div className="card">
          <h3 style={{ marginBottom: "10px" }}>Manage All Stores</h3>

          {stats.allStores?.map((store) => (
            <div key={store.id} style={{ padding: "12px 0", borderBottom: "1px solid #eee" }}>
              <strong>{store.name}</strong>
              <div style={{ color: "#666" }}>{store.address}</div>

              <Link to={`/admin/edit-store/${store.id}`} className="btn" style={{ marginRight: "10px" }}>
                Edit
              </Link>

              <button
                className="btn-danger"
                onClick={() => {
                  setDeleteId(store.id);
                  setShowModal(true);
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        {/* Top Stores */}
        <div className="card">
          <h3 style={{ marginBottom: "10px" }}>Top Rated Stores</h3>
          ...
        </div>
      </div>
    </>
  );
}
