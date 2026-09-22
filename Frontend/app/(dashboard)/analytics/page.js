import Sidebar from "@/components/dashboard/Sidebar";
import Header4 from "@/components/headers/Header4";
import AnalyticsDashboard from "@/components/dashboard/AnalyticsDashboard";
import React from "react";

export const metadata = {
  title: "Analytics Dashboard || UKA Car Trade",
  description: "Track website traffic and property engagement.",
};

export default function page() {
  return (
    <>
      <Sidebar />
      <div id="wrapper-dashboard">
        <div id="pagee" className="clearfix">
          <Header4 />
        </div>
        <div className="dashboard-toggle">Show DashBoard</div>
        <AnalyticsDashboard />
      </div>
    </>
  );
}
