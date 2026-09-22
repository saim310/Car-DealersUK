"use client";

import { useState, useEffect } from "react";
import useSubmit from "@/hooks/useSubmit";
import { toast } from "react-toastify";

export default function SoldListingModal({ isOpen, onClose, listing, onSuccess }) {
  const { submit, loading: submitting } = useSubmit();
  const [form, setForm] = useState({
    customer_name: "",
    phone: "",
    email: "",
    lead_source: "",
    sold_by: "",
    plate_number: "",
    sale_date: new Date().toISOString().split("T")[0],
    listing_id: null,
  });

  // Update form when modal opens or listing changes
  useEffect(() => {
    if (isOpen && listing) {
      console.log("🔄 Updating form with listing:", listing);
      setForm({
        customer_name: "",
        phone: "",
        email: "",
        lead_source: "",
        sold_by: "",
        plate_number: listing?.plate_number || "",
        sale_date: new Date().toISOString().split("T")[0],
        listing_id: listing?.id || null,
      });
    }
  }, [isOpen, listing]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.customer_name || !form.phone || !form.email) {
      toast.error("Customer Name, Phone, and Email are required");
      return;
    }

    console.log("📤 Submitting sale report with form data:", form);

    const response = await submit("/sale-reports", form);

    if (response) {
      toast.success("Sale report recorded successfully!");
      setForm({
        customer_name: "",
        phone: "",
        email: "",
        lead_source: "",
        sold_by: "",
        plate_number: listing?.plate_number || "",
        sale_date: new Date().toISOString().split("T")[0],
        listing_id: listing?.id || null,
      });
      onClose();
      if (onSuccess) onSuccess();
    } else {
      toast.error("Failed to record sale report");
    }
  };

  if (!isOpen) return null;

  // --- INTERNAL CUSTOM STYLES ---
  const styles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2000,
      backdropFilter: "blur(4px)",
    },
    modal: {
      backgroundColor: "#ffffff",
      width: "100%",
      maxWidth: "550px",
      borderRadius: "16px",
      overflow: "hidden",
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      animation: "modalFadeIn 0.3s ease-out",
    },
    header: {
      padding: "20px 24px",
      borderBottom: "1px solid #f3f4f6",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#fff",
    },
    title: {
      fontSize: "1.25rem",
      fontWeight: "700",
      color: "#111827",
      margin: 0,
    },
    orangeText: {
      color: "#FF7101",
    },
    body: {
      padding: "24px",
      maxHeight: "80vh",
      overflowY: "auto",
    },
    footer: {
      padding: "16px 24px",
      borderTop: "1px solid #f3f4f6",
      display: "flex",
      justifyContent: "flex-end",
      gap: "12px",
      backgroundColor: "#f9fafb",
    },
    label: {
      display: "block",
      fontSize: "0.875rem",
      fontWeight: "600",
      color: "#374151",
      marginBottom: "6px",
    },
    input: {
      width: "100%",
      padding: "10px 14px",
      borderRadius: "8px",
      border: "1px solid #d1d5db",
      fontSize: "0.95rem",
      transition: "border-color 0.2s, box-shadow 0.2s",
      outline: "none",
    },
    btnCancel: {
      padding: "10px 20px",
      borderRadius: "8px",
      border: "1px solid #d1d5db",
      backgroundColor: "#fff",
      color: "#374151",
      fontWeight: "600",
      cursor: "pointer",
    },
    btnSubmit: {
      padding: "10px 24px",
      borderRadius: "8px",
      border: "none",
      backgroundColor: "#FF7101",
      color: "#fff",
      fontWeight: "600",
      cursor: "pointer",
      boxShadow: "0 4px 6px -1px rgba(255, 113, 1, 0.3)",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "16px",
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Header */}
        <div style={styles.header}>
          <h5 style={styles.title}>
            Record Sale: <span style={styles.orangeText}>{listing?.title || "Vehicle"}</span>
          </h5>
          <button 
            onClick={onClose} 
            style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#9ca3af' }}
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={styles.body}>
            <div style={{ marginBottom: "16px" }}>
              <label style={styles.label}>Customer Name *</label>
              <input
                style={styles.input}
                type="text"
                name="customer_name"
                value={form.customer_name}
                onChange={handleChange}
                placeholder="Full Name"
                required
              />
            </div>

            <div style={styles.grid}>
              <div>
                <label style={styles.label}>Phone Number *</label>
                <input
                  style={styles.input}
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+44..."
                  required
                />
              </div>
              <div>
                <label style={styles.label}>Email Address *</label>
                <input
                  style={styles.input}
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                  required
                />
              </div>
              <div>
                <label style={styles.label}>Lead Source</label>
                <input
                  style={styles.input}
                  type="text"
                  name="lead_source"
                  value={form.lead_source}
                  onChange={handleChange}
                  placeholder="e.g. Facebook"
                />
              </div>
              <div>
                <label style={styles.label}>Sales Person</label>
                <input
                  style={styles.input}
                  type="text"
                  name="sold_by"
                  value={form.sold_by}
                  onChange={handleChange}
                  placeholder="Name"
                />
              </div>
              <div>
                <label style={styles.label}>Plate Number</label>
                <input
                  style={styles.input}
                  type="text"
                  name="plate_number"
                  value={form.plate_number}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label style={styles.label}>Sale Date</label>
                <input
                  style={styles.input}
                  type="date"
                  name="sale_date"
                  value={form.sale_date}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={styles.footer}>
            <button
              type="button"
              style={styles.btnCancel}
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                ...styles.btnSubmit,
                opacity: submitting ? 0.7 : 1,
                cursor: submitting ? "not-allowed" : "pointer"
              }}
              disabled={submitting}
            >
              {submitting ? "Processing..." : "Confirm Sale"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}