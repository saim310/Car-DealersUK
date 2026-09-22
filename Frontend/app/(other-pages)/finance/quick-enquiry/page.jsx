import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import React from "react";
import Link from "next/link";
import Apply from "@/components/finance/Quick&EasyEnquiry";
// export const metadata = {
//   title: "Financing || UKA Car Trade",
//   description: "View our pricing at UKA Car Trade",
// };
export default function page() {
  return (
    <>
      <div className="header-fixed">
        <Header2 />
      </div>
      <Apply />
     {/* <Brands />*/}
      <Footer1 />
    </>
  );
}
