"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { apiURL } from "@/utils/exports";

const API_BASE = "https://apis.ukaautotrade.co.uk/api";

export default function DashboardTestimonials() {
  const router = useRouter();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(8);
  const [filterRating, setFilterRating] = useState("all");

  const fetchReviews = async (page = 1, rating = filterRating) => {
    try {
      setLoading(true);
      console.log("🔄 Fetching testimonials for dashboard...");
      const ratingParam = rating !== "all" ? `&rating=${rating}` : "";
      const url = `${API_BASE}/testamonials?page=${page}&limit=${itemsPerPage}${ratingParam}`;
      console.log("📍 Fetching from:", url);
      
      const res = await fetch(url);
      
      console.log("📥 Response status:", res.status);
      
      if (!res.ok) {
        throw new Error(`API returned ${res.status}`);
      }
      
      const data = await res.json();

      console.log("✅ Dashboard API Response:", data);

      if (data.success) {
        console.log("📊 Testimonials count:", data.data?.length || 0);
        setReviews(data.data || []);
        setTotalPages(data.pagination?.total_pages || 1);
        setCurrentPage(page);
      } else {
        console.warn("⚠️ API error:", data.message);
        toast.error(data.message || "Failed to load testimonials");
      }
    } catch (error) {
      console.error("❌ Error fetching reviews:", error);
      toast.error("Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(currentPage);
  }, []);

  const handleDeleteReview = async (reviewId) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;

    try {
      const res = await fetch(
        `${API_BASE}/testamonials/${reviewId}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (data.success) {
        toast.success("Testimonial deleted successfully");
        fetchReviews(currentPage);
      } else {
        toast.error(data.message || "Failed to delete testimonial");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Error deleting testimonial");
    }
  };

  const openAddModal = () => {
    router.push("/submit-review");
  };

  const openEditModal = (review) => {
    router.push(`/submit-review?id=${review.id}`);
  };

  const handlePageChange = (newPage) => {
    fetchReviews(newPage, filterRating);
  };

  const handleRatingChange = (e) => {
    const newRating = e.target.value;
    setFilterRating(newRating);
    fetchReviews(1, newRating);
  };

  const StarRating = ({ rating }) => {
    return (
      <div style={{ display: "flex", gap: "4px" }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            style={{
              color: star <= rating ? "#ffc107" : "#ddd",
              fontSize: "16px",
            }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const reviewDate = new Date(dateString);
    const diffInSeconds = Math.floor((now - reviewDate) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return reviewDate.toLocaleDateString();
  };


  if (loading && reviews.length === 0) {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="content-area">
              <main id="main" className="main-content">
                <div className="tfcl-dashboard">
                  <h1 className="admin-title mb-3">Testimonials</h1>
                  <p style={{ textAlign: "center", padding: "40px" }}>
                    Loading testimonials...
                  </p>
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="content-area">
              <main id="main" className="main-content">
                <div className="tfcl-dashboard">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "20px",
                      flexWrap: "wrap",
                      gap: "15px",
                    }}
                  >
                    <h1 className="admin-title mb-3">Testimonials</h1>
                    <button
                      onClick={openAddModal}
                      style={{
                        padding: "10px 16px",
                        background: "#FF7101",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "600",
                      }}
                    >
                      + Add New Testimonial
                    </button>
                  </div>
                  <div
                    style={{
                      textAlign: "center",
                      padding: "60px 20px",
                      background: "#f9f9f9",
                      borderRadius: "8px",
                    }}
                  >
                    <p style={{ fontSize: "16px", color: "#666" }}>
                      No testimonials yet. Start collecting reviews from your customers!
                    </p>
                    <div
                      style={{
                        marginTop: "20px",
                        padding: "15px",
                        background: "white",
                        borderRadius: "4px",
                        border: "1px solid #ddd",
                      }}
                    >
                      <p style={{ marginBottom: "10px", color: "#999", fontSize: "14px" }}>
                        Share this link with customers:
                      </p>
                      <code
                        style={{
                          background: "#f0f0f0",
                          padding: "10px",
                          borderRadius: "4px",
                          display: "block",
                          wordBreak: "break-all",
                          color: "#333",
                        }}
                      >
                        {typeof window !== "undefined"
                          ? `${window.location.origin}/submit-review`
                          : "Loading..."}
                      </code>
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div className="content-area">
            <main id="main" className="main-content">
              <div className="tfcl-dashboard">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                    flexWrap: "wrap",
                    gap: "15px",
                  }}
                >
                  <h1 className="admin-title mb-3">Testimonials</h1>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                    }}
                  >
                    <button
                      onClick={openAddModal}
                      style={{
                        padding: "10px 16px",
                        background: "#FF7101",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "600",
                      }}
                    >
                      + Add New Testimonial
                    </button>
                    <label style={{ fontSize: "14px", color: "#666" }}>
                      Filter by Rating:
                    </label>
                    <select
                      value={filterRating}
                      onChange={(e) => handleRatingChange(e)}
                      style={{
                        padding: "8px 12px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        fontSize: "14px",
                      }}
                    >
                      <option value="all">All Ratings</option>
                      <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                      <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
                      <option value="3">⭐⭐⭐ (3 Stars)</option>
                      <option value="2">⭐⭐ (2 Stars)</option>
                      <option value="1">⭐ (1 Star)</option>
                    </select>
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(350px, 1fr))",
                    gap: "20px",
                    marginBottom: "30px",
                  }}
                >
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      style={{
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        padding: "20px",
                        background: "white",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                        transition: "all 0.3s",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.boxShadow =
                          "0 4px 12px rgba(0,0,0,0.1)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.boxShadow =
                          "0 2px 4px rgba(0,0,0,0.05)";
                      }}
                    >
                      {/* Vehicle Info - Top Badge */}
                      {/* {review.brand && (
                        <div
                          style={{
                            background: "#e8f4f8",
                            padding: "8px 12px",
                            borderRadius: "4px",
                            marginBottom: "12px",
                            fontSize: "13px",
                            fontWeight: "600",
                            color: "#FF7101",
                          }}
                        >
                          {review.years} {review.brand} {review.model} 
                          <br />
                          {/* <div style={{ fontSize: "11px", color: "#999", marginTop: "4px" }}>
                          {review.plate_number}
                        </div> 
                        </div>
                      )} */}

                      {/* Header */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "start",
                          marginBottom: "12px",
                        }}
                      >
                        <div>
                          <h4
                            style={{
                              margin: "0 0 4px 0",
                              color: "#333",
                              fontSize: "16px",
                            }}
                          >
                            {review.author_name}
                          </h4>
                          <p
                            style={{
                              margin: "0",
                              fontSize: "12px",
                              color: "#999",
                            }}
                          >
                            {review.author_email}
                          </p>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                          }}
                        >
                          <button
                            onClick={() => openEditModal(review)}
                            style={{
                              background: "#4CAF50",
                              color: "white",
                              border: "none",
                              padding: "6px 12px",
                              borderRadius: "3px",
                              cursor: "pointer",
                              fontSize: "12px",
                              fontWeight: "600",
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteReview(review.id)}
                            style={{
                              background: "#ff4444",
                              color: "white",
                              border: "none",
                              padding: "6px 12px",
                              borderRadius: "3px",
                              cursor: "pointer",
                              fontSize: "12px",
                              fontWeight: "600",
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      {/* Rating */}
                      <div style={{ marginBottom: "12px" }}>
                        <StarRating rating={review.rating} />
                      </div>

                      {/* Title */}
                      {review.title && (
                        <h5
                          style={{
                            margin: "0 0 8px 0",
                            fontSize: "14px",
                            color: "#333",
                          }}
                        >
                          {review.title}
                        </h5>
                      )}

                      {/* Review Text */}
                      <p
                        style={{
                          margin: "0 0 12px 0",
                          fontSize: "13px",
                          color: "#666",
                          lineHeight: "1.5",
                          maxHeight: "100px",
                          overflow: "hidden",
                        }}
                      >
                        {review.review_text}
                      </p>

                      {/* Images */}
                      {review.images && review.images.length > 0 && (
                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            marginBottom: "12px",
                            flexWrap: "wrap",
                          }}
                        >
                          {review.images.slice(0, 3).map((image, idx) => (
                            <img
                              key={idx}
                              src={image}
                              alt={`Review ${idx}`}
                              style={{
                                width: "60px",
                                height: "60px",
                                borderRadius: "4px",
                                objectFit: "cover",
                              }}
                            />
                          ))}
                          {review.images.length > 3 && (
                            <div
                              style={{
                                width: "60px",
                                height: "60px",
                                borderRadius: "4px",
                                background: "#f0f0f0",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "12px",
                                color: "#999",
                              }}
                            >
                              +{review.images.length - 3}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Footer */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          paddingTop: "12px",
                          borderTop: "1px solid #eee",
                          fontSize: "12px",
                          color: "#999",
                          flexWrap: "wrap",
                          gap: "8px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: "12px",
                            flex: 1,
                          }}
                        >
                          <span>{getTimeAgo(review.created_at)}</span>
                          {review.location && (
                            <span
                              style={{
                                color: "#666",
                                fontWeight: "500",
                              }}
                            >
                              📍 {review.location}
                            </span>
                          )}
                        </div>
                        <span
                          style={{
                            background: "#e8f4f8",
                            padding: "4px 8px",
                            borderRadius: "3px",
                            color: "#FF7101",
                          }}
                        >
                          {review.category || "General"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      justifyContent: "center",
                      marginTop: "30px",
                      paddingTop: "20px",
                      borderTop: "1px solid #eee",
                    }}
                  >
                    {currentPage > 1 && (
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        style={{
                          padding: "8px 12px",
                          background: "#FF7101",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Previous
                      </button>
                    )}

                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .slice(
                        Math.max(0, currentPage - 2),
                        Math.min(totalPages, currentPage + 1)
                      )
                      .map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          style={{
                            padding: "8px 12px",
                            background:
                              page === currentPage ? "#FF7101" : "#f0f0f0",
                            color: page === currentPage ? "white" : "#333",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          {page}
                        </button>
                      ))}

                    {currentPage < totalPages && (
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        style={{
                          padding: "8px 12px",
                          background: "#FF7101",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Next
                      </button>
                    )}
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}