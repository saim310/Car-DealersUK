"use client";
import React, { useState, useEffect } from "react";
import { FiCheckCircle } from "react-icons/fi";

export default function AdminFooter() {
  const [customerLinks, setCustomerLinks] = useState([]);
  const [whyLinks, setWhyLinks] = useState([]);
  const [investorLinks, setInvestorLinks] = useState([]);
  const [newsletterText, setNewsletterText] = useState("");
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(false);

  // Fetch Existing Data on Mount
  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const res = await fetch(
          "https://apis.ukaautotrade.co.uk/api/footer",
        );
        const data = await res.json();

        if (res.ok && data) {
          // Helper to safely parse MySQL JSON (depends on mysql2 driver config, sometimes returns string)
          const parseIfString = (val) =>
            typeof val === "string" ? JSON.parse(val) : val;

          if (data.customer_service)
            setCustomerLinks(parseIfString(data.customer_service));
          if (data.why_2cc) setWhyLinks(parseIfString(data.why_2cc));
          if (data.for_investors)
            setInvestorLinks(parseIfString(data.for_investors));
          if (data.newsletter_text) setNewsletterText(data.newsletter_text);
        }
      } catch (err) {
        console.error("Error loading footer data:", err);
      }
    };
    fetchFooterData();
  }, []);

  // Add new link
  const addLink = (setter) => {
    const newLink = {
      id: Date.now(),
      text: "",
      url: "#",
    };
    setter((prev) => [...prev, newLink]);
  };

  // Update link
  const updateLink = (setter, id, field, value) => {
    setter((prev) =>
      prev.map((link) => (link.id === id ? { ...link, [field]: value } : link)),
    );
  };

  // Delete link
  const deleteLink = (setter, id) => {
    setter((prev) => prev.filter((link) => link.id !== id));
  };

  // Save to Database
  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://apis.ukaautotrade.co.uk/api/footer",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer_service: customerLinks,
            why_2cc: whyLinks,
            for_investors: investorLinks,
            newsletter_text: newsletterText,
          }),
        },
      );

      if (res.ok) {
        setSaveStatus(true);
        setTimeout(() => setSaveStatus(false), 3000);
      } else {
        alert("Failed to save changes.");
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("An error occurred while saving.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold">Admin Panel - Footer Management</h1>
        <p className="text-muted">
          Update links and newsletter content for the website footer
        </p>
      </div>

      <div className="row g-4">
        {/* About UKA Auto Trade Column */}
        <div className="col-lg-4">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-dark text-white">
              <h5 className="mb-0">About UKA Auto Trade</h5>
            </div>
            <div className="card-body">
              {customerLinks.map((link) => (
                <div key={link.id} className="mb-3 p-3 border rounded bg-light">
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Link Text"
                    value={link.text}
                    onChange={(e) =>
                      updateLink(
                        setCustomerLinks,
                        link.id,
                        "text",
                        e.target.value,
                      )
                    }
                  />
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="URL (e.g. /vehicles)"
                    value={link.url}
                    onChange={(e) =>
                      updateLink(
                        setCustomerLinks,
                        link.id,
                        "url",
                        e.target.value,
                      )
                    }
                  />
                  <button
                    className="btn btn-sm"
                    style={{ color: "#fff", backgroundColor: "#24272c" }}
                    onClick={() => deleteLink(setCustomerLinks, link.id)}
                  >
                    Delete
                  </button>
                </div>
              ))}

              <button
                className="w-100"
                style={{
                  backgroundColor: "#FF7101",
                  color: "#fff",
                  padding: "8px 25px",
                  borderRadius: "50px",
                  border: "none",
                  fontSize: "16px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 14px 0 rgba(255, 113, 1, 0.39)",
                }}
                onClick={() => addLink(setCustomerLinks)}
              >
                + Add New Link
              </button>
            </div>
          </div>
        </div>

        {/* Popular Brands Column */}
        <div className="col-lg-4">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-dark text-white">
              <h5 className="mb-0">Popular Brands</h5>
            </div>
            <div className="card-body">
              {whyLinks.map((link) => (
                <div key={link.id} className="mb-3 p-3 border rounded bg-light">
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Link Text"
                    value={link.text}
                    onChange={(e) =>
                      updateLink(setWhyLinks, link.id, "text", e.target.value)
                    }
                  />
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="URL"
                    value={link.url}
                    onChange={(e) =>
                      updateLink(setWhyLinks, link.id, "url", e.target.value)
                    }
                  />
                  <button
                    className="btn btn-sm"
                    style={{ color: "#fff", backgroundColor: "#24272c" }}
                    onClick={() => deleteLink(setWhyLinks, link.id)}
                  >
                    Delete
                  </button>
                </div>
              ))}

              <button
                className="w-100"
                style={{
                  backgroundColor: "#FF7101",
                  color: "#fff",
                  padding: "8px 25px",
                  borderRadius: "50px",
                  border: "none",
                  fontSize: "16px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 14px 0 rgba(255, 113, 1, 0.39)",
                }}
                onClick={() => addLink(setWhyLinks)}
              >
                + Add New Link
              </button>
            </div>
          </div>
        </div>

        {/* Others Column */}
        <div className="col-lg-4">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-dark text-white">
              <h5 className="mb-0">Others</h5>
            </div>
            <div className="card-body">
              {investorLinks.map((link) => (
                <div key={link.id} className="mb-3 p-3 border rounded bg-light">
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Link Text"
                    value={link.text}
                    onChange={(e) =>
                      updateLink(
                        setInvestorLinks,
                        link.id,
                        "text",
                        e.target.value,
                      )
                    }
                  />
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="URL"
                    value={link.url}
                    onChange={(e) =>
                      updateLink(
                        setInvestorLinks,
                        link.id,
                        "url",
                        e.target.value,
                      )
                    }
                  />
                  <button
                    className="btn btn-sm"
                    style={{ color: "#fff", backgroundColor: "#24272c" }}
                    onClick={() => deleteLink(setInvestorLinks, link.id)}
                  >
                    Delete
                  </button>
                </div>
              ))}

              <button
                className="w-100"
                style={{
                  backgroundColor: "#FF7101",
                  color: "#fff",
                  padding: "8px 25px",
                  borderRadius: "50px",
                  border: "none",
                  fontSize: "16px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 14px 0 rgba(255, 113, 1, 0.39)",
                }}
                onClick={() => addLink(setInvestorLinks)}
              >
                + Add New Link
              </button>
            </div>
          </div>
        </div>

        {/* Others Column */}
        <div className="col-lg-4">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-dark text-white">
              <h5 className="mb-0">Others</h5>
            </div>
            <div className="card-body">
              {investorLinks.map((link) => (
                <div key={link.id} className="mb-3 p-3 border rounded bg-light">
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Link Text"
                    value={link.text}
                    onChange={(e) =>
                      updateLink(
                        setInvestorLinks,
                        link.id,
                        "text",
                        e.target.value,
                      )
                    }
                  />
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="URL"
                    value={link.url}
                    onChange={(e) =>
                      updateLink(
                        setInvestorLinks,
                        link.id,
                        "url",
                        e.target.value,
                      )
                    }
                  />
                  <button
                    className="btn btn-sm"
                    style={{ color: "#fff", backgroundColor: "#24272c" }}
                    onClick={() => deleteLink(setInvestorLinks, link.id)}
                  >
                    Delete
                  </button>
                </div>
              ))}

              <button
                className="w-100"
                style={{
                  backgroundColor: "#FF7101",
                  color: "#fff",
                  padding: "8px 25px",
                  borderRadius: "50px",
                  border: "none",
                  fontSize: "16px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 14px 0 rgba(255, 113, 1, 0.39)",
                }}
                onClick={() => addLink(setInvestorLinks)}
              >
                + Add New Link
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="mt-5">
        <div className="card shadow-sm">
          <div className="card-header bg-dark text-white">
            <h5 className="mb-0">Newsletter</h5>
          </div>
          <div className="card-body">
            <label className="form-label fw-medium">
              Newsletter Description
            </label>
            <input
              type="text"
              className="form-control form-control-lg"
              value={newsletterText}
              onChange={(e) => setNewsletterText(e.target.value)}
              placeholder="Stay up to date with special offers!"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="text-center mt-5">
        <button
          onClick={handleSave}
          disabled={loading}
          className="btn btn-lg px-5 py-3"
          style={{
            backgroundColor: saveStatus ? "#28a745" : "#24272c",
            color: "#ffffff",
            borderRadius: "50px",
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            transition: "all 0.3s ease",
          }}
        >
          {saveStatus ? <FiCheckCircle size={20} /> : "💾"}
          <span>
            {saveStatus
              ? "Settings Saved"
              : loading
                ? "Saving..."
                : "Save All Footer Changes"}
          </span>
        </button>
      </div>
    </div>
  );
}
