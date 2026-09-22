"use client";

import React from "react";

export default function StatusBadge({ status }) {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case "in_stock":
        return {
          label: "In Stock",
          bgColor: "#4CAF50",
          textColor: "#fff",
          icon: "✓",
        };
      case "in_transit":
        return {
          label: "In Transit",
          bgColor: "#FF9800",
          textColor: "#fff",
          icon: "→",
        };
      case "on_order":
        return {
          label: "On Order",
          bgColor: "#2196F3",
          textColor: "#fff",
          icon: "⊚",
        };
      default:
        return {
          label: "In Stock",
          bgColor: "#4CAF50",
          textColor: "#fff",
          icon: "✓",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "6px 12px",
        backgroundColor: config.bgColor,
        color: config.textColor,
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "600",
        whiteSpace: "nowrap",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
      }}
    >
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </div>
  );
}
