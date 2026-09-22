"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
// Integrated Lucide icons for a professional look
import { 
  MapPin, 
  Mail, 
  Calendar, 
  Tag, 
  Hash, 
  Key, 
  X, 
  Image as ImageIcon,
  Star
} from 'lucide-react';

import "swiper/css";
import "swiper/css/pagination";

import style from "../../public/assets/css/review.module.css";

/* ─────────────────────────────────────────
    Tiny helpers
───────────────────────────────────────── */
const StarRow = ({ rating, size = "1.2rem", showEmpty = false }) => (
  <div style={{ display: "flex", gap: "2px" }}>
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={size}
        fill={i < rating ? "#FFD700" : "transparent"}
        color={i < rating ? "#FFD700" : showEmpty ? "rgba(255,255,255,0.35)" : "transparent"}
      />
    ))}
  </div>
);

const Badge = ({ children }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "5px",
      padding: "4px 11px",
      borderRadius: "20px",
      fontSize: "0.74rem",
      fontWeight: 700,
      letterSpacing: "0.03em",
      textTransform: "capitalize",
      color: "#FF7101",
      background: "rgba(255,255,255,0.9)",
      border: "1px solid rgba(255,113,1,0.3)",
    }}
  >
    <Tag size={12} strokeWidth={3} />
    {children}
  </span>
);

const MetaRow = ({ icon: Icon, label, value }) => {
  if (!value) return null;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        padding: "12px 0",
        borderBottom: "1px solid #f3f3f3",
      }}
    >
      <span style={{ color: "#FF7101", flexShrink: 0, marginTop: "2px" }}>
        <Icon size={18} strokeWidth={2} />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: "0.65rem", color: "#b0b0b0", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em" }}>
          {label}
        </p>
        <p style={{ margin: "2px 0 0", fontSize: "0.9rem", color: "#2a2a2a", fontWeight: 500, wordBreak: "break-all" }}>
          {value}
        </p>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
    Modal
