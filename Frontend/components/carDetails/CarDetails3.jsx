"use client";

import React from "react";
import { kmToMiles } from "@/utils/exports";
import Slider3 from "./sliders/Slider3";
import Description from "./detailComponents/Description";
import CarReview from "./detailComponents/CarReview";
import Features from "./detailComponents/Features";
import LoanCalculator from "./detailComponents/LoanCalculator";
import Overview from "./detailComponents/Overview";
import ProfileInfo from "./detailComponents/ProfileInfo";
import Recommended from "./detailComponents/Recommended";
import SidebarToggleButton from "./SidebarToggleButton";

export default function CarDetails3({ carItem }) {
  // Prevent crash if carItem is still loading or undefined
  if (!carItem) return null;

  // Formatting helper for currency and numbers
  const formatNum = (num) => (num ? Number(num).toLocaleString() : "0");
      console.log("car items Cars:", carItem);
      const [featuresOpen, setFeaturesOpen] = useState(false);

      // Toggle for Features section in mobile view
        useEffect(() => {
          const handleFeaturesToggle = (event) => {
            const parent = event.target.closest(".listing-features");
            if (!parent) return;
      
            const content = parent.querySelector(".tf-collapse-content");
            if (!content) return;
      
            if (parent.classList.contains("open")) {
              content.style.height = content.scrollHeight + "px";
              requestAnimationFrame(() => {
                content.style.height = "0px";
              });
              parent.classList.remove("open");
              setFeaturesOpen(false);
            } else {
              parent.classList.add("open");
              content.style.height = content.scrollHeight + "px";
      
              content.addEventListener(
                "transitionend",
                () => {
                  if (parent.classList.contains("open")) {
                    content.style.height = "auto";
                  }
                },
                { once: true }
              );
              setFeaturesOpen(true);
            }
          };
      
          const featureHeading = document.querySelector(
            ".listing-features .feature-heading-mobie"
          );
          if (featureHeading) {
            featureHeading.addEventListener("click", handleFeaturesToggle);
            featureHeading.style.cursor = "pointer";
      
            return () => {
              featureHeading.removeEventListener("click", handleFeaturesToggle);
            };
          }
        }, []);

  return (
    <>
      <section className="tf-section3 listing-detail style-2">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="heading-widget flex-one mb-20 flex-wrap gap-8">
                <div className="inner">
                  {/* Dynamic Title */}
                  <h1 className="title">{carItem.listing_title}</h1>

                  <div className="icon-box flex flex-wrap">
                    <div className="icons flex-three">
                      <i className="icon-autodeal-km1" />
                      {/* Dynamic Mileage */}
                      <span>{kmToMiles(carItem.mileage).toLocaleString()} Miles</span>
                    </div>
                    <div className="icons flex-three">
                      <i className="icon-autodeal-diesel" />
                      {/* Dynamic Fuel Type */}
                      <span>{carItem.fuel_type || "N/A"}</span>
                    </div>
                    <div className="icons flex-three">
                      <i className="icon-autodeal-automatic" />
                      {/* Dynamic Transmission */}
                      <span>{carItem.transmission || "N/A"}</span>
                    </div>
                    <div className="icons flex-three">
                      <i className="icon-autodeal-owner" />
                      {/* Dynamic Year/Condition */}
                      <span>
                        {carItem.years} | {carItem.condition}
                      </span>
                    </div>
                  </div>

                  {/* Dynamic Price */}
                  <div className="money text-color-3 font">
                    £{formatNum(carItem.price)}
                  </div>

                  <div className="price-wrap flex">
                    <p className="fs-12 lh-16 text-color-2">
                      Make & Model:
                      <span className="fs-14 fw-5 font ml-1">
                        {carItem.brand} {carItem.model}
                      </span>
                    </p>
                    <p className="fs-12 lh-16 ml-2">Exterior Color: {carItem.exterior_color}</p>
                  </div>
                </div>

                {/* <ul className="action-icon style-1 flex flex-wrap">
                  <li>
                    <a href="#" className="icon">
                      <i className="far fa-share-alt" />
                    </a>
                  </li>
                  <li>
                    <a href="#" className="icon">
                      <i className="far fa-heart" />
                    </a>
                  </li>
                  <li>
                    <a href="#" className="icon">
                      <i className="far fa-sync-alt" />
                    </a>
                  </li>
                </ul> */}
              </div>
            </div>

            <div className="col-lg-12">
              {/* Pass the actual image array to your slider */}
              <Slider3 images={carItem.images} />
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <nav
                id="navbar-example2"
                className="navbar tab-listing-scroll mb-30"
              >
                <ul className="nav nav-pills">
                  <li className="nav-item">
                    <a className="nav-link" href="#scrollspyHeading1">
                      Overview
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#scrollspyHeading2">
                      Specs & features
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#scrollspyHeading3">
                      Location
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#scrollspyHeading4">
                      Loan calculator
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#scrollspyHeading5">
                      Reviews
                    </a>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="col-lg-8">
              <div className="listing-detail-wrap">
                <div className="row">
                  <div className="col-lg-12">
                    <div
                      data-bs-spy="scroll"
                      data-bs-target="#navbar-example2"
                      data-bs-offset={0}
                      className="scrollspy-example"
                      tabIndex={0}
                    >
                      {/* Dynamic Description Component */}
                      <div className="listing-description mb-40">
                        <div className="tfcl-listing-header">
                          <h2>Description</h2>
                        </div>
                        <Description content={carItem.description} />
                      </div>

                      {/* Dynamic Overview Component */}
                      <div
                        className="listing-description footer-col-block"
                      
                      >
                        <div className="footer-heading-desktop">
                          <h2>Car overview</h2>
                        </div>
                        <div className="footer-heading-mobie listing-details-mobie">
                          <h2>Car overview</h2>
                        </div>
                        <Overview data={carItem} />
                      </div>

                      <div className="listing-line" />

                      {/* Dynamic Features Component */}
                      <div
                        className="listing-features footer-col-block"
                        id="scrollspyHeading2"
                      >
                        <div className="footer-heading-desktop">
                          <h2>Features</h2>
                        </div>
                        <div className="footer-heading-mobie  listing-details-mobie mb-30">
                          <h2>Features</h2>
                        </div>
                        <Features features={carItem.features} />
                      </div>

                      <div className="listing-line" />

                      <div
                        className="listing-calculator loan-calculator-form pd-0"
                        id="scrollspyHeading4"
                      >
                        <div className="box-title">
                          <h2 className="title-ct">Auto Loan Calculator</h2>
                        </div>
                        <LoanCalculator price={carItem.price} />
                      </div>

                      <div className="listing-line" />

                      {/* Dynamic Location & Map */}
                      <div className="listing-location" id="scrollspyHeading3">
                        <div className="box-title">
                          <h2 className="title-ct">Location</h2>
                          <div className="list-icon-pf gap-8 flex-three">
                            <i className="far fa-map" />
                            <p className="font-1">{carItem.full_address}</p>
                          </div>
                        </div>
                        <iframe
                          className="map-content"
                          src={`https://maps.google.com/maps?q=${encodeURIComponent(carItem.full_address || "")}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                          allowFullScreen=""
                          loading="lazy"
                        />
                      </div>

                      <div className="listing-line" />

                      <div
                        className="listing-reviews flat-property-detail"
                        id="scrollspyHeading5"
                      >
                        <div className="box-title">
                          <h2 className="title-ct">
                            Car User Reviews & Rating
                          </h2>
                        </div>
                        <CarReview carId={carItem.id} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="overlay-siderbar-mobie" />
              <div className="listing-sidebar">
                <div className="widget-listing mb-30">
                  {/* Pass the user/seller data from the API */}
                  <ProfileInfo seller={carItem.user} />
                </div>
                <div className="list-icon-pf gap-8 flex-three mb-40">
                  <i className="far fa-flag" />
                  <p className="font-1">Report this listing</p>
                </div>
                <div className="widget-listing">
                  <div className="listing-header mb-30">
                    <h3>Recommended Used Cars</h3>
                  </div>
                  {/* Pass the current ID to exclude it from recommendations */}
                  <Recommended currentId={carItem.id} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <SidebarToggleButton />
    </>
  );
}
