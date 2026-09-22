"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import useFetch from "@/hooks/useFetch"; // Your custom hook
import { kmToMiles } from "@/utils/exports";

const priceRanges = [
  { title: "All Budget Cars", isActive: true, range: null },
  {
    title: "$50.000 - $70.000",
    isActive: false,
    range: { min: 50000, max: 70000 },
  },
  {
    title: "$70.000 - $90.000",
    isActive: false,
    range: { min: 70000, max: 90000 },
  },
  {
    title: "$90.000 - $100.000",
    isActive: false,
    range: { min: 90000, max: 100000 },
  },
];

export default function Cars3() {
  const [filtered, setFiltered] = useState([]);
  const [selectedRange, setSelectedRange] = useState(priceRanges[0]);

  // 1. Fetch live listings from your backend
  const { data: liveCars, loading } = useFetch("/listings", {
    immediate: true,
  });

  // 2. Main Budget Filtering Logic
  useEffect(() => {
    if (!liveCars) return;

    if (selectedRange.range) {
      const results = liveCars.filter(
        (car) =>
          Number(car.price) >= selectedRange.range.min &&
          Number(car.price) <= selectedRange.range.max,
      );
      setFiltered(results);
    } else {
      setFiltered(liveCars);
    }
  }, [selectedRange, liveCars]);

  return (
    <section className="tf-section3">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="heading-section flex align-center justify-space flex-wrap gap-20">
              <h2 className="wow fadeInUpSmall" data-wow-delay="0.2s">
                Used Cars by Budget
              </h2>
              <Link href="/listing-grid2" className="tf-btn-arrow">
                View all
                <i className="icon-autodeal-btn-right" />
              </Link>
            </div>
          </div>

          <div className="col-lg-12">
            <div className="flat-tabs themesflat-tabs">
              <div className="box-tab center">
                <ul className="menu-tab tab-title style flex">
                  {priceRanges.map((item, index) => (
                    <li
                      key={index}
                      className={`item-title ${item === selectedRange ? "active" : ""}`}
                      onClick={() => setSelectedRange(item)}
                    >
                      <h5 className="inner">{item.title}</h5>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="content-tab">
                <div className="content-inner tab-content">
                  {loading ? (
                    <div className="text-center py-5">
                      Checking budget options...
                    </div>
                  ) : (
                    <div className="list-car-grid-2">
                      {filtered.slice(0, 4).map((car, i) => (
                        <div
                          key={car.id || i}
                          className="box-car-list style-2 style-dark hv-one"
                        >
                          <div className="image-group relative">
                            {/* <div className="top flex-two">
                              <ul className="d-flex gap-8">
                                <li className="flag-tag success">Featured</li>
                                <li className="flag-tag style-1">
                                  <div className="icon">
                                    <i className="far fa-image text-white" />
                                  </div>
                                  {car.images?.length || 0}
                                </li>
                              </ul>
                              <div className="year flag-tag">{car.years}</div>
                            </div> */}

                            <div className="img-style">
                              <Image
                                className="lazyload object-cover"
                                alt={car.listing_title}
                                src={
                                  car.images?.[0] ||
                                  "/assets/images/placeholder.jpg"
                                }
                                width={450}
                                height={338}
                              />
                            </div>
                          </div>

                          <div className="content">
                            <div className="text-address">
                              <p className="text-color-3 font">{car.type}</p>
                            </div>
                            <h5 className="link-style-1">
                              <Link href={`/listing-detail-v3/${car.id}`}>
                                {car.listing_title}
                              </Link>
                            </h5>

                            <div className="icon-box flex flex-wrap">
                              <div className="icons flex-three">
                                <i className="icon-autodeal-km1" />
                                <span>
                                  {kmToMiles(car.mileage).toLocaleString()} Miles
                                </span>
                              </div>
                              <div className="icons flex-three">
                                <i className="icon-autodeal-diesel" />
                                <span>{car.fuel_type}</span>
                              </div>
                              <div className="icons flex-three">
                                <i className="icon-autodeal-automatic" />
                                <span>{car.transmission}</span>
                              </div>
                            </div>
    <hr />
                            <div className="money fs-20 fw-5 lh-25 text-color-3">
                              ${Number(car.price).toLocaleString()}
                            </div>

                            <div className="days-box flex justify-space align-center">
                              <div className="img-author">
                                <span className="font text-color-2 fw-5">
                                  {car.brand} {car.model}
                                </span>
                              </div>
                              <Link
                                href={`/listing-detail-v3/${car.id}`}
                                className="view-car"
                              >
                                View car
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {!loading && filtered.length === 0 && (
                    <div className="text-center py-5">
                      <p>No vehicles found in this price range.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
