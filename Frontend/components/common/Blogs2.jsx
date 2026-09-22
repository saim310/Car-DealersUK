"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { blogPosts4 } from "@/data/blogs";
import { getBlogDesc } from "@/utils/exports";

export default function Blogs2() {
  const [blogsData, setBlogsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("https://apis.ukaautotrade.co.uk/api/blogs?limit=4", {
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

  const posts = blogsData.length > 0 ? blogsData : blogPosts4;

  const formatDate = (post) => {
    if (post.created_at) {
      return new Date(post.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
    return post.date || "";
  };

  return (
    <section className="section-blog tf-section3">
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
          </div>
          <div className="col-lg-6">
            <div className="blog-article-left">
              {posts.slice(0, 1).map((post, i) => (
                <div key={post.id || i} className="blog-article-item hover-img">
                  <div className="images img-style relative flex-none">
                    <Image
                      className="ls-is-cached lazyloaded"
                      alt={post.title || "images"}
                      src={post.image_url || post.imgSrc || "/assets/images/blog/blog-19.jpg"}
                      width={945}
                      height={623}
                    />
                    <div className="date">{formatDate(post)}</div>
                  </div>
                  <div className="content">
                    <div className="sub-box flex align-center fs-13 fw-6">
                      <a href="#" className="admin fw-7 text-color-2">
                        {post.author_name || post.admin || "Admin"}
                      </a>
                      <a href="#" className="category text-color-3">
                        {post.category || "First Drives"}
                      </a>
                    </div>
                    <h3>
                      <Link href={`/blog-detail/${post.id}`}>{post.title}</Link>
                    </h3>
                    <p>{getBlogDesc(post)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-lg-6">
            <div className="blog-article-right">
              {posts.slice(1, 4).map((post, i) => (
                <div
                  key={post.id || i}
                  className="blog-article-item style3 hover-img wow fadeInUpSmall"
                  data-wow-delay="0.2s"
                  data-wow-duration="1000ms"
                >
                  <div className="images img-style relative flex-none">
                    <Image
                      className="ls-is-cached lazyloaded"
                      alt={post.title || "images"}
                      src={post.image_url || post.imgSrc || "/assets/images/blog/blog-20.jpg"}
                      width={285}
                      height={188}
                    />
                  </div>
                  <div className="content">
                    <div className="sub-box flex align-center flex-wrap fs-13 fw-6">
                      <a href="#" className="admin fw-7 text-color-2">
                        {post.author_name || post.admin || "Admin"}
                      </a>
                      <a href="#" className="category text-color-3 fw-4">
                        {post.category || "First Drives"}
                      </a>
                      <a href="#" className="date fw-4 fs-12 font-2">
                        {formatDate(post)}
                      </a>
                    </div>
                    <h3>
                      <Link href={`/blog-detail/${post.id}`}>{post.title}</Link>
                    </h3>
                    <p>{getBlogDesc(post)}</p>
                  </div>
                </div>
              ))}

              <div
                className="flat-bt-top wow fadeInUpSmall"
                data-wow-delay="0.2s"
                data-wow-duration="1000ms"
              >
                <Link className="sc-button btn-1" href="/blog-grid">
                  <span>View all news</span>
                  <i className="icon-autodeal-next" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
