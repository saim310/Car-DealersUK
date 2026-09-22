import React from "react";
import Image from "next/image";
import CommentForm from "./CommentForm";

// Helper to format date nicely
const formatDate = (dateString) => {
  if (!dateString) return "Unknown Date";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function BlogDetails({ blogItem }) {
  // 1. Handling case where no blog item is found
  if (!blogItem) {
    return (
      <section className="tf-section3 flat-blog-detail mt-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center pd-10 br-12 style-bg-1">
              <h3 className="fw-7 mb-3">Post Not Found</h3>
              <p className="fs-16 text-color-2">
                We're sorry, but the blog post you are looking for does not exist or has been removed.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const hasImage = blogItem.image_url || blogItem.image_path;

  return (
    <section className="tf-section3 flat-blog-detail pb-50 mt-30">
      <div className="container">
        <div className="row justify-content-center">
          {/* 
            Changed col-lg-8 to col-lg-10 offset-lg-1 
            This centers the content and reduces maximum width for better readability 
            since there is no sidebar.
          */}
          <div className="col-lg-10">
            <div className="post-details-wrap">
              
              {/* Header: Category, Title, Meta */}
              <div className="post-header text-center mb-40">
                <div className="flex justify-center mb-10 link-style-2 fs-14 fw-7 text-uppercase tracking-1">
                  <a href="#" className="text-color-3">
                    {blogItem.category || "General"}
                  </a>
                </div>
                <h1 className="title-heading fw-8 mb-20">
                  {blogItem.title}
                </h1>
                
                <div className="icon-boxs flex justify-center gap-20 fs-15 text-color-2 pb-20 border-bottom-style-1 mb-30">
                  <div className="icon flex align-center gap-8">
                    <i className="icon-autodeal-user fs-16" />
                    <span>by {blogItem.author_name || "Admin"}</span>
                  </div>
                  <div className="icon flex align-center gap-8">
                    <i className="icon-autodeal-calendar fs-16" />
                    <span>{formatDate(blogItem.created_at)}</span>
                  </div>
                </div>
              </div>

              {/* Excerpt/Lead text */}
              {blogItem.excerpt && (
                <div className="texts-1 lead fw-5 lh-28 text-color-2 mb-40 text-justify pd-20 br-12 style-bg-1">
                  {blogItem.excerpt}
                </div>
              )}

              {/* Main Featured Image */}
              {hasImage && (
                <div className="image mb-40 br-16 overflow-hidden shadow-sm" style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                  <Image
                    alt={blogItem.title}
                    src={blogItem.image_url || "/assets/images/blog/blog-details-1.jpg"}
                    width={700}
                    height={310}
                    className="img-fluid"
                    style={{ objectFit: 'cover', height: 'auto', justifyContent: 'center' }}
                    priority
                  />
                </div>
              )}

              {/* Main HTML Content */}
              <div
                className="blog-content fs-17 lh-30 text-color-2 mb-50 text-justify"
                dangerouslySetInnerHTML={{ __html: blogItem.content || "" }}
              />

              {/* Tags and Social Share */}
              <div className="tag-wrap flex flex-wrap justify-space align-center gap-20 pd-20 br-12 style-bg-1 mb-50">
                {/* <div className="tags flex align-center gap-10">
                  <p className="text-color-3 fw-7 fs-16 mb-0">Category:</p>
                  <div className="flex fs-13 fw-6 link-style-1 gap-8">
                    <a href="#" className="pd-5-15 br-4 style-bg-white border-style-1 mt-2">
                      {blogItem.category || "Cars"}
                    </a>
                  
                  </div>
                </div> */}
                
                {/* <div className="share-box flex align-center gap-15">
                  <p className="text-color-3 fw-7 fs-16 mb-0">Share:</p>
                  <div className="icon-social flex align-center gap-10link-style-3">
                    <a href="https://www.facebook.com/ukajapan" target="_blank" rel="noopener noreferrer">
                      <i className="icon-autodeal-facebook fs-18" />
                    </a>
                    <a href="#">
                      <i className="icon-autodeal-linkedin fs-18" />
                    </a>
                    <a href="#">
                      <i className="icon-autodeal-twitter fs-18" />
                    </a>
                    <a href="https://www.instagram.com/ukajapan_/" target="_blank" rel="noopener noreferrer">
                      <i className="icon-autodeal-instagram fs-18" />
                    </a>
                  </div>
                </div> */}
              </div>

              {/* Comment Form Section */}
              {/* <div className="wrap-contact wrap-form pd-40 pd-md-20 br-16 style-bg-white border-style-1 mt-60">
                <div className="title mb-30">
                  <h3 className="fw-7">Leave a Reply</h3>
                  <p className="fs-15 text-color-2 mt-5">
                    Your email address will not be published. Required fields are marked *
                  </p>
                </div>
                <CommentForm />
              </div> */}

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}