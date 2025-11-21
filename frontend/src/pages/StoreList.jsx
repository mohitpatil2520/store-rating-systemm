import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

export default function StoreList() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch stores on page load
  useEffect(() => {
    API.get("/stores")
      .then((res) => {
        setStores(res.data);
        setLoading(false);
      })
      .catch(() => {
        setStores([]);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="container">Loading stores...</div>;

  return (
    <div className="container">
      <h2 style={{ marginBottom: "20px" }}>Available Stores</h2>

      {stores.length === 0 ? (
        <p>No stores available.</p>
      ) : (
        stores.map((store) => (
          <div key={store.id} className="card" style={{ marginBottom: "15px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontWeight: "bold", fontSize: "18px" }}>
                  {store.name}
                </div>
                <div style={{ color: "#663333ff" }}>{store.address}</div>
              </div>

              <Link to={`/store/${store.id}`} className="btn">
                View
              </Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
