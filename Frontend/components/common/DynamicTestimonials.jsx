"use client";

import { useState, useEffect } from "react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import Link from "next/link";

export default function DynamicTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Fetch reviews with limit for homepage display
        const res = await fetch(
          `https://apis.ukaautotrade.co.uk/api/testamonials?limit=10&page=1`
        );
        const data = await res.json();

        if (data.success && data.data) {
          // Transform reviews data to match testimonials format
          const transformedData = data.data.map((review) => ({
            id: review.id,
            date: new Date(review.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            text: review.review_text,
            title: review.title,
            authorImage:
              review.images && review.images[0]
                ? review.images[0]
                : "/assets/images/author/avt2.jpg",
            authorName: review.author_name,
            authorTitle: review.category || "Customer",
            rating: review.rating,
          }));

          setTestimonials(transformedData);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const swiperOptions = {
    loop: testimonials.length > 1,
    slidesPerView: 1,
    spaceBetween: 30,
    pagination: {
      el: ".spd21",
      clickable: true,
    },
    breakpoints: {
      0: {
        slidesPerView: 1,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      992: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
    },
  };

  const StarRating = ({ rating }) => {
    return (
      <div style={{ display: "flex", gap: "4px", marginBottom: "10px" }}>
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

  if (loading) {
    return (
      <section className="tf-section bg-1">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="heading-section center">
                <h2 className="wow fadeInUpSmall" data-wow-delay="0.2s">
                  We love our clients
                </h2>
              </div>
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <p>Loading testimonials...</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return (
      <section className="tf-section bg-1">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="heading-section center">
                <h2 className="wow fadeInUpSmall" data-wow-delay="0.2s">
                  We love our clients
                </h2>
                <p
                  className="mt-18 wow fadeInUpSmall"
                  data-wow-delay="0.2s"
                  data-wow-duration="1000ms"
                >
                  Be the first to share your experience!
                </p>
                <Link
                  href="/submit-review"
                  style={{
                    display: "inline-block",
                    marginTop: "20px",
                    padding: "10px 20px",
                    background: "#FF7101",
                    color: "white",
                    borderRadius: "4px",
                    textDecoration: "none",
                  }}
                >
                  Submit Your Review
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="tf-section bg-1">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="heading-section center">
              <h2
                className="wow fadeInUpSmall"
                data-wow-delay="0.2s"
                data-wow-duration="1000ms"
              >
                We love our clients
              </h2>
              <p
                className="mt-18 wow fadeInUpSmall"
                data-wow-delay="0.2s"
                data-wow-duration="1000ms"
              >
                Discover exceptional experiences through testimonials from our
                satisfied customers.
              </p>
              <Link
                href="/submit-review"
                style={{
                  display: "inline-block",
                  marginTop: "15px",
                  padding: "8px 16px",
                  background: "#FF7101",
                  color: "white",
                  borderRadius: "4px",
                  textDecoration: "none",
                  fontSize: "14px",
                }}
              >
                Share Your Review
              </Link>
            </div>
          </div>
          <div className="col-lg-12">
            <Swiper
              {...swiperOptions}
              modules={[Pagination, Navigation]}
              className="swiper-container carousel-7 overflow-hidden"
            >
              {testimonials.map((elm, i) => (
                <SwiperSlide key={i} className="swiper-slide">
                  <div className="tf-testimonial style-2 box-tes">
                    <StarRating rating={elm.rating} />
                    {elm.title && (
                      <h5 style={{ marginBottom: "8px", marginTop: "-5px" }}>
                        {elm.title}
                      </h5>
                    )}
                    <p className="fs-16 lh-22 text-color-2">"{elm.text}"</p>
                    <div className="author-box flex">
                      <div className="images">
                        <Image
                          className="ls-is-cached lazyloaded"
                          alt={elm.authorName}
                          src={elm.authorImage}
                          width={120}
                          height={120}
                          onError={(e) => {
                            e.target.src =
                              "/assets/images/author/avt2.jpg";
                          }}
                        />
                      </div>
                      <div className="content">
                        <h5>{elm.authorName}</h5>
                        <p className="fs-14 text-color-1">{elm.authorTitle}</p>
                        <p className="fs-13 text-color-1">{elm.date}</p>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="spd21" />
          </div>
        </div>
      </div>
    </section>
  );
}
