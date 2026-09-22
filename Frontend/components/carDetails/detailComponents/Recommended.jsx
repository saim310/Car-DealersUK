"use client";

import useFetch from "@/hooks/useFetch";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export default function Recommended({ currentId }) {
  const { data: listings, loading } = useFetch("/listings", {
    immediate: true,
  });

  if (loading) return <p>Loading recommendations...</p>;
  if (!listings) return null;

  const recommendations = listings
    .filter((car) => car.id !== currentId)
    .slice(0, 8);

  if (recommendations.length === 0) return null;

  return (
    <div className="recommended-carousel-wrap mb-40">
      <div className="box-title d-flex justify-content-between align-items-center mb-20">
        <h2 className="title-ct">Recommended Used Cars</h2>
        <div className="swiper-nav-buttons d-flex gap-2">
          <div className="rec-button-prev swiper-button-prev-custom"><i className="icon-autodeal-angle-left" /></div>
          <div className="rec-button-next swiper-button-next-custom"><i className="icon-autodeal-angle-right" /></div>
        </div>
      </div>

      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={20}
        slidesPerView={3}
        navigation={{
          prevEl: ".rec-button-prev",
          nextEl: ".rec-button-next",
        }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        breakpoints={{
          0: { slidesPerView: 1 },
          576: { slidesPerView: 2 },
          992: { slidesPerView: 3 },
        }}
        className="recommended-swiper"
      >
        {recommendations.map((car, i) => (
          <SwiperSlide key={car.id || i}>
            <div className="car-card-item">
              <div className="image-box">
                <Image
                  className="lazyload object-cover"
                  alt={car.listing_title}
                  src={car.images?.[0] || "/assets/images/placeholder.jpg"}
                  width={400}
                  height={260}
                />
              </div>
              <div className="content-box">
                <h6>
                  <Link href={`/listing-detail-v1/${car.id}`}>
                    {car.listing_title}
                  </Link>
                </h6>
                <p className="price">£{Number(car.price).toLocaleString()}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx>{`
        .recommended-carousel-wrap {
          position: relative;
        }

        .title-ct {
          font-size: 24px;
          font-weight: 700;
          color: #1a202c;
          margin: 0;
        }

        .swiper-nav-buttons div {
          width: 36px;
          height: 36px;
          border: 1px solid #e2e8f0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          background: #fff;
          transition: all 0.3s ease;
        }

        .swiper-nav-buttons div:hover {
          background: #ff9800;
          color: #fff;
          border-color: #ff9800;
        }

        .car-card-item {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .car-card-item:hover {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
          transform: translateY(-2px);
        }

        .image-box {
          width: 100%;
          height: 180px;
          overflow: hidden;
        }

        .image-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .car-card-item:hover .image-box img {
          transform: scale(1.05);
        }

        .content-box {
          padding: 16px;
          display: flex;
          flex-direction: column;
          flex: 1;
          justify-content: space-between;
        }

        .content-box h6 {
          font-size: 15px;
          font-weight: 600;
          margin: 0 0 10px 0;
          line-height: 1.4;
        }

        .content-box h6 a {
          color: #1a202c;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .content-box h6 a:hover {
          color: #ff9800;
        }

        .content-box .price {
          font-size: 16px;
          font-weight: 700;
          color: #ff9800;
          margin: 0;
        }
      `}</style>
    </div>
  );
}