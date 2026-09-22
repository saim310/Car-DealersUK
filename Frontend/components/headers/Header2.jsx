"use client";
import React from "react";
import Nav from "./Nav";
import Image from "next/image";
import Link from "next/link";
import MobileNav from "./MobileNav";
import { useDispatch, useSelector } from "react-redux";

export default function Header2() {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);
  const isAuthenticated = Boolean(token && user);

  return (
    <header className="header main-header">
      <style jsx>{`
        .custom-logo {
          width: 85px !important;
          height: auto !important;
          max-width: 85px !important;
          object-fit: contain !important;
        }
        @media (max-width: 991px) {
          /* Expand mobile header height and padding */
          .header-lower {
            padding-top: 22px !important;
            padding-bottom: 22px !important;
          }
          .inner-container {
            position: relative;
            min-height: 60px;
          }
          .logo-box {
            position: absolute !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
          }
          .custom-logo {
            width: 82px !important;
            max-width: 82px !important;
          }
        }
      `}</style>

      {/* Header Lower */}
      <div className="header-lower">
        <div className="container2">
          <div className="row">
            <div className="col-lg-12">
              <div className="inner-container flex justify-space align-center">
                {/* Logo Box */}
                <div className="logo-box flex">
                  <div className="logo">
                    <Link href={`/`}>
                      <Image
                        className="lazyload custom-logo"
                        style={{ width: "85px", height: "auto", maxWidth: "85px", objectFit: "contain" }}
                        data-src="/assets/images/logo-1.webp"
                        alt="UKA Auto Trade"
                        width={100}
                        height={100}
                        src="/assets/images/logo-1.webp"
                        priority
                      />
                    </Link>
                  </div>
                </div>
                <div className="nav-outer flex align-center">
                  {/* Main Menu */}
                  <nav className="main-menu show navbar-expand-md">
                    <div
                      className="navbar-collapse collapse clearfix"
                      id="navbarSupportedContent"
                    >
                      <ul className="navigation clearfix">
                        <Nav />
                      </ul>
                    </div>
                  </nav>
                  {/* Main Menu End*/}
                </div>

                {/* Enquire Now Button (Hidden on mobile using d-none d-lg-block) */}
                <div className="header-enquire d-none d-lg-block">
                  <Link href="/listing-grid" className="sc-button">
                    <span>ENQUIRE NOW</span>
                  </Link>
                </div>
              
                <div className="header-account flex align-center">
                  <a
                    href="#"
                    className="header-favorite flex items-center justify-center"
                  >
                    {/* <i className="icon-autodeal-favorite fs-18" /> */}
                  </a>
                  <div className="register">
                    <ul className="flex align-center">
                      {isAuthenticated && (
                        <>
                          <li>
                            <Link href="/dashboard">Dashboard</Link>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
                <div
                  className="mobile-nav-toggler mobile-button"
                  onClick={() =>
                    document.body.classList.add("mobile-menu-visible")
                  }
                >
                  <span />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End Header Lower */}
      
      {/* Mobile Menu  */}
      <div className="mobile-menu">
        <div
          className="menu-backdrop"
          onClick={() => document.body.classList.remove("mobile-menu-visible")}
        />
        <nav className="menu-box">
          <div
            className="nav-logo d-flex justify-content-center"
            style={{ paddingLeft: "0px", padding: "15px 0" }}
          >
            <Link href={`/`}>
              <Image
                className="lazyload custom-logo"
                style={{ width: "82px", height: "auto", maxWidth: "82px", objectFit: "contain" }}
                data-src="/assets/images/logo-1.webp"
                alt="UKA Auto Trade"
                width={100}
                height={100}
                src="/assets/images/logo-1.webp"
              />
            </Link>
          </div>
          <div className="bottom-canvas">
            <div className="login-box flex align-center">
              {isAuthenticated && (
                <>
                  <Link href="/dashboard" className="fw-7 font-2">
                    Dashboard
                  </Link>
                </>
              )}
            </div>
            <MobileNav />
          </div>
        </nav>
      </div>
      {/* End Mobile Menu */}
    </header>
  );
}