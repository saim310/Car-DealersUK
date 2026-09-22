"use client";

import useFetch from "@/hooks/useFetch";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { kmToMiles } from "@/utils/exports";

export default function Cars() {
  // 1. Fetch live listings from your API
  const { data: listings, loading } = useFetch("/listings", {
    immediate: true,
  });

  if (loading) return <p className="text-center">Loading featured cars...</p>;
  if (!listings || listings.length === 0) return null;

  // 2. Maintaining the slice logic (displaying 3 items starting from index 3)
  const displayCars = listings.slice(3, 6);

  return (
    <>
      {displayCars.map((car, i) => (
        <div key={car.id || i} className="box-car-list style-2 hv-one mb-3">
          <div className="image-group relative">
            {/* <div className="top flex-two">
              <ul className="d-flex gap-8">
                <li className="flag-tag success">Featured</li>
                <li className="flag-tag style-1">
                  <div className="icon">
                    <i className="far fa-image text-white" />
                  </div>
                  {/* Dynamic image count if available
                  {car.images?.length || 0}
                </li>
              </ul>
              <div className="year flag-tag">{car.years}</div>
            </div> */}

            <ul className="change-heart flex">
              <li className="box-icon w-32">
                <Link href="/compare" className="icon">
                  <i className="far fa-sync-alt" />
                </Link>
              </li>
              <li className="box-icon w-32">
                <Link href="/my-favorite" className="icon">
                  <i className="far fa-heart" />
                </Link>
              </li>
            </ul>

            <div className="img-style">
              <Image
                className="lazyload object-cover"
                alt={car.listing_title}
                // Use the first image from the database array
                src={car.images?.[0] || "/assets/images/placeholder.jpg"}
                width={615}
                height={462}
              />
            </div>
          </div>

          <div className="content">
            <div className="text-address">
              <p className="text-color-3 font">{car.type}</p>
            </div>
            <h5 className="link-style-1">
              <Link href={`/listing-detail-v2/${car.id}`}>
                {car.listing_title}
              </Link>
            </h5>

            <div className="icon-box flex flex-wrap">
              <div className="icons flex-three">
                <i className="icon-autodeal-km1" />
                <span>{kmToMiles(car.mileage).toLocaleString()} Miles</span>
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
                {/* Fallback to brand name if author image is missing in your new schema */}
                <span className="font text-color-2 fw-5">
                  {car.brand} {car.model}
                </span>
              </div>
              <Link href={`/listing-detail-v2/${car.id}`} className="view-car">
                View car
              </Link>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
