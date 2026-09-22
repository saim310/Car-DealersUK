import React from 'react'
import BlogManagement from '@/components/dashboard/BlogManagement';
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
     <BlogManagement />
        </div>
        </div>
      
  )
}

export default page