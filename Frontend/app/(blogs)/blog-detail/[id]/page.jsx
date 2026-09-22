import BlogDetails from "@/components/blogs/BlogDetails";
import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Blog Details || UKA Car Trade",
  description: "Read blog details at UKA Car Trade",
};

async function getBlogData(id) {
  try {
    const res = await fetch(`https://apis.ukaautotrade.co.uk/api/blogs/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch blog");
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching blog:", error);
    return null;
  }
}

export default async function page({ params }) {
  const blogItem = await getBlogData(params.id);

  if (!blogItem) {
    return (
      <>
        <div className="header-fixed">
          <Header2 />
        </div>
        <section className="flat-title mb-40">
          <div className="container2">
            <div className="row">
              <div className="col-lg-12">
                <div className="title-inner style">
                  <div className="title-group fs-12">
                    <Link className="home fw-6 text-color-3" href={`/`}>
                      Home
                    </Link>
                    <span>Blog not found</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="tf-section3 flat-blog-detail">
          <div className="container">
            <div className="row">
              <div className="col-lg-8">
                <div className="post">
                  <p className="text-center fs-20 fw-6">Blog not found</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer1 />
      </>
    );
  }

  return (
    <>
      <div className="header-fixed">
        <Header2 />
      </div>
      <section className="flat-title mb-40">
        <div className="container2">
          <div className="row">
            <div className="col-lg-12">
              <div className="title-inner style">
                <div className="title-group fs-12">
                  <Link className="home fw-6 text-color-3" href={`/`}>
                    Home
                  </Link>
                  <span>{blogItem.title}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <BlogDetails blogItem={blogItem} />
      <Footer1 />
    </>
  );
}
