import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function AdminCreateStore() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/stores", form); // admin route
      alert("Store created successfully!");
      navigate("/admin"); // go back to dashboard
    } catch (err) {
      alert(err.response?.data?.message || "Store creation failed");
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: "450px", margin: "auto" }}>
        <h2 style={{ marginBottom: "15px" }}>Create Store</h2>

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
            Create Store
          </button>
        </form>
      </div>
    </div>
  );
}
