import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import Banner from "@/components/common/Banner";
import Blogs from "@/components/common/Blogs";
import Brands from "@/components/common/Brands";
import CarBrands from "@/components/homes/home-1/CarBrands";
import Cars from "@/components/common/Cars";
import Cars2 from "@/components/homes/home-1/Cars2";
import Categories from "@/components/homes/home-1/Categories";
import Filter from "@/components/homes/home-1/Filter";
import Hero from "@/components/homes/home-1/Hero";
import LoanCalculator from "@/components/homes/home-1/LoanCalculator";
import Process from "@/components/homes/home-1/Process";
import Cta from "@/components/common/Cta";
import TopBar from "@/components/homes/home-1/TopBar";
import HomeFAQ from "@/components/homes/home-1/HomeFAQ";
import FinanceCalculator from "@/components/finance/FinanceCalculator";
import FinanceCalculatorSection from "@/components/homes/home-1/FinanceCalculatorSection";
import ClientHighlights from "@/components/homes/home-1/ClientHighlights";
import GoogleReviews from "@/components/homes/home-1/GoogleReviews"; // 1. Import your Google Reviews component here


export const metadata = {
  title: "UKA Car Trade - Home",
  description: "UKA Car Trade - Quality Cars and Exceptional Service",
};

export default function Home() {
  return (
    <>
      <div className="header-fixed">
        <Header2 />
      </div>
      <Hero />
      {/* <Filter /> */}
      <CarBrands />
      <Cars />
      <Categories />
      {/* <LoanCalculator /> */}
      <Process />
      <FinanceCalculatorSection />
      <Cta/>
      <HomeFAQ/>
      <GoogleReviews /> {/* 2. Render your Google Reviews component here */}
      <ClientHighlights />
      
   

      <Blogs />  
      
      {/* <Brands />*/}
      <Footer1 />
    </>
  );
}