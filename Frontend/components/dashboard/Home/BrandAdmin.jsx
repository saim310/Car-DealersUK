"use client";

import React, { useState, useEffect, useRef } from "react";
import { FiUpload, FiTrash2, FiCheckCircle } from "react-icons/fi";
import styles from "../../../public/assets/css/dashboard/content.module.css";

const BrandAdmin = () => {
  const [brands, setBrands] = useState([]);
  const [formData, setFormData] = useState({ name: "" });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(false);
  const fileInputRef = useRef(null);

  const fetchBrands = async () => {
    try {
      const res = await fetch(
        "https://apis.ukaautotrade.co.uk/api/brands",
      );
      const data = await res.json();
      setBrands(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching brands:", err);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  // Handle file selection and generate a preview
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAddBrand = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !imageFile) {
      alert("Please provide both a brand name and a logo image.");
      return;
    }

    setLoading(true);
    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("qty", 0);
    submitData.append("image", imageFile);

    try {
      const res = await fetch(
        "https://apis.ukaautotrade.co.uk/api/brands",
        {
          method: "POST",
          body: submitData,
        },
      );

      if (res.ok) {
        setSaveStatus(true);
        fetchBrands();

        // Reset form
        setFormData({ name: "" });
        setImageFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = "";

        setTimeout(() => setSaveStatus(false), 3000);
      }
    } catch (err) {
      console.error("Error adding brand:", err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBrand = async (id) => {
    if (!window.confirm("Remove this brand?")) return;
    try {
      const res = await fetch(
        `https://apis.ukaautotrade.co.uk/api/brands/${id}`,
        {
          method: "DELETE",
        },
      );
      if (res.ok) fetchBrands();
    } catch (err) {
      console.error("Error deleting brand:", err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          Brand <span className={styles.highlight}>Management</span>
        </h2>
        <span className={styles.badge}>Slider 01</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
        {/* Current Brands Grid (Replaces the old HTML table) */}
        <div>
          <label className={styles.fieldLabel}>Active Brands</label>
          {brands.length === 0 ? (
            <p style={{ color: "#666", fontSize: "14px", marginTop: "10px" }}>
              No brands added yet.
            </p>
          ) : (
            <div
              style={{
                display: "flex",
                gap: "15px",
                flexWrap: "wrap",
                marginTop: "10px",
              }}
            >
              {brands.map((brand) => (
                <div
                  key={brand.id}
                  style={{
                    position: "relative",
                    width: "140px",
                    height: "120px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "12px",
                    border: "1px solid #ddd",
                  }}
                >
                  <img

                    src={`https://apis.ukaautotrade.co.uk${brand.image}`}

                    alt={brand.name}
                    style={{
                      width: "100%",
                      height: "60px",
                      objectFit: "contain",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#333",
                      textAlign: "center",
                    }}
                  >
                    {brand.name}
                  </span>

                  <button
                    onClick={() => handleDeleteBrand(brand.id)}
                    style={{
                      position: "absolute",
                      top: "-8px",
                      right: "-8px",
                      background: "#ff4d4d",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                      borderRadius: "50%",
                      padding: "6px",
                      display: "flex",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    }}
                    title="Remove Brand"
                  >
                    <FiTrash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <hr style={{ borderTop: "1px dashed #ddd", margin: "10px 0" }} />

        {/* Add New Brand Form */}
        <form
          onSubmit={handleAddBrand}
          style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
        >
          <div>
            <label className={styles.fieldLabel}>New Brand Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g. Toyota, BMW..."
              className={styles.inputField}
              style={{
                paddingLeft: "1.5rem",
                borderRadius: "2rem",
                width: "100%",
                maxWidth: "500px",
              }}
              required
            />
          </div>

          <div>
            <label className={styles.fieldLabel}>Brand Logo</label>
            <div style={{ marginTop: "10px" }}>
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  width: "180px",
                  height: "180px",
                  border: "3px dashed #ff7101",
                  borderRadius: "16px",
                  backgroundColor: "#f8f9fa",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  color: "#ff7101",
                  boxShadow: "0 4px 12px rgba(13, 110, 253, 0.1)",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#e9f0ff")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f8f9fa")
                }
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{
                      width: "80%",
                      height: "80%",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <>
                    <FiUpload size={42} style={{ marginBottom: "12px" }} />
                    <span
                      style={{
                        fontSize: "15px",
                        fontWeight: "600",
                        color: "#333",
                      }}
                    >
                      Upload Logo
                    </span>
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#666",
                        marginTop: "4px",
                      }}
                    >
                      Click to select
                    </span>
                  </>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                hidden
                accept="image/*"
              />
            </div>
          </div>

          {/* Orange Pill Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: saveStatus ? "#28a745" : "#ff6b00",
                color: "#ffffff",
                border: "none",
                padding: "14px 32px",
                fontSize: "16px",
                fontWeight: "600",
                borderRadius: "50px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                boxShadow: "0 4px 15px rgba(255, 107, 0, 0.3)",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => {
                if (!saveStatus) {
                  e.currentTarget.style.backgroundColor = "#e55c00";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }
              }}
              onMouseOut={(e) => {
                if (!saveStatus) {
                  e.currentTarget.style.backgroundColor = "#ff6b00";
                  e.currentTarget.style.transform = "translateY(0)";
                }
              }}
            >
              {saveStatus ? <FiCheckCircle size={20} /> : null}
              <span>
                {saveStatus
                  ? "Brand Added!"
                  : loading
                    ? "Uploading..."
                    : "Add Brand"}
              </span>
              {!saveStatus && <span style={{ fontSize: "18px" }}>→</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BrandAdmin;
