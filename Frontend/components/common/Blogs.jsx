"use client";

import { useEffect, useState } from "react";
import { blogSlides } from "@/data/blogs";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
import Image from "next/image";
import { getBlogDesc } from "@/utils/exports";

export default function Blogs({ parentClass = "section-blog tf-section" }) {
   const [blogsData, setBlogsData] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchBlogs = async () => {
        try {
          const res = await fetch("https://apis.ukaautotrade.co.uk/api/blogs?limit=6", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
  
          if (res.ok) {
            const data = await res.json();
            
            // Handle new pagination format
            if (data.success && data.data) {
              setBlogsData(data.data);
            } 
            // Fallback for old format (array)
            else if (Array.isArray(data)) {
              setBlogsData(data);
            }
            
            console.log("Blogs data:", data);
          } else {
            console.error("Server returned an error:", res.status);
          }
        } catch (err) {
          console.error("Network or parsing error:", err);
        } finally {
          setLoading(false);
        }
      };
  
      fetchBlogs();
    }, []);
  
    if (loading) return <div className="container">Loading blogs...</div>;
  
  
  
  
  
  return (
    <section className={parentClass} style={{paddingBottom:"0px"}}>
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="heading-section flex align-center justify-space flex-wrap gap-20">
              <h2
                className="wow fadeInUpSmall"
                data-wow-delay="0.2s"
                data-wow-duration="1000ms"
              >
                News to help choose your car
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
            <Swiper
              className="swiper tf-sw-mobile"
              slidesPerView={3}
              breakpoints={{
                1024: {
                  slidesPerView: 3,
                },
                768: {
                  slidesPerView: 2,
                },
                0: {
                  slidesPerView: 1,
                },
              }}
              spaceBetween={30}
            >
              {blogsData.map((slide, index) => (
                <SwiperSlide className="swiper-slide" key={index}>
                  <div className="blog-article-item style1 hover-img">
                    <div className="images img-style relative flex-none">
                      <Image
                        className="lazyload"
                        data-src={slide.image_url}
                        alt={slide.image_url}
                        src={slide.image_url}
                        width={800}
                        height={100}
                      />
                      <div className="date">{slide.author_name}</div>
                    </div>
                    <div className="content">
                      <div className="sub-box flex align-center fs-13 fw-6">
                        <a href="#" className="admin fw-7 text-color-2">
                          {slide.admin}
                        </a>
                        <a href="#" className="category text-color-3">
                          {slide.category}
                        </a>
                      </div>
                      <h3>
                        <Link href={`/blog-detail/${slide.id}`}>
                          {slide.title}
                        </Link>
                      </h3>
                      <p>{getBlogDesc(slide)}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}

              <div className="swiper-pagination3" />
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}
