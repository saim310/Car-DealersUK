"use client";
import React from "react";
import Image from "next/image";

export default function TestimonialModal({ testimonial, isOpen, onClose }) {
  if (!testimonial) return null;

  return (
    <div
      className={`modal fade ${isOpen ? "show" : ""}`}
      id="testimonial_modal"
      tabIndex={-1}
      aria-labelledby="testimonialModalLabel"
      aria-hidden={!isOpen}
      style={{ display: isOpen ? "block" : "none" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={onClose}
            style={{
              position: "absolute",
              right: "20px",
              top: "20px",
              zIndex: 10,
              border: "none",
              background: "none",
              fontSize: "28px",
              cursor: "pointer",
              color: "#333",
            }}
          >
            ×
          </button>

          <div className="modal-body pd-40" style={{ padding: "40px" }}>
            <div className="testimonial-modal-content">
              {/* Quote Icon */}
              <div className="quote-icon mb-4">
                <svg
                  width={48}
                  height={48}
                  viewBox="0 0 36 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.74992 4.5C14.5409 4.5 17.9999 8.4555 17.9999 14.313C17.9699 22.8225 11.5724 28.839 2.34292 29.994C1.48792 30.102 1.15792 28.914 1.94542 28.5645C5.48542 26.9895 7.27492 24.9915 7.50592 23.0145C7.67842 21.537 6.87592 20.2425 5.86642 19.9995C3.25192 19.371 1.49992 16.1145 1.49992 12.75C1.49992 10.562 2.36911 8.46354 3.91628 6.91637C5.46346 5.36919 7.56188 4.5 9.74992 4.5ZM27.7499 4.5C32.5409 4.5 35.9999 8.4555 35.9999 14.313C35.9699 22.8225 29.5724 28.839 20.3429 29.994C19.4879 30.102 19.1579 28.914 19.9454 28.5645C23.4854 26.9895 25.2749 24.9915 25.5059 23.0145C25.6784 21.537 24.8759 20.2425 23.8664 19.9995C21.2519 19.371 19.4999 16.1145 19.4999 12.75C19.4999 10.562 20.3691 8.46354 21.9163 6.91637C23.4635 5.36919 25.5619 4.5 27.7499 4.5Z"
                    fill="#FF8C00"
                  />
                </svg>
              </div>

              {/* Review Text */}
              <p
                className="review-text"
                style={{
                  fontSize: "16px",
                  lineHeight: "1.6",
                  color: "#333",
                  marginBottom: "30px",
                  fontStyle: "italic",
                }}
              >
                "{testimonial.text}"
              </p>

              {/* Author Info */}
              <div className="author-info" style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <div className="author-image" style={{ flexShrink: 0 }}>
                  <Image
                    className="rounded-circle"
                    alt={testimonial.authorName}
                    src={testimonial.authorImage}
                    width={80}
                    height={80}
                    style={{
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div className="author-details">
                  <h4 style={{ margin: "0 0 8px 0", fontSize: "18px", fontWeight: "600" }}>
                    {testimonial.authorName}
                  </h4>
                  <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#666" }}>
                    {testimonial.authorTitle}
                  </p>
                  {testimonial.date && (
                    <p style={{ margin: "0", fontSize: "12px", color: "#999" }}>
                      {testimonial.date}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Backdrop */}
      {isOpen && (
        <div
          className="modal-backdrop fade show"
          onClick={onClose}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1040,
          }}
        />
      )}
    </div>
  );
}
