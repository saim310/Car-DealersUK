"use client";

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  const [slides, setSlides] = useState([]);
  const [callUsLink, setCallUsLink] = useState("/contact");
  const [isMobile, setIsMobile] = useState(false);

  const localMobileSlides = [
    "/assets/images/mobile-banner-1.jpeg",
  ];

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const fetchHeroContent = async () => {
      try {
        const response = await fetch("https://apis.ukaautotrade.co.uk/api/hero");
        const data = await response.json();
        setSlides(data?.backgroundImages || []);
        if (data?.callUsLink) {
          setCallUsLink(data.callUsLink);
        }
      } catch (error) {
        console.error("Error fetching hero content:", error);
      }
    };
    fetchHeroContent();
  }, []);

  const activeSlides = isMobile && localMobileSlides.length > 0 && localMobileSlides[0] !== "" ? localMobileSlides : slides;

  const swiperOptions = {
    autoplay: {
      delay: 6000,
      disableOnInteraction: false,
    },
    slidesPerView: 1,
    speed: 500,
    effect: "fade",
    fadeEffect: { crossFade: true },
    navigation: {
      nextEl: ".snbn7",
      prevEl: ".snbp7",
    },
  };

  return (
    <>
      <style jsx global>{`
        .hero-slide-item {
          position: relative;
          width: 100%;
          height: 600px;
          min-height: 400px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }

        @media (max-width: 992px) {
          .hero-slide-item {
            height: 500px;
          }
        }

        @media (max-width: 768px) {
          .hero-slide-item {
            height: 420px;
          }
        }

        /* Desktop Buttons Layout */
        .hero-buttons-block {
          position: relative;
          z-index: 2;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          padding: 0 24px 36px 24px;
        }

        .hero-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: rgb(255, 107, 0);
          color: #ffffff;
          padding: 12px 24px;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 600;
          text-decoration: none;
          transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 4px 18px rgba(255, 107, 0, 0.4);
          white-space: nowrap;
        }

        .hero-btn:hover {
          background: rgb(220, 85, 0);
          transform: translateY(-2px);
          color: #ffffff;
        }

        /* Mobile Centered Bottom Circular Buttons Styles */
        @media (max-width: 768px) {
          .hero-buttons-block {
            position: absolute;
            bottom: 15px;
            left: 50%;
            transform: translateX(-50%);
            width: auto;
            flex-direction: row; /* Aligns them side-by-side in the center */
            gap: 12px;
            padding: 0;
            z-index: 10;
          }

          .hero-btn {
            width: 48px;
            height: 48px;
            padding: 0;
            border-radius: 50%;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            font-size: 0; /* Hides text, shows only icon */
          }

          .hero-btn svg {
            width: 20px;
            height: 20px;
          }

          .hero-btn.finance-btn {
            background: #111111;
            border: 2px solid #fff;
          }
        }
      `}</style>

      <Swiper
        {...swiperOptions}
        modules={[Autoplay, Navigation, Pagination, EffectFade]}
        className="swiper mainslider slider home"
      >
        {activeSlides.map((elm, i) => (
          <SwiperSlide key={i}>
            <div className="hero-slide-item">
              <Image
                alt="Hero Background"
                src={elm}
                priority={i === 0}
                fill
                style={{
                  objectFit: "cover",
                  objectPosition: "center center",
                }}
              />

              <div className="hero-buttons-block">
                {/* Call Button */}
                <Link
                  href={callUsLink}
                  className="hero-btn"
                  title="Call us now"
                  aria-label="Call us"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>Give Us a Call</span>
                </Link>

                {/* Finance Button */}
                <Link
                  href="/finance"
                  className="hero-btn finance-btn"
                  title="Apply for finance"
                  aria-label="Apply for finance"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                  </svg>
                  <span>Apply For Finance</span>
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}

        <div className="swiper-button-next snbn7" />
        <div className="swiper-button-prev snbp7" />
      </Swiper>
    </>
  );
}