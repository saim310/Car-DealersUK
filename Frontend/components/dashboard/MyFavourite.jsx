"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import useFetch from "@/hooks/useFetch";
import DropdownSelect from "../common/DropDownSelect";
import Pagination2 from "../common/Pagination2";
import { getImageUrl, kmToMiles } from "@/utils/exports";

export default function MyFavourite() {
  // Fetch the data from your backend
  const { data: backendListings, loading } = useFetch("/listings");
  const [favoriteCars, setFavoriteCars] = useState([]);

  // Map the backend data to fit your UI
  useEffect(() => {
    if (backendListings) {
      const mapped = backendListings.map((item) => ({
        id: item.id,
        year: item.years || item.year,
        type: item.type || "Sedan",
        title: item.listing_title || item.title,
        km: parseInt(item.mileage) || 0,
        fuelType: item.fuel_type || "N/A",
        transmission: item.transmission || "N/A",
        price: parseFloat(item.price) || 0,
        // Safely resolve the image URL
        imgSrc: getImageUrl(item.images && item.images.length > 0 ? item.images[0] : null),
        authorName: item.authorName || "Admin",
        authorImage: item.authorImage || "/assets/images/author/8.png",
      }));

      setFavoriteCars(mapped);
    }
  }, [backendListings]);

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div className="content-area">
            <main id="main" className="main-content">
              <div className="tfcl-dashboard">
                <h1 className="admin-title mb-3">My favorite</h1>
                <div className="tfcl-favorite-listing">
                  <div className="controller-sorting mb-3">
                    <div className="count-list">
                      {/* Dynamically display the correct number of cars */}
                      <span>{favoriteCars.length}</span> Car listing
                    </div>
                    <div className="sorting-input">
                      <div className="label">Sort By</div>
                      <DropdownSelect
                        addtionalParentClass="form-control"
                        options={["Newest", "New", "Old"]}
                      />
                    </div>
                  </div>

                  <div className="wrap-favorite-listing">
                    {loading ? (
                      <p style={{ padding: "20px" }}>
                        Loading your favorite cars...
                      </p>
                    ) : favoriteCars.length === 0 ? (
                      <p style={{ padding: "20px" }}>
                        You haven't favorited any cars yet.
                      </p>
                    ) : (
                      favoriteCars.map((car, i) => (
                        <div key={car.id || i} className="box-car-list hv-one">
                          <div className="image-group relative">
                            <div className="img-style">
                              <Image
                                className="lazyload"
                                alt={car.title}
                                src={car.imgSrc}
                                width={450}
                                height={338}
                                style={{
                                  objectFit: "cover",
                                  width: "100%",
                                  height: "auto",
                                }}
                              />
                            </div>
                          </div>
                          <div className="content">
                            <div className="text-address">
                              <p className="text-color-3 font">{car.type}</p>
                            </div>
                            <h5 className="link-style-1">
                              <Link href={`/listing-detail-v1/${car.id}`}>
                                {car.title}
                              </Link>
                            </h5>
                            <div className="icon-box flex flex-wrap">
                              <div className="icons flex-three">
                                <i className="icon-autodeal-km1" />
                                <span>{kmToMiles(car.km).toLocaleString()} Miles</span>
                              </div>
                              <div className="icons flex-three">
                                <i className="icon-autodeal-diesel" />
                                <span>{car.fuelType}</span>
                              </div>
                              <div className="icons flex-three">
                                <i className="icon-autodeal-automatic" />
                                <span>{car.transmission}</span>
                              </div>
                            </div>
                            <hr />
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <div className="money fs-20 fw-5 lh-25 text-color-3">
                                £{car.price?.toLocaleString()}
                              </div>
                              <div>
                                <Link
                                  href={`/listing-detail-v1/${car.id}`}
                                  className="view-car"
                                >
                                  View car
                                </Link>
                              </div>
                            </div>
                            {/* <div className="days-box flex justify-space align-center">
                              {/* <div className="img-author">
                                <Image
                                  className="lazyload"
                                  alt={car.authorName}
                                  src={car.authorImage}
                                  width={40} // Scaled down the avatar width so it fits better
                                  height={40}
                                  style={{
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                  }}
                                />
                                <span className="font text-color-2 fw-5 ml-2">
                                  {car.authorName}
                                </span>
                              </div> 
                              <Link
                                href={`/listing-detail-v1/${car.id}`}
                                className="view-car"
                              >
                                View car
                              </Link>
                            </div> */}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Only show pagination if there are cars */}
                  {favoriteCars.length > 0 && (
                    <div className="themesflat-pagination clearfix mt-40">
                      <ul>
                        <Pagination2 />
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
