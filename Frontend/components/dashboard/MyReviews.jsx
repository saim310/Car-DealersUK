"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function MyReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);

  const fetchReviews = async (page = 1) => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://apis.ukaautotrade.co.uk/api/testamonials?page=${page}&limit=${itemsPerPage}`
      );
      const data = await res.json();

      if (data.success) {
        setReviews(data.data || []);
        setTotalPages(data.pagination?.total_pages || 1);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(currentPage);
  }, []);

  const handleDeleteReview = async (reviewId) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const res = await fetch(
        `https://apis.ukaautotrade.co.uk/api/testamonials/${reviewId}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (data.success) {
        toast.success("Review deleted successfully");
        fetchReviews(currentPage);
      } else {
        toast.error(data.message || "Failed to delete review");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Error deleting review");
    }
  };

  const handlePageChange = (newPage) => {
    fetchReviews(newPage);
  };

  const StarRating = ({ rating }) => {
    return (
      <div className="star-rating-review">
        {[1, 2, 3, 4, 5].map((star) => (
          <i
            key={star}
            className={`star disabled-click icon-autodeal-star ${
              star <= rating ? "active" : ""
            }`}
            data-rating={star}
          />
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
                  <h1 className="admin-title mb-3">All Reviews</h1>
                  <p style={{ textAlign: "center", padding: "40px" }}>
                    Loading reviews...
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
                  <h1 className="admin-title mb-3">All Reviews</h1>
                  <div
                    style={{
                      textAlign: "center",
                      padding: "60px 20px",
                      background: "#f9f9f9",
                      borderRadius: "8px",
                    }}
                  >
                    <p style={{ fontSize: "16px", color: "#666" }}>
                      No reviews yet. Share the link below so customers can submit reviews!
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
                        Customer Review Link:
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
                  }}
                >
                  <h1 className="admin-title mb-3">All Reviews</h1>
                  <div
                    style={{
                      padding: "8px 15px",
                      background: "#e8f0ff",
                      borderRadius: "4px",
                      fontSize: "14px",
                      color: "#FF7101",
                    }}
                  >
                    Total: {reviews.length} reviews
                  </div>
                </div>

                <div className="tfcl-dashboard-middle-right">
                  <div className="tfcl-card tfcl-dashboard-reviews">
                    <ul>
                      {reviews.map((review, index) => (
                        <li key={review.id || index} className="comment-by-user">
                          <div className="group-author">
                            <div className="avatar" style={{ fontSize: "32px", display: "flex", alignItems: "center", justifyContent: "center", width: "56px", height: "56px", borderRadius: "50%", background: "#e8f0ff", color: "#FF7101" }}>
                              {review.author_name.charAt(0).toUpperCase()}
                            </div>
                            <div className="group-name">
                              <div className="review-name">
                                <b>{review.author_name}</b>
                                <span className="review-date">
                                  {getTimeAgo(review.created_at)}
                                </span>
                              </div>
                              <p style={{ fontSize: "12px", color: "#999", margin: "2px 0" }}>
                                {review.author_email}
                              </p>
                            </div>
                          </div>

                          {review.title && (
                            <div style={{ marginBottom: "10px" }}>
                              <h5 style={{ margin: "0", color: "#333" }}>
                                {review.title}
                              </h5>
                            </div>
                          )}

                          <div className="content">
                            <p>{review.review_text}</p>
                            {review.images && review.images.length > 0 && (
                              <div
                                style={{
                                  display: "flex",
                                  gap: "10px",
                                  marginTop: "10px",
                                  flexWrap: "wrap",
                                }}
                              >
                                {review.images.map((image, idx) => (
                                  <img
                                    key={idx}
                                    src={image}
                                    alt={`Review ${idx}`}
                                    style={{
                                      maxWidth: "100px",
                                      maxHeight: "100px",
                                      borderRadius: "4px",
                                      objectFit: "cover",
                                    }}
                                  />
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="rating-wrap">
                            <div className="form-group">
                              <StarRating rating={review.rating} />
                            </div>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              gap: "10px",
                              marginTop: "10px",
                              paddingTop: "10px",
                              borderTop: "1px solid #eee",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "12px",
                                background: "#f0f0f0",
                                padding: "4px 8px",
                                borderRadius: "3px",
                                color: "#666",
                              }}
                            >
                              {review.category || "General"}
                            </span>
                            <button
                              onClick={() => handleDeleteReview(review.id)}
                              style={{
                                marginLeft: "auto",
                                background: "#ff4444",
                                color: "white",
                                border: "none",
                                padding: "6px 12px",
                                borderRadius: "3px",
                                cursor: "pointer",
                                fontSize: "12px",
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
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

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
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
                        )
                      )}

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
