import DashboardTestimonials from "@/components/dashboard/DashboardTestimonials";
import Sidebar from "@/components/dashboard/Sidebar";
import Header4 from "@/components/headers/Header4";
import React from "react";

export const metadata = {
  title: "Testimonials || UKA Car Trade",
  description: "Manage customer testimonials and reviews",
};

export default function TestimonialsPage() {
  return (
    <>
      <Sidebar />
      <div id="wrapper-dashboard">
        <div id="pagee" className="clearfix">
          <Header4 />
        </div>
        <div id="themesflat-content"></div>
        <div className="dashboard-toggle">Show DashBoard</div>
        <DashboardTestimonials />
      </div>
    </>
  );
}
