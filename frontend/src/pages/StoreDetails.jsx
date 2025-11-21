import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function StoreDetails() {
  const { id } = useParams(); // store ID from URL
  const { user } = useContext(AuthContext);

  const [store, setStore] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Rating form state
  const [ratingValue, setRatingValue] = useState(5);
  const [comment, setComment] = useState("");

  // Fetch store details + ratings on mount
  useEffect(() => {
    Promise.all([
      API.get(`/stores/${id}`),
      API.get(`/stores/${id}/ratings`)
    ])
      .then(([storeRes, ratingsRes]) => {
        setStore(storeRes.data);
        setRatings(ratingsRes.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [id]);

  // Submit rating
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post(`/stores/${id}/ratings`, {
        rating: ratingValue,
        comment
      });

      alert("Rating submitted successfully!");

      // Refresh ratings after submission
      const newRatings = await API.get(`/stores/${id}/ratings`);
      setRatings(newRatings.data);

      // Clear form
      setComment("");
      setRatingValue(5);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit rating");
    }
  };

  if (loading) return <div className="container">Loading…</div>;
  if (!store) return <div className="container">Store not found.</div>;

  return (
    <div className="container">
      {/* Store Details */}
      <div className="card">
        <h2 style={{ marginBottom: "5px" }}>{store.name}</h2>
        <p style={{ color: "#666" }}>{store.address}</p>
      </div>

      {/* Rating Form */}
      <div className="card">
        <h3>Rate this Store</h3>

        {!user ? (
          <p style={{ color: "red" }}>Please login to submit a rating.</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>Rating (1–5)</label>
            <input
              type="number"
              min="1"
              max="5"
              value={ratingValue}
              onChange={(e) => setRatingValue(Number(e.target.value))}
            />

            <label>Comment</label>
            <textarea
              value={comment}
              placeholder="Write your comment..."
              onChange={(e) => setComment(e.target.value)}
            />

            <button className="btn" type="submit">
              Submit Rating
            </button>
          </form>
        )}
      </div>

      {/* Ratings List */}
      <div className="card">
        <h3>Ratings</h3>

        {ratings.length === 0 ? (
          <p>No ratings yet.</p>
        ) : (
          ratings.map((r) => (
            <div
              key={r.id}
              style={{ paddingBottom: "10px", marginBottom: "10px", borderBottom: "1px solid #eee" }}
            >
              <strong>⭐ {r.rating}</strong>
              <p>{r.comment}</p>
              <small style={{ color: "#555" }}>
                by {r.User?.name || "Unknown User"}
              </small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
