"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import StatusBadge from "./StatusBadge";
import useFetch from "@/hooks/useFetch";
import { getImageUrl, sortCarsWithRegistrationPriority, normalizeBodyType, ALLOWED_BODY_TYPES, kmToMiles } from "@/utils/exports";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const carTypes = ["All", ...ALLOWED_BODY_TYPES];

export default function Cars({ parentClass = "tf-section" }) {
  const { data: backendListings, loading } = useFetch("/listings");
  const searchParams = useSearchParams();
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const rawTypeFromUrl = searchParams.get("type");
  const typeFromUrl = normalizeBodyType(rawTypeFromUrl) || (rawTypeFromUrl === "All" ? "All" : null);
  const initialType =
    typeFromUrl && carTypes.includes(typeFromUrl) ? typeFromUrl : "All";

  const [selectedType, setSelectedType] = useState(initialType);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const raw = searchParams.get("type");
    const t = normalizeBodyType(raw) || (raw === "All" ? "All" : null);
    setSelectedType(t && carTypes.includes(t) ? t : "All");
  }, [searchParams]);

  useEffect(() => {
    if (typeFromUrl && sectionRef.current) {
      const timer = setTimeout(() => {
        sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [typeFromUrl]);

  useEffect(() => {
    const mappedListings = (backendListings || []).map((item) => ({
      id: item.id,
      year: item.years || item.year,
      type: normalizeBodyType(item.type) || item.type || "Unknown Type",
      title: item.listing_title || item.title,
      km: parseInt(item.mileage) || 0,
      fuelType: item.fuel_type || "N/A",
      transmission: item.transmission || "N/A",
      price: parseFloat(item.price) || 0,
      road_tax: item.road_tax || "N/A",
      location: item.location || "Birmingham",
      imgSrc: getImageUrl(item.images && item.images.length > 0 ? item.images[0] : null),
      authorName: item.authorName || "Admin",
      authorImage: item.authorImage || "/assets/images/author/8.png",
      status: item.status || "in_stock",
      created_at: item.created_at,
      plate_number: item.plate_number || item.plateNo || "",
      plateNo: item.plateNo || item.plate_number || "",
    }));

    let results =
      selectedType === "All"
        ? mappedListings
        : mappedListings.filter((el) => el.type === selectedType);

    results = sortCarsWithRegistrationPriority(results);

    setFiltered(results);
  }, [selectedType, backendListings]);

  return (
    <>
      <style jsx>{`
        .car-title-clamp {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 2.8rem;
          line-height: 1.3;
          font-size: 18px;
          font-weight: 800;
          color: #0b1120;
        }
        .custom-car-card {
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid #f1f5f9;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          height: 100%;
          box-sizing: border-box;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .custom-car-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        .custom-car-image-container {
          position: relative;
          width: 100%;
          height: 240px;
        }
        .custom-car-body {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .pricing-boxes-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .pricing-box {
          background: #f8fafc;
          border: 1px solid #f1f5f9;
          border-radius: 12px;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .pricing-box-label {
          font-size: 11px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .pricing-box-value {
          font-size: 20px;
          font-weight: 900;
          color: #0b1120;
        }
        .pricing-box-sub {
          font-size: 12px;
          color: #64748b;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .specs-grid-bar {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          border-top: 1px solid #f1f5f9;
          border-bottom: 1px solid #f1f5f9;
          padding: 12px 0;
          text-align: center;
        }
        .spec-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          font-size: 13px;
          font-weight: 700;
          color: #0b1120;
        }
        .spec-item i {
          font-size: 18px;
          color: #475569;
        }
        .spec-item:not(:last-child) {
          border-right: 1px solid #f1f5f9;
        }
        .custom-view-btn {
          width: 100%;
          background: #ff5500;
          color: #ffffff;
          font-weight: 800;
          height: 48px;
          border-radius: 12px;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 16px;
          cursor: pointer;
          text-decoration: none;
          box-shadow: 0 4px 12px rgba(255, 85, 0, 0.25);
          transition: background 0.2s, transform 0.1s;
        }
        .custom-view-btn:hover {
          background: #e04b00;
          color: #ffffff;
        }
        .section-header-centered {
          text-align: center;
          margin-bottom: 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        .hot-deals-badge,
        .animated-title,
        .animated-subtext,
        .animated-divider {
          opacity: 0;
        }
        .animate .hot-deals-badge {
          animation: fadeInDown 0.8s ease-out forwards;
        }
        .animate .animated-title {
          animation: fadeInUp 0.8s ease-out 0.15s forwards;
        }
        .animate .animated-subtext {
          animation: fadeInUp 0.8s ease-out 0.3s forwards;
        }
        .animate .animated-divider {
          animation: expandWidth 0.8s ease-out 0.45s forwards;
        }
        .hot-deals-badge {
          background: #ff5500;
          color: #ffffff;
          font-size: 12px;
          font-weight: 700;
          padding: 6px 16px;
          border-radius: 30px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 4px 14px rgba(255, 85, 0, 0.3);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .section-subtext {
          font-size: 14px;
          color: #666;
          margin: 0;
        }
        .orange-divider {
          width: 50px;
          height: 3px;
          background: #ff5500;
          border-radius: 2px;
          margin-top: 4px;
        }
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes expandWidth {
          from {
            width: 0;
            opacity: 0;
          }
          to {
            width: 50px;
            opacity: 1;
          }
        }
        .bottom-view-all-container {
          display: flex;
          justify-content: center;
          margin-top: 40px;
        }
        .bottom-view-all-btn {
          background: #ff5500 !important;
          color: #ffffff !important;
          border: 2px solid #ff5500 !important;
          font-weight: 800;
          padding: 14px 40px;
          border-radius: 12px;
          font-size: 16px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          box-shadow: 0 4px 16px rgba(255, 85, 0, 0.35);
          transition: all 0.2s ease;
        }
        .bottom-view-all-btn:hover {
          background: #e04b00 !important;
          color: #ffffff !important;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 85, 0, 0.45);
        }
        .swiper-button-prev,
        .swiper-button-next {
          color: #ff5500 !important;
          background: #ffffff;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          transition: all 0.2s ease;
        }
        .swiper-button-prev:hover,
        .swiper-button-next:hover {
          background: #ff5500;
          color: #ffffff !important;
        }
      `}</style>

      <section id="cars-by-type" ref={sectionRef} className={parentClass}>
        <div className={`container ${isVisible ? "animate" : ""}`}>
          <div className="row">
            <div className="col-lg-12">
              <div className="section-header-centered">
                <div className="hot-deals-badge">
                  <span>🔥</span> FRESH IMPORTS
                </div>
                <h2 className="animated-title" style={{ margin: "0" }}>
                  {selectedType === "All"
                    ? "EXPLORE OUR LATEST JAPANESE IMPORTS"
                    : `EXPLORE OUR HOTTEST ${selectedType.toUpperCase()} DEALS`}
                </h2>
                <p className="section-subtext animated-subtext">
                  Directly imported from Japan • Fully inspected & certified • Ready to drive away
                </p>
                <div className="orange-divider animated-divider"></div>
              </div>
            </div>

            <div className="col-lg-12">
              <div className="content-tab">
                <div className="content-inner tab-content">
                  {loading ? (
                    <p style={{ textAlign: "center", padding: "2rem" }}>
                      Loading cars...
                    </p>
                  ) : filtered.length === 0 ? (
                    <p style={{ textAlign: "center", padding: "2rem" }}>
                      No {selectedType !== "All" ? selectedType : ""} cars found.
                    </p>
                  ) : (
                    <div style={{ position: "relative", padding: "0 5px" }}>
                      <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={30}
                        slidesPerView={1}
                        navigation
                        pagination={{ clickable: true }}
                        autoplay={{
                          delay: 3500,
                          disableOnInteraction: false,
                          pauseOnMouseEnter: true,
                        }}
                        breakpoints={{
                          640: { slidesPerView: 2 },
                          992: { slidesPerView: 3 },
                          1200: { slidesPerView: 4 },
                        }}
                        style={{ paddingBottom: "50px" }}
                      >
                        {filtered.slice(0, 12).map((car, index) => {
                          const monthlyPrice = car.price ? Math.round(car.price / 42) : 309;
                          return (
                            <SwiperSlide key={index}>
                              <div className="custom-car-card">
                                <div className="custom-car-image-container">
                                  <div style={{ position: "absolute", top: "12px", right: "12px", zIndex: 10 }}>
                                    <StatusBadge status={car.status} />
                                  </div>
                                  <Image
                                    className="lazyload"
                                    alt="image"
                                    src={car.imgSrc}
                                    fill
                                    style={{ objectFit: "cover", objectPosition: "center" }}
                                  />
                                </div>

                                <div className="custom-car-body">
                                  <div>
                                    <h5 style={{ margin: "0 0 6px 0" }}>
                                      <Link href={`/listing-detail-v1/${car.id}`}>
                                        <span className="car-title-clamp">{car.title}</span>
                                      </Link>
                                    </h5>
                                    <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", color: "#e74c3c", fontWeight: 700 }}>
                                      <i className="icon-autodeal-location" />
                                      <span>{car.location}</span>
                                    </div>
                                  </div>

                                  <div className="pricing-boxes-grid">
                                    <div className="pricing-box">
                                      <span className="pricing-box-label">PAY MONTHLY</span>
                                      <span className="pricing-box-value">£{monthlyPrice.toLocaleString()}</span>
                                      <span className="pricing-box-sub">per month</span>
                                    </div>
                                    <div className="pricing-box">
                                      <span className="pricing-box-label">FULL PRICE</span>
                                      <span className="pricing-box-value">£{car.price ? car.price.toLocaleString() : "N/A"}</span>
                                      <span className="pricing-box-sub">
                                        <i className="icon-autodeal-calendar" style={{ fontSize: "11px" }} />
                                        {car.road_tax && car.road_tax !== "N/A" ? `£${car.road_tax} Road tax` : "Tax included"}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="specs-grid-bar">
                                    <div className="spec-item">
                                      <i className="icon-autodeal-km1" />
                                      <span>{kmToMiles(car.km).toLocaleString()} mi</span>
                                    </div>
                                    <div className="spec-item">
                                      <i className="icon-autodeal-diesel" />
                                      <span>{car.fuelType}</span>
                                    </div>
                                    <div className="spec-item">
                                      <i className="icon-autodeal-automatic" />
                                      <span>{car.transmission}</span>
                                    </div>
                                  </div>

                                  <Link href={`/listing-detail-v1/${car.id}`} className="custom-view-btn">
                                    View Vehicle <i className="icon-autodeal-btn-right" style={{ fontSize: "14px" }} />
                                  </Link>
                                </div>
                              </div>
                            </SwiperSlide>
                          );
                        })}
                      </Swiper>
                    </div>
                  )}

                  <div className="bottom-view-all-container">
                    <Link href="/listing-grid" className="bottom-view-all-btn">
                      View All Vehicles <i className="icon-autodeal-btn-right" style={{ fontSize: "14px" }} />
                    </Link>
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