"use client";

import React from "react";
import { kmToMiles } from "@/utils/exports";
import Slider2 from "./sliders/Slider2";
import Description from "./detailComponents/Description";
import Overview from "./detailComponents/Overview";
import Features from "./detailComponents/Features";
import LoanCalculator from "./detailComponents/LoanCalculator";
import CarReview from "./detailComponents/CarReview";
import ProfileInfo from "./detailComponents/ProfileInfo";
import Recommended from "./detailComponents/Recommended";
import SidebarToggleButton from "./SidebarToggleButton";

export default function CarDetails2({ carItem }) {
  // Fallback if carItem is not provided yet
  if (!carItem) return null;

  // Helper to format currency or numbers safely
  const formatNumber = (num) => {
    return num ? Number(num).toLocaleString() : "0";
  };

    console.log("car items Cars:", carItem);


  return (
    <>
      <section className="tf-section3 listing-detail style-2">
        <div className="container">
          <div className="row">
            <div className="heading-widget flex-one mb-20 flex-wrap gap-8">
              <div className="inner">
                {/* Dynamic Title */}
                <h1 className="title">{carItem.listing_title}</h1>

                <div className="icon-box flex flex-wrap">
                  <div className="icons flex-three gap-8">
                    <i className="icon-autodeal-km1" />
                    {/* Dynamic Mileage */}
                    <span>{kmToMiles(carItem.mileage).toLocaleString()} Miles</span>
                  </div>
                  <div className="icons flex-three gap-8">
                    <i className="icon-autodeal-diesel" />
                    {/* Dynamic Fuel Type */}
                    <span>{carItem.fuel_type || "N/A"}</span>
                  </div>
                  <div className="icons flex-three gap-8">
                    <i className="icon-autodeal-automatic" />
                    {/* Dynamic Transmission */}
                    <span>{carItem.transmission || "N/A"}</span>
                  </div>
                  <div className="icons flex-three gap-8">
                    <i className="icon-autodeal-owner" />
                    {/* Dynamic Year/Condition */}
                    <span>
                      {carItem.years} | {carItem.condition}
                    </span>
                  </div>
                </div>

                {/* Dynamic Price */}
                <div className="money text-color-3 font">
                  £{formatNumber(carItem.price)}
                </div>

                <div className="price-wrap flex">
                  <p className="fs-12 lh-16 text-color-2">
                    Model:
                    <span className="fs-14 fw-5 font ml-1">
                      {carItem.brand} {carItem.model}
                    </span>
                  </p>
                  <p className="fs-12 lh-16">Exterior Color: {carItem.exterior_color}</p>
                </div>
              </div>

              {/* Action Icons (Share/Favorite/Compare) */}
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
        </div>

        {/* Passing Images to Slider - assuming carItem.images is an array of URLs */}
        <div className="container-fluid">
          <Slider2 images={carItem.images} />
        </div>

        <div className="container">
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
                      {/* Dynamic Description */}
                      <div className="listing-description mb-40 widget-listing box-sd">
                        <div className="tfcl-listing-header">
                          <h2>Description</h2>
                        </div>
                        <Description content={carItem.description} />
                      </div>

                      {/* Dynamic Overview */}
                      <div
                        className="listing-description widget-listing box-sd mb-30 footer-col-block"
                        id="scrollspyHeading1"
                      >
                        <div className="footer-heading-desktop">
                          <h2>Car overview</h2>
                        </div>
                        <Overview data={carItem} />
                      </div>

                      {/* Dynamic Features */}
                      <div
                        className="listing-features widget-listing box-sd mb-30 footer-col-block"
                        id="scrollspyHeading2"
                      >
                        <div className="footer-heading-desktop">
                          <h2>Features</h2>
                        </div>
                        <Features features={carItem.features} />
                      </div>

                      <div
                        className="listing-calculator loan-calculator-form widget-listing box-sd mb-30"
                        id="scrollspyHeading4"
                      >
                        <div className="box-title">
                          <h2 className="title-ct">Auto Loan Calculator</h2>
                        </div>
                        <LoanCalculator price={carItem.price} />
                      </div>

                      {/* Dynamic Location */}
                      <div
                        className="listing-location widget-listing box-sd mb-30"
                        id="scrollspyHeading3"
                      >
                        <div className="box-title">
                          <h2 className="title-ct">Location</h2>
                          <div className="list-icon-pf gap-8 flex-three">
                            <i className="far fa-map" />
                            <p className="font-1">{carItem.full_address}</p>
                          </div>
                        </div>
                        {/* If you have lat/lng you can make the map dynamic here */}
                        <iframe
                          className="map-content"
                          src={`https://maps.google.com/maps?q=${encodeURIComponent(carItem.full_address)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                          allowFullScreen=""
                          loading="lazy"
                        />
                      </div>

                      <div
                        className="listing-reviews flat-property-detail widget-listing box-sd mb-30"
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
                <div className="widget-listing mb-30 box-sd">
                  {/* Pass seller info if available in carItem */}
                  <ProfileInfo seller={carItem.user} />
                </div>
                <div className="list-icon-pf gap-8 flex-three mb-40">
                  <i className="far fa-flag" />
                  <p className="font-1">Report this listing</p>
                </div>
                <div className="widget-listing box-sd">
                  <div className="listing-header mb-30">
                    <h3>Recommended Used Cars</h3>
                  </div>
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
