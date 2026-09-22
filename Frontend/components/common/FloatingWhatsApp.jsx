"use client";
import React, { useState, useEffect } from "react";

export default function FloatingWhatsApp() {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsAnimating(true);
      // Small delay to create animation effect
      setTimeout(() => setIsAnimating(false), 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleWhatsAppClick = () => {
    // Replace with your actual WhatsApp number
    const phoneNumber = "+447878642902"; // Format: country code + number without + or spaces
    const message = encodeURIComponent("Hello! I'm interested in your services.");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  return (
    <div className="floating-whatsapp-container">
      <button
        onClick={handleWhatsAppClick}
        className={`floating-whatsapp-btn ${isAnimating ? "animating" : ""}`}
        title="Chat with us on WhatsApp"
        aria-label="Open WhatsApp chat"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
        <span className="whatsapp-text">Chat</span>
      </button>

      <style jsx>{`
        .floating-whatsapp-container {
          position: fixed;
          bottom: 140px;
          right: 20px;
          z-index: 998;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        .floating-whatsapp-btn {
          background: linear-gradient(135deg, #25d366 0%, #20ba5d 100%);
          color: white;
          border: none;
          border-radius: 50px;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          flex-direction: column;
          gap: 2px;
          font-size: 10px;
          font-weight: 600;
          position: relative;
        }

        .floating-whatsapp-btn:hover {
          transform: scale(1.1) translateY(-5px);
          box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4);
        }

        .floating-whatsapp-btn:active {
          transform: scale(0.95);
        }

        .floating-whatsapp-btn.animating {
          animation: pulse-scroll 0.3s ease-out;
        }

        .floating-whatsapp-btn svg {
          width: 24px;
          height: 24px;
        }

        .whatsapp-text {
          display: none;
        }

        @keyframes pulse-scroll {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }

        @media (max-width: 768px) {
          .floating-whatsapp-container {
            bottom: 90px;
            right: 25px;
          }

          .floating-whatsapp-btn {
            width: 56px;
            height: 56px;
          }

          .floating-whatsapp-btn svg {
            width: 22px;
            height: 22px;
          }
        }

        @media (max-width: 480px) {
          .floating-whatsapp-container {
            bottom: 80px;
            right: 10px;
          }

          .floating-whatsapp-btn {
            width: 50px;
            height: 50px;
          }

          .floating-whatsapp-btn svg {
            width: 20px;
            height: 20px;
          }
        }
      `}</style>
    </div>
  );
}
