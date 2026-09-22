"use client";
import React, { useState } from "react";

export default function NewsLetter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("https://apis.ukaautotrade.co.uk/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setMessage("Subscribed successfully!");
        setEmail("");
      } else {
        setSuccess(false);
        setMessage(data.error || "Failed to subscribe");
      }
    } catch (err) {
      setSuccess(false);
      setMessage("Error subscribing. Please try again.");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 5000);
    }
  };

  return (
    <div className="widget newsletter">
      <h3 className="widget-title title-news">Join our newsletter</h3>
      <p>
        Signup to be the first to hear about exclusive deals, special offers and
        upcoming collections
      </p>
      <div className="form-s2">
        <form onSubmit={handleSubmit}>
          <div className="wd-find-select">
            <div className="form-newsletter relative">
              <input
                type="email"
                className="email-field"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                name="email"
                title="Enter your email"
                required
                disabled={loading}
              />
              <div className="button-submit">
                <button className="" type="submit" disabled={loading}>
                  <div className="icon">
                    {loading ? (
                      <span>...</span>
                    ) : (
                      <svg
                        width={15}
                        height={14}
                        viewBox="0 0 15 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3.00035 6.99998L1.17969 1.08398C5.53489 2.35043 9.6419 4.35118 13.3237 6.99998C9.64218 9.64917 5.53541 11.6504 1.18035 12.9173L3.00035 6.99998ZM3.00035 6.99998H8.00035"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </form>
        {message && (
          <div
            style={{
              marginTop: "10px",
              padding: "10px",
              borderRadius: "4px",
              backgroundColor: success ? "#d4edda" : "#f8d7da",
              color: success ? "#155724" : "#721c24",
              fontSize: "0.9rem",
            }}
          >
            {message}
          </div>
        )}
        {/* End Job  Search Form*/}
      </div>
    </div>
  );
}
