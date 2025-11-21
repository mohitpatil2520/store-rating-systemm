import React, { useEffect, useState } from "react";
import API from "../services/api";

export default function OwnerDashboard() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch owned stores on load
  useEffect(() => {
    API.get("/owner/stores")
      .then((res) => {
        setStores(res.data);
        setLoading(false);
      })
      .catch(() => {
        setStores([]);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="container">Loading your stores…</div>;

  return (
    <div className="container">
      <h2 style={{ marginBottom: "20px" }}>Owner Dashboard</h2>

      {stores.length === 0 ? (
        <p>You do not own any stores.</p>
      ) : (
        stores.map((store) => (
          <div key={store.id} className="card">
            <h3>{store.name}</h3>
            <p style={{ color: "#555" }}>{store.address}</p>

            <div style={{ marginTop: "10px" }}>
              <strong>Average Rating:</strong> ⭐ {store.averageRating || 0}
            </div>

            <div>
              <strong>Total Ratings:</strong> {store.ratingsCount || 0}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
