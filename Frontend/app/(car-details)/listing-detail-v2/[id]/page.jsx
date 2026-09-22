"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import Header2 from "@/components/headers/Header2";
import Footer1 from "@/components/footers/Footer1";
import CarDetails2 from "@/components/carDetails/CarDetails2";
import useFetch from "@/hooks/useFetch";

export default function Page({ params }) {
  const carId = params.id;

  // 1. Setup the dynamic API endpoint
  const endpoint = useMemo(() => `/listings/${carId}`, [carId]);

  // 2. Fetch the car data
  const {
    data: carItem,
    loading,
    error,
  } = useFetch(endpoint, {
    immediate: true,
  });

  // 3. Loading State (Centered for better UI)
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading car details...</span>
        </div>
      </div>
    );
  }

  // 4. Error/Not Found State
  if (error || !carItem) {
    return (
      <div className="text-center py-5 mt-100">
        <h3>Car not found</h3>
        <Link href="/my-listing" className="text-color-3 underline">
          Return to listings
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
                  <span>
                    {carItem.brand} {carItem.model}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Passing the fetched car object to the component */}
      <CarDetails2 carItem={carItem} />

      <Footer1 />
    </>
  );
}
