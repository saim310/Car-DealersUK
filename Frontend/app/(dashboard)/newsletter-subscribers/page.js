import Sidebar from "@/components/dashboard/Sidebar";
import Header4 from "@/components/headers/Header4";
import NewsletterSubscribers from "@/components/dashboard/NewsletterSubscribers";
import React from "react";

export const metadata = {
  title: "Newsletter Subscribers || UKA Car Trade",
  description: "View newsletter subscribers collected from the footer.",
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
        <NewsletterSubscribers />
      </div>
    </>
  );
}
