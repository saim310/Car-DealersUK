import Cars2 from "@/components/carsListings/Cars2";
import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import Link from "next/link";
import React from "react";

export const metadata = {
  title: "All Listing",
  description: "Browse our extensive inventory of quality cars at UKA Car Trade",
};

export default function page() {
  return (
    <>
      <div className="header-fixed">
        <Header2 />
      </div>
      <Cars2 />
      <Footer1 />
    </>
  );
}