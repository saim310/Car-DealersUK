// "use client";
// import "rc-slider/assets/index.css";
// import "../public/assets/scss/app.scss";
// import "swiper/css/effect-fade";
// import "swiper/css/grid";
// import "photoswipe/style.css";
// import { useEffect } from "react";
// import BackToTop from "@/components/common/BacktoTop";
// import FloatingWhatsApp from "@/components/common/FloatingWhatsApp";
// import ReduxProvider from "@/components/common/ReduxProvider";
// import { usePathname } from "next/navigation";
// import AuthModals from "@/components/modals/AuthModals";
// import { useAnalytics } from "@/hooks/useAnalytics";

// export default function RootLayout({ children }) {
//   useAnalytics();
//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       // Import the script only on the client side
//       import("bootstrap/dist/js/bootstrap.esm").then(() => {
//         // Module is imported, you can access any exported functionality if
//       });
//     }
//   }, []);
//   const pathname = usePathname();
//   useEffect(() => {
//     const nav = document.querySelector(".header-lower");
//     if (nav) {
//       const headerHeight = nav.offsetHeight;

//       // Create a placeholder div to maintain layout when nav is fixed
//       const injectSpace = document.createElement("div");
//       injectSpace.style.height = `${headerHeight}px`;
//       injectSpace.classList.add("header-lower-after-div");
//       nav.after(injectSpace);
//       injectSpace.style.display = "none";
//     }
//     const handleScroll = () => {
//       const nav = document.querySelector(".header-lower");

//       if (document.querySelector(".header-fixed")) {
//         const afterDiv = document.querySelector(".header-lower-after-div");
//         if (nav && afterDiv) {
//           if (window.scrollY > 200) {
//             nav.classList.add("is-fixed");
//             afterDiv.style.display = "block";
//           } else {
//             nav.classList.remove("is-fixed");
//             afterDiv.style.display = "none";
//           }

//           if (window.scrollY > 300) {
//             nav.classList.add("is-small");
//           } else {
//             nav.classList.remove("is-small");
//           }
//         }
//       }
//     };

//     // Add scroll event listener
//     window.addEventListener("scroll", handleScroll);

//     // Cleanup event listener on component unmount
//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, [pathname]);
//   useEffect(() => {
//     const { WOW } = require("wowjs");
//     const wow = new WOW({
//       mobile: false,
//       live: false,
//     });
//     wow.init();
//   }, [pathname]);
//   return (
//     <html lang="en">
//       <head>
//         <title>UKA Japan</title>
//         <meta name="description" content="UKA Car Trade - Quality Cars and Exceptional Service" />
//         <link rel="icon" href="/assets/images/logo/UKA White new stars.png" />
//         <link
//           href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Outfit:wght@100..900&display=swap"
//           rel="stylesheet"
//         />
//       </head>

//       <body className="body " style={{ transition: "0s" }}>
//         <ReduxProvider>
//           <div id="wrapper">
//             <div id="pagee" className="clearfix">
//               {children}
//             </div>
//           </div>
//           <AuthModals />
//           <BackToTop />
//           <FloatingWhatsApp />
//         </ReduxProvider>
//       </body>
//     </html>
//   );
// }
