import CarsReview from "@/components/dashboard/CarsReview";
import Sidebar from "@/components/dashboard/Sidebar";
import Header4 from "@/components/headers/Header4";
import React from "react";

export const metadata = {
  title: "Cars Review saasasas  || UKA Car Trade",
  description: "Car reviews from customers on UKA Car Trade",
};

export default function page() {
  return (
    <>
      <Sidebar />
      <div id="wrapper-dashboard">
        <div id="pagee" className="clearfix">
          <Header4 />
        </div>
        <div id="themesflat-content"></div>
        <div className="dashboard-toggle">Show DashBoard</div>
        <CarsReview />
      </div>
    </>
  );
}
