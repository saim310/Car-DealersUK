"use client";
import React, { useRef, useState } from "react";

export default function Contact() {
  const formRef = useRef();
  const [success, setSuccess] = useState(true);
  const [showMessage, setShowMessage] = useState(false);

  const handleShowMessage = () => {
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  };

  const sendMail = async (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };
    try {
      const res = await fetch("https://apis.ukaautotrade.co.uk/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setSuccess(true);
        handleShowMessage();
        formRef.current.reset();
      } else {
        setSuccess(false);
        handleShowMessage();
      }
    } catch (err) {
      setSuccess(false);
      handleShowMessage();
    }
  };

  return (
    <>
      <style>{`
        /* ── Contact Page Styles ── */
        .contact-page-wrapper {
          background: #f8f8f8;
        }

        /* ── Hero strip ── */
        .contact-hero {
          background: linear-gradient(135deg, #24272C 0%, #3a3f47 100%);
          padding: 56px 0 52px;
          text-align: center;
        }
        .contact-hero h1 {
          color: #fff;
          font-size: 38px;
          font-weight: 700;
          margin-bottom: 10px;
          letter-spacing: -0.5px;
        }
        .contact-hero p {
          color: rgba(255,255,255,0.65);
          font-size: 16px;
          margin: 0;
        }
        .contact-hero .orange-dot {
          color: #FF7101;
        }

        /* ── Map + Info row ── */
        .contact-map-row {
          padding: 52px 0 0;
        }

        /* Map card */
        .contact-map-card {
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(0,0,0,0.09);
          height: 100%;
          min-height: 440px;
        }
        .contact-map-card iframe {
          width: 100%;
          height: 100%;
          min-height: 440px;
          border: none;
          display: block;
        }

        /* Info card */
        .contact-info-card {
          background: #fff;
          border-radius: 18px;
          padding: 40px 36px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.07);
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 0;
        }
        .contact-info-card .card-label {
          display: inline-block;
          background: rgba(255,113,1,0.1);
          color: #FF7101;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 5px 14px;
          border-radius: 20px;
          margin-bottom: 18px;
        }
        .contact-info-card h2 {
          font-size: 25px;
          font-weight: 700;
          color: #24272C;
          margin-bottom: 28px;
          line-height: 1.25;
        }

        /* Info rows */
        .info-row {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 18px 0;
          border-bottom: 1px solid #EDEDED;
        }
        .info-row:last-of-type {
          border-bottom: none;
          padding-bottom: 0;
        }
        .info-row:first-of-type {
          padding-top: 0;
        }
        .info-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: rgba(255,113,1,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .info-icon svg {
          width: 20px;
          height: 20px;
          stroke: #FF7101;
        }
        .info-text h6 {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #696665;
          margin-bottom: 4px;
        }
        .info-text p {
          font-size: 15px;
          color: #24272C;
          font-weight: 500;
          margin: 0;
          line-height: 1.6;
        }

        /* Social icons */
        .contact-socials {
          display: flex;
          gap: 10px;
          margin-top: 6px;
        }
        .contact-socials a {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          border: 1.5px solid #EDEDED;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #24272C;
          font-size: 15px;
          transition: all 0.2s ease;
          text-decoration: none;
        }
        .contact-socials a:hover {
          background: #FF7101;
          border-color: #FF7101;
          color: #fff;
          transform: translateY(-2px);
        }

        /* ── Drop Us a Line section ── */
        .contact-form-section {
          padding: 52px 0 72px;
        }
        .form-card {
          background: #fff;
          border-radius: 20px;
          padding-top: 52px;
          padding-left: 56px;
          padding-right: 56px;
          padding-bottom: 52px;
          box-shadow: 0 4px 32px rgba(0,0,0,0.07);
        }
        .form-card-header {
          text-align: center;
          margin-bottom: 40px;
        }
        .form-card-header .card-label {
          display: inline-block;
          background: rgba(255,113,1,0.1);
          color: #FF7101;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 5px 14px;
          border-radius: 20px;
          margin-bottom: 14px;
        }
        .form-card-header h2 {
          font-size: 30px;
          font-weight: 700;
          color: #24272C;
          margin-bottom: 10px;
        }
        .form-card-header p {
          color: #696665;
          font-size: 15px;
          margin: 0;
        }

        /* Form fields override */
        .contact-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }
        .contact-form-full {
          margin-bottom: 20px;
        }
        .cf-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #24272C;
          margin-bottom: 8px;
          letter-spacing: 0.2px;
        }
        .cf-input {
          width: 100%;
          height: 50px;
          border: 1.5px solid #EDEDED;
          border-radius: 10px;
          padding: 0 16px;
          font-size: 14px;
          color: #24272C;
          background: #fafafa;
          transition: border-color 0.2s, box-shadow 0.2s;
          outline: none;
        }
        .cf-input:focus {
          border-color: #FF7101;
          box-shadow: 0 0 0 3px rgba(255,113,1,0.1);
          background: #fff;
        }
        .cf-textarea {
          width: 100%;
          min-height: 140px;
          border: 1.5px solid #EDEDED;
          border-radius: 10px;
          padding: 14px 16px;
          font-size: 14px;
          color: #24272C;
          background: #fafafa;
          resize: vertical;
          transition: border-color 0.2s, box-shadow 0.2s;
          outline: none;
          font-family: inherit;
        }
        .cf-textarea:focus {
          border-color: #FF7101;
          box-shadow: 0 0 0 3px rgba(255,113,1,0.1);
          background: #fff;
        }
        .cf-submit {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 28px;
        }
        .cf-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #FF7101;
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 0 40px;
          height: 52px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          letter-spacing: 0.3px;
        }
        .cf-btn:hover {
          background: #e06400;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255,113,1,0.3);
        }
        .cf-btn svg {
          width: 18px;
          height: 18px;
          stroke: #fff;
        }

        /* Success/error message */
        .cf-message {
  display: none;
  align-items: center;
  gap: 10px;
  padding: 14px 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  margin-top: 16px;
}

.cf-message.visible {
  display: flex;
  animation: fadeIn 0.3s ease;
}

.cf-message.success {
  background: rgba(52,168,83,0.1);
  color: #34a853;
  border: 1px solid rgba(52,168,83,0.2);
}

.cf-message.error {
  background: rgba(234,67,53,0.08);
  color: #ea4335;
  border: 1px solid rgba(234,67,53,0.2);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

        @media (max-width: 991px) {
          .contact-hero h1 { font-size: 28px; }
          .form-card { padding: 36px 24px; }
          .contact-form-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 576px) {
          .contact-info-card { padding: 28px 22px}
          .form-card { padding: 28px 18px}
          .contact-form-section {
          padding: 52px 0 50px;
        }
        }
      `}</style>

      <div className="contact-page-wrapper">

        {/* ── Hero ──
        <div className="contact-hero">
          <h1>Get In <span className="orange-dot">Touch</span></h1>
          <p>We'd love to hear from you — visit us, call us, or send a message below.</p>
        </div> */}

        {/* ── Map (left) + Contact Info (right) ── */}
        <section className="contact-map-row">
          <div className="container">
            <div className="row g-4 align-items-stretch">

              {/* Map */}
              <div className="col-lg-8 col-md-12">
                <div className="contact-map-card">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2429.081046042691!2d-1.875853!3d52.4957725!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4870bbb429adc091%3A0x3af5ff490e8dca9b!2sUKA%20Auto%20Trade%20Ltd!5e0!3m2!1sen!2s!4v1775646186599!5m2!1sen!2s"
                    allowFullScreen=""
                    loading="lazy"
                    title="UKA Auto Trade Location"
                  />
                </div>
              </div>

              {/* Contact Info */}
              <div className="col-lg-4 col-md-12">
                <div className="contact-info-card">
                  <span className="card-label">Find Us</span>
                  <h2>Contact Information</h2>

                  <div className="info-row">
                    <div className="info-icon">
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                    </div>
                    <div className="info-text">
                      <h6>Address</h6>
                      <p>180a Rupert St, Nechells<br />Birmingham B7 5DT<br />United Kingdom</p>
                    </div>
                  </div>

                  <div className="info-row">
                    <div className="info-icon">
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.18 2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.56a16 16 0 0 0 6.29 6.29l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                    </div>
                    <div className="info-text">
                      <h6>Phone</h6>
                      <p>+44 7383 908070</p>
                    </div>
                  </div>

                  <div className="info-row">
                    <div className="info-icon">
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                      </svg>
                    </div>
                    <div className="info-text">
                      <h6>Follow Us</h6>
                      <div className="contact-socials">
                        <a href="https://www.facebook.com/ukajapan" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                          <i className="icon-autodeal-facebook" />
                        </a>
                        <a href="https://www.tiktok.com/@uka_japan?_r=1&_t=ZS-95OWtQag8If" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                          <i className="fab fa-tiktok" />
                        </a>
                        <a href="https://www.instagram.com/ukajapan_/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                          <i className="icon-autodeal-instagram" />
                        </a>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── Drop Us a Line ── */}
        <section className="contact-form-section">
          <div className="container">
            <div className="form-card">
              <div className="form-card-header">
                <span className="card-label">Send a Message</span>
                <h2>Drop Us a Line</h2>
                <p>Fill out the form and our team will get back to you within 24 hours.</p>
              </div>

              <form onSubmit={sendMail} ref={formRef} acceptCharset="utf-8">

                <div className="contact-form-grid">
                  <div>
                    <label className="cf-label">Full Name</label>
                    <input type="text" className="cf-input" name="name" placeholder="John Smith" required />
                  </div>
                  <div>
                    <label className="cf-label">Email Address</label>
                    <input type="email" className="cf-input" name="email" placeholder="john@example.com" required />
                  </div>
                </div>

                <div className="contact-form-grid">
                  <div>
                    <label className="cf-label">Phone Number</label>
                    <input type="tel" className="cf-input" name="phone" placeholder="+44 7000 000000" required />
                  </div>
                  <div>
                    <label className="cf-label">Subject</label>
                    <input type="text" className="cf-input" name="subject" placeholder="e.g. Car enquiry" required />
                  </div>
                </div>

                <div className="contact-form-full">
                  <label className="cf-label">Your Message</label>
                  <textarea className="cf-textarea" name="message" placeholder="Tell us how we can help you..." required defaultValue="" />
                </div>

                <div className="cf-submit">
                  <button type="submit" className="cf-btn">
                    Send Message
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"/>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                  </button>
                </div>

                <div className={`cf-message ${showMessage ? "visible" : ""} ${success ? "success" : "error"}`}>
                  {success ? (
                    <>✓ &nbsp;Your message has been sent successfully. We'll be in touch soon!</>
                  ) : (
                    <>✕ &nbsp;Something went wrong. Please try again or call us directly.</>
                  )}
                </div>

              </form>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
