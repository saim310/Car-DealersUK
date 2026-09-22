"use client";

import { useState } from "react";

export default function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <style jsx>{`
        .floating-container {
          position: fixed;
          bottom: 30px;
          right: 30px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* The Main Toggle Button */
        .main-btn {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background-color: #22c55e;
          border: none;
          outline: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 25px rgba(34, 197, 94, 0.4);
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), background-color 0.2s;
          position: relative;
        }

        .main-btn:hover {
          transform: scale(1.1);
          background-color: #16a34a;
        }

        /* Subtle Pulse Ring Effect */
        .main-btn::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 2px solid #22c55e;
          animation: pulseRing 2s infinite;
          opacity: 0;
        }

        @keyframes pulseRing {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        /* Expanded Pill Menu */
        .contact-pill-menu {
          position: absolute;
          bottom: 75px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(229, 231, 235, 0.8);
          padding: 12px 10px;
          border-radius: 40px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          opacity: ${isOpen ? "1" : "0"};
          visibility: ${isOpen ? "visible" : "hidden"};
          transform: ${isOpen ? "translateY(0) scale(1)" : "translateY(20px) scale(0.9)"};
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Individual Action Buttons */
        .action-item {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          text-decoration: none;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s, filter 0.2s;
        }

        .action-item:hover {
          transform: scale(1.12);
          filter: brightness(1.1);
        }

        .btn-email { background-color: #3b82f6; }   /* Blue */
        .btn-whatsapp { background-color: #25d366; }/* WhatsApp Green */
        .btn-phone { background-color: #8b5cf6; }   /* Purple */

        /* SVG Icon styling */
        .icon {
          width: 22px;
          height: 22px;
          fill: none;
          stroke: currentColor;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
      `}</style>

      <div className="floating-container">
        {/* Expanded Vertical Options Container */}
        <div className="contact-pill-menu">
          {/* Email Option */}
          <a href="mailto:sales@ukaautotrade.co.uk" className="action-item btn-email" title="Send Email">
            <svg className="icon" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
          </a>

          {/* WhatsApp Option */}
          <a href="https://wa.me/447878642902" target="_blank" rel="noopener noreferrer" className="action-item btn-whatsapp" title="WhatsApp Chat">
            <svg className="icon" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
          </a>

          {/* Phone Call Option */}
          <a href="tel:+447383908070" className="action-item btn-phone" title="Call Us">
            <svg className="icon" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
          </a>
        </div>

        {/* Main Floating Trigger Button */}
        <button className="main-btn" onClick={toggleMenu} aria-label="Open Contact Options">
          {isOpen ? (
            <svg className="icon" style={{ stroke: "#ffffff", width: "24px", height: "24px" }} viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          ) : (
            <svg className="icon" style={{ stroke: "#ffffff", width: "24px", height: "24px" }} viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
          )}
        </button>
      </div>
    </>
  );
}