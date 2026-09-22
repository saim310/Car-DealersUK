"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function FinanceCalculatorSection() {
  const [vehiclePrice, setVehiclePrice] = useState("19995");
  const [deposit, setDeposit] = useState("2000");
  const [term, setTerm] = useState(48);
  const [loanType, setLoanType] = useState("Personal");

  // Dynamic Calculation
  const principal = Math.max(0, Number(vehiclePrice || 0) - Number(deposit || 0));
  const annualInterestRate = 0.1195; // 11.95% APR
  const totalInterest = principal * annualInterestRate * (term / 12);
  const totalPayable = principal + totalInterest;
  const weeklyRepayment = totalPayable / (term * 4.333);

  return (
    <section 
      style={{ 
        position: "relative", 
        padding: "90px 20px", 
        background: "#ffffff", 
        width: "100%", 
        overflow: "hidden" 
      }}
    >
      {/* Background Japanese Car & Shrine Image with Light Fade / Overlay */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1, opacity: 0.22, pointerEvents: "none" }}>
        <Image
          src="/assets/images/section/financecalculator.jpg"
          alt="Finance Background"
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </div>

      <div style={{ maxWidth: "1400px", margin: "0 auto", position: "relative", zIndex: 2 }}>
        <div 
          style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", 
            alignItems: "center", 
            gap: "50px" 
          }}
        >
          {/* Left Side: Headings, Bullet Points & CTA */}
          <div>
            {/* Subtitle with orange line */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <div style={{ width: "24px", height: "2px", background: "#ff5722" }} />
              <span style={{ fontSize: "13px", fontWeight: "700", color: "#ff5722", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                Finance Your Next Car
              </span>
            </div>

            {/* Main Title */}
            <h2 style={{ fontSize: "clamp(2.4rem, 4vw, 3.5rem)", fontWeight: "800", color: "#111111", margin: "0 0 16px 0", lineHeight: "1.15" }}>
              Drive Away Sooner with <br />
              <span style={{ color: "#ff5722" }}>Flexible Finance.</span>
            </h2>

            {/* Description */}
            <p style={{ fontSize: "16px", color: "#555555", lineHeight: "1.6", margin: "0 0 30px 0", maxWidth: "540px" }}>
              We work with trusted finance partners to help make your next vehicle more affordable and straightforward.
            </p>

            {/* Checkmark Features List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "35px" }}>
              {[
                "Flexible repayment terms",
                "Competitive finance options",
                "Quick & easy application process",
                "Finance options tailored to your budget"
              ].map((text, index) => (
                <div key={index} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div 
                    style={{ 
                      width: "22px", 
                      height: "22px", 
                      borderRadius: "50%", 
                      background: "#ff5722", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center", 
                      flexShrink: 0 
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span style={{ fontSize: "15px", fontWeight: "600", color: "#222222" }}>
                    {text}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Button & Disclaimer */}
            <div>
              <Link 
                href="/finance"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  background: "#ff5722",
                  color: "#ffffff",
                  padding: "16px 36px",
                  borderRadius: "50px",
                  fontSize: "16px",
                  fontWeight: "700",
                  textDecoration: "none",
                  boxShadow: "0 8px 25px rgba(255, 87, 34, 0.35)",
                  transition: "transform 0.2s ease"
                }}
              >
                Get a Finance Quote
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
              <p style={{ fontSize: "12px", color: "#777777", marginTop: "12px", margin: "12px 0 0 0" }}>
                Finance subject to approval. T&Cs apply.
              </p>
            </div>
          </div>

          {/* Right Side: Dark Floating Calculator Box */}
          <div 
            style={{
              background: "#111622",
              borderRadius: "20px",
              padding: "35px 30px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
              color: "#ffffff",
              border: "1px solid rgba(255,255,255,0.08)",
              maxWidth: "480px",
              width: "100%",
              marginLeft: "auto",
              marginRight: "auto"
            }}
          >
            {/* Calculator Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "25px", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "15px" }}>
              <div style={{ width: "16px", height: "2px", background: "#ff5722" }} />
              <span style={{ fontSize: "12px", fontWeight: "700", color: "#ff5722", letterSpacing: "1.2px", textTransform: "uppercase" }}>
                Finance Calculator
              </span>
            </div>

            {/* Vehicle Price Input */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#9ca3af", marginBottom: "8px" }}>
                Vehicle Price
              </label>
              <div style={{ position: "relative" }}>
                <input 
                  type="number"
                  value={vehiclePrice}
                  onChange={(e) => setVehiclePrice(e.target.value)}
                  style={{ 
                    width: "100%", 
                    padding: "14px 18px", 
                    background: "#1c2436", 
                    border: "1px solid rgba(255,255,255,0.06)", 
                    borderRadius: "10px", 
                    color: "#ffffff", 
                    fontSize: "16px", 
                    fontWeight: "700", 
                    outline: "none" 
                  }}
                />
              </div>
            </div>

            {/* Deposit / Trade-in Input */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#9ca3af", marginBottom: "8px" }}>
                Deposit / Trade-in
              </label>
              <div style={{ position: "relative" }}>
                <input 
                  type="number"
                  value={deposit}
                  onChange={(e) => setDeposit(e.target.value)}
                  style={{ 
                    width: "100%", 
                    padding: "14px 18px", 
                    background: "#1c2436", 
                    border: "1px solid rgba(255,255,255,0.06)", 
                    borderRadius: "10px", 
                    color: "#ffffff", 
                    fontSize: "16px", 
                    fontWeight: "700", 
                    outline: "none" 
                  }}
                />
              </div>
            </div>

            {/* Term (Months) Selector */}
            <div style={{ marginBottom: "25px" }}>
              <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#9ca3af", marginBottom: "10px" }}>
                Term (Months)
              </label>
              <div style={{ display: "flex", gap: "8px", justifyContent: "space-between" }}>
                {[12, 24, 36, 48, 60].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTerm(t)}
                    style={{
                      flex: 1,
                      height: "44px",
                      borderRadius: "10px",
                      background: term === t ? "#ff5722" : "#1c2436",
                      border: "none",
                      color: "#ffffff",
                      fontSize: "14px",
                      fontWeight: "700",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      boxShadow: term === t ? "0 4px 15px rgba(255, 87, 34, 0.4)" : "none"
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Estimated Weekly Repayment & Type Selector */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", background: "#182030", padding: "16px 20px", borderRadius: "12px" }}>
              <div>
                <span style={{ display: "block", fontSize: "12px", color: "#9ca3af", fontWeight: "600", marginBottom: "4px" }}>
                  Estimated Weekly Repayment
                </span>
                <span style={{ fontSize: "28px", fontWeight: "800", color: "#ff5722" }}>
                  £{weeklyRepayment > 0 ? weeklyRepayment.toFixed(0) : "0"} <span style={{ fontSize: "14px", color: "#ffffff", fontWeight: "600" }}>/wk</span>
                </span>
              </div>
              <select 
                value={loanType}
                onChange={(e) => setLoanType(e.target.value)}
                style={{ 
                  background: "#1c2436", 
                  color: "#ffffff", 
                  border: "1px solid rgba(255,255,255,0.08)", 
                  padding: "10px 14px", 
                  borderRadius: "10px", 
                  fontSize: "13px", 
                  fontWeight: "600", 
                  outline: "none", 
                  cursor: "pointer" 
                }}
              >
                <option value="Personal">Personal</option>
                <option value="Business">Business</option>
              </select>
            </div>

            {/* Apply Now Button */}
            <Link
              href="/apply-finance"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                width: "100%",
                background: "#ff5722",
                color: "#ffffff",
                border: "none",
                padding: "16px",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: "700",
                textDecoration: "none",
                cursor: "pointer",
                boxShadow: "0 6px 20px rgba(255, 87, 34, 0.35)",
                transition: "background 0.2s ease"
              }}
            >
              Apply Now
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}