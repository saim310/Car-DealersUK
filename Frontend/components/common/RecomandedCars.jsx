"use client";

import { Navigation, Pagination } from "swiper/modules";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import StatusBadge from "./StatusBadge";
import useFetch from "@/hooks/useFetch"; // 1. Import your custom fetch hook
import { getImageUrl, sortCarsWithRegistrationPriority, normalizeBodyType, kmToMiles } from "@/utils/exports";

export default function RecomandedCars() {
  // 2. Fetch the live backend listings
  const { data: backendListings, loading } = useFetch("/listings");
  const [dynamicCars, setDynamicCars] = useState([]);

  // 3. Map the backend data
  useEffect(() => {
    if (backendListings) {
      const mapped = backendListings.map((item) => ({
        id: item.id,
        year: item.years || item.year,
        type: normalizeBodyType(item.type) || item.type || "N/A",
        title: item.listing_title || item.title,
        km: parseInt(item.mileage) || 0,
        fuelType: item.fuel_type || "N/A",
        transmission: item.transmission || "N/A",
        price: parseFloat(item.price) || 0,
        // Helper to resolve the correct image URL
        imgSrc: getImageUrl(item.images && item.images.length > 0 ? item.images[0] : null),
        authorName: item.authorName || "Admin",
        authorImage: item.authorImage || "/assets/images/author/8.png",
        status: item.status || "in_stock",
        created_at: item.created_at,
        plate_number: item.plate_number || item.plateNo || "",
        plateNo: item.plateNo || item.plate_number || "",
      }));

      const sorted = sortCarsWithRegistrationPriority(mapped);

      setDynamicCars(sorted);
    }
  }, [backendListings]);

  const swiperOptions = {
    speed: 1000,
    spaceBetween: 30,
    pagination: {
      el: ".spd9",
      clickable: true,
      dynamicBullets: true,
      dynamicMainBullets: 3,
    },
    navigation: {
      nextEl: ".snbn6",
      prevEl: ".snbp6",
    },
    breakpoints: {
      0: {
        slidesPerView: 1,
        spaceBetween: 20,
      },
      600: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      1200: {
        slidesPerView: 3,
      },
    },
  };

  return (
    <section className="tf-section3">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="heading-section flex align-center justify-space flex-wrap gap-20">
              <h2
                className="wow fadeInUpSmall"
                data-wow-delay="0.2s"
                data-wow-duration="1000ms"
              >
                Recommended Used Cars For You
              </h2>
              <Link
                href={`/blog-grid`}
                className="tf-btn-arrow wow fadeInUpSmall"
                data-wow-delay="0.2s"
                data-wow-duration="1000ms"
              >
                View all
                <i className="icon-autodeal-btn-right" />
              </Link>
            </div>
          </div>
          <div className="col-lg-12 relative">
            {loading ? (
              <p style={{ textAlign: "center", padding: "20px" }}>
                Loading recommended cars...
              </p>
            ) : dynamicCars.length === 0 ? (
              <p style={{ textAlign: "center", padding: "20px" }}>
                No recommended cars found.
              </p>
            ) : (
              <>
                <Swiper
                  {...swiperOptions}
                  modules={[Pagination, Navigation]}
                  className="swiper-container tf-sw-mobile3"
                >
                  {dynamicCars.map((car, i) => (
                    <SwiperSlide key={car.id || i} className="swiper-slide">
                      <div className="box-car-list hv-one">
                        <div className="image-group relative">
                          {/* <div className="top flex-two">
                            <ul className="d-flex gap-8">
                              <li className="flag-tag success">Featured</li>
                              <li className="flag-tag style-1">
                                <div className="icon">
                                  <svg
                                    width={16}
                                    height={13}
                                    viewBox="0 0 16 13"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M1.5 9L4.93933 5.56067C5.07862 5.42138 5.24398 5.31089 5.42597 5.2355C5.60796 5.16012 5.80302 5.12132 6 5.12132C6.19698 5.12132 6.39204 5.16012 6.57403 5.2355C6.75602 5.31089 6.92138 5.42138 7.06067 5.56067L10.5 9M9.5 8L10.4393 7.06067C10.5786 6.92138 10.744 6.81089 10.926 6.7355C11.108 6.66012 11.303 6.62132 11.5 6.62132C11.697 6.62132 11.892 6.66012 12.074 6.7355C12.256 6.81089 12.4214 6.92138 12.5607 7.06067L14.5 9M2.5 11.5H13.5C13.7652 11.5 14.0196 11.3946 14.2071 11.2071C14.3946 11.0196 14.5 10.7652 14.5 10.5V2.5C14.5 2.23478 14.3946 1.98043 14.2071 1.79289C14.0196 1.60536 13.7652 1.5 13.5 1.5H2.5C2.23478 1.5 1.98043 1.60536 1.79289 1.79289C1.60536 1.98043 1.5 2.23478 1.5 2.5V10.5C1.5 10.7652 1.60536 11.0196 1.79289 11.2071C1.98043 11.3946 2.23478 11.5 2.5 11.5ZM9.5 4H9.50533V4.00533H9.5V4ZM9.75 4C9.75 4.0663 9.72366 4.12989 9.67678 4.17678C9.62989 4.22366 9.5663 4.25 9.5 4.25C9.4337 4.25 9.37011 4.22366 9.32322 4.17678C9.27634 4.12989 9.25 4.0663 9.25 4C9.25 3.9337 9.27634 3.87011 9.32322 3.82322C9.37011 3.77634 9.4337 3.75 9.5 3.75C9.5663 3.75 9.62989 3.77634 9.67678 3.82322C9.72366 3.87011 9.75 3.9337 9.75 4Z"
                                      stroke="white"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </div>
                                6
                              </li>
                            </ul>
                            {/* Fixed hardcoded year to show dynamically
                            <div className="year flag-tag">{car.year}</div>
                          </div> */}
                          <div className="img-style" style={{ position: "relative", height: "300px" }}>
                            <div style={{ position: "absolute", top: "10px", right: "10px", zIndex: 10 }}>
                              <StatusBadge status={car.status} />
                            </div>
                            <Image
                              className="lazyload"
                              alt={car.title}
                              src={car.imgSrc}
                              fill
                              style={{
                                objectFit: "cover",
                                objectPosition: "center",
                              }}
                            />
                          </div>
                        </div>
                        <div className="content">
                          <div className="text-address">
                            <p className="text-color-3 font">{car.type}</p>
                          </div>
                          <h5 className="link-style-1">
                            <Link href={`/listing-detail-v5/${car.id}`}>
                              {car.title}
                            </Link>
                          </h5>
                          <div className="icon-box flex flex-wrap">
                            <div className="icons flex-three">
                              <i className="icon-autodeal-km1" />
                              <span>{kmToMiles(car.km).toLocaleString()} Miles</span>
                            </div>
                            <div className="icons flex-three">
                              <i className="icon-autodeal-diesel" />
                              <span>{car.fuelType}</span>
                            </div>
                            <div className="icons flex-three">
                              <i className="icon-autodeal-automatic" />
                              <span>{car.transmission}</span>
                            </div>
                          </div>
                          <hr />
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div className="money fs-20 fw-5 lh-25 text-color-3">
                              £{car.price ? car.price?.toLocaleString() : "Price upon request"}
                            </div>
                            <div>
                              <Link
                                href={`/listing-detail-v1/${car.id}`}
                                className="view-car"
                              >
                                View car
                              </Link>
                            </div>
                          </div>
                          {/* <div className="days-box flex justify-space align-center">
                            {/* <div className="img-author">
                              <Image
                                className="lazyload"
                                alt={car.authorName}
                                src={car.authorImage}
                                width={40} // Resized author avatar
                                height={40}
                                style={{
                                  borderRadius: "50%",
                                  objectFit: "cover",
                                }}
                              />
                              <span className="font text-color-2 fw-5 ml-2">
                                {car.authorName}
                              </span>
                            </div> 
                            <Link
                              href={`/listing-detail-v5/${car.id}`}
                              className="view-car"
                            >
                              View car
                            </Link>
                          </div> */}
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                  <div className="swiper-pagination5 spd9" style={{ padding: "10px 0px" }}></div>
                </Swiper>
                <div className="swiper-button-next style-1 snbn6" />
                <div className="swiper-button-prev style-1 snbp6" />
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
