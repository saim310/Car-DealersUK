"use client";

import React from "react";
import useFetch from "@/hooks/useFetch"; // Importing your reusable hook
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";

export default function Hero() {
  // Fetch dynamic hero slides from your API
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
      nextEl: ".snbn10",
      prevEl: ".snbp10",
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
      {...swiperOptions}
      modules={[Pagination, Navigation, EffectFade, Autoplay]}
      className="swiper mainslider slider home10"
    >
      {slidesData.map((slide, index) => (
        <SwiperSlide className="swiper-slide" key={slide.id || index}>
          <div className="slider-item">
            <div className="img-slider">
              <Image
                className="img-item"
                alt={slide.heading || "Hero Image"}
                // Fallback to placeholder if imgSrc is missing
                src={slide.imgSrc || "/assets/images/slider/default-hero.jpg"}
                width={1920}
                height={960}
                priority={index === 0} // Load first slide immediately
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
                      <p className="text-color-1 fs-20 fw-3 lh-25 font fade-item fade-item-2">
                        {slide.paragraph?.split("\n").map((text, i) => (
                          <React.Fragment key={i}>
                            {text}
                            <br />
                          </React.Fragment>
                        ))}
                      </p>
                      {slide.linkText && (
                        <div className="chat-wrap fade-item fade-item-3">
                          <a href={slide.linkHref || "#"} className="chat">
                            {slide.linkText}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}

      {slidesData.length > 1 && (
        <>
          <div className="swiper-button-next snbn10" />
          <div className="swiper-button-prev snbp10" />
        </>
      )}
    </Swiper>
  );
}
