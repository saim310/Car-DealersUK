"use client"; // <--- Add this at the very top

import { useEffect, useState } from "react";
import BlogSidebar from "./BlogSidebar";
import Link from "next/link";
import Image from "next/image";
import Pagination2 from "../common/Pagination2";
import { getBlogDesc } from "@/utils/exports";

export default function Blogs1() {
  const [blogsData, setBlogsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        // Build URL with category and pagination parameters
        let url = `https://apis.ukaautotrade.co.uk/api/blogs?page=${currentPage}&limit=${itemsPerPage}`;
        if (selectedCategory) {
          url += `&category=${encodeURIComponent(selectedCategory)}`;
        }

        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const data = await res.json();
          
          // Handle both old format (array) and new format (object with pagination)
          if (data.success && data.data) {
            setBlogsData(data.data);
            setTotalPages(data.pagination?.pages || 1);
          } else if (Array.isArray(data)) {
            // Fallback for old API format
            setBlogsData(data);
            setTotalPages(Math.ceil(data.length / itemsPerPage));
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
  }, [selectedCategory, currentPage]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when category changes
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    // Scroll to top of blog section
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) return <div className="container">Loading blogs...</div>;

  return (
    <section className="tf-section3 flat-blog-list flat-property">
      <div className="container">
        <div className="inner-heading flex-two flex-wrap">
          <h1 className="heading-listing">Blog List</h1>
          {/* <div className="social-listing flex-six flex-wrap">
            <p>Share this page:</p>
            <div className="icon-social style1">
              <a href="https://www.facebook.com/ukajapan"><i className="icon-autodeal-facebook" /></a>
              <a href="#"><i className="icon-autodeal-linkedin" /></a>
              <a href="#"><i className="icon-autodeal-twitter" /></a>
              <a href="https://www.instagram.com/ukajapan_/">
                <i className="icon-autodeal-instagram" />
              </a>
            </div>
          </div> */}
        </div>
        <div className="row">
          <div className="col-lg-8">
            <div className="post">
              <div className="flat-blog">
                <div className="wrap-blog">
                  {/* Changed from blogPosts to blogsData */}
                  {blogsData.length > 0 ? (
                    blogsData.map((post) => (
                      <div className="box hover-img" key={post.id}>
                        <div className="images img-style relative flex-none" style={{ position: 'relative', height: '450px' }}>
                          <Image
                            alt={post.title}
                            src={post.image_url} // Using your API's image_url
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                        <div className="content">
                          <h3>
                            <Link href={`/blog-detail/${post.id}`}>
                              {post.title}
                            </Link>
                          </h3>
                          <div className="sub-box flex align-center fs-13 fw-6">
                            <a className="title-2 text-color-3">
                              {post.category}
                            </a>
                            <div className="title-1">
                              {new Date(post.created_at).toLocaleDateString()}
                            </div>
                          </div>
                          <p>{getBlogDesc(post)}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="box">
                      <p>No blogs found in this category.</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="themesflat-pagination clearfix center">
                <ul>
                  <Pagination2 
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                  />
                </ul>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
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