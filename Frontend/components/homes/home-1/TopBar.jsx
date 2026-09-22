"use client";
import React from "react";
import Link from "next/link";

export default function TopBar() {
  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .topbar-container {
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
            gap: 10px !important;
          }
          .topbar-left, .topbar-right {
            justify-content: center !important;
            width: 100% !important;
            gap: 12px !important;
          }
          .topbar-socials {
            display: none !important; /* Hide social icons on mobile to save space */
          }
          .topbar-email {
            display: none !important; /* Hide email on mobile, keep address, phone */
          }
        }
      `}</style>
      <div 
        style={{ 
          background: "#0b0b0b", 
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)", 
          padding: "8px 16px",
          width: "100%",
          fontSize: "13px",
          color: "#ffffff"
        }}
      >
        <div 
          className="topbar-container"
          style={{ 
            maxWidth: "1400px", 
            margin: "0 auto", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "15px"
          }}
        >
          {/* Left Side: Location & Email */}
          <div className="topbar-left" style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ color: "#ff5722", display: "flex", alignItems: "center" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </span>
              <span style={{ color: "#e0e0e0", fontWeight: "500" }}>
                Yard: 180a Rupert St, Birmingham B7 5DT, UK
              </span>
            </div>

            <div className="topbar-email" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ color: "#ff5722", display: "flex", alignItems: "center" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </span>
              <a href="mailto:sales@ukaautotrade.co.uk" style={{ color: "#e0e0e0", textDecoration: "none", transition: "color 0.2s" }}>
                sales@ukaautotrade.co.uk
              </a>
            </div>
          </div>

          {/* Right Side: Phone & Social Media Icons */}
          <div className="topbar-right" style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
            {/* Social Icons */}
            <div className="topbar-socials" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Link href="#" style={socialIconStyle} aria-label="Facebook">
                <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </Link>
              <Link href="#" style={socialIconStyle} aria-label="Instagram">
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </Link>
              <Link href="#" style={socialIconStyle} aria-label="LinkedIn">
                <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
              </Link>
              <Link href="#" style={socialIconStyle} aria-label="TikTok">
                <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
              </Link>
            </div>

            {/* Phone Number */}
            <a 
              href="tel:+447383908070" 
              style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "8px", 
                color: "#ffffff", 
                textDecoration: "none", 
                fontWeight: "700",
                background: "rgba(255, 87, 34, 0.12)",
                padding: "5px 12px",
                borderRadius: "4px",
                border: "1px solid rgba(255, 87, 34, 0.3)"
              }}
            >
              <span style={{ color: "#ff5722", display: "flex", alignItems: "center" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </span>
              +44 7383 908070
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

const socialIconStyle = {
  width: "26px",
  height: "26px",
  borderRadius: "50%",
  background: "rgba(255, 255, 255, 0.08)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#ffffff",
  transition: "all 0.2s ease"
};