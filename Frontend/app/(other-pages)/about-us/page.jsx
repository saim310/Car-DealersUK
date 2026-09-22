import Agents from "@/components/common/Agents";
import Brands from "@/components/common/Brands";
import Footer1 from "@/components/footers/Footer1";
import RecomandedCars from "@/components/common/RecomandedCars";
import Header2 from "@/components/headers/Header2";
import Testimonials from "@/components/homes/home-10/Testimonials";
import AboutUsBanner from "@/components/otherPages/about/AboutUsBanner";
import AboutUsContent from "@/components/otherPages/about/AboutUsContent";

import Link from "next/link";
import React from "react";

export const metadata = {
  title: "About Us || UKA Japan Motors",
  description: "Learn about UKA Japan Motors - Your trusted Japanese car importer in the UK. 25+ years of experience in quality Japanese vehicles.",
};
export default function page() {
  return (
    <>
      <div className="header-fixed">
        <Header2 />
      </div>
      <section className="flat-title">
        <div className="container2">
          <div className="row">
            <div className="col-lg-12">
              <div className="title-inner style">
                <div className="title-group fs-12">
                  <Link className="home fw-6 text-color-3" href={`/`}>
                    Home
                  </Link>
                  <span>About Us</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <AboutUsBanner />
      <AboutUsContent />
      {/*<Agents parentClass="tf-section3" />*/}
     {/* <Brands />*/}
      {/*<Testimonials />*/}
      <RecomandedCars />
      <Footer1 />
    </>
  );
}
