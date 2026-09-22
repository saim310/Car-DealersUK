"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";

export default function CarsReview() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);
  const [cars, setCars] = useState({});

  const API_BASE = "https://apis.ukaautotrade.co.uk/api";

  const fetchReviews = async (page = 1) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${API_BASE}/reviews?page=${page}&limit=${itemsPerPage}`
      );
      const data = await res.json();

      if (data.success) {
        // Filter only reviews with listing_id (car reviews, not testimonials)
        const carReviews = (data.data || []).filter((review) => review.listing_id);
        setReviews(carReviews);
        setTotalPages(data.pagination?.total_pages || 1);
        setCurrentPage(page);

        // Fetch car details for each review
        const carsMap = {};
        for (const review of carReviews) {
          if (review.listing_id && !carsMap[review.listing_id]) {
            try {
              const carRes = await fetch(`${API_BASE}/listings/${review.listing_id}`);
              const carData = await carRes.json();
              if (carData && carData.id) {
  carsMap[review.listing_id] = carData;
}
            } catch (err) {
              console.error(`Failed to fetch car ${review.listing_id}:`, err);
            }
          }
        }
        setCars(carsMap);
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
      const res = await fetch(`${API_BASE}/reviews/${reviewId}`, {
        method: "DELETE",
      });

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
                  <h1 className="admin-title mb-3">Cars Review</h1>
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
                  <h1 className="admin-title mb-3">Cars Review</h1>
                  <div
                    style={{
                      textAlign: "center",
                      padding: "60px 20px",
                      background: "#f9f9f9",
                      borderRadius: "8px",
                    }}
                  >
                    <p style={{ fontSize: "16px", color: "#666" }}>
                      No car reviews yet. Reviews submitted from car detail pages will appear here.
                    </p>
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
                <h1 className="admin-title mb-3">Cars Review</h1>

                {/* Reviews Grid */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                    gap: "24px",
                    marginBottom: "30px",
                  }}
                >
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      style={{
                        background: "white",
                        borderRadius: "12px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        overflow: "hidden",
                        transition: "all 0.3s ease",
                        display: "flex",
                        flexDirection: "column",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)";
                        e.currentTarget.style.transform = "translateY(-4px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      {/* Car Title Header */}
                      <div className="car-title-header" style={{ background: "#f5f5f5", padding: "14px 16px" }}>
                        <Link
                          href={`/listing-detail-v1/${review.listing_id}`}
                          target="_blank"
                          style={{
                            color: "#ff9800",
                            textDecoration: "none",
                            display: "block",
                            cursor: "pointer",
                          }}
                        >
                          <h3
                         
                            style={{

                              margin: "0",
                              fontSize: "15px",
                              fontWeight: 700,
                              color: "inherit",
                            }}
                          >
                            {cars[review.listing_id]?.title || 
                             cars[review.listing_id]?.listing_title || 
                             `View Car Details`}
                          </h3>
                        </Link>
                      </div>

                      <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column" }}>
                        {/* Review Title */}
                        <h4
                          style={{
                            margin: "0 0 8px 0",
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#333",
                          }}
                        >
                          {review.title || "Review"}
                        </h4>

                        {/* Author and Rating */}
                        <div style={{ marginBottom: "10px" }}>
                          <p
                            style={{
                              margin: "0 0 4px 0",
                              fontSize: "13px",
                              color: "#666",
                              fontWeight: 600,
                            }}
                          >
                            {review.author_name}
                          </p>
                          <div style={{ marginBottom: "8px" }}>
                            <StarRating rating={review.rating} />
                          </div>
                          <p
                            style={{
                              margin: "0",
                              fontSize: "11px",
                              color: "#999",
                            }}
                          >
                            {getTimeAgo(review.created_at)}
                          </p>
                        </div>

                        {/* Category */}
                        {review.category && review.category !== "all" && (
                          <div
                            style={{
                              display: "inline-block",
                              backgroundColor: "#fff3e0",
                              padding: "4px 10px",
                              borderRadius: "4px",
                              fontSize: "11px",
                              color: "#ff9800",
                              fontWeight: 600,
                              marginBottom: "10px",
                              width: "fit-content",
                            }}
                          >
                            {review.category}
                          </div>
                        )}

                        {/* Review Text */}
                        <p
                          style={{
                            margin: "0 0 12px 0",
                            color: "#555",
                            fontSize: "13px",
                            lineHeight: "1.5",
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            flex: 1,
                          }}
                        >
                          {review.review_text}
                        </p>

                        {/* Review Images */}
                        {review.images && review.images.length > 0 && (
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "repeat(3, 1fr)",
                              gap: "8px",
                              marginBottom: "12px",
                            }}
                          >
                            {review.images.slice(0, 3).map((image, idx) => (
                              <div
                                key={idx}
                                style={{
                                  width: "100%",
                                  height: "70px",
                                  borderRadius: "6px",
                                  overflow: "hidden",
                                  border: "1px solid #eee",
                                }}
                              >
                                <img
                                  src={image}
                                  alt={`Review ${idx + 1}`}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                              </div>
                            ))}
                            {review.images.length > 3 && (
                              <div
                                style={{
                                  width: "100%",
                                  height: "70px",
                                  borderRadius: "6px",
                                  background: "#f0f0f0",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "11px",
                                  fontWeight: 600,
                                  color: "#999",
                                  border: "1px solid #eee",
                                }}
                              >
                                +{review.images.length - 3} more
                              </div>
                            )}
                          </div>
                        )}

                        {/* Meta Info */}
                        {review.author_email && (
                          <div
                            style={{
                              fontSize: "11px",
                              color: "#999",
                              marginBottom: "12px",
                              paddingBottom: "12px",
                              borderBottom: "1px solid #eee",
                            }}
                          >
                            {review.author_email}
                          </div>
                        )}

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteReview(review.id)}
                          style={{
                            width: "100%",
                            padding: "10px",
                            backgroundColor: "#ff4444",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "13px",
                            fontWeight: 600,
                            transition: "background-color 0.2s",
                          }}
                          onMouseEnter={(e) =>
                            (e.target.style.backgroundColor = "#cc0000")
                          }
                          onMouseLeave={(e) =>
                            (e.target.style.backgroundColor = "#ff4444")
                          }
                        >
                          Delete Review
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div
                    style={{
                      marginTop: "30px",
                      display: "flex",
                      justifyContent: "center",
                      gap: "10px",
                      flexWrap: "wrap",
                    }}
                  >
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          style={{
                            padding: "8px 12px",
                            backgroundColor:
                              currentPage === page ? "#ff9800" : "#f0f0f0",
                            color: currentPage === page ? "white" : "#333",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontWeight: currentPage === page ? 600 : 400,
                          }}
                        >
                          {page}
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
       <style jsx>{`
      .car-title-header h3:hover {
        text-decoration: underline;
      } 
        `}</style>
    </div>

   
  );
}
