import React from 'react'
import ContactMessages from '@/components/dashboard/ContactMessages'
import Sidebar from "@/components/dashboard/Sidebar";
import Header4 from "@/components/headers/Header4";

function page() {
  return (
    <div>

  <Sidebar />
       <div id="wrapper-dashboard">
         <div id="pagee" className="clearfix">
           <Header4 />
         </div>
         <div id="themesflat-content"></div>
         <div className="dashboard-toggle">Show DashBoard</div>
         <ContactMessages />
       </div>
        </div>
  )
}

export default page