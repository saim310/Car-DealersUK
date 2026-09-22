"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import useFetch from "@/hooks/useFetch"; // Use your dynamic fetch hook
import { kmToMiles } from "@/utils/exports";

const carTypes = ["All", "SUV", "Hatchback", "Sedan", "MUV"];

export default function Cars() {
  const [selectedType, setSelectedType] = useState(carTypes[0]);
  const [filtered, setFiltered] = useState([]);

  // 1. Fetch live listings from your API
  const { data: liveCars, loading } = useFetch("/listings", {
    immediate: true,
  });

  // 2. Main Filtering Logic
  useEffect(() => {
    if (!liveCars) return;

    if (selectedType === "All") {
      setFiltered(liveCars);
    } else {
      // Assuming your API 'type' field matches our 'carTypes' labels
      const filteredResults = liveCars.filter(
        (car) => car.type?.toLowerCase() === selectedType.toLowerCase(),
      );
      setFiltered(filteredResults);
    }
  }, [selectedType, liveCars]);

  return (
    <>
      <style jsx>{`
        .car-title-clamp {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 2.8rem;
          line-height: 1.4;
        }
      `}</style>
      <section className="tf-section3">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="heading-section flex align-center justify-space flex-wrap gap-20">
              <h2 className="wow fadeInUpSmall" data-wow-delay="0.2s">
                Used Cars By Body Type
              </h2>
              <Link href="/listing-grid" className="tf-btn-arrow">
                View all
                <i className="icon-autodeal-btn-right" />
              </Link>
            </div>
          </div>

          <div className="col-lg-12">
            <div className="flat-tabs themesflat-tabs">
              {/* Tab Menu */}
              <div className="box-tab center">
                <ul className="menu-tab tab-title style flex">
                  {carTypes.map((type, index) => (
                    <li
                      key={index}
                      onClick={() => setSelectedType(type)}
                      className={`item-title ${selectedType === type ? "active" : ""}`}
                    >
                      <h5 className="inner">{type}</h5>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="content-tab">
                <div className="content-inner tab-content">
                  {loading ? (
                    <div className="text-center py-5">Loading Vehicles...</div>
                  ) : (
                    <div className="list-car-grid-2">
                      {filtered.slice(0, 4).map((car, i) => (
                        <div
                          key={car.id || i}
                          className="box-car-list style-2 hv-one"
onClick={() => router.push(`/listing-detail-v1/${car.id}`)}
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
                              <Link href={`/listing-detail-v1/${car.id}`}>
                                <span className="car-title-clamp">{car.listing_title}</span>
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
                                href={`/listing-detail-v1/${car.id}`}
                                className="view-car"
                              >
                                View details
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {!loading && filtered.length === 0 && (
                    <div className="text-center py-5">
                      <p>
                        No {selectedType} vehicles found in our current
                        inventory.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
