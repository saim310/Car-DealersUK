"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import useFetch from "@/hooks/useFetch";
import { kmToMiles } from "@/utils/exports";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";

const carTypes = ["All", "SUV", "Hatchback"];

export default function Cars2() {
  // 1. Fetch dynamic data from your API
  const { data: carListings = [], loading } = useFetch("/listings", {
    immediate: true,
  });

  const [selectedType, setSelectedType] = useState(carTypes[0]);

  // 2. Efficiently filter data based on tab selection
  const filtered = useMemo(() => {
    if (selectedType === "All") return carListings;
    return carListings.filter(
      (el) => el.type?.toLowerCase() === selectedType.toLowerCase(),
    );
  }, [carListings, selectedType]);

  if (loading)
    return (
      <div className="text-center p-5">
        <div
          className="spinner-border"
          style={{ color: "#ff7101" }}
          role="status"
        />
      </div>
    );

  return (
    <section className="tf-section3">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="heading-section flex align-center justify-space flex-wrap gap-20">
              <h2 className="wow fadeInUpSmall" data-wow-delay="0.2s">
                Recommended Used Cars For You
              </h2>
              <Link href={`/listing-grid`} className="tf-btn-arrow">
                View all
                <i className="icon-autodeal-btn-right" />
              </Link>
            </div>
          </div>
          <div className="col-lg-12">
            <div className="flat-tabs themesflat-tabs">
              <div className="box-tab center">
                <ul className="menu-tab tab-title style flex">
                  {carTypes.map((car, index) => (
                    <li
                      key={index}
                      onClick={() => setSelectedType(car)}
                      className={`item-title ${selectedType === car ? "active" : ""}`}
                    >
                      <h5 className="inner">{car}</h5>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="content-tab">
                <div className="content-inner tab-content">
                  <Swiper
                    className="swiper tf-sw-mobile"
                    slidesPerView={3}
                    spaceBetween={30}
                    breakpoints={{
                      1024: { slidesPerView: 3, spaceBetween: 30 },
                      768: { slidesPerView: 2, spaceBetween: 15 },
                      0: { slidesPerView: 1, spaceBetween: 15 },
                    }}
                  >
                    {filtered.map((elm, i) => (
                      <SwiperSlide key={elm.id || i} className="swiper-slide">
                        <div className="box-car-list hv-one">
                          <div className="image-group relative">
                            <div className="top flex-two">
                              <ul className="d-flex gap-8">
                                <li className="flag-tag success">
                                  {elm.condition || "Used"}
                                </li>
                                <li className="flag-tag style-1">
                                  <div className="icon">
                                    <svg width={16} height={13} fill="none">
                                      <path
                                        d="M1.5 9L4.93 5.56M2.5 11.5H13.5"
                                        stroke="white"
                                        strokeWidth="1.5"
                                      />
                                    </svg>
                                  </div>
                                  {elm.images?.length || 0}
                                </li>
                              </ul>
                              <div className="year flag-tag">{elm.years}</div>
                            </div>

                            {/* Inner Dynamic Image Slider */}
                            <Swiper
                              modules={[Pagination]}
                              pagination={{
                                el: `.spd-rec-${i}`,
                                clickable: true,
                                 dynamicBullets: true,
  dynamicMainBullets: 3,
                              }}
                              className="swiper-container carousel-2 img-style"
                            >
                              {elm.images?.map((imgUrl, i2) => (
                                <SwiperSlide key={i2}>
                                  <Image
                                    className="lazyload"
                                    alt={elm.listing_title}
                                    src={imgUrl}
                                    width={615}
                                    height={462}
                                    style={{ objectFit: "cover" }}
                                  />
                                </SwiperSlide>
                              ))}
                              <div className="pagi2">
                                <div
                                  className={`swiper-pagination2 spd-rec-${i}`}
                                />
                              </div>
                            </Swiper>
                          </div>

                          <div className="content">
                            <div className="text-address">
                              <p className="text-color-3 font">{elm.type}</p>
                            </div>
                            <h5 className="link-style-1">
                              <Link href={`/listing-detail-v2/${elm.id}`}>
                                {elm.listing_title}
                              </Link>
                            </h5>
                            <div className="icon-box flex flex-wrap">
                              <div className="icons flex-three">
                                <i className="icon-autodeal-km1" />
                                <span>
                                  {kmToMiles(elm.mileage).toLocaleString()} Miles
                                </span>
                              </div>
                              <div className="icons flex-three">
                                <i className="icon-autodeal-diesel" />
                                <span>{elm.fuel_type}</span>
                              </div>
                              <div className="icons flex-three">
                                <i className="icon-autodeal-automatic" />
                                <span>{elm.transmission}</span>
                              </div>
                            </div>
                                <hr />
                            <div className="money fs-20 fw-5 lh-25 text-color-3">
                              ${Number(elm.price).toLocaleString()}
                            </div>
                            <div className="days-box flex justify-space align-center">
                              <div className="img-author d-flex align-items-center">
                                <Image
                                  className="lazyload rounded-circle"
                                  alt="dealer"
                                  src="/assets/images/author/default.jpg"
                                  width={30}
                                  height={30}
                                />
                                <span className="font text-color-2 fw-5 ms-2">
                                  Dealer
                                </span>
                              </div>
                              <Link
                                href={`/listing-detail-v2/${elm.id}`}
                                className="view-car"
                              >
                                View car
                              </Link>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
