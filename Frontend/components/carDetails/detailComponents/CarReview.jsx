"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import ReviewForm from "./ReviewForm";
import toast from "react-hot-toast";

export default function CarReview({ carId }) {
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (!carId) {
      setLoading(false);
      return;
    }

    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://apis.ukaautotrade.co.uk/api/reviews/listing/${carId}?category=${selectedCategory}`,
        );
        const data = await response.json();

        if (data.success) {
          setReviews(data.data || []);
          setSummary(data.summary);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [carId, selectedCategory, refreshTrigger]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleReviewSubmitted = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleDeleteReview = async (reviewId) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const res = await fetch(
        `https://apis.ukaautotrade.co.uk/api/reviews/${reviewId}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (data.success) {
        toast.success("Review deleted successfully");
        setRefreshTrigger((prev) => prev + 1);
      } else {
        toast.error(data.message || "Failed to delete review");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Error deleting review");
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <i
        key={i}
        className="icon-autodeal-star"
        style={{
          color: i < rating ? "#ff9800" : "#ddd",
        }}
      />
    ));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      {/* Rating Summary Card */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "25px",
        padding: "30px",
        backgroundColor: "#fff8f3",
        borderRadius: "12px",
        marginBottom: "40px",
        border: "1px solid #ffe0cc"
      }}>
        <div style={{
          textAlign: "center",
          flex: "0 0 auto"
        }}>
          <div style={{
            fontSize: "16px",
            color: "#ff9800",
            marginBottom: "5px"
          }}>
            ★★★★★
          </div>
          <div style={{
            fontSize: "48px",
            fontWeight: "700",
            color: "#ff9800",
            lineHeight: "1"
          }}>
            {summary && summary.average_rating 
              ? parseFloat(summary.average_rating).toFixed(1) 
              : "0"}
          </div>
        </div>
        <div style={{
          flex: "1"
        }}>
          <p style={{
            fontSize: "18px",
            fontWeight: "600",
            color: "#1a1a1a",
            margin: "0 0 8px 0"
          }}>
            Overall Rating
          </p>
          <p style={{
            fontSize: "14px",
            color: "#666",
            margin: "0"
          }}>
            Based on <strong>{(summary && summary.total_reviews) || 0}</strong> verified reviews
          </p>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div style={{
        marginBottom: "40px",
        // borderBottom: "2px solid #e0e0e0"
      }}>
        <div style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          overflowX: "auto",
          paddingBottom: "15px"
        }}>
          {["all", "mileage", "performance", "safety", "looks", "comfort"].map(
            (category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                style={{
                  padding: "10px 18px",
                  fontSize: "13px",
                  fontWeight: "600",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  backgroundColor: selectedCategory === category ? "#ff9800" : "#f0f0f0",
                  color: selectedCategory === category ? "white" : "#666",
                  transition: "all 0.3s ease",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  whiteSpace: "nowrap"
                }}
                onMouseOver={(e) => {
                  if (selectedCategory !== category) {
                    e.target.style.backgroundColor = "#e8e8e8";
                  }
                }}
                onMouseOut={(e) => {
                  if (selectedCategory !== category) {
                    e.target.style.backgroundColor = "#f0f0f0";
                  }
                }}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ),
          )}
        </div>
      </div>

      {/* Reviews Section Header */}
      <div style={{ marginBottom: "30px" }}>
        <h3 style={{
          fontSize: "20px",
          fontWeight: "600",
          color: "#1a1a1a",
          margin: "0 0 10px 0"
        }}>
          {reviews.length === 0
            ? "No reviews yet"
            : `${reviews.length} ${reviews.length === 1 ? "Review" : "Reviews"}`}
        </h3>
      </div>

      {/* Loading State */}
      {loading ? (
        <div style={{
          textAlign: "center",
          padding: "60px 20px",
          backgroundColor: "#f9f9f9",
          borderRadius: "12px"
        }}>
          <div style={{
            display: "inline-block",
            width: "40px",
            height: "40px",
            border: "4px solid #e0e0e0",
            borderTop: "4px solid #ff9800",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite"
          }} />
          <p style={{
            marginTop: "15px",
            color: "#666",
            fontSize: "14px"
          }}>
            Loading reviews...
          </p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      ) : reviews.length === 0 ? (
        // Empty State
        <div style={{
          padding: "50px 30px",
          textAlign: "center",
          backgroundColor: "#f9f9f9",
          borderRadius: "12px",
          border: "1px dashed #ddd"
        }}>
          <div style={{ fontSize: "48px", marginBottom: "15px" }}>💬</div>
          <p style={{
            fontSize: "16px",
            fontWeight: "600",
            color: "#1a1a1a",
            margin: "0 0 8px 0"
          }}>
            No reviews yet
          </p>
          <p style={{
            fontSize: "14px",
            color: "#999",
            margin: "0"
          }}>
            Be the first to share your experience with this car!
          </p>
        </div>
      ) : (
        // Reviews List
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "25px",
          marginBottom: "40px"
        }}>
          {reviews.map((review) => (
            <div
              key={review.id}
              style={{
                padding: "25px",
                backgroundColor: "white",
                border: "1px solid #e0e0e0",
                borderRadius: "12px",
                transition: "all 0.3s ease"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.08)";
                e.currentTarget.style.borderColor = "#ff9800";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = "#e0e0e0";
              }}
            >
              {/* Author Header */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "15px"
              }}>
                <div style={{
                  display: "flex",
                  gap: "15px",
                  flex: "1"
                }}>
                  <div style={{
                    width: "50px",
                    height: "50px",
                    minWidth: "50px",
                    borderRadius: "50%",
                    backgroundColor: "#ff9800",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "20px",
                    fontWeight: "700"
                  }}>
                    {review.author_name.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: "1" }}>
                    <h4 style={{
                      fontSize: "15px",
                      fontWeight: "700",
                      color: "#1a1a1a",
                      margin: "0 0 5px 0"
                    }}>
                      {review.author_name}
                    </h4>
                    <div style={{
                      display: "flex",
                      gap: "5px",
                      marginBottom: "5px"
                    }}>
                      {renderStars(review.rating)}
                    </div>
                    {review.category && review.category !== "all" && (
                      <span style={{
                        display: "inline-block",
                        padding: "3px 10px",
                        backgroundColor: "#f0f0f0",
                        borderRadius: "20px",
                        fontSize: "12px",
                        color: "#666",
                        fontWeight: "500"
                      }}>
                        {review.category.charAt(0).toUpperCase() + review.category.slice(1)}
                      </span>
                    )}
                  </div>
                </div>
                <p style={{
                  fontSize: "12px",
                  color: "#999",
                  margin: "0",
                  whiteSpace: "nowrap",
                  marginLeft: "15px"
                }}>
                  {formatDate(review.created_at)}
                </p>
              </div>

              {/* Review Title */}
              {review.title && (
                <h5 style={{
                  fontSize: "15px",
                  fontWeight: "700",
                  color: "#1a1a1a",
                  margin: "0 0 12px 0"
                }}>
                  {review.title}
                </h5>
              )}

              {/* Review Text */}
              <p style={{
                fontSize: "14px",
                color: "#555",
                lineHeight: "1.6",
                margin: "0 0 15px 0",
                whiteSpace: "pre-wrap"
              }}>
                {review.review_text}
              </p>

              {/* Review Images */}
              {review.images && review.images.length > 0 && (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                  gap: "12px",
                  marginBottom: "15px"
                }}>
                  {review.images.slice(0, 4).map((img, idx) => (
                    <div
                      key={idx}
                      style={{
                        position: "relative",
                        paddingBottom: "100%",
                        overflow: "hidden",
                        borderRadius: "8px",
                        border: "1px solid #e0e0e0",
                        cursor: "pointer",
                        transition: "all 0.3s ease"
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = "scale(1.05)";
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <Image
                        alt={`Review ${idx + 1}`}
                        src={img}
                        fill
                        style={{
                          objectFit: "cover"
                        }}
                      />
                    </div>
                  ))}
                  {review.images.length > 4 && (
                    <div style={{
                      position: "relative",
                      paddingBottom: "100%",
                      overflow: "hidden",
                      borderRadius: "8px",
                      border: "1px solid #e0e0e0",
                      backgroundColor: "#f0f0f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      color: "#666",
                      fontWeight: "600"
                    }}>
                      +{review.images.length - 4} more
                    </div>
                  )}
                </div>
              )}

              {/* Delete Button */}
              {/* <div style={{
                display: "flex",
                justifyContent: "flex-end",
                paddingTop: "15px",
                borderTop: "1px solid #e0e0e0",
                marginTop: "15px"
              }}>
                <button
                  onClick={() => handleDeleteReview(review.id)}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#ff4444",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
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
              </div> */}
            </div>
          ))}
        </div>
      )}

      {/* Review Form */}
      {carId && (
        <div style={{
          marginTop: "50px",
          paddingTop: "50px",
          borderTop: "2px solid #e0e0e0"
        }}>
          <ReviewForm
            listingId={carId}
            onReviewSubmitted={handleReviewSubmitted}
          />
        </div>
      )}
    </>
  );
}
