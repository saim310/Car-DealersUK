import React from "react";
import Accordion from "@/components/common/Accordions";
import { features } from "@/data/faqs";

export default function Features({ carItem, features }) {
  const carFeatures = Array.isArray(features) && features.length > 0
    ? features
    : carItem?.features && carItem.features.length > 0
      ? carItem.features
      : [];

  return (
    <div
      className="features-inner tf-collapse-content mt-30"
      style={{
        background: "#ffffff",
        border: "1px solid #eaeaea",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
        overflow: "hidden",
        position: "relative",
        padding: "30px",
        width: "100%",
      }}
    >
  

      <div className="inner" style={{ width: "100%" }}>
        {carFeatures.length > 0 ? (
          <div 
            style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(3, 1fr)", 
              gap: "15px",
              width: "100%"
            }}
          >
            {carFeatures.map((feature, idx) => (
              <div 
                key={idx} 
                className="listing-feature-wrap"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  background: "#f9fafb",
                  padding: "12px 14px",
                  borderRadius: "8px",
                  border: "1px solid #f3f4f6",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              >
                <i 
                  className="icon-autodeal-check" 
                  style={{ color: "#ff6b00", fontSize: "16px", flexShrink: 0 }} 
                />
                <span 
                  style={{ 
                    fontSize: "13.5px", 
                    fontWeight: "600", 
                    color: "#1f2937",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }}
                >
                  {feature}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: "#999", fontSize: "12px", margin: 0 }}>No features listed.</p>
        )}
      </div>

      {/* <div className="row">
        <div className="col-lg-12 flat-accordion">
          <Accordion parentClass="flat-toggle style-1" faqData={features} />
        </div>
      </div> */}
    </div>
  );
}