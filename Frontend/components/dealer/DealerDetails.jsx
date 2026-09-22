"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import AgentList from "./AgentList";
import Cars from "./Cars";
import Review from "./Review";

export default function DealerDetails({ dealerItem }) {
  // Guard clause
  if (!dealerItem) return null;

  return (
    <section className="tf-section3 listing-detail style-1">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 col-md-12">
            <div className="features-thumb mb-4">
              <Image
                alt={dealerItem.title}
                // Fallback image if dealer doesn't have a banner
                src={
                  dealerItem.imgSrc ||
                  "/assets/images/dashboard/single-dealer.jpg"
                }
                width={830}
                height={467}
                className="object-cover rounded"
              />
            </div>

            <h2 className="title mb-3">{dealerItem.title}</h2>

            <p className="mb-2">
              {dealerItem.description ||
                `Welcome to ${dealerItem.title}. We are dedicated to providing the best automotive experience, offering a wide range of quality vehicles and professional servicing to meet all your driving needs.`}
            </p>

            <div className="tf-sale-agent-list mt-40">
              <h2 className="mb-3">Sale agent list</h2>
              <AgentList dealerId={dealerItem.id} />
              <Link href="#" className="fs-16 fw-5 font text-color-3 lh-22">
                View all sale agents <i className="icon-autodeal-view-more" />
              </Link>
            </div>

            <div className="tf-list-car-agent mt-40">
              <h2 className="mb-3">Dealership inventory</h2>
              {/* This component now fetches live data */}
              <Cars dealerId={dealerItem.id} />
              <Link href="/cars" className="fs-16 fw-5 font text-color-3 lh-22">
                View all cars <i className="icon-autodeal-view-more" />
              </Link>
            </div>

            <h2 className="mb-12 mt-40">{dealerItem.title} Servicing</h2>
            <p className="mb-3">
              Check out what {dealerItem.title} serves their customers.
            </p>

            <div className="widget-book-apoint">
              <h3>Book an appointment</h3>
              <p className="mb-3">
                Interested in this dealership? Leave your contact details to
                schedule a visit or service.
              </p>
              <Link href="#" className="btn-book">
                Book an appointment with Dealership
              </Link>
            </div>

            <div
              className="listing-reviews dealer-review flat-property-detail"
              id="scrollspyHeading5"
            >
              <div className="box-title mb-30">
                <h2 className="title-ct">Dealer Reviews & Rating</h2>
              </div>
              <Review dealerId={dealerItem.id} />
            </div>
          </div>

          <div className="col-lg-4 col-md-12">
            <div className="dealer-sidebar">
              <div className="widget-dealer-contact mb-4">
                <h1 className="fs-24 mb-2">{dealerItem.title}</h1>
                <ul className="list-authencation mb-4">
                  <li>
                    <i className="icon-autodeal-check" /> Certified seller
                  </li>
                  <li>
                    <i className="icon-autodeal-check" /> Verified contact
                  </li>
                </ul>

                <div className="open-store">
                  <h6>Business hours</h6>
                  <ul>
                    <li>
                      <span className="left">Mon - Fri:</span>
                      <span className="right">
                        {dealerItem.weekdayHours || "09:00 AM - 06:00 PM"}
                      </span>
                    </li>
                    <li>
                      <span className="left">Sat - Sun:</span>
                      <span className="right">
                        {dealerItem.weekendHours || "10:00 AM - 04:00 PM"}
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="rating">
                  <div className="content-left">
                    <p>{dealerItem.reviewCount || 0} Reviews</p>
                  </div>
                  <div className="content-right">
                    <div className="overall-rating-detail-star">
                      {[...Array(5)].map((_, index) => (
                        <i
                          key={index}
                          className={`icon-autodeal-star ${index < (dealerItem.rating || 5) ? "" : "disabled"}`}
                        />
                      ))}
                      <span>
                        <b>{dealerItem.rating || 5}</b>/5
                      </span>
                    </div>
                  </div>
                </div>

                <Link href="#" className="button-form-1">
                  Get quote
                </Link>
                <Link href="#" className="button-form-2">
                  Request test drive
                </Link>
              </div>

              {/* Social Sharing */}
              <div className="social-listing flex-wrap mb-4">
                <p>Share {dealerItem.title}:</p>
                <div className="icon-social style1">
                  <Link href="https://www.facebook.com/ukajapan">
                    <i className="icon-autodeal-facebook" />
                  </Link>
                  <Link href="#">
                    <i className="icon-autodeal-linkedin" />
                  </Link>
                  <Link href="#">
                    <i className="icon-autodeal-twitter" />
                  </Link>
                </div>
              </div>

              {/* Dynamic Map */}
              <div className="widget-dealer-map mb-4">
                <h3 className="mb-3">Location</h3>
                <div className="address-dealer mb-3">
                  <i className="far fa-map-marker-alt mr-2" />
                  {dealerItem.location || "Address not specified"}
                </div>
                <iframe
                  className="map-content rounded"
                  style={{ width: "100%", height: "200px", border: 0 }}
                  src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(dealerItem.location || "")}`}
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
