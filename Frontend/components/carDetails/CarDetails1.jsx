"use client";
import React, { useEffect, useState } from "react";
import ImageGallerySlider from "./sliders/ImageGallerySlider";
import Image from "next/image";
import Description from "./detailComponents/Description";
import Overview from "./detailComponents/Overview";
import LoanCalculator from "./detailComponents/LoanCalculator";
import CarInfo from "./detailComponents/CarInfo";
import ProfileInfo from "./detailComponents/ProfileInfo";
import TestDriveForm from "./detailComponents/TestDriveForm";
import Recommended from "./detailComponents/Recommended";
import Features from "./detailComponents/Features";
import CarLocation from "./detailComponents/CarLocation";
import { useDispatch, useSelector } from "react-redux";
import { fetchCarDetails, clearCarDetails } from "@/reducer/carDetailsSlice";

export default function CarDetails1({ carId }) {
  const dispatch = useDispatch();
  const { carItem, loading, error } = useSelector((state) => state.carDetails);

  // Modal states
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [showTestDriveModal, setShowTestDriveModal] = useState(false);

  useEffect(() => {
    if (carId && carItem && carItem.title) {
      const reportView = async () => {
        try {
          await fetch(
            "https://apis.ukaautotrade.co.uk/api/analytics/property-view",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                listingId: carId,
                title: carItem.title,
              }),
            },
          );
        } catch (err) {
          console.error("Analytics Error:", err);
        }
      };
      reportView();
    }
  }, [carId, carItem]);

  useEffect(() => {
    if (carId) {
      dispatch(fetchCarDetails(carId));
    }
    return () => {
      dispatch(clearCarDetails());
    };
  }, [dispatch, carId]);

  useEffect(() => {
    const featureSection = document.querySelector(".listing-features");
    const featureHeading = featureSection?.querySelector(".feature-heading-mobie");
    
    if (!featureHeading || !featureSection) return;

    const toggleFeature = (event) => {
      event.preventDefault();
      const content = featureSection.querySelector(".tf-collapse-content");
      if (!content) return;

      if (featureSection.classList.contains("open")) {
        const scrollHeight = content.scrollHeight;
        content.style.height = scrollHeight + "px";
        
        requestAnimationFrame(() => {
          content.style.height = "0px";
        });
        
        featureSection.classList.remove("open");
      } else {
        featureSection.classList.add("open");
        const scrollHeight = content.scrollHeight;
        content.style.height = scrollHeight + "px";

        const handleTransitionEnd = () => {
          if (featureSection.classList.contains("open")) {
            content.style.height = "auto";
          }
          content.removeEventListener("transitionend", handleTransitionEnd);
        };

        content.addEventListener("transitionend", handleTransitionEnd);
      }
    };

    featureHeading.addEventListener("click", toggleFeature);

    return () => {
      featureHeading.removeEventListener("click", toggleFeature);
    };
  }, [carItem]);

  if (loading) {
    return (
      <section className="tf-section3 listing-detail style-1">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="tf-section3 listing-detail style-1">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center py-5">
              <h3 className="text-danger">Error: {error}</h3>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!carItem) {
    return null;
  }

  return (
    <>
      <section className="tf-section3 listing-detail style-1">
        <div className="container">
          <div className="row">
            {/* ── MAIN CONTENT COLUMN ── */}
            <div className="col-lg-8">
              <div className="listing-detail-wrap">
                {/* Picture Container with Added Shadow & Rounded Styling */}
                <div className="gallery-slider-card">
                  <ImageGallerySlider carItem={carItem} />
                </div>

                {/* ── CAR INFO + ACTION BUTTONS — mobile only ── */}
                <div className="mobile-inline-sidebar">
                  <div className="mobile-widget-card mb-20">
                    <h2 className="title">{carItem.title}</h2>
                    <CarInfo carItem={carItem} />
                  </div>

                  <div className="mobile-widget-card mb-20">
                    <div className="mobile-section-label">Quick Actions</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      <button 
                        onClick={() => setShowEnquiryModal(true)}
                        style={{
                          width: "100%",
                          padding: "14px 24px",
                          borderRadius: "50px",
                          background: "#ff7a00",
                          color: "#ffffff",
                          border: "none",
                          fontSize: "15px",
                          fontWeight: "700",
                          cursor: "pointer",
                          boxShadow: "0 4px 12px rgba(255,122,0,0.2)",
                          textAlign: "center",
                          transition: "background 0.2s"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = "#e06a00"}
                        onMouseOut={(e) => e.currentTarget.style.background = "#ff7a00"}
                      >
                        Enquire About This Car &rarr;
                      </button>
                      <button 
                        onClick={() => setShowTestDriveModal(true)}
                        style={{
                          width: "100%",
                          padding: "14px 24px",
                          borderRadius: "50px",
                          background: "#ffffff",
                          color: "#1a1a1a",
                          border: "1px solid #1a1a1a",
                          fontSize: "15px",
                          fontWeight: "700",
                          cursor: "pointer",
                          textAlign: "center",
                          transition: "all 0.2s"
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = "#1a1a1a";
                          e.currentTarget.style.color = "#ffffff";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = "#ffffff";
                          e.currentTarget.style.color = "#1a1a1a";
                        }}
                      >
                        Book a Test Drive &rarr;
                      </button>
                    </div>
                  </div>
                </div>

                {/* ── SCROLLSPY NAV ── */}
                <div className="row">
                  <div className="col-lg-12">
                    <nav
                      id="navbar-example2"
                      className="navbar tab-listing-scroll"
                    >
                      <ul className="nav nav-pills">
                        <li className="nav-item">
                          <a className="nav-link" href="#scrollspyHeading1">
                            Overview
                          </a>
                        </li>
                        <li className="nav-item">
                          <a className="nav-link" href="#scrollspyHeading2">
                            Specs &amp; features
                          </a>
                        </li>
                        <li className="nav-item">
                          <a className="nav-link" href="#scrollspyHeading3">
                            Recommended
                          </a>
                        </li>
                      </ul>
                    </nav>

                    <div
                      data-bs-spy="scroll"
                      data-bs-target="#navbar-example2"
                      data-bs-offset={0}
                      className="scrollspy-example"
                      tabIndex={0}
                    >
                      {/* Overview */}
                      <div className="overview-section" id="scrollspyHeading1">
                        <div className="footer-heading-desktop mb-30">
                          
                        </div>
                        <Overview carItem={carItem} />
                      </div>

                      {/* Description */}
                      <div className="listing-description mt-40">
                        <div className="tfcl-listing-header">
                          <h2>Description</h2>
                        </div>
                        <Description carItem={carItem} />
                      </div>

                      <div className="listing-line" />

                      {/* Features */}
                      <div
                        className="listing-features footer-col-block"
                        id="scrollspyHeading2"
                      >
                        <div className="footer-heading-desktop mb-30">
                          <h2>Features</h2>
                        </div>
                        <div className="feature-heading-mobie listing-details-mobie mb-30">
                          <h2>Features</h2>
                        </div>
                         <div className="tf-collapse-content">
                          <Features carItem={carItem} />
                        </div>
                      </div>

                      <div className="listing-line" />

                      {/* Recommended Cars Carousel */}
                      <div className="listing-recommended-section mt-40" id="scrollspyHeading3">
                        <Recommended currentId={carId} />
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── DESKTOP SIDEBAR — hidden on mobile ── */}
            <div className="col-lg-4 desktop-sidebar-col">
              <div className="listing-sidebar">
                <div className="widget-listing mb-40">
                  <div className="heading-widget">
                    <h2 className="title">{carItem.title}</h2>
                    <CarInfo carItem={carItem} />
                  </div>
                </div>
                
                {/* Desktop Action Buttons Box */}
                <div className="widget-listing mb-30" style={{ background: "#ffffff", borderRadius: "16px", padding: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", border: "1px solid #eaeaea" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <button 
                      onClick={() => setShowEnquiryModal(true)}
                      style={{
                        width: "100%",
                        padding: "14px 24px",
                        borderRadius: "50px",
                        background: "#ff7a00",
                        color: "#ffffff",
                        border: "none",
                        fontSize: "15px",
                        fontWeight: "700",
                        cursor: "pointer",
                        textAlign: "center",
                        transition: "background 0.2s"
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = "#e06a00"}
                      onMouseOut={(e) => e.currentTarget.style.background = "#ff7a00"}
                    >
                      Enquire About This Car &rarr;
                    </button>
                    <button 
                      onClick={() => setShowTestDriveModal(true)}
                      style={{
                        width: "100%",
                        padding: "14px 24px",
                        borderRadius: "50px",
                        background: "#ffffff",
                        color: "#1a1a1a",
                        border: "1px solid #1a1a1a",
                        fontSize: "15px",
                        fontWeight: "700",
                        cursor: "pointer",
                        textAlign: "center",
                        transition: "all 0.2s"
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = "#1a1a1a";
                        e.currentTarget.style.color = "#ffffff";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = "#ffffff";
                        e.currentTarget.style.color = "#1a1a1a";
                      }}
                    >
                      Book a Test Drive &rarr;
                    </button>
                  </div>
                </div>

                {/* Location Widget in Sidebar */}
                <div className="widget-listing">
                  <CarLocation carItem={carItem} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ENQUIRE NOW MODAL ── */}
      {showEnquiryModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(4px)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px"
        }}>
          <div style={{
            background: "#ffffff",
            borderRadius: "16px",
            width: "100%",
            maxWidth: "500px",
            maxHeight: "90vh",
            overflowY: "auto",
            padding: "30px",
            position: "relative",
            boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
          }}>
            <button 
              onClick={() => setShowEnquiryModal(false)}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                background: "#f1f1f1",
                border: "none",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: "16px",
                color: "#333"
              }}
            >
              <i className="fas fa-times" />
            </button>
            <h3 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "20px", color: "#1a1a1a" }}>
              Enquire About This Car
            </h3>
            <ProfileInfo />
          </div>
        </div>
      )}

      {/* ── BOOK A TEST DRIVE MODAL ── */}
      {showTestDriveModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(4px)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px"
        }}>
          <div style={{
            background: "#ffffff",
            borderRadius: "16px",
            width: "100%",
            maxWidth: "550px",
            maxHeight: "90vh",
            overflowY: "auto",
            padding: "30px",
            position: "relative",
            boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
          }}>
            <button 
              onClick={() => setShowTestDriveModal(false)}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                background: "#f1f1f1",
                border: "none",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: "16px",
                color: "#333",
                zIndex: 10
              }}
            >
              <i className="fas fa-times" />
            </button>
            <div style={{ padding: "0px" }}>
              <TestDriveForm carItem={carItem} />
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        /* Gallery Slider Card Container Shadow & Rounded Corners */
        .gallery-slider-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
          border: 1px solid #eaeaea;
          margin-bottom: 30px;
        }

        /* Scrollspy Nav Pill Styling with white background */
        .tab-listing-scroll .nav-pills {
          gap: 15px;
        }
        .tab-listing-scroll .nav-pills .nav-link {
          background: #ffffff !important;
          color: #1a1a1a !important;
          border: 1px solid #eaeaea !important;
          border-radius: 50px !important;
          padding: 12px 28px !important;
          font-weight: 600 !important;
          box-shadow: 0 2px 6px rgba(0,0,0,0.03);
          transition: all 0.2s ease;
        }
        .tab-listing-scroll .nav-pills .nav-link.active,
        .tab-listing-scroll .nav-pills .nav-link:hover {
          background: #1a1a1a !important;
          color: #ffffff !important;
          border-color: #1a1a1a !important;
        }

        @media (max-width: 991px) {
          .listing-features .feature-heading-mobie {
            margin-bottom: 0px !important;
          }
          .mobile-inline-sidebar {
            display: block !important;
          }
          .desktop-sidebar-col {
            display: none !important;
          }
          .btn-siderbar-mobie-filter {
            display: none !important;
          }
          .overlay-siderbar-mobie {
            display: none !important;
          }
          .mobile-widget-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
          }
          .mobile-section-label {
            font-size: 18px;
            font-weight: 700;
            color: #1a202c;
            margin-bottom: 16px;
            padding-bottom: 10px;
            border-bottom: 2px solid #ff9800;
          }
          .overview-section .tf-collapse-content {
            height: auto !important;
            overflow: visible !important;
          }
          .overview-section .footer-heading-mobie {
            cursor: default !important;
            padding: 20px 25px 0px 25px !important;
          }
          .overview-section .footer-heading-mobie::before,
          .overview-section .footer-heading-mobie::after {
            display: none !important;
          }
          .overview-section .footer-heading-mobie h2 {
            font-size: 24px;
            font-weight: 700;
            color: #1a202c;
          }
          .listing-features .footer-heading-desktop {
            display: none !important;
          }
          .listing-features {
            position: relative !important;
          }
          .listing-features .feature-heading-mobie {
            cursor: pointer !important;
            position: relative !important;
            user-select: none !important;
            padding: 15px 0 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
          }
          .listing-features .feature-heading-mobie h2 {
            margin: 0 !important;
            flex: 1 !important;
          }
          .listing-features .feature-heading-mobie::after {
            content: "+" !important;
            position: relative !important;
            right: auto !important;
            font-size: 24px !important;
            font-weight: 300 !important;
            color: #ff9800 !important;
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
            display: inline-block !important;
            width: 30px !important;
            text-align: center !important;
          }
          .listing-features.open .feature-heading-mobie::after {
            content: "−" !important;
            transform: scale(1.3) !important;
          }
          .listing-features .feature-heading-mobie::before {
            display: none !important;
          }
          .listing-features .tf-collapse-content {
            height: 0 !important;
            overflow: hidden !important;
            transition: height 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
            display: block !important;
          }
          .listing-features.open .tf-collapse-content {
            height: auto !important;
          }
        }

        @media (max-width: 768px) {
          .listing-features .footer-heading-desktop {
            display: none !important;
          }
          .listing-features .feature-heading-mobie::after {
            font-size: 22px !important;
            width: 28px !important;
            top: -10px;
          }
          .listing-features .tf-collapse-content {
            display: block !important;
          }
        }

        @media (max-width: 560px) {
          .listing-features .footer-heading-desktop {
            display: none !important;
          }
          .listing-features .feature-heading-mobie {
            padding: 12px 0 !important;
            font-weight: 600 !important;
            position: relative !important;
            cursor: pointer !important;
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
          }
          .listing-features .feature-heading-mobie h2 {
            margin: 0 !important;
            flex: 1 !important;
          }
          .listing-features .feature-heading-mobie::after {
            content: "+" !important;
            font-size: 24px !important;
            width: 26px !important;
            color: #ff9800 !important;
            font-weight: 300 !important;
          }
          .listing-features.open .feature-heading-mobie::after {
            content: "−" !important;
          }
          .listing-features .feature-heading-mobie::before {
            display: none !important;
          }
          .listing-features .tf-collapse-content {
            display: block !important;
            height: 0 !important;
            overflow: hidden !important;
            transition: height 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
          }
          .listing-features.open .tf-collapse-content {
            height: auto !important;
          }
        }

        @media (min-width: 992px) {
          .mobile-inline-sidebar {
            display: none !important;
          }
          .desktop-sidebar-col {
            display: block !important;
          }
          .listing-features .feature-heading-mobie {
            display: none !important;
          }
          .listing-features .footer-heading-desktop {
            display: block !important;
          }
          .listing-features .tf-collapse-content {
            height: auto !important;
            overflow: visible !important;
          }
        }

        body, .page-content-wrapper {
          background-color: #f7f8fa;
        }
      `}</style>
    </>
  );
}