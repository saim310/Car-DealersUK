import Cars5 from "@/components/carsListings/Cars5";
import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import React from "react";

export const metadata = {
  title: "Car Listings Map || UKA Car Trade",
  description: "View our car listings on map at UKA Car Trade",
};
export default function page() {
  return (
    <>
      <div className="header-fixed">
        <Header2 />
      </div>
      <Cars5 />
      <Footer1 />
    </>
  );
}
