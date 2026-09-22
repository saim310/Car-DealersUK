"use client";
import LocationMap from "@/components/common/LocationMap";
import { useState } from "react";

export default function CarLocation({ carItem }) {
  const locationText = carItem?.location || "Birmingham";
  const subAddress = "Yard: 180a Rupert St, Birmingham B7 5DT, UK";
  const phone = "+44 7383 908070";
  const [mapError, setMapError] = useState(false);
  
  if (!carItem?.location) {
    return null;
  }

  return (
    <div className="widget-listing" style={{ background: "#ffffff", borderRadius: "16px", padding: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", border: "1px solid #eaeaea" }}>
      <div className="car-location-section">
        
        {/* Header */}
        <div className="location-header" style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#fff5ed", display: "flex", alignItems: "center", justifyContent: "center", color: "#ff7a00" }}>
              <i className="far fa-map" style={{ fontSize: "16px" }} />
            </div>
            <h4 style={{ margin: 0, fontSize: "20px", fontWeight: "700", color: "#1a1a1a" }}>
              Car Location
            </h4>
          </div>
          <p style={{ margin: 0, fontSize: "13px", color: "#666", paddingLeft: "46px" }}>
            Visit us at our Birmingham yard
          </p>
        </div>

        {/* Content Box (Text Left + Map Right) */}
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "20px" }}>
          
          {/* Left Text Card */}
          <div style={{ 
            flex: "1 1 180px",
            backgroundColor: "#fffaf5", 
            padding: "16px", 
            borderRadius: "12px", 
            border: "1px solid #fce8d5",
            display: "flex",
            flexDirection: "column",
            gap: "10px"
          }}>
            <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
              <div style={{ color: "#ff7a00", marginTop: "2px" }}>
                <i className="fas fa-map-marker-alt" style={{ fontSize: "16px" }} />
              </div>
              <div>
                <span style={{ display: "block", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#888", fontWeight: "600", marginBottom: "2px" }}>
                  Our Location
                </span>
                <h5 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#1a1a1a" }}>
                  {locationText}
                </h5>
                <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#555", lineHeight: "1.4", whiteSpace: "pre-line" }}>
                  {subAddress}
                </p>
              </div>
            </div>

            {/* Phone Number Item */}
            <div style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "6px", paddingTop: "8px", borderTop: "1px dashed #fce8d5" }}>
              <div style={{ color: "#ff7a00" }}>
                <i className="fas fa-phone-alt" style={{ fontSize: "13px" }} />
              </div>
              <a href={`tel:${phone}`} style={{ fontSize: "12px", fontWeight: "600", color: "#333", textDecoration: "none" }}>
                {phone}
              </a>
            </div>
          </div>

          {/* Right Map Image / Widget Preview */}
          <div style={{ flex: "1 1 160px", minWidth: "150px", borderRadius: "10px", overflow: "hidden", border: "1px solid #e0e0e0", position: "relative", minHeight: "130px", background: "#f0f0f0" }}>
            {!mapError ? (
              <LocationMap 
                address={subAddress} 
                height="100%"
                onError={() => setMapError(true)}
              />
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", padding: "10px", textAlign: "center", fontSize: "12px", color: "#666" }}>
                Map preview unavailable
              </div>
            )}
          </div>
        </div>

        {/* Opening Hours Box */}
        <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", padding: "12px 14px", background: "#f8f9fa", borderRadius: "10px", marginBottom: "16px" }}>
          <div style={{ color: "#666", marginTop: "1px" }}>
            <i className="far fa-clock" style={{ fontSize: "14px" }} />
          </div>
          <div>
            <span style={{ display: "block", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#888", fontWeight: "600", marginBottom: "2px" }}>
              Opening Hours
            </span>
            <p style={{ margin: 0, fontSize: "12px", color: "#333", lineHeight: "1.4" }}>
              Mon - Sat: 9:00 - 18:00<br />
              Sun: 10:00 - 16:00
            </p>
          </div>
        </div>

        {/* View on Google Maps Button */}
        <a 
          href={`https://maps.google.com/?q=${encodeURIComponent(subAddress)}`} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            width: "100%",
            padding: "10px 16px",
            borderRadius: "8px",
            border: "1px solid #ff7a00",
            color: "#ff7a00",
            background: "#ffffff",
            fontSize: "13px",
            fontWeight: "600",
            textDecoration: "none",
            transition: "all 0.2s ease"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "#fff5ed";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "#ffffff";
          }}
        >
          <i className="fas fa-map-marked-alt" />
          View on Google Maps
          <i className="fas fa-external-link-alt" style={{ fontSize: "10px", marginLeft: "auto" }} />
        </a>

      </div> 
    </div>
  );
}