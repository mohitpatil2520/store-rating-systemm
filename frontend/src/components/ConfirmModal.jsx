import React from "react";

export default function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "10px",
          width: "330px",
          textAlign: "center",
          boxShadow: "0 5px 15px rgba(0,0,0,0.2)"
        }}
      >
        <h3 style={{ marginBottom: "20px" }}>{message}</h3>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button
            className="btn-danger"
            onClick={onConfirm}
            style={{ width: "47%" }}
          >
            Yes, Delete
          </button>

          <button className="btn" onClick={onCancel} style={{ width: "47%" }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
