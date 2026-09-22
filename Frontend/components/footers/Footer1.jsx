"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

export default function Footer1() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [success, setSuccess] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dynamicFooterData, setDynamicFooterData] = useState([]);
  const [newsletterText, setNewsletterText] = useState("Stay up to date with special offers!");

 const handleNewsletter = async (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setLoading(true);
    setShowMessage(false);
    try {
      const res = await fetch("https://apis.ukaautotrade.co.uk/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletterEmail }),
      });
      if (res.ok) {
        setSuccess(true);
        setNewsletterEmail("");
      } else {
        setSuccess(false);
      }
    } catch (err) {
      setSuccess(false);
    } finally {
      setLoading(false);
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 5000);
    }
  };

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const res = await fetch("https://apis.ukaautotrade.co.uk/api/footer");
        const data = await res.json();
        if (res.ok && data) {
          const parseData = (val) => (typeof val === "string" ? JSON.parse(val) : val || []);
          const mappedFooterData = [
            {
              heading: "UKA Auto Trade",
              menuItems: parseData(data.customer_service).map((item) => ({ text: item.text, href: item.url })),
            },
            {
              heading: "Popular Brands",
              menuItems: parseData(data.why_2cc).map((item) => ({ text: item.text, href: item.url })),
            },
            {
              heading: "Others",
              menuItems: parseData(data.for_investors).map((item) => ({ text: item.text, href: item.url })),
            },
          ];
          setDynamicFooterData(mappedFooterData);
          if (data.newsletter_text) setNewsletterText(data.newsletter_text);
        }
      } catch (err) {
        console.error("Error fetching footer data:", err);
      }
    };
    fetchFooter();
  }, []);

  useEffect(() => {
    const headings = document.querySelectorAll(".footer-heading-mobie");
  const toggleOpen = (event) => {
  const parent = event.target.closest(".footer-col-block");
  if (!parent) return; // ← add this guard
  const content = parent.querySelector(".tf-collapse-content");
  if (!content) return;

  if (parent.classList.contains("open")) {
    content.style.height = content.scrollHeight + "px";

    requestAnimationFrame(() => {
      content.style.height = "0px";
    });

    parent.classList.remove("open");
  } else {
    parent.classList.add("open");

    content.style.height = content.scrollHeight + "px";

    content.addEventListener(
      "transitionend",
      () => {
        if (parent.classList.contains("open")) {
          content.style.height = "auto";
        }
      },
      { once: true }
    );
  }
};
    headings.forEach((heading) => heading.addEventListener("click", toggleOpen));
    return () => headings.forEach((heading) => heading.removeEventListener("click", toggleOpen));
  }, [dynamicFooterData]);

  return (
    <footer id="footer" className="footer-black-theme pt-5 pb-3">
      <div className="container">
        <div className="footer-main" style={{borderTop:"none", paddingTop:"40px", paddingBottom:"0px"}}>
          <div className="row gy-5">
            {/* Dynamic Menu Columns */}
            {dynamicFooterData.map((column, index) => (
              <div className="col-lg-2 col-md-4 col-12" key={index} style={{marginTop:"0px", marginBottom:"0px"}}>
                <div className="widget widget-menu footer-col-block">
                  <div className="footer-heading-desktop mb-4">
                    <h5 className="fw-bold text-uppercase heading-orange">{column.heading}</h5>
                  </div>
                  <div className="footer-heading-mobie d-lg-none">
                    <div className="d-flex justify-content-between align-items-center border-bottom border-dark">
                        <h5 className="heading-orange mb-0">{column.heading}</h5>
                        
                    </div>
                  </div>
                  <ul className="list-unstyled tf-collapse-content">
                    {column.menuItems.map((item, itemIndex) => (
                      <li key={itemIndex} className="mb-3" style={{color:"#a9a9a9"}}>
                        <Link href={item.href || "#"} className="footer-link">
                          {item.text}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}

            {/* Contact Us Column */}
            <div className="col-lg-3 col-md-6 col-12" style={{marginTop:"0px", marginBottom:"0px"}}>
              <div className="widget footer-col-block">
                <div className="footer-heading-desktop mb-4">
                  <h5 className="fw-bold text-uppercase heading-orange">Contact Us</h5>
                </div>
                <div className="footer-heading-mobie d-lg-none">
                    <div className="d-flex justify-content-between align-items-center border-bottom border-dark ">
                        <h5 className="heading-orange mb-0">Contact Us</h5>
                     
                    </div>
                </div>
                <ul className="list-unstyled tf-collapse-content contact-list" style={{color:"#a9a9a9"}}>
                  <li className="mb-3 d-flex gap-2">
                    <Mail size={18} className="text-orange shrink-0" />
                    <span className="footer-link">sales@ukaautotrade.co.uk</span>
                  </li>
                  <li className="mb-3 d-flex gap-2">
                    <Phone size={18} className="text-orange shrink-0" />
                    <span className="footer-link">+44 7383 908070</span>
                  </li>
                  <li className="mb-3 d-flex gap-2">
                    <MapPin size={18} className="text-orange shrink-0" />
                    <span className="footer-link">Yard: 180a Rupert St, Birmingham B7 5DT, UK</span>
                  </li>
                  <li className="mb-3 d-flex gap-2">
                    <Clock size={18} className="text-orange shrink-0" />
                    <span className="footer-link">Mon-Sat 9:00-18:00 | Sun 10:00-16:00</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Newsletter Column - Always Visible */}
            <div className="col-lg-3 col-md-6 col-12" style={{marginTop:"0px", marginBottom:"0px"}}>
              <div className="widget">
                <div className="footer-heading-desktop mb-4">
                  <h5 className="fw-bold text-uppercase heading-orange">Newsletter</h5>
                </div>
                {/* Mobile version has a plain header to match but no toggle */}
                <div className="d-lg-none mb-4">
                   <h5 className="fw-bold text-uppercase heading-orange">Newsletter</h5>
                </div>
                <p className="mb-4 text-light-gray">{newsletterText}</p>
                <form className="newsletter-form position-relative" onSubmit={handleNewsletter}>
                    <input
                      type="email"
                      className="form-control newsletter-input"
                      placeholder="Your email address"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      required
                    />
                    <button type="submit" className="newsletter-submit-btn" disabled={loading}>
                        {loading ? <span className="nl-spinner" /> : <Send size={18} />}
                    </button>
                </form>
                {showMessage && (
                  <div className={`newsletter-message ${success ? 'success' : 'error'}`}>
                    {success ? '✓ Subscribed successfully!' : '✗ Subscription failed. Try again.'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom pt-4 mt-1 border-top border-dark">
          <div className="row align-items-center gy-4">
            <div className="col-12 col-md-6 text-center text-md-start">
              <Link href="/">
                <Image
                  alt="UKA Logo"
                  width={220}
                  height={60}
                  src="/assets/images/logo/80 x 450-02.png"
                  style={{ objectFit: "contain" }}
                />
              </Link>
            </div>
            <div className="col-12 col-md-6 d-flex justify-content-center justify-content-md-end mt-4">
              <div className="social-icons d-flex gap-3 ">
                <a href="https://www.facebook.com/ukajapan" className="social-link"><i className="icon-autodeal-facebook" /></a>
                <a href="https://www.tiktok.com/@uka_japan?_r=1&_t=ZS-95OWtQag8If" className="social-link"><i className="fab fa-tiktok" /></a>
                <a href="https://www.instagram.com/ukajapan_/" className="social-link"><i className="icon-autodeal-instagram" /></a>
              </div>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-12 text-center">
              <p className="small mb-0" style={{color:"#a9a9a9"}}>
                © {new Date().getFullYear()} UKA Group. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer-black-theme {
          background-color: #0d0d0d;
          color: #a9a9a9;
        }
        .text-orange { color: #FF7101; }
        .shrink-0 { flex-shrink: 0; }
        .heading-orange {
          color: #FF7101;
          font-size: clamp(0.85rem, 2vw, 0.95rem);
          font-weight: 700;
          letter-spacing: 1px;
        }
        .footer-link {
          color: #a9a9a9;
          text-decoration: none;
          transition: 0.3s;
          font-size: clamp(0.8rem, 1.5vw, 0.9rem);
        }
        .footer-link:hover { cursor: pointer; color: #FF7101; }
        
        .newsletter-input {
          background-color: #1a1a1a;
          border: 1px solid #333;
          color: white;
          padding: clamp(10px, 2vw, 12px) clamp(40px, 8vw, 50px) clamp(10px, 2vw, 12px) clamp(12px, 2vw, 15px);
          border-radius: 8px;
          font-size: clamp(0.85rem, 1.5vw, 0.9rem);
          width: 100%;
          transition: border-color 0.3s;
        }
        .newsletter-input:focus {
          border-color: #FF7101;
          outline: none;
        }
        .newsletter-form {
          margin-bottom: 12px;
        }
        .newsletter-submit-btn {
            position: absolute;
            right: 5px; 
            top: 50%;
            transform: translateY(-50%);
            background: #FF7101;
            border: none;
            color: white;
            padding: clamp(8px, 1.5vw, 10px) clamp(12px, 2vw, 15px);
            border-radius: 6px;
            transition: 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .newsletter-submit-btn:hover:not(:disabled) { background: #e66600; }
        .newsletter-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        
        .nl-spinner {
          display: inline-block;
          width: 14px;
          height: 14px;
          border: 2px solid #ffffff;
          border-top: 2px solid transparent;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .newsletter-message {
          padding: clamp(8px, 1.5vw, 12px) clamp(12px, 2vw, 16px);
          border-radius: 6px;
          font-size: clamp(0.8rem, 1.5vw, 0.85rem);
          text-align: center;
          animation: fadeIn 0.3s ease;
        }
        .newsletter-message.success {
          background-color: #1a4d2e;
          color: #4ade80;
          border: 1px solid #4ade80;
        }
        .newsletter-message.error {
          background-color: #4d1a1a;
          color: #ff6b6b;
          border: 1px solid #ff6b6b;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .social-link {
          color: white;
          width: clamp(36px, 8vw, 38px);
          height: clamp(36px, 8vw, 38px);
          display: flex;
          align-items: center;
          justify-content: center;
          background: #1a1a1a;
          border-radius: 50%;
          transition: 0.3s;
          font-size: clamp(0.9rem, 2vw, 1.1rem);
        }
        .social-link:hover { background: #FF7101; transform: translateY(-3px); }

        .plus-icon {
          color: #FF7101;
          font-size: clamp(1.2rem, 2vw, 1.4rem);
          line-height: 1;
          transition: transform 0.3s ease;
        }
        
        .footer-bottom {
          padding-top: clamp(12px, 2vw, 16px) !important;
          padding-bottom: clamp(12px, 2vw, 16px) !important;
        }

        /* Tablet/Small Desktop (740px - 1000px) - Responsive Footer */
        @media (max-width: 1000px) and (min-width: 740px) {
          .footer-heading-desktop { display: none; }
          .footer-heading-mobie { 
            cursor: pointer; 
            display: block;
            margin-bottom: 16px;
          }
          
          .tf-collapse-content { 
             height: auto !important; 
             overflow: visible !important; 
             margin-bottom: 20px;
          }
          
          .footer-col-block { margin-bottom: 20px; }
          .widget-menu { margin-bottom: 15px; }
          
          .footer-main .col-lg-2,
          .footer-main .col-lg-3 {
            flex: 0 0 auto;
            width: 50%;
            padding-right: clamp(12px, 2vw, 15px);
            padding-left: clamp(12px, 2vw, 15px);
          }
          
          .footer-main .row {
            margin-right: clamp(-12px, -2vw, -15px);
            margin-left: clamp(-12px, -2vw, -15px);
          }
        }

        /* Mobile (below 740px) */
        @media (max-width: 739px) {
          .footer-heading-desktop { display: none; }
          .footer-heading-mobie { 
            cursor: pointer; 
            display: block;
            margin-bottom: 12px;
          }
             .footer-heading-mobie > .d-flex::after {
            content: '+';
            color: #FF7101;
           font-size: 24px;
            font-weight: 300;
            line-height: 1;
            margin-left: auto;
            transition: transform 0.3s ease;
            
          }
          .footer-col-block.open .footer-heading-mobie > .d-flex::after {
            content: '-';
          }
          
        .tf-collapse-content {
  height: 0;
  overflow: hidden;
  transition: height 0.35s ease, margin 0.35s ease;
  will-change: height;
  margin-bottom: 0;
}

.footer-col-block.open .tf-collapse-content {
  margin-bottom: 20px;
}
          
       
          
          .footer-main .col-lg-2,
          .footer-main .col-lg-3 {
            width: 100% !important;
          }
        }
        
        /* Toggle button visibility for 570px-740px */
        @media (max-width: 739px) and (min-width: 570px) {
         
          
          .footer-col-block.open .footer-heading-mobie > .d-flex::after{
            content: '−';
          }
        }
        
        /* Extra small mobile (below 570px) */
        @media (max-width: 569px) {
          .footer-main .row { 
            --bs-gutter-y: clamp(24px, 5vw, 40px); 
          }
          .footer-col-block { margin-bottom: 12px; }
          
          // .footer-heading-mobie .d-flex::after {
          //   content: '+';
          //   color: #FF7101;
          //   font-size: clamp(1.1rem, 2.5vw, 1.3rem);
          //   font-weight: 300;
          //   line-height: 1;
          //   margin-left: auto;
          // }
          
       .footer-col-block.open .footer-heading-mobie > .d-flex::after {
  content: '−';
}
        }
      `}</style>
    </footer>
  );
}