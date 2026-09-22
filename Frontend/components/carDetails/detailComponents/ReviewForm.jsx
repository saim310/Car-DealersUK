"use client";
import React, { useState } from "react";
import Image from "next/image";

export default function ReviewForm({ listingId, onReviewSubmitted }) {
  const [formData, setFormData] = useState({
    author_name: "",
    author_email: "",
    rating: 5,
    category: "all",
    title: "",
    review_text: "",
  });

  const [images, setImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rating" ? parseInt(value) : value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    // Create preview URLs
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreview(previews);
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreview((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!agreeTerms) {
      setMessageType("error");
      setMessage("Please agree to the terms and conditions");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const form = new FormData();
      form.append("listing_id", listingId);
      form.append("author_name", formData.author_name);
      form.append("author_email", formData.author_email);
      form.append("rating", formData.rating);
      form.append("category", formData.category);
      form.append("title", formData.title);
      form.append("review_text", formData.review_text);

      // Add images
      images.forEach((image) => {
        form.append("files", image);
      });

      console.log("📤 Submitting review to:", "https://apis.ukaautotrade.co.uk/api/review");
      console.log("📋 Listing ID:", listingId);

      const response = await fetch("https://apis.ukaautotrade.co.uk/api/reviews", {
        method: "POST",
        body: form,
      });

      console.log("📥 Response Status:", response.status, response.statusText);

      const data = await response.json();
      console.log("📥 Response Data:", data);

      if (data.success) {
        setMessageType("success");
        setMessage("✅ Your review has been posted successfully!");

        // Reset form
        setFormData({
          author_name: "",
          author_email: "",
          rating: 5,
          category: "all",
          title: "",
          review_text: "",
        });
        setImages([]);
        setImagePreview([]);
        setAgreeTerms(false);

        // Notify parent component to refresh reviews
        if (onReviewSubmitted) {
          onReviewSubmitted();
        }

        // Clear message after 4 seconds
        setTimeout(() => setMessage(""), 4000);
      } else {
        setMessageType("error");
        setMessage(`❌ ${data.message || "Failed to post review"}`);
        console.error("API Error:", data);
      }
    } catch (error) {
      console.error("🚨 Error submitting review:", error);
      setMessageType("error");
      setMessage(`🚨 Error: ${error.message}. Check console for details.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: "60px" }}>
      <style jsx>{`
        @media (max-width: 600px) {
          .review-form-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
      <div style={{ marginBottom: "40px" }}>
        <h2 style={{
          fontSize: "28px",
          fontWeight: "600",
          color: "#1a1a1a",
          marginBottom: "15px"
        }}>
          Share Your Experience
        </h2>
        <p style={{
          fontSize: "14px",
          color: "#999",
          margin: "0"
        }}>
          Your feedback helps other buyers make informed decisions
        </p>
      </div>


      <form onSubmit={handleSubmit} style={{ marginBottom: "40px" }}>
        {/* Name and Email Row */}
        <div className="review-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
          <fieldset style={{ border: "none", padding: "0" }}>
            <label style={{
              display: "block",
              fontSize: "13px",
              fontWeight: "600",
              color: "#1a1a1a",
              marginBottom: "8px",
              textTransform: "uppercase",
              letterSpacing: "0.5px"
            }}>
              Your Name *
            </label>
            <input
              required
              type="text"
              name="author_name"
              placeholder="John Doe"
              value={formData.author_name}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "12px 15px",
                fontSize: "14px",
                border: "1px solid #e0e0e0",
                borderRadius: "6px",
                fontFamily: "inherit",
                backgroundColor: "#fff",
                transition: "all 0.3s ease",
                boxSizing: "border-box"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#ff9800";
                e.target.style.boxShadow = "0 0 0 3px rgba(255, 152, 0, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e0e0e0";
                e.target.style.boxShadow = "none";
              }}
            />
          </fieldset>

          <fieldset style={{ border: "none", padding: "0" }}>
            <label style={{
              display: "block",
              fontSize: "13px",
              fontWeight: "600",
              color: "#1a1a1a",
              marginBottom: "8px",
              textTransform: "uppercase",
              letterSpacing: "0.5px"
            }}>
              Email Address
            </label>
            <input
              type="email"
              name="author_email"
              placeholder="your@email.com"
              value={formData.author_email}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "12px 15px",
                fontSize: "14px",
                border: "1px solid #e0e0e0",
                borderRadius: "6px",
                fontFamily: "inherit",
                backgroundColor: "#fff",
                transition: "all 0.3s ease",
                boxSizing: "border-box"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#ff9800";
                e.target.style.boxShadow = "0 0 0 3px rgba(255, 152, 0, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e0e0e0";
                e.target.style.boxShadow = "none";
              }}
            />
          </fieldset>
        </div>

        {/* Rating and Category Row */}
        <div className="review-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
          <fieldset style={{ border: "none", padding: "0" }}>
            <label style={{
              display: "block",
              fontSize: "13px",
              fontWeight: "600",
              color: "#1a1a1a",
              marginBottom: "8px",
              textTransform: "uppercase",
              letterSpacing: "0.5px"
            }}>
              Rating *
            </label>
            <select
              name="rating"
              value={formData.rating}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "12px 15px",
                fontSize: "14px",
                border: "1px solid #e0e0e0",
                borderRadius: "6px",
                fontFamily: "inherit",
                backgroundColor: "#fff",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxSizing: "border-box"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#ff9800";
                e.target.style.boxShadow = "0 0 0 3px rgba(255, 152, 0, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e0e0e0";
                e.target.style.boxShadow = "none";
              }}
            >
              <option value={5}>⭐⭐⭐⭐⭐  Excellent</option>
              <option value={4}>⭐⭐⭐⭐  Good</option>
              <option value={3}>⭐⭐⭐  Average</option>
              <option value={2}>⭐⭐  Poor</option>
              <option value={1}>⭐  Very Poor</option>
            </select>
          </fieldset>

          <fieldset style={{ border: "none", padding: "0" }}>
            <label style={{
              display: "block",
              fontSize: "13px",
              fontWeight: "600",
              color: "#1a1a1a",
              marginBottom: "8px",
              textTransform: "uppercase",
              letterSpacing: "0.5px"
            }}>
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "12px 15px",
                fontSize: "14px",
                border: "1px solid #e0e0e0",
                borderRadius: "6px",
                fontFamily: "inherit",
                backgroundColor: "#fff",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxSizing: "border-box"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#ff9800";
                e.target.style.boxShadow = "0 0 0 3px rgba(255, 152, 0, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e0e0e0";
                e.target.style.boxShadow = "none";
              }}
            >
              <option value="all">General</option>
              <option value="mileage">Mileage</option>
              <option value="performance">Performance</option>
              <option value="safety">Safety</option>
              <option value="looks">Looks</option>
              <option value="comfort">Comfort</option>
            </select>
          </fieldset>
        </div>

        {/* Review Title */}
        <fieldset style={{ border: "none", padding: "0", marginBottom: "20px" }}>
          <label style={{
            display: "block",
            fontSize: "13px",
            fontWeight: "600",
            color: "#1a1a1a",
            marginBottom: "8px",
            textTransform: "uppercase",
            letterSpacing: "0.5px"
          }}>
            Review Title (Optional)
          </label>
          <input
            type="text"
            name="title"
            placeholder="e.g., Great car, highly recommend!"
            value={formData.title}
            onChange={handleInputChange}
            style={{
              width: "100%",
              padding: "12px 15px",
              fontSize: "14px",
              border: "1px solid #e0e0e0",
              borderRadius: "6px",
              fontFamily: "inherit",
              backgroundColor: "#fff",
              transition: "all 0.3s ease",
              boxSizing: "border-box"
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#ff9800";
              e.target.style.boxShadow = "0 0 0 3px rgba(255, 152, 0, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e0e0e0";
              e.target.style.boxShadow = "none";
            }}
          />
        </fieldset>

        {/* Review Text */}
        <fieldset style={{ border: "none", padding: "0", marginBottom: "20px" }}>
          <label style={{
            display: "block",
            fontSize: "13px",
            fontWeight: "600",
            color: "#1a1a1a",
            marginBottom: "8px",
            textTransform: "uppercase",
            letterSpacing: "0.5px"
          }}>
            Your Review *
          </label>
          <textarea
            required
            name="review_text"
            placeholder="Share your experience with this car. What was good? What could be improved?..."
            value={formData.review_text}
            onChange={handleInputChange}
            rows={5}
            style={{
              width: "100%",
              padding: "12px 15px",
              fontSize: "14px",
              border: "1px solid #e0e0e0",
              borderRadius: "6px",
              fontFamily: "inherit",
              backgroundColor: "#fff",
              resize: "vertical",
              minHeight: "140px",
              transition: "all 0.3s ease",
              boxSizing: "border-box"
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#ff9800";
              e.target.style.boxShadow = "0 0 0 3px rgba(255, 152, 0, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e0e0e0";
              e.target.style.boxShadow = "none";
            }}
          />
        </fieldset>

        {/* Images Upload */}
        <fieldset style={{ border: "none", padding: "0", marginBottom: "20px" }}>
          <label style={{
            display: "block",
            fontSize: "13px",
            fontWeight: "600",
            color: "#1a1a1a",
            marginBottom: "8px",
            textTransform: "uppercase",
            letterSpacing: "0.5px"
          }}>
            Upload Images (Optional)
          </label>
          <div style={{
            border: "2px dashed #ff9800",
            borderRadius: "8px",
            padding: "25px",
            textAlign: "center",
            transition: "all 0.3s ease",
            cursor: "pointer"
          }}>
            <input
              type="file"
              name="images"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              style={{
                display: "none"
              }}
              id="image-upload"
            />
            <label htmlFor="image-upload" style={{ cursor: "pointer", width: "100%" }}>
              <div style={{ marginBottom: "10px" }}>
                <i style={{
                  fontSize: "32px",
                  color: "#ff9800"
                }}>📷</i>
              </div>
              <p style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#1a1a1a",
                margin: "0 0 5px 0"
              }}>
                Click to upload or drag images
              </p>
              <p style={{
                fontSize: "12px",
                color: "#999",
                margin: "0"
              }}>
                PNG, JPG, GIF up to 10MB (Max 5 images)
              </p>
            </label>
          </div>
        </fieldset>

        {/* Image Preview */}
        {imagePreview.length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <p style={{
              fontSize: "13px",
              fontWeight: "600",
              color: "#1a1a1a",
              marginBottom: "15px",
              textTransform: "uppercase",
              letterSpacing: "0.5px"
            }}>
              Uploaded Images ({imagePreview.length}/5)
            </p>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
              gap: "12px"
            }}>
              {imagePreview.map((preview, index) => (
                <div
                  key={index}
                  style={{
                    position: "relative",
                    paddingBottom: "100%",
                    overflow: "hidden",
                    borderRadius: "8px",
                    border: "2px solid #e0e0e0",
                    backgroundColor: "#f5f5f5"
                  }}
                >
                  <Image
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    style={{
                      position: "absolute",
                      top: "4px",
                      right: "4px",
                      background: "rgba(255, 0, 0, 0.85)",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "28px",
                      height: "28px",
                      cursor: "pointer",
                      fontSize: "18px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      transition: "all 0.2s ease"
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = "rgba(255, 0, 0, 1)";
                      e.target.style.transform = "scale(1.1)";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = "rgba(255, 0, 0, 0.85)";
                      e.target.style.transform = "scale(1)";
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Checkbox */}
        <label style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "12px",
          marginBottom: "25px",
          cursor: "pointer",
          fontSize: "14px"
        }}>
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            style={{
              width: "18px",
              height: "18px",
              minWidth: "18px",
              marginTop: "2px",
              cursor: "pointer",
              accentColor: "#ff9800"
            }}
          />
          <span style={{
            color: "#666",
            lineHeight: "1.5"
          }}>
            I agree to share this review publicly and confirm that my experience is genuine
          </span>
        </label>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            maxWidth: "300px",
            padding: "14px 40px",
            fontSize: "15px",
            fontWeight: "600",
            color: "white",
            backgroundColor: loading ? "#ccc" : "#ff9800",
            border: "none",
            borderRadius: "6px",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all 0.3s ease",
            textTransform: "uppercase",
            letterSpacing: "1px",
            boxShadow: "0 4px 15px rgba(255, 152, 0, 0.3)"
          }}
          onMouseOver={(e) => {
            if (!loading) {
              e.target.style.backgroundColor = "#e68900";
              e.target.style.boxShadow = "0 6px 20px rgba(255, 152, 0, 0.4)";
              e.target.style.transform = "translateY(-2px)";
            }
          }}
          onMouseOut={(e) => {
            if (!loading) {
              e.target.style.backgroundColor = "#ff9800";
              e.target.style.boxShadow = "0 4px 15px rgba(255, 152, 0, 0.3)";
              e.target.style.transform = "translateY(0)";
            }
          }}
        >
          {loading ? "POSTING..." : "POST REVIEW"}
        </button>
      </form>
      
      {message && (
        <div
          style={{
            padding: "15px 20px",
            marginBottom: "25px",
            borderRadius: "8px",
            backgroundColor: messageType === "success" ? "#d4edda" : "#f8d7da",
            color: messageType === "success" ? "#155724" : "#721c24",
            border: `1px solid ${messageType === "success" ? "#c3e6cb" : "#f5c6cb"}`,
            fontSize: "14px",
            fontWeight: "500"
          }}
          role="alert"
        >
          {message}
        </div>
      )}
    </div>
  );
}