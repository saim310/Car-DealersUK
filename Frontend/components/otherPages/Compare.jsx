"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import useFetch from "@/hooks/useFetch";
import { kmToMiles } from "@/utils/exports";
import { toggleItems2, toggleItems3 } from "@/data/faqs";
import Accordion from "../common/Accordions";

export default function Compare() {
  // 1. Fetch dynamic listings
  const { data: carListings = [], loading } = useFetch("/listings", {
    immediate: true,
  });

  // 2. Limit to top 3 for the comparison table layout
  const compareList = useMemo(() => carListings.slice(0, 3), [carListings]);

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div
          className="spinner-border"
          style={{ color: "#ff7101" }}
          role="status"
        />
      </div>
    );

  return (
    <section className="tf-section3 flat-blog-list flat-property">
      <div className="container">
        <div className="inner-heading flex-two flex-wrap">
          <h1 className="heading-listing">Compare vehicle</h1>
          <div className="social-listing flex-six flex-wrap">
            <p>Share this page:</p>
            <div className="icon-social style1">
              <a href="https://www.facebook.com/ukajapan">
                <i className="icon-autodeal-facebook" />
              </a>
              <a href="#">
                <i className="icon-autodeal-linkedin" />
              </a>
              <a href="#">
                <i className="icon-autodeal-twitter" />
              </a>
              <a href="https://www.instagram.com/ukajapan_/">
                <i className="icon-autodeal-instagram" />
              </a>
            </div>
          </div>
        </div>

        <div className="wrap-single-compare">
          <div className="inner-respond">
            {/* DYNAMIC HEADER CARDS */}
            <div className="header-compare">
              {compareList.map((elm, i) => (
                <div key={elm.id || i} className="box-car-list hv-one">
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
                                d="M1.5 9L4.9 5.5M2.5 11.5H13.5"
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
                    <Swiper
                      modules={[Pagination]}
                      pagination={{ el: `.spd-comp-${i}`, clickable: true }}
                      className="swiper-container carousel-2 img-style"
                    >
                      {elm.images?.map((img, i2) => (
                        <SwiperSlide key={i2}>
                          <Image
                            className="lazyload"
                            alt="car"
                            src={img}
                            width={615}
                            height={462}
                            style={{ objectFit: "cover" }}
                          />
                        </SwiperSlide>
                      ))}
                      <div className="pagi2">
                        <div className={`swiper-pagination2 spd-comp-${i}`} />
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
                    <div className="money fs-20 fw-5 lh-25 text-color-3">
                      ${Number(elm.price).toLocaleString()}
                    </div>
                    <div className="days-box flex justify-space align-center">
                      <div className="img-author d-flex align-items-center">
                        <div
                          className="rounded-circle bg-light border me-2 d-flex align-items-center justify-content-center"
                          style={{ width: 32, height: 32 }}
                        >
                          <i className="icon-user text-muted" />
                        </div>
                        <span className="font text-color-2 fw-5">Dealer</span>
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
              ))}
            </div>

            <nav
              id="navbar-example2"
              className="navbar tab-listing-scroll mb-30"
            >
              <ul className="nav nav-pills">
                <li className="nav-item">
                  <a className="nav-link" href="#scrollspyHeading1">
                    Overview
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#scrollspyHeading2">
                    Features
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#scrollspyHeading3">
                    Specification
                  </a>
                </li>
              </ul>
            </nav>

            <div
              data-bs-spy="scroll"
              data-bs-target="#navbar-example2"
              className="scrollspy-example"
              tabIndex={0}
            >
              <div id="scrollspyHeading1">
                <div className="tf-compare-overview compare-table">
                  <h3 className="title-table">Car Overview</h3>

                  <div className="title-tr">Price</div>
                  <ul className="group-tr">
                    {compareList.map((elm) => (
                      <li key={elm.id}>
                        ${Number(elm.price).toLocaleString()}
                      </li>
                    ))}
                  </ul>

                  <div className="title-tr">Fuel Type</div>
                  <ul className="group-tr">
                    {compareList.map((elm) => (
                      <li key={elm.id}>{elm.fuel_type || "N/A"}</li>
                    ))}
                  </ul>

                  <div className="title-tr">Mileage</div>
                  <ul className="group-tr">
                    {compareList.map((elm) => (
                      <li key={elm.id}>
                        {kmToMiles(elm.mileage).toLocaleString()} Miles
                      </li>
                    ))}
                  </ul>

                  <div className="title-tr">Transmission</div>
                  <ul className="group-tr">
                    {compareList.map((elm) => (
                      <li key={elm.id}>{elm.transmission || "Manual"}</li>
                    ))}
                  </ul>

                  <div className="title-tr">Registration Year</div>
                  <ul className="group-tr">
                    {compareList.map((elm) => (
                      <li key={elm.id}>{elm.years}</li>
                    ))}
                  </ul>

                  <div className="title-tr">Car location</div>
                  <ul className="group-tr mb-0">
                    {compareList.map((elm) => (
                      <li key={elm.id} className="text-truncate">
                        {elm.full_address || "Available Locally"}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Static Features & Specs sections kept as placeholders or for manual checkmarks */}
              <div id="scrollspyHeading2">
                <div className="tf-compare-fatures compare-table">
                  <h3 className="title-table">Features</h3>
                  {/* You can map specific features here if your DB supports them */}
                  <div className="title-tr">Parking Sensors</div>
                  <ul className="group-tr">
                    {compareList.map((elm) => (
                      <li key={elm.id}>Rear</li>
                    ))}
                  </ul>
                  <div className="col-lg-12 flat-accordion">
                    <Accordion
                      parentClass="flat-toggle style-1"
                      faqData={toggleItems2}
                    />
                  </div>
                </div>
              </div>

              <div id="scrollspyHeading3">
                <div className="tf-compare-overview compare-table">
                  <h3 className="title-table">Specification</h3>
                  <div className="col-lg-12 flat-accordion">
                    <Accordion
                      parentClass="flat-toggle style-1"
                      faqData={toggleItems3}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
