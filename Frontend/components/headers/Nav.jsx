"use client";
import React from "react";
import Link from "next/link";
import { blogPages, homepages, listingPages, otherPages, financePages, Aboutpages} from "@/data/menu";
import { usePathname, useSearchParams } from "next/navigation";
import AboutUsBanner from "../otherPages/about/AboutUsBanner";

export default function Nav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const isActive = (menus) => {
    let active = false;

    menus.forEach((elm) => {
      if (elm.links) {
        elm.links.forEach((elm2) => {
          if (elm2.href.split("/")[1] == pathname.split("/")[1]) {
            active = true;
          }
        });
      } else {
        if (elm.href.split("/")[1] == pathname.split("/")[1]) {
          active = true;
        }
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
  return (
    <>
    <li className={`tf-megamenu ${
          pathname === "/" ? "current" : ""
        } `}><Link href="/">Home</Link></li>

<li className={`  ${isActive(Aboutpages) ? "current" : ""} `}><Link href="/about-us">About Us</Link></li>
     <li
        className={`tf-megamenu dropdown2  ${isActive(listingPages) ? "current" : ""} `}
      >
        <a href="#">Vehicles</a>
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
      </li>
     <li className={`dropdown2  ${isActive(financePages) ? "current" : ""} `}>
        <a href="#">Finance</a>
        <ul>
          {financePages.map((item, index) => (
            <li
              key={index}
              className={
                item.href === pathname
                  ? "current"
                  : ""
              }
            >
              <Link href={item.href}>{item.text}</Link>
            </li>
          ))}
        </ul>
      </li>
      

    <li className={`  ${isActive(blogPages) ? "current" : ""} `}>
        <a href="/blog">Blogs</a>
        {/* <ul>
          {blogPages.map((item, index) => (
            <li
              key={index}
              className={
                item.href.split("/")[1] == pathname.split("/")[1]
                  ? "current"
                  : ""
              }
            >
              <Link href={item.href}>{item.text}</Link>
            </li>
          ))}
        </ul> */}
      </li>
      {/* <li
        className={`tfcl-mega-menu dropdown2  ${
          isActive(listingPages) ? "current" : ""
        } `}
      >
        <a href="#">Finance</a>
        <ul>
          {listingPages.map((item, index) => (
            <li key={index} className={item.className}>
              <a href="#">{item.title}</a>
              <ul>
                {item.links.map((link, linkIndex) => (
                  <li
                    key={linkIndex}
                    className={`${link.className || ""} ${
                      link.href.split("/")[1] == pathname.split("/")[1]
                        ? "current"
                        : ""
                    }`}
                  >
                    <Link href={link.href}>{link.text}</Link>
                  </li>
                ))}
              </ul>
              <div className="dropdown2-btn" />
            </li>
          ))}
        </ul>
      </li> */}
      {/* <li className={`dropdown2  ${isActive(otherPages) ? "current" : ""} `}>
        <a href="#">Sell Your Car</a>
        <ul>
          {otherPages.map((item, index) => (
            <li
              key={index}
              className={`${item.className || ""}  ${
                item.links ? (isActive(item.links) ? "current" : "") : ""
              } ${
                item.href?.split("/")[1] == pathname.split("/")[1]
                  ? "current"
                  : ""
              }`}
            >
              {item.title ? (
                <>
                  <a href="#">{item.title}</a>
                  <ul>
                    {item.links.map((link, linkIndex) => (
                      <li
                        key={linkIndex}
                        className={
                          link.href.split("/")[1] == pathname.split("/")[1]
                            ? "current"
                            : ""
                        }
                      >
                        <Link href={link.href}>{link.text}</Link>
                      </li>
                    ))}
                  </ul>
                  <div className="dropdown2-btn" />
                </>
              ) : (
                <Link href={item.href}>{item.text}</Link>
              )}
            </li>
          ))}
        </ul>
      </li> */}
   
      {/* <li className={`dropdown2  ${isActive(dealershipPages) ? "current" : ""} `}>
        <a href="#">dealership</a>
        <ul>
          {dealershipPages.map((item, index) => (
            <li
              key={index}
              className={
                item.href.split("/")[1] == pathname.split("/")[1]
                  ? "current"
                  : ""
              }
            >
              <Link href={item.href}>{item.text}</Link>
            </li>
          ))}
        </ul>
      </li> */}

   <li className={"contact" == pathname.split("/")[1] ? "current" : ""}>
        <Link href={`/contact`}>Contact</Link>
      </li>
    </>
  );
}
