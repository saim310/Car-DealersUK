"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import useFetch from "@/hooks/useFetch";
import { kmToMiles } from "@/utils/exports";

const carTypes = ["All", "SUV", "Hatchback", "Sedan", "MUV"];

export default function Cars() {
  // Fetch dynamic listings from your API
  const { data: carListings = [], loading } = useFetch("/listings", {
    immediate: true,
  });

  const [selectedType, setSelectedType] = useState(carTypes[0]);

  // Use useMemo to filter the fetched data based on the selected body type
  const filtered = useMemo(() => {
    if (selectedType === "All") {
      return carListings;
    }
    // Matching the 'type' field from your database (e.g., SUV, Sedan)
    return carListings.filter(
      (el) => el.type?.toLowerCase() === selectedType.toLowerCase(),
    );
  }, [carListings, selectedType]);

  if (loading)
    return <div className="text-center p-5">Loading Vehicles...</div>;

  return (
    <section className="tf-section3">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="heading-section flex align-center justify-space flex-wrap gap-20">
              <h2 className="wow fadeInUpSmall" data-wow-delay="0.2s">
                Used Cars By Body Type
              </h2>
              <Link href={`/listing-grid`} className="tf-btn-arrow">
                View all
                <i className="icon-autodeal-btn-right" />
              </Link>
            </div>
          </div>
          <div className="col-lg-12">
            <div className="flat-tabs themesflat-tabs">
              <div className="box-tab center">
                <ul className="menu-tab tab-title style flex">
                  {carTypes.map((type, index) => (
                    <li
                      key={index}
                      onClick={() => setSelectedType(type)}
                      className={`item-title ${
                        selectedType === type ? "active" : ""
                      }`}
                    >
                      <h5 className="inner">{type}</h5>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="content-tab">
                <div className="content-inner tab-content">
                  <div className="list-car-grid-4 gap-30">
                    {filtered.map((elm, i) => (
                      <div key={elm.id || i} className="box-car-list hv-one">
                        <div className="image-group relative">
                          <div className="top flex-two">
                            <ul className="d-flex gap-8">
                              <li className="flag-tag success">
                                {elm.condition || "Used"}
                              </li>
                              <li className="flag-tag style-1">
                                <div className="icon">
                                  <svg width={16} height={13} fill="none">
                                    <path
                                      d="M1.5 9L4.93 5.56M2.5 11.5H13.5"
                                      stroke="white"
                                      strokeWidth="1.5"
                                    />
                                  </svg>
                                </div>
                                {elm.images?.length || 0}
                              </li>
                            </ul>
                            <div className="year flag-tag">{elm.years}</div>
                          </div>

                          {/* Interaction Icons */}
                          <div className="img-style">
                            <Image
                              className="lazyload"
                              alt={elm.listing_title}
                              // Using the first image from your API's images array
                              src={
                                elm.images?.[0] ||
                                "/assets/images/placeholder-car.jpg"
                              }
                              width={450}
                              height={338}
                              style={{ objectFit: "cover" }}
                            />
                          </div>
                        </div>

                        <div className="content">
                          <div className="text-address">
                            <p className="text-color-3 font">{elm.type}</p>
                          </div>
                          <h5 className="link-style-1">
                            <Link href={`/listing-detail-v3/${elm.id}`}>
                              {elm.listing_title}
                            </Link>
                          </h5>
                          <div className="icon-box flex flex-wrap">
                            <div className="icons flex-three">
                              <i className="icon-autodeal-km1" />
                              <span>
                                {kmToMiles(elm.mileage).toLocaleString()} Miles
                              </span>
                            </div>
                            <div className="icons flex-three">
                              <i className="icon-autodeal-diesel" />
                              <span>{elm.fuel_type}</span>
                            </div>
                            <div className="icons flex-three">
                              <i className="icon-autodeal-automatic" />
                              <span>{elm.transmission}</span>
                            </div>
                          </div>
                        
                          <div className="money fs-20 fw-5 lh-25 text-color-3">
                            ${Number(elm.price).toLocaleString()}
                          </div>
                          <div className="days-box flex justify-space align-center">
                            <div className="img-author d-flex align-items-center">
                              <div
                                className="rounded-circle bg-light border d-flex align-items-center justify-content-center"
                                style={{ width: 32, height: 32 }}
                              >
                                <i className="icon-user text-muted" />
                              </div>
                              <span className="font text-color-2 fw-5 ms-2">
                                Dealer
                              </span>
                            </div>
                            <Link
                              href={`/listing-detail-v3/${elm.id}`}
                              className="view-car"
                            >
                              View car
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
