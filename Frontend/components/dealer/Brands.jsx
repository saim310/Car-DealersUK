"use client";
import { partners } from "@/data/categories";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Categories2() {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch(
          "https://apis.ukaautotrade.co.uk/api/brands",
        );
        const data = await res.json();
        if (data && data.length > 0) {
          setBrands(data);
        } else {
          setBrands(
            partners.map((p) => ({
              id: p.title,
              name: p.title,
              image_url: p.imgSrc,
              qty: p.subTitle.replace(" Car", ""),
            })),
          );
        }
      } catch (err) {
        console.error("Error fetching brands:", err);
        setBrands(
          partners.map((p) => ({
            id: p.title,
            name: p.title,
            image_url: p.imgSrc,
            qty: p.subTitle.replace(" Car", ""),
          })),
        );
      }
    };
    fetchBrands();
  }, []);

  const swiperOptions = {
    slidesPerView: 6,
    spaceBetween: 30,
    // autoplay: {
    //     delay: 0,
    //     disableOnInteraction: false,
    // },
    // speed: 10000,
    observer: true,
    observeParents: true,

    breakpoints: {
      0: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      600: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
      992: {
        slidesPerView: 4,
      },
      1440: {
        slidesPerView: 6,
      },
    },
  };
  return (
    <section className="tf-section">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="heading-section flex align-center justify-space flex-wrap gap-20">
              <h2
                className="wow fadeInUpSmall"
                data-wow-delay="0.2s"
                data-wow-duration="1000ms"
              >
                Dealerships by Brands
              </h2>
            </div>
          </div>
          <div className="col-lg-12">
            <Swiper
              {...swiperOptions}
              modules={[Pagination]}
              className="swiper partner-slide overflow-hidden"
            >
              {brands.map((partner, i) => (
                <SwiperSlide key={partner.id || i} className="swiper-slide">
                  <a href="#" className="partner-item style-1">
                    <div className="image">
                      <Image
                        className="lazyload"
                        data-src={partner.image_url}
                        alt="images"
                        src={partner.image_url}
                        width={200}
                        height={200}
                        style={{ objectFit: "contain" }}
                      />
                    </div>
                    <div className="content center">
                      <div className="fs-16 fw-6 title text-color-2 font-2">
                        {partner.name}
                      </div>
                      <span className="sub-title fs-12 fw-4 font-2">
                        {partner.qty ? `${partner.qty} Car` : "Car"}
                      </span>
                    </div>
                  </a>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}
