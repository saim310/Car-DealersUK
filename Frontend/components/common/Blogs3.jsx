"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { blogArticles } from "@/data/blogs";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { getBlogDesc } from "@/utils/exports";

export default function Blogs3({ parentClass = "section-blog tf-section" }) {
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
          if (data.success && data.data) {
            setBlogsData(data.data);
          } else if (Array.isArray(data)) {
            setBlogsData(data);
          }
        }
      } catch (err) {
        console.error("Network or parsing error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const articles = blogsData.length > 0 ? blogsData : blogArticles;

  const formatDate = (article) => {
    if (article.created_at) {
      return new Date(article.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
    return article.date || "";
  };

  return (
    <section className={parentClass}>
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
            <div
              className="swiper-container overflow-visible tf-sw-mobile7"
              data-preview={2}
              data-space={30}
            >
              <div className="swiper-wrapper blog-article-grid list-car-grid-blog-2">
                {articles.map((article, index) => (
                  <div className="swiper-slide" key={article.id || index}>
                    <div className="blog-article-item style2 hover-img">
                      <div className="images img-style relative flex-none">
                        <Image
                          className="lazyload"
                          data-src={article.image_url || article.imgSrc || "/assets/images/blog/blog-15.jpg"}
                          alt={article.title || "images"}
                          src={article.image_url || article.imgSrc || "/assets/images/blog/blog-15.jpg"}
                          width={450}
                          height={297}
                        />
                        <div className="date">{formatDate(article)}</div>
                      </div>
                      <div className="content">
                        <div className="sub-box flex align-center fs-13 fw-6">
                          <a href="#" className="admin fw-7 text-color-2">
                            {article.author_name || article.admin || "Admin"}
                          </a>
                          <a href="#" className="category text-color-3">
                            {article.category || "First Drives"}
                          </a>
                        </div>
                        <h3>
                          <Link href={`/blog-detail/${article.id}`}>
                            {article.title}
                          </Link>
                        </h3>
                        <p>{getBlogDesc(article)}</p>
                        <Link
                          href={`/blog-detail/${article.id}`}
                          className="read-more"
                        >
                          Read more
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="swiper-pagination3" />
            </div>
            <Swiper
              className="swiper-container overflow-visible tf-sw-mobile7-swiper"
              slidesPerView={2}
              spaceBetween={30}
              modules={[Pagination]}
              pagination={{
                clickable: true,
                el: ".spd26",
              }}
            >
              {articles.map((article, index) => (
                <SwiperSlide className="swiper-slide" key={article.id || index}>
                  <div className="blog-article-item style2 hover-img">
                    <div className="images img-style relative flex-none">
                      <Image
                        className="lazyload"
                        data-src={article.image_url || article.imgSrc || "/assets/images/blog/blog-15.jpg"}
                        alt={article.title || "images"}
                        src={article.image_url || article.imgSrc || "/assets/images/blog/blog-15.jpg"}
                        width={450}
                        height={297}
                      />
                      <div className="date">{formatDate(article)}</div>
                    </div>
                    <div className="content">
                      <div className="sub-box flex align-center fs-13 fw-6">
                        <a href="#" className="admin fw-7 text-color-2">
                          {article.author_name || article.admin || "Admin"}
                        </a>
                        <a href="#" className="category text-color-3">
                          {article.category || "First Drives"}
                        </a>
                      </div>
                      <h3>
                        <Link href={`/blog-detail/${article.id}`}>
                          {article.title}
                        </Link>
                      </h3>
                      <p>{getBlogDesc(article)}</p>
                      <Link
                        href={`/blog-detail/${article.id}`}
                        className="read-more"
                      >
                        Read more
                      </Link>
                    </div>
                  </div>
                </SwiperSlide>
              ))}

              <div className="swiper-pagination3 spd26" />
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}
