import HeroSection from '@/components/dashboard/Home/HeroSection'
import BrandAdmin from '@/components/dashboard/Home/BrandAdmin'
import React from 'react'
import Sidebar from "@/components/dashboard/Sidebar";
import Header4 from "@/components/headers/Header4";
import FooterAdmin from '@/components/dashboard/Footer';



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
        <HeroSection/>
        <BrandAdmin />
        <FooterAdmin/>
        </div>
        </div>

  )
}

export default page