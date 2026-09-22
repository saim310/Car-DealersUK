"use client";

import React, { useMemo } from "react";
import useFetch from "@/hooks/useFetch";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";

const BRAND_ORANGE = "#ff7101";

export default function Hero() {
  const { data: slidesData = [], loading } = useFetch("/hero", {
    immediate: true,
  });

  const swiperOptions = {
    autoplay: { delay: 6000, disableOnInteraction: false },
    slidesPerView: 1,
    speed: 500,
    effect: "fade",
    fadeEffect: { crossFade: true },
    navigation: { nextEl: ".snbn21", prevEl: ".snbp21" },
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
      modules={[Pagination, Navigation, EffectFade, Autoplay]}
      className="swiper mainslider slider home7"
    >
      {slidesData.map((slide, index) => {
        // Parsing nested data if stored as JSON strings in DB, otherwise using fallbacks
        const specs = Array.isArray(slide.specifications)
          ? slide.specifications
          : JSON.parse(slide.specifications || "[]");

        const controllers = Array.isArray(slide.controllers)
          ? slide.controllers
          : JSON.parse(slide.controllers || "[]");

        return (
          <SwiperSlide key={slide.id || index} className="swiper-slide">
            <div className="slider-item">
              <div className="img-slider">
                <Image
                  className="img-item"
                  alt={slide.title || "Hero Slide"}
                  src={slide.imgSrc || "/assets/images/slider/default.jpg"}
                  width={1920}
                  height={960}
                  priority={index === 0}
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="container2 relative">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="content flex justify-space">
                      <div className="po-content">
                        <div className="heading">
                          <h1 className="text-color-1 fade-item fade-item-1">
                            {slide.title || slide.heading}
                          </h1>
                          <p className="text-color-1 font fade-item fade-item-2">
                            {slide.description || slide.paragraph}
                          </p>
                          <div className="reserve-wrap fade-item fade-item-3">
                            <a
                              href={slide.reserveLink || slide.linkHref || "#"}
                              className="reserve text-color-1 fs-16 fw-5 font"
                            >
                              {slide.linkText || "Reserve now"}
                            </a>
                          </div>
                        </div>

                        {/* Dynamic Specifications */}
                        <div className="specifications-wrap style2">
                          {specs.map((spec, specIndex) => (
                            <div key={specIndex} className="specifications">
                              <div className="specifications-title">
                                <div className="title fs-20 fw-5 lh-25 text-color-3">
                                  {spec.title}
                                </div>
                              </div>
                              <div className="specifications-content">
                                <p className="text-color-1 font">
                                  {spec.value}
                                </p>
                                <div className="font text-color-1">
                                  {spec.description}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Dynamic Controllers */}
                      <div className="controller-button">
                        {controllers.map((controller, ctrlIndex) => (
                          <div key={ctrlIndex} className="flex-six controller">
                            <div className="content-controller">
                              <p className="fs-16 fw-5 lh-20 text-color-1 right">
                                {controller.label1}
                              </p>
                              <p className="fs-16 fw-5 lh-20 text-color-1 right">
                                {controller.label2}
                              </p>
                            </div>
                            <div className="icon-controller">
                              <i className={controller.iconClass} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        );
      })}

      {slidesData.length > 1 && (
        <>
          <div className="swiper-button-next style7-next snbn21" />
          <div className="swiper-button-prev style7-prev snbp21" />
        </>
      )}
    </Swiper>
  );
}
