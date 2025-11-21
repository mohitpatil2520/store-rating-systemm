import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate, useParams } from "react-router-dom";

export default function AdminEditStore() {
  const { id } = useParams();      // store id from URL
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: ""
  });

  const [loading, setLoading] = useState(true);

  // Load store details
  useEffect(() => {
    API.get(`/stores/${id}`)
      .then((res) => {
        const store = res.data;
        setForm({
          name: store.name,
          email: store.email,
          address: store.address
        });
        setLoading(false);
      })
      .catch(() => {
        alert("Failed to load store details");
        navigate("/admin");
      });
  }, [id, navigate]);

  // Submit edited details
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.put(`/stores/${id}`, form);
      alert("Store updated successfully!");
      navigate("/admin");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update store");
    }
  };

  if (loading) return <div className="container">Loading store details…</div>;

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: "450px", margin: "auto" }}>
        <h2 style={{ marginBottom: "15px" }}>Edit Store</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Store Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <input
            type="email"
            placeholder="Store Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <input
            type="text"
            placeholder="Store Address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            required
          />

          <button className="btn" type="submit" style={{ width: "100%" }}>
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
