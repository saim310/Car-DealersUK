"use client";

import React from "react";
import useFetch from "@/hooks/useFetch"; // Your reusable hook
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";

const BRAND_ORANGE = "#ff7101";

export default function Hero() {
  // Fetch dynamic slides from your API
  const { data: slidesData = [], loading } = useFetch("/hero", {
    immediate: true,
  });

  const swiperOptions = {
    autoplay: {
      delay: 6000,
      disableOnInteraction: false,
    },
    slidesPerView: 1,
    speed: 500,
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
    navigation: {
      nextEl: ".snbn22",
      prevEl: ".snbp22",
    },
  };

  if (loading)
    return (
      <div className="vh-100 d-flex align-items-center justify-content-center bg-white">
        <div
          className="spinner-border"
          style={{ color: BRAND_ORANGE }}
          role="status"
        />
      </div>
    );

  return (
    <Swiper
      {...swiperOptions}
      modules={[Navigation, Pagination, Autoplay, EffectFade]}
      className="swiper mainslider slider home8"
    >
      {slidesData.map((slide, index) => (
        <SwiperSlide className="swiper-slide" key={slide.id || index}>
          <div className="slider-item">
            <div className="container2 relative">
              <div className="row">
                <div className="col-lg-12">
                  <div className="content po-content-two">
                    <div className="heading center">
                      {/* Subtitle mapping from database */}
                      <div className="sub-title font fade-item fade-item-1">
                        {slide.subTitle || slide.heading}
                      </div>

                      {/* Main Title mapping */}
                      <h1 className="fade-item fade-item-2">
                        {slide.title || slide.paragraph}
                      </h1>

                      <div className="img-slider2">
                        <Image
                          className="img-item"
                          alt={slide.title || "Featured Vehicle"}
                          src={
                            slide.imgSrc ||
                            "/assets/images/slider/default-car.png"
                          }
                          // Use DB dimensions or sensible defaults for Home 8 layout
                          width={slide.width || 1200}
                          height={slide.height || 600}
                          priority={index === 0} // LCP Performance boost
                          style={{ objectFit: "contain" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}

      {/* Navigation arrows only show if more than one slide exists */}
      {slidesData.length > 1 && (
        <>
          <div className="swiper-button-next snbn22" />
          <div className="swiper-button-prev snbp22" />
        </>
      )}
    </Swiper>
  );
}
