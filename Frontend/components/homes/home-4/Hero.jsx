"use client";

import React from "react";
import useFetch from "@/hooks/useFetch"; // Using your custom hook
import Image from "next/image";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

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
      nextEl: ".snbn17",
      prevEl: ".snbp17",
    },
  };

  if (loading)
    return (
      <div className="vh-100 d-flex align-items-center justify-content-center bg-dark">
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
      modules={[Autoplay, EffectFade, Pagination, Navigation]}
      className="swiper mainslider slider home4"
    >
      {slidesData.map((slide, index) => (
        <SwiperSlide className="swiper-slide" key={slide.id || index}>
          <div className="slider-item">
            <div className="img-slider">
              <Image
                className="img-item"
                alt={slide.heading || "Hero Background"}
                src={slide.imgSrc || "/assets/images/slider/default-hero.jpg"}
                width={1920}
                height={960}
                priority={index === 0} // SEO optimization for the first slide
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="container relative">
              <div className="row">
                <div className="col-lg-12">
                  <div className="content po-content-two">
                    <div className="heading">
                      <h1 className="text-color-1 fade-item fade-item-1">
                        {slide.heading}
                      </h1>
                      <p className="fs-20 fw-3 lh-25 text-color-1 font fade-item fade-item-2">
                        {/* Map database 'paragraph' to this description slot */}
                        {slide.paragraph?.split("\n").map((text, i) => (
                          <React.Fragment key={i}>
                            {text}
                            {i < slide.paragraph.split("\n").length - 1 && (
                              <br />
                            )}
                          </React.Fragment>
                        ))}
                      </p>
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
          <div className="swiper-button-next snbn17" />
          <div className="swiper-button-prev snbp17" />
        </>
      )}
    </Swiper>
  );
}
