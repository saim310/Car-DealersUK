"use client";

import { useState, useRef, useEffect } from "react";
import { FiUpload, FiPlus, FiTrash2, FiCheckCircle, FiSmartphone } from "react-icons/fi";
import styles from "../../../public/assets/css/dashboard/content.module.css";

const HeroSectionForm = () => {
  const [formData, setFormData] = useState({
    mainHeading: "",
    callUsLink: "",
    backgroundImages: [],
    mobileBackgroundImages: [],
  });
  const [urlInput, setUrlInput] = useState("");
  const [mobileUrlInput, setMobileUrlInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mobileLoading, setMobileLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(false);
  
  const fileInputRef = useRef(null);
  const mobileFileInputRef = useRef(null);

  const fetchHero = async () => {
    try {
      const res = await fetch("https://apis.ukaautotrade.co.uk/api/hero");
      const data = await res.json();
      
      setFormData({
        mainHeading: data?.mainHeading || "",
        callUsLink: data?.callUsLink || "",
        backgroundImages: data?.backgroundImages || data?.images || [],
        // Robust fallback to catch whatever property name your backend is returning
        mobileBackgroundImages: data?.mobileBackgroundImages || data?.mobileImages || data?.mobile_images || [],
      });
    } catch (err) {
      console.error("Load error:", err);
    }
  };

  useEffect(() => {
    fetchHero();
  }, []);

  // Helper function to update state and instantly sync changes with backend
  const updateBackendWithImages = async (updatedDesktop, updatedMobile, heading = formData.mainHeading, callLink = formData.callUsLink) => {
    try {
      const response = await fetch("https://apis.ukaautotrade.co.uk/api/hero/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mainHeading: heading,
          callUsLink: callLink,
          existing_images: JSON.stringify(updatedDesktop),
          existing_mobile_images: JSON.stringify(updatedMobile),
          is_mobile_upload: "false",
        }),
      });
      if (response.ok) {
        await fetchHero();
      }
    } catch (err) {
      console.error("Sync error:", err);
      alert("Failed to update changes on server");
    }
  };

  const addImageLink = async () => {
    if (!urlInput.trim()) return;
    const updatedDesktop = [...(formData.backgroundImages || []), urlInput.trim()];
    setUrlInput("");
    setFormData((prev) => ({ ...prev, backgroundImages: updatedDesktop }));
    await updateBackendWithImages(updatedDesktop, formData.mobileBackgroundImages);
  };

  const addMobileImageLink = async () => {
    if (!mobileUrlInput.trim()) return;
    const updatedMobile = [...(formData.mobileBackgroundImages || []), mobileUrlInput.trim()];
    setMobileUrlInput("");
    setFormData((prev) => ({ ...prev, mobileBackgroundImages: updatedMobile }));
    await updateBackendWithImages(formData.backgroundImages, updatedMobile);
  };

  // Desktop File Upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const payload = new FormData();
    payload.append("banner", file);
    payload.append("mainHeading", formData.mainHeading || "");
    payload.append("callUsLink", formData.callUsLink || "");
    payload.append("existing_images", JSON.stringify(formData.backgroundImages || []));
    payload.append("existing_mobile_images", JSON.stringify(formData.mobileBackgroundImages || []));
    payload.append("is_mobile_upload", "false");

    try {
      const res = await fetch("https://apis.ukaautotrade.co.uk/api/hero/upload", {
        method: "POST",
        body: payload,
      });
      if (res.ok) await fetchHero();
    } catch (err) {
      alert("Desktop upload failed");
    } finally {
      setLoading(false);
    }
  };

  // Mobile File Upload
  const handleMobileFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setMobileLoading(true);
    const payload = new FormData();
    payload.append("banner", file);
    payload.append("mainHeading", formData.mainHeading || "");
    payload.append("callUsLink", formData.callUsLink || "");
    payload.append("existing_images", JSON.stringify(formData.backgroundImages || []));
    payload.append("existing_mobile_images", JSON.stringify(formData.mobileBackgroundImages || []));
    payload.append("is_mobile_upload", "true");

    try {
      const res = await fetch("https://apis.ukaautotrade.co.uk/api/hero/upload", {
        method: "POST",
        body: payload,
      });
      if (res.ok) await fetchHero();
    } catch (err) {
      alert("Mobile upload failed");
    } finally {
      setMobileLoading(false);
    }
  };

  const removeImage = async (idx) => {
    const updatedDesktop = formData.backgroundImages.filter((_, i) => i !== idx);
    setFormData((prev) => ({ ...prev, backgroundImages: updatedDesktop }));
    await updateBackendWithImages(updatedDesktop, formData.mobileBackgroundImages);
  };

  const removeMobileImage = async (idx) => {
    const updatedMobile = formData.mobileBackgroundImages.filter((_, i) => i !== idx);
    setFormData((prev) => ({ ...prev, mobileBackgroundImages: updatedMobile }));
    await updateBackendWithImages(formData.backgroundImages, updatedMobile);
  };

  const publishChanges = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://apis.ukaautotrade.co.uk/api/hero/upload",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mainHeading: formData.mainHeading,
            callUsLink: formData.callUsLink,
            existing_images: JSON.stringify(formData.backgroundImages),
            existing_mobile_images: JSON.stringify(formData.mobileBackgroundImages),
            is_mobile_upload: "false",
          }),
        },
      );
      if (response.ok) {
        setSaveStatus(true);
        setTimeout(() => setSaveStatus(false), 3000);
        await fetchHero();
      }
    } catch (err) {
      alert("Error publishing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          Hero Section <span className={styles.highlight}>Editor</span>
        </h2>
        <span className={styles.badge}>Section 01</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem", paddingBottom: "4rem" }}>
        
        {/* ================= DESKTOP BACKGROUND MEDIA ================= */}
        <div>
          <label className={styles.fieldLabel}>Desktop Background Media</label>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
            {formData.backgroundImages?.map((img, i) => (
              <div key={i} style={{ position: "relative", width: "140px", height: "90px" }}>
                <img
                  src={img}
                  alt="Hero Desktop"
                  style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "12px", border: "1px solid #ddd" }}
                />
                <button
                  onClick={() => removeImage(i)}
                  style={{
                    position: "absolute", top: "-5px", right: "-5px",
                    background: "#ff4d4d", color: "white", border: "none",
                    cursor: "pointer", borderRadius: "50%", padding: "5px", display: "flex"
                  }}
                >
                  <FiTrash2 size={12} />
                </button>
              </div>
            ))}
          </div>

          <div className={styles.inputSection}>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Paste desktop image URL..."
                className={styles.inputField}
              />
              <div className={styles.buttonGroup} style={{ marginLeft: "10px" }}>
                <button onClick={addImageLink} className={styles.addButton}>
                  <FiPlus strokeWidth={3} /> Add
                </button>
              </div>
            </div>

            <div style={{ marginTop: "20px" }}>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                style={{
                  width: "180px", height: "180px", border: "3px dashed #ff7101",
                  borderRadius: "16px", backgroundColor: "#f8f9fa", display: "flex",
                  flexDirection: "column", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: "#ff7101"
                }}
              >
                <FiUpload size={42} style={{ marginBottom: "12px" }} />
                <span style={{ fontSize: "15px", fontWeight: "600", color: "#333" }}>
                  {loading ? "Uploading..." : "Upload Desktop"}
                </span>
                <span style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>Click or drag & drop</span>
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} hidden accept="image/*" />
            </div>
          </div>
        </div>

        {/* ================= MOBILE BACKGROUND MEDIA ================= */}
        <div style={{ borderTop: "1px solid #eee", paddingTop: "2rem" }}>
          <label className={styles.fieldLabel} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <FiSmartphone /> Mobile Background Media
          </label>
          <p style={{ fontSize: "13px", color: "#666", marginBottom: "15px" }}>
            Upload custom background images specifically tailored for mobile and smaller devices.
          </p>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
            {formData.mobileBackgroundImages?.map((img, i) => (
              <div key={i} style={{ position: "relative", width: "100px", height: "140px" }}>
                <img
                  src={img}
                  alt="Hero Mobile"
                  style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "12px", border: "1px solid #ddd" }}
                />
                <button
                  onClick={() => removeMobileImage(i)}
                  style={{
                    position: "absolute", top: "-5px", right: "-5px",
                    background: "#ff4d4d", color: "white", border: "none",
                    cursor: "pointer", borderRadius: "50%", padding: "5px", display: "flex"
                  }}
                >
                  <FiTrash2 size={12} />
                </button>
              </div>
            ))}
          </div>

          <div className={styles.inputSection}>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                value={mobileUrlInput}
                onChange={(e) => setMobileUrlInput(e.target.value)}
                placeholder="Paste mobile image URL..."
                className={styles.inputField}
              />
              <div className={styles.buttonGroup} style={{ marginLeft: "10px" }}>
                <button onClick={addMobileImageLink} className={styles.addButton}>
                  <FiPlus strokeWidth={3} /> Add
                </button>
              </div>
            </div>

            <div style={{ marginTop: "20px" }}>
              <button
                onClick={() => mobileFileInputRef.current?.click()}
                disabled={mobileLoading}
                style={{
                  width: "180px", height: "180px", border: "3px dashed #333",
                  borderRadius: "16px", backgroundColor: "#f8f9fa", display: "flex",
                  flexDirection: "column", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: "#333"
                }}
              >
                <FiSmartphone size={42} style={{ marginBottom: "12px" }} />
                <span style={{ fontSize: "15px", fontWeight: "600", color: "#333" }}>
                  {mobileLoading ? "Uploading..." : "Upload Mobile"}
                </span>
                <span style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>Click or drag & drop</span>
              </button>
              <input type="file" ref={mobileFileInputRef} onChange={handleMobileFileUpload} hidden accept="image/*" />
            </div>
          </div>
        </div>

        {/* ================= HEADING SECTION ================= */}
        <div>
          <label className={styles.fieldLabel}>Hero Heading</label>
          <input
            type="text"
            value={formData.mainHeading}
            onChange={(e) => setFormData({ ...formData, mainHeading: e.target.value })}
            className={styles.inputField}
            style={{ paddingLeft: "1.5rem", borderRadius: "2rem" }}
          />
        </div>

        {/* ================= PUBLISH BUTTON ================= */}
        <div>
          <button
            className={styles.saveBtn}
            onClick={publishChanges}
            disabled={loading}
            style={{
              backgroundColor: saveStatus ? "#28a745" : "#ff6b00",
              color: "#ffffff", border: "none", padding: "14px 32px", fontSize: "16px",
              fontWeight: "600", borderRadius: "50px", cursor: "pointer", display: "inline-flex",
              alignItems: "center", gap: "10px", boxShadow: "0 4px 15px rgba(255, 107, 0, 0.3)",
            }}
          >
            {saveStatus ? <FiCheckCircle size={20} /> : null}
            <span>{saveStatus ? "Settings Saved" : loading ? "Publishing..." : "Publish Changes"}</span>
            {!saveStatus && <span style={{ fontSize: "18px" }}>→</span>}
          </button>
        </div>

      </div>
    </div>
  );
};

export default HeroSectionForm;