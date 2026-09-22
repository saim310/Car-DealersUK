"use client";
import React, { useState } from "react";

export default function HomeFAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What types of vehicles does UKA Auto Trade offer?",
      answer: "We specialize in a wide selection of quality Japanese imports and used cars, carefully inspected and sourced from trusted suppliers across the UK and Japan."
    },
    {
      question: "Where is your dealership located?",
      answer: "Our yard is conveniently located at 180a Rupert St, Birmingham B7 5DT, UK. You are welcome to visit us to explore our available inventory in person."
    },
    {
      question: "Are your vehicles inspected before purchase?",
      answer: "Yes, every vehicle in our inventory undergoes rigorous checks and quality preparations to ensure you receive a dependable, top-standard car."
    },
    {
      question: "Do you offer vehicle financing or trade-in options?",
      answer: "We offer flexible financing solutions and trade-in support to help you spread the cost and easily drive away in your preferred car."
    },
    {
      question: "How can I contact your team for inquiries or quotes?",
      answer: "You can reach us directly via phone at +44 7383 908070, email us at info@ukajapan.com, or visit our yard in Birmingham."
    }
  ];

  return (
    <section style={{ padding: "90px 20px", background: "#f9fafb", width: "100%" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        
        {/* Section Header */}
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
            <div style={{ width: "24px", height: "2px", background: "#ff5722" }} />
            <span style={{ fontSize: "13px", fontWeight: "700", color: "#ff5722", letterSpacing: "1.5px", textTransform: "uppercase" }}>
              Got Questions?
            </span>
            <div style={{ width: "24px", height: "2px", background: "#ff5722" }} />
          </div>
          <h2 style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: "800", color: "#111111", margin: 0, lineHeight: "1.2" }}>
            Frequently Asked Questions
          </h2>
          <p style={{ fontSize: "15px", color: "#666666", marginTop: "10px", maxWidth: "600px", marginLeft: "auto", marginRight: "auto" }}>
            Find quick answers to common questions about our Japanese imports, yard location, financing, and vehicle inspection standards.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {faqs.map((faq, index) => {
            const isOpen = activeIndex === index;
            return (
              <div 
                key={index}
                style={{
                  background: "#ffffff",
                  borderRadius: "12px",
                  border: "1px solid #eaeaea",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.02)",
                  overflow: "hidden",
                  transition: "border-color 0.2s ease"
                }}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  style={{
                    width: "100%",
                    padding: "20px 24px",
                    background: "none",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    textAlign: "left",
                    gap: "20px"
                  }}
                >
                  <span style={{ fontSize: "17px", fontWeight: "700", color: isOpen ? "#ff5722" : "#111111", transition: "color 0.2s ease" }}>
                    {faq.question}
                  </span>
                  <span 
                    style={{ 
                      width: "30px", 
                      height: "30px", 
                      borderRadius: "50%", 
                      background: isOpen ? "#ff5722" : "#f4f4f4", 
                      color: isOpen ? "#ffffff" : "#333333",
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      flexShrink: 0,
                      transition: "all 0.2s ease",
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)"
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </span>
                </button>

                {isOpen && (
                  <div style={{ padding: "0 24px 24px 24px" }}>
                    <p style={{ fontSize: "14.5px", color: "#666666", lineHeight: "1.6", margin: 0 }}>
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}