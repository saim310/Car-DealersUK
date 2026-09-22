"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import Image from "next/image";

import "swiper/css";
import "swiper/css/pagination";

export default function ClientHighlights() {
  const highlights = [
    { id: 1, image: "/assets/images/Testemonials/WhatsApp Image 2026-09-16 at 8.19.48 AM.jpeg", alt: "Client review 1" },
    { id: 2, image: "/assets/images/Testemonials/WhatsApp Image 2026-09-16 at 8.21.31 AM.jpeg", alt: "Client review 2" },
    { id: 3, image: "/assets/images/Testemonials/WhatsApp Image 2026-09-16 at 8.21.18 AM.jpeg", alt: "Client review 3" },
    { id: 4, image: "/assets/images/Testemonials/WhatsApp Image 2026-09-16 at 8.21.02 AM.jpeg", alt: "Client review 4" },
    { id: 5, image: "/assets/images/Testemonials/WhatsApp Image 2026-09-16 at 8.21.10 AM.jpeg", alt: "Client review 5" },
    { id: 6, image: "/assets/images/Testemonials/WhatsApp Image 2026-09-16 at 8.20.56 AM.jpeg", alt: "Client review 6" },
  ];

  return (
    <>
      <style jsx global>{`
        .client-highlights-section {
          width: 100%;
          background-color: #fcfbf9;
          padding: 80px 20px;
        }

        @media (max-width: 768px) {
          .client-highlights-section {
            padding: 50px 16px;
          }
        }

        .client-highlights-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .client-highlights-header {
          text-align: left;
          margin-bottom: 40px;
        }

        @media (max-width: 768px) {
          .client-highlights-header {
            text-align: center;
            margin-bottom: 30px;
          }
        }

        .client-highlights-subtitle {
          display: inline-block;
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: rgb(255, 107, 0);
          margin-bottom: 10px;
        }

        .client-highlights-title {
          font-size: 36px;
          font-weight: 800;
          color: #111111;
          line-height: 1.2;
          margin: 0;
        }

        @media (max-width: 768px) {
          .client-highlights-title {
            font-size: 26px;
          }
        }

        .client-card {
          position: relative;
          background: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
        }

        /* Forces a perfect 1:1 square box since your images are 1600x1600 */
        .client-card-image-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1; 
          background-color: #f1f1f1;
        }

        .swiper-pagination-bullet-active {
          background: rgb(255, 107, 0) !important;
        }
      `}</style>

      <section className="client-highlights-section">
        <div className="client-highlights-container">
          
          <div className="client-highlights-header">
            <span className="client-highlights-subtitle">Client Highlights</span>
            <h2 className="client-highlights-title">
              See What Our Clients<br />Say About Us
            </h2>
          </div>

          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className="client-carousel"
          >
            {highlights.map((item) => (
              <SwiperSlide key={item.id}>
                <div className="client-card">
                  <div className="client-card-image-wrapper">
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      style={{
                        objectFit: "cover", // Perfect fill for 1:1 ratio images
                        objectPosition: "center",
                      }}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

        </div>
      </section>
    </>
  );
}