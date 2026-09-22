"use client";
import React, { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function NavbarUtils() {
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  // Handle map location click
  // const handleMapLocation = () => {
  //   window.open("https://maps.google.com/?q=2972+Westheimer+Rd+Santa+Ana+Illinois+85486", "_blank");
  // };

  // Handle translate change
  const handleTranslate = (lang) => {
    setSelectedLanguage(lang);
    // You can implement actual translation logic here
    // For now, this is a placeholder
    console.log("Language changed to:", lang);
    // If using Google Translate or similar service, implement here
  };

  // Social media links
  const socialLinks = [
    {
      id: "facebook",
      icon: "icon-autodeal-facebook",
      url: "https://www.facebook.com/ukajapan",
      label: "Facebook",
    },
    {
      id: "tiktok",
       icon: "fab fa-tiktok",
      url: "https://www.tiktok.com/@uka_japan?_r=1&_t=ZS-95OWtQag8If",
      label: "Twitter",
    },
    {
      id: "instagram",
      icon: "icon-autodeal-instagram",
      url: "https://www.instagram.com/ukajapan_/",
      label: "Instagram",
    },

  ];

  return (
    <div className="navbar-utils flex align-center gap-3">
      {/* Map Location Icon
      <div className="navbar-location">
        <button
          onClick={handleMapLocation}
          className="location-btn flex items-center justify-center"
          title="View our location"
          aria-label="View location on map"
        >
          <svg
            width={20}
            height={20}
            style={{color:"white"}}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </button>
      </div> */}

      {/* Social Media Icons */}
      <div className="navbar-social flex align-center gap-2">
        {socialLinks.map((social) => (
          <a
            key={social.id}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon flex items-center justify-center"
            title={social.label}
            aria-label={social.label}
          >
            <i className={`${social.icon} fs-16`} />
          </a>
        ))}
      </div>

      <style jsx>{`
        @media (max-width: 992px) {
          .navbar-social {
            display: none !important;
          }

          .mobile-menu .navbar-social {
            display: none !important;
          }
        }
      `}</style>

      {/* Language Translator */}
      {/* <div className="navbar-translate">
        <div className="dropdown">
          <button
          style={{color:"white"}}
            className="translate-btn flex items-center justify-center"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            data-bs-auto-close="true"
            title="Change language"
            aria-label="Select language"
          >
            <svg
              width={20}
              height={20}
              style={{color:"white"}}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span className="translate-label">{selectedLanguage.toUpperCase()}</span>
          </button>
          <ul className="dropdown-menu dropdown-menu-end translate-dropdown">
            <li>
              <button
                className={`dropdown-item translate-option ${selectedLanguage === "en" ? "active" : ""}`}
                onClick={() => handleTranslate("en")}
              >
                <span>English</span>
              </button>
            </li>
            <li>
              <button 
              
                className={`dropdown-item translate-option ${selectedLanguage === "es" ? "active" : ""}`}
                onClick={() => handleTranslate("es")}
              >
                <span>Español</span>
              </button>
            </li>
            <li>
              <button
                className={`dropdown-item translate-option ${selectedLanguage === "fr" ? "active" : ""}`}
                onClick={() => handleTranslate("fr")}
              >
                <span>Français</span>
              </button>
            </li>
            <li>
              <button
                className={`dropdown-item translate-option ${selectedLanguage === "de" ? "active" : ""}`}
                onClick={() => handleTranslate("de")}
              >
                <span>Deutsch</span>
              </button>
            </li>
            <li>
              <button
                className={`dropdown-item translate-option ${selectedLanguage === "ar" ? "active" : ""}`}
                onClick={() => handleTranslate("ar")}
              >
                <span>العربية</span>
              </button>
            </li>
          </ul>
        </div>
      </div> */}

      <style jsx>{`
        .navbar-utils {
          padding: 0 15px;
        }

        .navbar-location,
        .navbar-social,
        .navbar-translate {
          display: flex;
          align-items: center;
        }

        .location-btn,
        .social-icon,
        .translate-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 5px;
          border-radius: 4px;
          transition: all 0.3s ease;
        }

        .location-btn:hover,
        .social-icon:hover,
        .translate-btn:hover {
          color: #000;
          background: rgba(255, 107, 53, 0.12);
        }

        .social-icon {
          padding: 4px 8px;
          color: #ff5500;
        }

        .social-icon i {
          color: inherit;
        }

        .translate-label {
          font-size: 12px;
          font-weight: 600;
          margin-left: 4px;
        }

        .translate-dropdown {
          min-width: 120px;
        }

        .translate-option {
          width: 100%;
          text-align: left;
          padding: 8px 12px;
          border: none;
          background: transparent;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .translate-option:hover {
          background: rgba(255, 107, 53, 0.1);
          color: #ff5500;
        }

        .translate-option.active {
          background: rgba(255, 107, 53, 0.2);
          color: #ff5500;
          font-weight: 600;
        }

        @media (max-width: 992px) {
          .navbar-utils {
            padding: 0 10px;
            gap: 8px;
          }

          .navbar-social {
            gap: 0;
          }

          .social-icon {
            padding: 3px 6px;
          }
        }

        @media (max-width: 750px) {
          .navbar-social {
            display: none !important;
          }

          .navbar-utils {
            padding: 0 5px;
            gap: 5px;
          }

          .translate-label {
            display: none;
          }

          .location-btn svg,
          .social-icon i,
          .translate-btn svg {
            width: 18px;
            height: 18px;
          }
        }
      `}</style>
    </div>
  );
}
