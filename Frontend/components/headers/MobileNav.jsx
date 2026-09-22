"use client";
import { blogPages, homepages, listingPages, otherPages, financePages, Aboutpages } from "@/data/menu";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

export default function MobileNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isActive = (menus) => {
    let active = false;
    menus.forEach((elm) => {
      if (elm.links) {
        elm.links.forEach((elm2) => {
          if (elm2.href.split("/")[1] == pathname.split("/")[1]) active = true;
        });
      } else {
        if (elm.href.split("/")[1] == pathname.split("/")[1]) active = true;
      }
    });
    return active;
  };

  const isVehicleFilterActive = (href) => {
    // Check if this vehicle filter link is active
    const url = new URL(href, window.location.origin);
    const type = url.searchParams.get("type");
    const currentType = searchParams.get("type");
    return type === currentType;
  };

  const handleActive1 = (event) => {
    const dropdown = event.currentTarget.closest(".dropdown2.parent-menu-1");
    const allDropdowns = document.querySelectorAll(".dropdown2.parent-menu-1");
    if (dropdown) {
      const ulElement = dropdown.querySelector("ul");
      if (dropdown.classList.contains("open")) {
        dropdown.classList.remove("open");
        if (ulElement) {
          ulElement.style.height = "0px";
          ulElement.style.padding = "0px 20px";
        }
      } else {
        dropdown.classList.add("open");
        if (ulElement) {
          ulElement.style.height = `${ulElement.scrollHeight + 30}px`;
          ulElement.style.padding = "15px 20px";
        }
        allDropdowns.forEach((elm) => {
          if (elm !== dropdown) {
            elm.classList.remove("open");
            const ulElement2 = elm.querySelector("ul");
            if (ulElement2) {
              ulElement2.style.height = "0px";
              ulElement2.style.padding = "0px 20px";
            }
          }
        });
      }
    }
  };

  const handleActive2 = (event) => {
    const dropdown = event.currentTarget.closest(".dropdown2:not(.parent-menu-1)");
    if (dropdown) {
      const ulElement = dropdown.querySelector("ul");
      if (dropdown.classList.contains("open")) {
        dropdown.classList.remove("open");
        if (ulElement) {
          ulElement.style.height = "0px";
          ulElement.style.padding = "0px 20px";
        }
      } else {
        dropdown.classList.add("open");
        if (ulElement) {
          ulElement.style.height = `${ulElement.scrollHeight + 30}px`;
          ulElement.style.padding = "15px 20px";
        }
      }
    }
    const parentElement = dropdown?.closest(".dropdown2.parent-menu-1");
    if (parentElement) {
      const ulElement2 = parentElement.querySelector("ul");
      if (ulElement2) ulElement2.style.height = "auto";
    }
  };

  useEffect(() => {
    document.body.classList.remove("mobile-menu-visible");
  }, [pathname]);

  return (
    <div className="menu-outer">
      <div
        className="navbar-collapse collapse clearfix"
        id="navbarSupportedContent"
      >
        <ul className="navigation clearfix">

          {/* Home */}
          <li
            className={`tf-megamenu parent-menu-1 ${pathname === "/" ? "current" : ""}`}
          >
            <a href="/">Home</a>
            <ul>
              {homepages.map((page, index) => (
                <li
                  key={index}
                  className={isVehicleFilterActive(page.href) ? "current" : ""}
                >
                  <a href={page.href}>{page.text}</a>
                </li>
              ))}
            </ul>
            <div className="dropdown2-btn" onClick={handleActive1} />
          </li>

          {/* Listing Car */}
          {/* <li
            className={`tfcl-mega-menu parent-menu-1 ${isActive(listingPages) ? "current" : ""}`}
          >
            <Link href="/listing-grid">Vehicles</Link>
            <div onClick={handleActive1} />
          </li> */}

        

             {/* About Us */}
          <li
            className={`dropdown2 parent-menu-1 ${isActive(Aboutpages) ? "current" : ""}`}
          >
            <Link href="/about-us">About Us</Link>
            <div onClick={handleActive1} />
          </li>

{/* Vehicles */}
<li
  className={`dropdown2 parent-menu-1 ${
    pathname === "/" || pathname.includes("listing")
      ? "current"
      : ""
  }`}
>
  <a href="#">Vehicles</a>

  <ul>
    {homepages.map((page, index) => (
      <li
        key={index}
        className={isVehicleFilterActive(page.href) ? "current" : ""}
      >
        <Link href={page.href}>{page.text}</Link>
      </li>
    ))}
  </ul>

  <div className="dropdown2-btn" onClick={handleActive1} />
</li>

      

          {/* Finance — dropdown just like desktop Nav */}
          <li
            className={`dropdown2 parent-menu-1 ${isActive(financePages) ? "current" : ""}`}
          >
            <a href="#">Finance</a>
            <ul>
              {financePages.map((item, index) => (
                <li
                  key={index}
                  className={item.href === pathname ? "current" : ""}
                >
                  <Link href={item.href}>{item.text}</Link>
                </li>
              ))}
            </ul>
            <div className="dropdown2-btn" onClick={handleActive1} />
          </li>

          {/* Blog */}
          <li
            className={`parent-menu-1 ${isActive(blogPages) ? "current" : ""}`}
          >
            <Link href="/blog">Blog</Link>
            <div className="dropdown2-btn" onClick={handleActive1} />
          </li>

          {/* Contact */}
          <li className={"contact" == pathname.split("/")[1] ? "current" : ""}>
            <Link href="/contact">Contact</Link>
          </li>

        </ul>
      </div>
    </div>
  );
}