import React from "react";
import { apiURL } from "@/utils/exports";

const API_BASE_URL = apiURL.replace(/\/api\/?$/, "");

const getPublicUrl = (value) => {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  const normalized = String(value).replace(/\\/g, "/").replace(/^\/+/, "");
  return `${API_BASE_URL}/${normalized}`;
};

const getFileName = (url) => {
  if (!url) return "brochure.pdf";
  try {
    const parsed = new URL(url);
    return decodeURIComponent(parsed.pathname.split("/").pop()) || "brochure.pdf";
  } catch {
    return decodeURIComponent(url.split("/").pop().split("?")[0]) || "brochure.pdf";
  }
};

export default function Description({ carItem }) {
  const attachments = React.useMemo(() => {
    // Prefer attachment_paths (raw storage paths) → attachments (may already be full URLs)
    const sources =
      Array.isArray(carItem?.attachment_paths) && carItem.attachment_paths.length > 0
        ? carItem.attachment_paths
        : Array.isArray(carItem?.attachments)
        ? carItem.attachments
        : [];

    return sources.filter(Boolean).map(getPublicUrl);
  }, [carItem]);

  console.log(carItem, 'ikikkk', carItem?.attachment_paths, "attachments in Description.jsx");

  return (
    <div
      className="tfcl-listing-info mt-30"
      style={{
        background: "#ffffff",
        border: "1px solid #eaeaea",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
        overflow: "hidden",
        position: "relative",
        padding: "30px",
      }}
    >
 

      <p style={{ whiteSpace: "pre-line", marginBottom: "20px", color: "#4b5563", lineHeight: "1.6" }}>
        {carItem?.description || "No description available."}
      </p>

      {attachments.length > 0 ? (
        <div className="list-file-container" style={{ marginTop: "30px" }}>
          <h4 style={{ marginBottom: "15px", fontSize: "16px", fontWeight: "700", color: "#111" }}>Attachments</h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {attachments.map((url, index) => (
              <a
                key={`${url}-${index}`}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="pdf-download-btn"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "10px 20px",
                  backgroundColor: "#FF7101",
                  color: "#fff",
                  borderRadius: "5px",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: "bold",
                  gap: "10px",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="12" y1="18" x2="12" y2="12" />
                  <polyline points="9 15 12 18 15 15" />
                </svg>
                {getFileName(url)}
              </a>
            ))}
          </div>
        </div>
      ) : (
        <p style={{ color: "#999", fontSize: "12px", margin: 0 }}>No attachments found.</p>
      )}
    </div>
  );
}