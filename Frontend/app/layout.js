"use client";
import "rc-slider/assets/index.css";
import "../public/assets/scss/app.scss";
import "swiper/css/effect-fade";
import "swiper/css/grid";
import "photoswipe/style.css";
import Script from "next/script";
import { usePathname } from "next/navigation";
import BackToTop from "@/components/common/BacktoTop";
import ReduxProvider from "@/components/common/ReduxProvider";
import AuthModals from "@/components/modals/AuthModals";
import LayoutClient from "@/components/common/LayoutClient";
import ToastProvider from "@/components/toast/ToastProvider";
import TopBar from "@/components/homes/home-1/TopBar";
import FloatingContact from "@/components/common/FloatingContact";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  
  // Hide topbar on dashboard or login pages
  const hideTopBar = pathname?.startsWith("/dashboard") || pathname?.startsWith("/login");

  return (
    <html lang="en">
      <head>
        <title>UKA Car Trade - Home</title>
        <meta name="description" content="UKA Car Trade - Quality Cars and Exceptional Service" />
        <link rel="icon" href="/assets/images/logo/UKA White new stars.png" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Outfit:wght@100..900&display=swap"
          rel="stylesheet"
        />
        {/* Meta Pixel Code */}
        <Script
          id="facebook-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '945911635007266');
fbq('track', 'PageView');`,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=945911635007266&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* End Meta Pixel Code */}
      </head>
      <body className="body" style={{ transition: "0s" }}>
        <ReduxProvider>
          <div id="wrapper">
            <div id="pagee" className="clearfix">
              {!hideTopBar && <TopBar />}
              <LayoutClient>{children}</LayoutClient>
            </div>
          </div>
          <FloatingContact />
          <AuthModals />
          <BackToTop />
        </ReduxProvider>
        <ToastProvider />
      </body>
    </html>
  );
}