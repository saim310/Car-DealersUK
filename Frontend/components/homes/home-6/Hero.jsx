"use client";

import React from "react";
import useFetch from "@/hooks/useFetch"; // Reusable dynamic hook
import { kmToMiles } from "@/utils/exports";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";

const BRAND_ORANGE = "#ff7101";

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
      nextEl: ".snbn19",
      prevEl: ".snbp19",
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
      modules={[Navigation, Pagination, EffectFade, Autoplay]}
      className="swiper mainslider slider home6"
    >
      {slidesData.map((slide, index) => (
        <SwiperSlide key={slide.id || index} className="swiper-slide">
          <div className="slider-item">
            <div className="img-slider">
              <Image
                className="img-item"
                alt={slide.heading || "Hero Slide"}
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
                      <h1 className="text-color-1 fade-item fade-item-1">
                        {slide.heading}
                      </h1>

                      {/* Dynamic Stats Row */}
                      <ul className="ul flex category-list-car flex-wrap fade-item fade-item-2">
                        {/* Body Type */}
                        <li className="flex-three">
                          <div className="icon">
                            {/* Car Icon SVG */}
                            <svg
                              width={26}
                              height={26}
                              viewBox="0 0 26 26"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M25.406 12.1967C25.051 11.5568 24.5392 11.0175 23.9187 10.6294L22.5255 9.75818H24.7453C25.229 9.75818 25.6226 9.36467 25.6226 8.88091V8.06775..."
                                fill="currentColor"
                              />
                            </svg>
                          </div>
                          <div className="font text-color-1">
                            {slide.type || "Sedan"}
                          </div>
                        </li>

                        {/* Mileage / Speed */}
                        <li className="flex-three">
                          <div className="icon">
                            {/* Speedometer Icon SVG */}
                            <svg
                              width={26}
                              height={26}
                              viewBox="0 0 26 26"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M13.0201 1.36567C6.01644 1.36567 0.338867 7.04319 0.338867 14.0469..."
                                fill="currentColor"
                              />
                            </svg>
                          </div>
                          <div className="font text-color-1">
                            {kmToMiles(slide.mileage).toLocaleString()} Miles
                          </div>
                        </li>

                        {/* Price / Cost */}
                        <li className="flex-three">
                          <div className="icon">
                            {/* Dollar Icon SVG */}
                            <svg
                              width={26}
                              height={26}
                              viewBox="0 0 26 26"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M13.0001 0.222775C5.95485 0.222775 0.222852 5.95478 0.222852 13..."
                                fill="currentColor"
                              />
                            </svg>
                          </div>
                          <div className="font text-color-1">
                            ${Number(slide.price || 0).toLocaleString()}
                          </div>
                        </li>
                      </ul>

                      {/* Chat / Author Section */}
                      <div className="chat-wrap flex-three fade-item fade-item-3">
                        <a href={slide.linkHref || "#"} className="chat">
                          {slide.linkText || "Chat"}
                        </a>
                        <div className="flex-three">
                          <div className="image">
                            <Image
                              className="img-item rounded-circle"
                              alt="author"
                              src={
                                slide.authorImg ||
                                "/assets/images/author/default.jpg"
                              }
                              width={42}
                              height={42}
                            />
                          </div>
                          <div className="content-chat">
                            <div className="fs-16 text-color-1 fw-bold">
                              {slide.author || "Admin"}
                            </div>
                            <span className="fs-12 text-color-1 opacity-75">
                              {slide.activeTime || "Active Now"}
                            </span>
                          </div>
                        </div>
                      </div>
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
          <div className="swiper-button-next snbn19" />
          <div className="swiper-button-prev snbp19" />
        </>
      )}
    </Swiper>
  );
}
