"use client"; // <--- Add this at the very top

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { blogPosts2 } from "@/data/blogs";
import Pagination2 from "../common/Pagination2";
import BlogSidebar from "./BlogSidebar";
import { getBlogDesc } from "@/utils/exports";

export default function Blogs2() {
  const [blogsData, setBlogsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchblogs = async () => {
      try {
        // Build URL with category parameter if selected
        let url = "https://apis.ukaautotrade.co.uk/api/blogs";
        if (selectedCategory) {
          url += `?category=${encodeURIComponent(selectedCategory)}`;
        }

        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (res.ok) {
          const data = await res.json();
          setBlogsData(data);
          console.log("Blogs data:", data);
        }
      } catch (err) {
        console.error("Network or parsing error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchblogs();
  }, [selectedCategory]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  if (loading) return <div className="container">Loading blogs...</div>;

  return (
    <section className="tf-section3 flat-blog-grid flat-blog-list flat-property">
      <div className="container">
        <div className="inner-heading flex-two flex-wrap">
          <h1 className="heading-listing">Blog Grid</h1>
          {/* <div className="social-listing flex-six flex-wrap">
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
              <a href="#">
                <i className="icon-autodeal-instagram" />
              </a>
            </div>
          </div> */}
        </div>
        <div className="row">
          <div className="col-lg-9">
            <div className="post">
              <div className="flat-blog">
                <div className="row">
                  {blogsData.length > 0 ? (
                    blogsData.map((post, index) => (
                      <div className="col-lg-4 col-md-6" key={index}>
                        <div className="box hover-img">
                          <div
                            className="images img-style relative flex-none"
                            style={{ position: "relative", height: "250px" }}
                          >
                            <Image
                              alt="images"
                              src={post.image_url}
                              fill
                              style={{ objectFit: "cover" }}
                            />
                            <div className="date">{post.author_name}</div>
                          </div>
                          <div className="content">
                            <div className="sub-box flex align-center fs-13 fw-6">
                              <a href="#" className="admin fw-7 text-color-2">
                                {post.author_name}
                              </a>
                              <a href="#" className="category text-color-3">
                                {post.category}
                              </a>
                            </div>
                            <h3>
                              <Link href={`/blog-detail/${post.id}`}>
                                {post.title}
                              </Link>
                            </h3>
                            <p>{getBlogDesc(post)}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-lg-12">
                      <p>No blogs found in this category.</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="themesflat-pagination clearfix center">
                <ul>
                  <Pagination2 />
                </ul>
              </div>
            </div>
          </div>
          <div className="col-lg-3">
            <BlogSidebar
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
