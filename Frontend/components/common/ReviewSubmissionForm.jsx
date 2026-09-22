"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import { apiURL } from "@/utils/exports";

const API_BASE = apiURL;

export default function ReviewSubmissionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  const [formData, setFormData] = useState({
    author_name: "",
    author_email: "",
    rating: 5,
    title: "",
    review_text: "",
    category: "all",
    location: "",
  });

  const [images, setImages] = useState([]); // new File objects selected by user
  const [existingImages, setExistingImages] = useState([]); // URLs already saved on server
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Load testimonial if editing
  useEffect(() => {
    const fetchTestimonialForEdit = async () => {
      try {
        const res = await fetch(`${API_BASE}/testamonials/${editId}`);
        const data = await res.json();

        if (data.success) {
          const testimonial = data.data;
          setFormData({
            author_name: testimonial.author_name || "",
            author_email: testimonial.author_email || "",
            rating: testimonial.rating || 5,
            title: testimonial.title || "",
            review_text: testimonial.review_text || "",
            category: testimonial.category || "all",
            location: testimonial.location || "",
          });

          // Populate existing images so they're shown in the preview
          if (testimonial.images && testimonial.images.length > 0) {
            setExistingImages(testimonial.images);
          }

          setIsEditMode(true);
        } else {
          toast.error("Failed to load testimonial");
        }
      } catch (error) {
        console.error("Error fetching testimonial:", error);
        toast.error("Error loading testimonial");
      }
    };

    if (editId) {
      fetchTestimonialForEdit();
    }
  }, [editId]);



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
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.author_name ||
      !formData.review_text ||
      !formData.author_email
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);

      if (isEditMode && editId) {
        // Edit mode — send FormData so we can include both text fields and any
        // newly-selected images, while also forwarding the kept existing image URLs.
        const editData = new FormData();
        editData.append("author_name", formData.author_name);
        editData.append("author_email", formData.author_email);
        editData.append("rating", formData.rating);
        editData.append("title", formData.title);
        editData.append("review_text", formData.review_text);
        editData.append("category", formData.category);
        editData.append("location", formData.location);

        // Keep existing images that weren't removed
        existingImages.forEach((url) => {
          editData.append("existing_images", url);
        });

        // Append any newly-selected image files
        images.forEach((image) => {
          editData.append("images", image);
        });

        const res = await fetch(`${API_BASE}/testamonials/${editId}`, {
          method: "PUT",
          body: editData,
        });

        const data = await res.json();

        if (data.success) {
          toast.success("Testimonial updated successfully!");
          setTimeout(() => {
            router.push("/testimonials");
          }, 1500);
        } else {
          toast.error(data.message || "Failed to update testimonial");
        }
      } else {
        // Add mode - send FormData with multipart for images
        const submitData = new FormData();
        submitData.append("author_name", formData.author_name);
        submitData.append("author_email", formData.author_email);
        submitData.append("rating", formData.rating);
        submitData.append("title", formData.title);
        submitData.append("review_text", formData.review_text);
        submitData.append("category", formData.category);
        submitData.append("location", formData.location);

        // Add images
        images.forEach((image) => {
          submitData.append("images", image);
        });

        const res = await fetch(
          `${API_BASE}/testamonials`,
          {
            method: "POST",
            body: submitData,
          }
        );

        const data = await res.json();

        if (data.success) {
          toast.success("Review submitted successfully! Thank you for your feedback.");
          setFormData({
            author_name: "",
            author_email: "",
            rating: 5,
            title: "",
            review_text: "",
            category: "all",
            location: "",
          });
          setImages([]);
          
          // Reset form
          if (e.target) {
            e.target.reset();
          }
        } else {
          toast.error(data.message || "Failed to submit review");
        }
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Error submitting review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: "all", label: "General" },
    { value: "mileage", label: "Mileage" },
    { value: "performance", label: "Performance" },
    { value: "safety", label: "Safety" },
    { value: "looks", label: "Looks" },
    { value: "comfort", label: "Comfort" },
  ];

  return (
    <div className="review-submission-form">
      <style>{`
        .review-submission-form {
          max-width: 600px;
          margin: 0 auto;
          padding: 30px;
          background: #f9f9f9;
          border-radius: 8px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #333;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          font-family: inherit;
        }

        .form-group textarea {
          min-height: 120px;
          resize: vertical;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #FF7101;
          box-shadow: 0 0 0 3px rgba(28, 63, 176, 0.1);
        }

        .rating-input {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .star-input {
          font-size: 24px;
          cursor: pointer;
          color: #ddd;
          transition: color 0.2s;
        }

        .star-input.active {
          color: #ffc107;
        }

        .star-input:hover {
          color: #ffc107;
        }

        .file-input-wrapper {
          position: relative;
        }

        .file-input-label {
          display: inline-block;
          padding: 10px 20px;
         
          color: white;
          border-radius: 4px;
          cursor: pointer;
         
          transition: background 0.3s;
        }

        // .file-input-label:hover {
        //   background: #162f8a;
        // }

        .file-input-wrapper input[type="file"] {
          display: none;
        }

        .image-preview {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 10px;
        }

        .image-preview-item {
          position: relative;
          width: 80px;
          height: 80px;
          border-radius: 4px;
          overflow: hidden;
          background: white;
        }

        .image-preview-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .remove-image-btn {
          position: absolute;
          top: 2px;
          right: 2px;
          background: rgba(0, 0, 0, 0.6);
          color: white;
          border: none;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          padding: 0;
        }

        .required-field::after {
          content: " *";
          color: #ff4444;
        }

        .submit-btn {
          width: 100%;
          padding: 12px;
          background: #FF7101;
          color: white;
          border: none;
          border-radius: 4px;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: background 0.3s;
        }

        // .submit-btn:hover:not(:disabled) {
        //   background: #162f8a;
        // }

        .submit-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        @media (max-width: 600px) {
          .review-submission-form {
            padding: 20px;
          }

          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="form-header">
        <h3 style={{ marginBottom: "10px" }}>{isEditMode ? "Edit Your Review" : "Share Your Review"}</h3>
        <p style={{ color: "#666", marginBottom: "20px" }}>
          {isEditMode 
            ? "Update your review and help other customers make informed decisions"
            : "Help other customers make informed decisions by sharing your experience"
          }
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Name and Email */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="author_name" className="required-field">
              Your Name
            </label>
            <input
              type="text"
              id="author_name"
              name="author_name"
              value={formData.author_name}
              onChange={handleInputChange}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="author_email" className="required-field">
              Your Email
            </label>
            <input
              type="email"
              id="author_email"
              name="author_email"
              value={formData.author_email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        {/* Rating */}
        <div className="form-group">
          <label>Rating</label>
          <div className="rating-input">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star-input ${star <= formData.rating ? "active" : ""}`}
                onClick={() => handleInputChange({ target: { name: "rating", value: star } })}
                role="button"
                tabIndex="0"
              >
                ★
              </span>
            ))}
            <span style={{ marginLeft: "10px", color: "#666" }}>
              {formData.rating}/5
            </span>
          </div>
        </div>

        {/* Category */}
        <div className="form-group">
          <label htmlFor="category">Review Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div className="form-group">
          <label htmlFor="title">Review Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g., Excellent quality and great service"
          />
        </div>

        {/* Location */}
        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="e.g., New York, NY"
          />
        </div>

        {/* Review Text */}
        <div className="form-group">
          <label htmlFor="review_text" className="required-field">
            Your Review
          </label>
          <textarea
            id="review_text"
            name="review_text"
            value={formData.review_text}
            onChange={handleInputChange}
            placeholder="Share your experience with this vehicle..."
            required
          />
        </div>

        {/* Images */}
        <div className="form-group">
          <label>Upload Images (Optional)</label>
          <div className="file-input-wrapper">
            <label htmlFor="images" className="file-input-label">
              Choose Images
            </label>
            <input
              type="file"
              id="images"
              name="images"
              multiple
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          {/* Show existing saved images when editing */}
          {existingImages.length > 0 && (
            <div className="image-preview" style={{ marginTop: "10px" }}>
              {existingImages.map((url, idx) => (
                <div key={`existing-${idx}`} className="image-preview-item">
                  <img src={url} alt={`Existing ${idx}`} />
                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={() => {
                      setExistingImages(existingImages.filter((_, i) => i !== idx));
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Show newly-selected file previews */}
          {images.length > 0 && (
            <div className="image-preview">
              {images.map((image, idx) => (
                <div key={idx} className="image-preview-item">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${idx}`}
                  />
                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={() => {
                      setImages(images.filter((_, i) => i !== idx));
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="submit-btn"
          disabled={loading}
        >
          {loading ? (isEditMode ? "Updating..." : "Submitting...") : (isEditMode ? "Update Review" : "Submit Review")}
        </button>
      </form>
    </div>
  );
}