"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function WhyChooseUsSection() {
  const cards = [
    {
      title: "Quality Japanese Imports",
      description: "Carefully selected vehicles sourced from trusted Japanese suppliers.",
      image: "/assets/images/section/quality.jpg",
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18.4 10.4c-.3-.8-1-1.4-1.9-1.4H7.5c-.9 0-1.6.6-1.9 1.4L3.5 11.1C2.7 11.3 2 12.1 2 13v3c0 .6.4 1 1 1h2"></path>
          <circle cx="7" cy="17" r="2"></circle>
          <circle cx="17" cy="17" r="2"></circle>
          <path d="M5 11l1.5-4.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11"></path>
        </svg>
      )
    },
    {
      title: "Inspected & Prepared",
      description: "Every vehicle is checked and prepared before it reaches you.",
      image: "/assets/images/section/inspected.jpg",
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
      )
    },
    {
      title: "Competitive Prices",
      description: "Great-value vehicles without compromising on quality.",
      image: "/assets/images/section/prices.jpg",
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23"></line>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
      )
    },
    {
      title: "Trusted Support",
      description: "From choosing your car to getting it delivered, we're here to help.",
      image: "/assets/images/section/trust.jpg",
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      )
    }
  ];

  return (
    <section style={{ padding: "90px 20px 70px 20px", background: "#ffffff", width: "100%", position: "relative", overflow: "hidden" }}>
      <div style={{ maxWidth: "1550px", margin: "0 auto" }}>
        
        {/* Header Content */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "30px", marginBottom: "50px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <div style={{ width: "24px", height: "2px", background: "#ff5722" }} />
              <span style={{ fontSize: "13px", fontWeight: "700", color: "#ff5722", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                Why Choose UKA Auto Trade?
              </span>
            </div>
            <h2 style={{ fontSize: "clamp(2.2rem, 3.8vw, 3.2rem)", fontWeight: "800", color: "#111111", margin: 0, lineHeight: "1.15" }}>
              Quality Japanese Imports,<br />
              <span style={{ color: "#ff5722" }}>Built for Your Journey.</span>
            </h2>
          </div>
          <div style={{ maxWidth: "450px" }}>
        
          </div>
        </div>

        {/* 4 Cards Grid - Wider and Lower Height */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "24px", marginBottom: "40px" }}>
          {cards.map((item, index) => (
            <div 
              key={index}
              style={{
                position: "relative",
                background: "#ffffff",
                borderRadius: "16px",
                overflow: "hidden",
                border: "1px solid #eaeaea",
                boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                display: "flex",
                flexDirection: "row",
                height: "210px"
              }}
            >
              {/* Left Side: Text content */}
              <div style={{ flex: "1 1 52%", padding: "20px 18px", display: "flex", flexDirection: "column", justifyContent: "space-between", zIndex: 2 }}>
                <div>
                  <div style={{ color: "#ff5722", marginBottom: "8px" }}>
                    {item.icon}
                  </div>
                  <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#111111", margin: "0 0 6px 0", lineHeight: "1.2" }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: "12.5px", color: "#666666", lineHeight: "1.4", margin: 0 }}>
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Right Side Image with Horizontal Fade Effect */}
              <div style={{ position: "relative", flex: "1 1 48%", height: "100%", overflow: "hidden" }}>
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  style={{ objectFit: "cover", objectPosition: "center" }}
                />
                {/* Horizontal gradient fade from left (white) to right (image) */}
                <div 
                  style={{ 
                    position: "absolute", 
                    inset: 0, 
                    background: "linear-gradient(to right, #ffffff 0%, rgba(255,255,255,0.75) 30%, transparent 100%)" 
                  }} 
                />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Button */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
          <Link 
            href="/inventory"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              background: "#ff5722",
              color: "#ffffff",
              padding: "15px 36px",
              borderRadius: "50px",
              fontSize: "16px",
              fontWeight: "700",
              textDecoration: "none",
              boxShadow: "0 8px 25px rgba(255, 87, 34, 0.35)",
              transition: "transform 0.2s ease, background 0.2s ease"
            }}
          >
            View Our Stock
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
}