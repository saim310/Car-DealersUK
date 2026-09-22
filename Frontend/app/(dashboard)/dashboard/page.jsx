import DashBoard from "@/components/dashboard/DashBoard";
import Sidebar from "@/components/dashboard/Sidebar";
import Header4 from "@/components/headers/Header4";
import React from "react";

export const metadata = {
  title: "Dashboard || UKA Car Trade",
  description: "Manage your UKA Car Trade dashboard",
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
        <DashBoard />
      </div>
    </>
  );
}
