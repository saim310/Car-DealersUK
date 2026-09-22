"use client";
import React from "react";
import Image from "next/image";

export default function SafeHandsBanner() {
  return (
    <section 
      style={{ 
        position: "relative", 
        width: "100%", 
        height: "170px", 
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#111111",
        borderTop: "3px solid #ff5722",
        borderBottom: "3px solid #ff5722"
      }}
    >
      {/* Background Image with Dark Overlay */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1, opacity: 0.5 }}>
        <Image
          src="/assets/images/section/bgaacars.avif"
          alt="Safe Hands Background"
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </div>

      {/* Content Container */}
      <div 
        style={{ 
          position: "relative", 
          zIndex: 2, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between", 
          width: "100%",
          maxWidth: "1400px",
          padding: "0 35px"
        }}
      >
        {/* Left Side: Text Block */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ width: "5px", height: "50px", background: "#ff5722", borderRadius: "2px" }} />
          <div>
            <h3 
              style={{ 
                color: "#ffffff", 
                fontSize: "28px", 
                fontWeight: "700", 
                margin: "0 0 4px 0",
                letterSpacing: "0.5px",
                textTransform: "uppercase"
              }}
            >
              You&apos;re in Safe Hands
            </h3>
            <p 
              style={{ 
                color: "#ff5722", 
                fontSize: "14px", 
                margin: 0, 
                fontWeight: "600",
                letterSpacing: "0.3px"
              }}
            >
              Verified Dealer Promise & Quality Standards
            </p>
          </div>
        </div>

        {/* Right Side: Modern Badge Block */}
        <div 
          style={{ 
            background: "linear-gradient(135deg, #ffcc00 0%, #ff9900 100%)", 
            padding: "12px 24px", 
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            boxShadow: "0 6px 20px rgba(255, 153, 0, 0.3)"
          }}
        >
          <span style={{ color: "#000000", fontWeight: "900", fontSize: "19px", fontStyle: "italic", letterSpacing: "-0.5px" }}>
            AA <span style={{ fontSize: "13px", fontStyle: "normal", fontWeight: "700" }}>Cars</span>
          </span>
          <div style={{ width: "1px", height: "30px", background: "rgba(0,0,0,0.2)" }} />
          <span style={{ color: "#000000", fontSize: "11px", fontWeight: "800", lineHeight: "1.2", letterSpacing: "0.5px" }}>
            APPROVED CODE<br />
            <span style={{ fontSize: "8.5px", fontWeight: "600", opacity: "0.85" }}>STANDARDS COMPLIANT</span>
          </span>
        </div>
      </div>
    </section>
  );
}