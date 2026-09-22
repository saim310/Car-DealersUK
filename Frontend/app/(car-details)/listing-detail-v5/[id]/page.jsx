"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import Header2 from "@/components/headers/Header2";
import Footer1 from "@/components/footers/Footer1";
import CarDetails5 from "@/components/carDetails/CarDetails5";
import useFetch from "@/hooks/useFetch";

export default function Page({ params }) {
  const carId = params.id;

  // 1. Point to your API endpoint for the specific car ID
  const endpoint = useMemo(() => `/listings/${carId}`, [carId]);

  // 2. Fetch the live data
  const {
    data: carItem,
    loading,
    error,
  } = useFetch(endpoint, {
    immediate: true,
  });

  // 3. Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading car data...</span>
        </div>
      </div>
    );
  }

  // 4. Error or Not Found State
  if (error || !carItem) {
    return (
      <div className="text-center py-5 mt-100">
        <h3>Listing not found</h3>
        <p>This car might no longer be available.</p>
        <Link href="/my-listing" className="text-color-3 underline">
          Back to Listings
        </Link>
      </div>
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
                  <Link className="home fw-6 text-color-3" href="/">
                    Home
                  </Link>
                  {/* <i className="fa fa-angle-right mx-2" /> */}
                  {/* Dynamic brand/model breadcrumb */}
                  <span>
                    {carItem.brand} {carItem.model}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Passing the fetched API data to the component */}
      <CarDetails5 carItem={carItem} />

      <Footer1 />
    </>
  );
}
