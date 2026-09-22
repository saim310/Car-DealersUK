"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import useFetch from "@/hooks/useFetch";
import StatusBadge from "@/components/common/StatusBadge";
import { getImageUrl, sortCarsWithRegistrationPriority, normalizeBodyType, kmToMiles } from "@/utils/exports";

export default function Cars2() {
  const { data: backendListings } = useFetch("/listings");
  const [displayCars, setDisplayCars] = useState([]);

  useEffect(() => {
    // 1. Safely handle the backend response
    const mappedListings = (backendListings || []).map((item) => ({
      id: item.id, // Using raw ID so routing to /listing-detail-v1/[id] works
      year: item.years || item.year,
      type: normalizeBodyType(item.type) || item.type || "Unknown Type",
      title: item.listing_title || item.title,
      km: parseInt(item.mileage) || 0,
      fuelType: item.fuel_type || "N/A",
      transmission: item.transmission || "N/A",
      price: parseFloat(item.price) || 0,
      imgSrc: getImageUrl(item.images && item.images.length > 0 ? item.images[0] : null),
      authorName: item.authorName || "Admin", // Fallback author
      authorImage: item.authorImage || "/assets/images/author/8.png", // Fallback avatar
      status: item.status || "in_stock",
      created_at: item.created_at,
      plate_number: item.plate_number || item.plateNo || "",
      plateNo: item.plateNo || item.plate_number || "",
    }));

    const sorted = sortCarsWithRegistrationPriority(mappedListings);

    // 2. Set ONLY the dynamic listings (no staticCarData appended)
    setDisplayCars(sorted);
  }, [backendListings]);

  const swiperOptions = {
    slidesPerView: 4,
    spaceBetween: 30,
    speed: 1000,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".spd31",
      clickable: true,
       dynamicBullets: true,
  dynamicMainBullets: 3,
    },
    breakpoints: {
      0: {
        slidesPerView: 1,
      },
      600: {
        slidesPerView: 2,
      },
   
      1200: {
        slidesPerView: 3,
      },
    },
  };

  return (
    <section className="tf-section3" style={{ padding: "60px 0" }}>
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
                href={`/listing-grid`}
                className="tf-btn-arrow wow fadeInUpSmall"
                data-wow-delay="0.2s"
                data-wow-duration="1000ms"
              >
                View all
                <i className="icon-autodeal-btn-right" />
              </Link>
            </div>
          </div>

          <div className="col-lg-12">
            {displayCars.length > 0 ? (
              <Swiper
                className="swiper-container tf-sw-mobile2-swiper"
                {...swiperOptions}
                modules={[Pagination, Autoplay]}
              >
                {displayCars.slice(0, 12).map((car, i) => (
                  <SwiperSlide key={i} className="swiper-slide">
                    <div className="box-car-list hv-one">
                      <div className="image-group relative">
                        {/* <div className="top flex-two">
                          <ul className="d-flex gap-8">
                            <li className="flag-tag success">Featured</li>
                          </ul>
                          <div className="year flag-tag">{car.year}</div>
                        </div> */}

  <div className="img-style" style={{position: "relative", height:"300px"}}>
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
                          <span className="car-title-clamp">
                          <Link href={`/listing-detail-v1/${car.id}`}>
                            {car.title}
                          </Link>
                          </span>
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
                        <div style={{display:"flex", justifyContent:"space-between",alignItems:"center"}}>
                        <div className="money fs-20 fw-5 lh-25 text-color-3">
                          £{car.price?.toLocaleString()}
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
                              alt="author"
                              src={car.authorImage}
                              width={30}
                              height={30}
                              style={{ borderRadius: "50%" }}
                            />
                            <span className="font text-color-2 fw-5 ml-2">
                              {car.authorName}
                            </span>
                          </div> 
                          <Link
                            href={`/listing-detail-v1/${car.id}`}
                            className="view-car"
                          >
                            View car
                          </Link>
                        </div> */}
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
                {/* Pagination Dots */}
                <div className="swiper-pagination5 spd31" style={{padding:"10px 0px"}} />
              </Swiper>
            ) : (
              <p>Loading cars...</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
