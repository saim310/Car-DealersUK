import ChangePass from "@/components/dashboard/ChangePass";

import Sidebar from "@/components/dashboard/Sidebar";
import Header4 from "@/components/headers/Header4";
import React from "react";

export const metadata = {
  title: "Change Password || UKA Car Trade",
  description: "Change your password on UKA Car Trade",
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
        <ChangePass />
      </div>
    </>
  );
}