───────────────────────────────────────── */
const ReviewModal = ({ review, onClose }) => {
  if (!review) return null;

  const carLabel = [review.brand, review.model, review.years].filter(Boolean).join(" ");
  const hasCarInfo = review.brand || review.model || review.plate_number || review.vin_number;
  const images = Array.isArray(review.images) ? review.images.filter(Boolean) : [];

  const formattedDate = review.created_at
    ? new Date(review.created_at).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })
    : null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(10,10,10,0.75)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "16px",
        animation: "mFadeIn 0.18s ease",
      }}
    >
      <style>{`
        @keyframes mFadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes mSlideUp { from { opacity:0; transform:translateY(28px) scale(0.98) } to { opacity:1; transform:translateY(0) scale(1) } }
        .mscroll::-webkit-scrollbar { width: 4px; }
        .mscroll::-webkit-scrollbar-track { background: transparent; }
        .mscroll::-webkit-scrollbar-thumb { background: #e4e4e4; border-radius: 99px; }
        .mclose:hover { background: white !important; color: #FF7101 !important; transform: rotate(90deg); }
        .mimg:hover { transform: scale(1.05); box-shadow: 0 8px 24px rgba(0,0,0,0.22); }
        .mimg { transition: transform 0.2s, box-shadow 0.2s; }
      `}</style>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "600px",
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 40px 100px rgba(0,0,0,0.35)",
          animation: "mSlideUp 0.25s cubic-bezier(0.34,1.2,0.64,1)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{ background: "linear-gradient(140deg, #FF7101 0%, #ff9a45 100%)", padding: "30px 26px 24px", position: "relative" }}>
          <button
            className="mclose"
            onClick={onClose}
            style={{
              position: "absolute", top: "16px", right: "16px", width: "32px", height: "32px",
              borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.2)",
              color: "#fff", cursor: "pointer", display: "flex", alignItems: "center",
              justifyContent: "center", transition: "all 0.3s ease"
            }}
          >
            <X size={18} />
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "18px" }}>
            <div style={{
              width: "56px", height: "56px", borderRadius: "50%", background: "rgba(255,255,255,0.2)",
              border: "2px solid rgba(255,255,255,0.6)", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: "1.4rem", fontWeight: 800, color: "#fff"
            }}>
              {review.author_name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <p style={{ margin: 0, color: "#fff", fontWeight: 700, fontSize: "1.1rem" }}>{review.author_name}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px", marginTop: "4px" }}>
                {review.author_email && (
                  <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "rgba(255,255,255,0.85)", fontSize: "0.8rem" }}>
                    <Mail size={12} /> {review.author_email}
                  </span>
                )}
                {formattedDate && (
                  <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "rgba(255,255,255,0.85)", fontSize: "0.8rem" }}>
                    <Calendar size={12} /> {formattedDate}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <StarRow rating={review.rating} size={20} showEmpty />
            <span style={{ background: "white", color: "#FF7101", fontWeight: 800, fontSize: "0.8rem", borderRadius: "12px", padding: "2px 10px" }}>
              {review.rating}.0
            </span>
            {review.category && review.category !== "all" && <Badge>{review.category}</Badge>}
            {review.location && (
              <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "white", fontSize: "0.8rem", fontWeight: 500 }}>
                <MapPin size={14} /> {review.location}
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="mscroll" style={{ overflowY: "auto", flex: 1, padding: "24px 26px" }}>
          {review.title && <h3 style={{ margin: "0 0 12px", fontSize: "1.2rem", fontWeight: 700, color: "#111" }}>{review.title}</h3>}
          <p style={{ margin: "0 0 24px", color: "#454545", fontSize: "0.95rem", lineHeight: 1.7 }}>{review.review_text}</p>

          {images.length > 0 && (
            <div style={{ marginBottom: "24px" }}>
              <p style={{ display: "flex", alignItems: "center", gap: "6px", margin: "0 0 12px", fontSize: "0.7rem", fontWeight: 700, color: "#b0b0b0", textTransform: "uppercase" }}>
                <ImageIcon size={14} /> Gallery ({images.length})
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "10px" }}>
                {images.map((src, i) => (
                  <img key={i} src={src} alt="Review" className="mimg" style={{ width: "100%", height: "90px", objectFit: "cover", borderRadius: "10px" }} />
                ))}
              </div>
            </div>
          )}

          {hasCarInfo && (
            <>
              <SectionDivider label="Vehicle Specifications" />
              <div style={{ background: "#fcfcfc", borderRadius: "12px", padding: "4px 16px", border: "1px solid #f0f0f0" }}>
                <MetaRow icon={Tag} label="Make · Model · Year" value={carLabel} />
                <MetaRow icon={Hash} label="Plate Number" value={review.plate_number} />
                <MetaRow icon={Key} label="VIN Number" value={review.vin_number} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const SectionDivider = ({ label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "10px 0 16px" }}>
    <div style={{ flex: 1, height: "1px", background: "#f0f0f0" }} />
    <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</span>
    <div style={{ flex: 1, height: "1px", background: "#f0f0f0" }} />
  </div>
);



/* ─────────────────────────────────────────
   Main Slider
───────────────────────────────────────── */
const ReviewSlider = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("https://apis.ukaautotrade.co.uk/api/testamonials");
        const result = await response.json();
        if (result.success) setReviews(result.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setSelectedReview(null); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = selectedReview ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selectedReview]);

  if (loading) return <p>Loading reviews...</p>;

  return (
    <>
      <section className={style["review-section"]}>
        <div className={style["container"]}>
          <h2 className={style["section-title"]}>Reviews</h2>

          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            loop={reviews.length > 1}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ clickable: true , dynamicBullets: true,
  dynamicMainBullets: 3,}}
            breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
            className={style["mySwiper"]}
          >
            {reviews.map((rev) => (
              <SwiperSlide key={rev.id}>
                <div
                  className={style["review-card"]}
                  onClick={() => setSelectedReview(rev)}
                  style={{ cursor: "pointer" }}
                >
                  <div className={style["card-header"]}>
                    <div className={style["stars"]}>
                      {[...Array(rev.rating)].map((_, i) => (
                        <span key={i} className={style["star"]}>★</span>
                      ))}
                    </div>
                    <div className={style["thumbs-up"]}>
                      <span>{rev.category}</span>
                    </div>
                  </div>
                  <p className={style["review-text"]}>{rev.review_text}</p>
                  <div className={style["review-footer"]} style={{ position: "absolute", bottom: "30px" }}>
                    <p className={style["author"]}>{rev.author_name}</p>
                    <p className={style["location"]}>
                      {new Date(rev.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {selectedReview && (
        <ReviewModal review={selectedReview} onClose={() => setSelectedReview(null)} />
      )}
    </>
  );
};

export default ReviewSlider;