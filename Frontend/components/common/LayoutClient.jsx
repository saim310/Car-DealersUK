"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAnalytics } from "@/hooks/useAnalytics";

export default function LayoutClient({ children }) {
  useAnalytics();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("bootstrap/dist/js/bootstrap.esm").then(() => {});
    }
  }, []);

  useEffect(() => {
    const nav = document.querySelector(".header-lower");
    if (nav) {
      const headerHeight = nav.offsetHeight;
      const injectSpace = document.createElement("div");
      injectSpace.style.height = `${headerHeight}px`;
      injectSpace.classList.add("header-lower-after-div");
      nav.after(injectSpace);
      injectSpace.style.display = "none";
    }
    const handleScroll = () => {
      const nav = document.querySelector(".header-lower");
      if (document.querySelector(".header-fixed")) {
        const afterDiv = document.querySelector(".header-lower-after-div");
        if (nav && afterDiv) {
          if (window.scrollY > 200) {
            nav.classList.add("is-fixed");
            afterDiv.style.display = "block";
          } else {
            nav.classList.remove("is-fixed");
            afterDiv.style.display = "none";
          }
          if (window.scrollY > 300) {
            nav.classList.add("is-small");
          } else {
            nav.classList.remove("is-small");
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  useEffect(() => {
    const { WOW } = require("wowjs");
    const wow = new WOW({ mobile: false, live: false });
    wow.init();
  }, [pathname]);

  return <>{children}</>;
}