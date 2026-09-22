"use client";
import React from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

export default function SearchByBody() {
  const bodyTypes = [
    { title: "Hatchback", query: "Hatchback", image: "/assets/images/section/Hatchback.png" },
    { title: "SUV", query: "SUV", image: "/assets/images/section/Suv.png" },
    { title: "Sedan", query: "Sedan", image: "/assets/images/section/Sedan.png" },
    { title: "Van", query: "Van", image: "/assets/images/section/Van.png" },
    { title: "Crossover", query: "Crossover", image: "/assets/images/section/Crossover.png" },
    { title: "Estate", query: "Estate", image: "/assets/images/section/Estate.png" },
  ];

  return (
    <section className="tf-section" style={{ padding: "40px 0", background: "#ff5722" }}>
      <div className="container" style={{ width: "100%", maxWidth: "1400px", margin: "0 auto", paddingLeft: "15px", paddingRight: "15px" }}>
        <div className="row" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          
          <div className="col-lg-12" style={{ width: "100%" }}>
            <Swiper
              modules={[Navigation]}
              spaceBetween={20}
              slidesPerView={2}
              navigation={false}
              breakpoints={{
                576: { slidesPerView: 3 },
                768: { slidesPerView: 4 },
                992: { slidesPerView: 5 },
                1200: { slidesPerView: 6 },
              }}
              className="mySwiper"
            >
              {bodyTypes.map((item, index) => (
                <SwiperSlide key={index}>
                  <Link
                    href={{
                      pathname: "/listing-grid",
                      query: { type: item.query },
                    }}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "20px 15px",
                      background: "transparent",
                      textAlign: "center",
                      textDecoration: "none",
                      height: "170px",
                      width: "100%",
                      transition: "all 0.3s ease",
                    }}
                    className="box-icon-item"
                  >
                    <div style={{ height: "70px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "15px" }}>
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        style={{ maxHeight: "60px", width: "auto", objectFit: "contain", filter: "drop-shadow(0px 4px 6px rgba(0,0,0,0.15))" }} 
                      />
                    </div>
                    <div 
                      className="title" 
                      style={{ 
                        fontSize: "15px", 
                        fontWeight: "700", 
                        color: "#fff", 
                        background: "#000", 
                        padding: "10px 24px", 
                        borderRadius: "30px",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                        letterSpacing: "0.3px",
                        width: "100%",
                        maxWidth: "140px"
                      }}
                    >
                      {item.title}
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

        </div>
      </div>
    </section>
  );
}