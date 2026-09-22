"use client";

import useFetch from "@/hooks/useFetch"; // Using your custom hook
import { kmToMiles } from "@/utils/exports";
import Link from "next/link";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import { useEffect, useState, useMemo } from "react";

const priceRanges = [
  { title: "Auto Decar used cars", isActive: true, range: null },
  {
    title: "$5,000 - $10,000",
    isActive: false,
    range: { min: 5000, max: 10000 },
  },
  {
    title: "$10,000 - $30,000",
    isActive: false,
    range: { min: 10000, max: 30000 },
  },
];

export default function CarSlider() {
  const { data: carListings = [], loading } = useFetch("/listings", {
    immediate: true,
  });

  const [selectedRange, setSelectedRange] = useState(priceRanges[0]);

  // Filter listings based on the selected budget tab
  const filtered = useMemo(() => {
    if (!selectedRange.range) return carListings;
    return carListings.filter(
      (item) =>
        item.price >= selectedRange.range.min &&
        item.price <= selectedRange.range.max,
    );
  }, [carListings, selectedRange]);

  if (loading) return <div className="text-center p-5">Loading Cars...</div>;

  return (
    <>
      <style jsx>{`
        .car-title-clamp {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 2.8rem;
          line-height: 1.4;
        }
      `}</style>
      <section className="tf-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="heading-section flex align-center justify-space flex-wrap gap-20">
                <h2 className="wow fadeInUpSmall" data-wow-delay="0.2s">
                  Used Cars by Budget
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
                    {priceRanges.map((item, index) => (
                      <li
                        key={index}
                        className={`item-title ${item.title === selectedRange.title ? "active" : ""
                          }`}
                        onClick={() => setSelectedRange(item)}
                      >
                        <h5 className="inner">{item.title}</h5>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="content-tab">
                  <div className="content-inner tab-content">
                    <Swiper
                      modules={[Pagination]}
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

                              <Swiper
                                modules={[Pagination]}
                                pagination={{ el: `.spd${i}`, clickable: true }}
                                className="swiper-container carousel-2 img-style"
                              >
                                {/* Mapping dynamic images from the API */}
                                {(elm.images || []).map((imgUrl, i2) => (
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
                                  <div className={`swiper-pagination2 spd${i}`} />
                                </div>
                              </Swiper>
                            </div>

                            <div className="content">
                              <div className="text-address">
                                <p className="text-color-3 font">
                                  {elm.brand} {elm.model}
                                </p>
                              </div>
                              <h5 className="link-style-1">
                                <Link href={`/listing-detail-v2/${elm.id}`}>
                                  <span className="car-title-clamp">{elm.listing_title}</span>
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
                                {/* <div className="img-author">
                                {/* Using a default avatar since API listings don't have author icons yet 
                                <Image
                                  className="lazyload rounded-circle"
                                  alt="author"
                                  src="/assets/images/author/default.jpg"
                                  width={30}
                                  height={30}
                                />
                                <span className="font text-color-2 fw-5 ms-2">
                                  Admin
                                </span>
                              </div> */}
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
    </>
  );
}
