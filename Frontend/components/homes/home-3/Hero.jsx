"use client";

import React from "react";
import useFetch from "@/hooks/useFetch"; // Reusable dynamic hook
import Image from "next/image";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export default function Hero() {
  // Fetch dynamic slides from your /hero endpoint
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
      nextEl: ".snbn13",
      prevEl: ".snbp13",
    },
  };

  if (loading)
    return (
      <div className="vh-100 d-flex align-items-center justify-content-center bg-dark">
        <div
          className="spinner-border"
          style={{ color: "#ff7101" }}
          role="status"
        />
      </div>
    );

  return (
    <Swiper
      modules={[Pagination, Navigation, Autoplay, EffectFade]}
      {...swiperOptions}
      className="swiper mainslider slider home3"
    >
      {slidesData.map((slide, index) => (
        <SwiperSlide className="swiper-slide" key={slide.id || index}>
          <div className="slider-item">
            <div className="img-slider">
              <Image
                className="img-item"
                alt={slide.subHeading || slide.heading || "Hero Slide"}
                src={slide.imgSrc || "/assets/images/slider/default-hero.jpg"}
                width={1920}
                height={960}
                priority={index === 0} // LCP Optimization
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="container relative">
              <div className="row">
                <div className="col-lg-12">
                  <div className="content po-content-two">
                    <div className="heading">
                      <span className="fs-20 fw-3 lh-26 text-color-1 fade-item fade-item-1">
                        {slide.heading}
                      </span>
                      <h1 className="text-color-1 fade-item fade-item-2">
                        {/* Mapping subHeading from DB, or fallback to paragraph if empty */}
                        {slide.subHeading || slide.paragraph}
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}

      {/* Only show navigation if there are multiple slides */}
      {slidesData.length > 1 && (
        <>
          <div className="swiper-button-next snbn13" />
          <div className="swiper-button-prev snbp13" />
        </>
      )}
    </Swiper>
  );
}
