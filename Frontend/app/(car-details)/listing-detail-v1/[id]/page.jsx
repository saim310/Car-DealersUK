"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import Header2 from "@/components/headers/Header2";
import Footer1 from "@/components/footers/Footer1";
import CarDetails1 from "@/components/carDetails/CarDetails1";
import useFetch from "@/hooks/useFetch"; // Assuming this is the same hook from your first code

export default function Page({ params }) {
  const carId = params.id;

  // 1. Define the dynamic endpoint
  const endpoint = useMemo(() => `/listings/${carId}`, [carId]);

  // 2. Fetch the actual data from your API
  const {
    data: carData,
    loading,
    error,
  } = useFetch(endpoint, {
    immediate: true,
  });

  // 3. Handle Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading car details...</p>
      </div>
    );
  }

  // 4. Handle Error or Not Found
  if (error || !carData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h3>Listing not found</h3>
        <Link href="/my-listing" className="btn-primary">
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
                  {/* <i className="fa fa-angle-right" /> */}
                  <span>
                    {carData.brand} {carData.model}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pass the fetched data directly to your component if needed, 
          or let the component handle its own internal fetch using carId */}
      <CarDetails1 carId={carId} initialData={carData} />

      <Footer1 />
    </>
  );
}
