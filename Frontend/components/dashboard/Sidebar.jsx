"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/reducer/authSlice";
import content from "../../app/(dashboard)/content/page";
import style from "../../public/assets/css/dashboard/drop-down.module.css";

export default function Sidebar() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isContentOpen, setIsContentOpen] = useState(false);
  const [isEnquiriesOpen, setIsEnquiriesOpen] = useState(false);

  useEffect(() => {
    // Function to open the dashboard
    const openDashboard = () => {
      document.querySelector(".sidebar-dashboard").classList.add("active");
      document.querySelector(".dashboard-overlay").classList.add("active");
    };

    // Function to close the dashboard
    const closeDashboard = () => {
      document.querySelector(".sidebar-dashboard").classList.remove("active");
      document.querySelector(".dashboard-overlay").classList.remove("active");
    };

    // Adding event listeners
    const openButton = document.querySelector(".dashboard-toggle");
    const overlay = document.querySelector(".dashboard-overlay");

    openButton?.addEventListener("click", openDashboard);
    overlay?.addEventListener("click", closeDashboard);

    // Cleanup: Remove event listeners on component unmount
    return () => {
      openButton?.removeEventListener("click", openDashboard);
      overlay?.removeEventListener("click", closeDashboard);
    };
  }, []);

  const pathname = usePathname();

  return (
    <>
      <div className="dashboard-overlay" />
      <aside className="sidebar-dashboard">
        <div
          className="db-content db-logo pad-30 d-flex justify-content-center"
          style={{ paddingLeft: "0px" }}
        >
          <Link href={`/`} title="autodecar">
            <Image
              className="site-logo"
              alt="autodecar"
              src="/assets/images/dashboard/logo.png"
              width={450}
              height={80}
              style={{ width: "200px", height: "auto" }}
            />
          </Link>
        </div>

        <div className="db-content db-author pad-30">
          <h6 className="db-title">Profile</h6>
          <div className="author">
            <div className="avatar">
              <Image
                loading="lazy"
                id="tfre_avatar_thumbnail"
                alt="admin"
                title="admin"
                src={`https://apis.ukaautotrade.co.uk/${user?.user?.avatar || user?.avatar}`}
                width={52}
                height={52}
              />
            </div>
            <div className="content">
              <div className="name">{user?.user?.name || user?.name || ""}</div>
              <div className="author-email">
                {user?.user?.email || user?.email || ""}
              </div>
            </div>
          </div>
        </div>
        <div className="db-content db-list-menu">
          <h6 className="db-title">Menu</h6>
          <div className="db-dashboard-menu">
            <ul>
              
              <li>
                <Link
                  href={`/dashboard`}
                  className={`menu-index-1 ${
                    pathname == "/dashboard" ? "active" : ""
                  } `}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={22}
                    height={22}
                    viewBox="0 0 22 22"
                    fill="none"
                  >
                    <g opacity="0.2">
                      <path
                        d="M6.92479 9.35156V15.64"
                        stroke="#F1FAEE"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M11.2021 6.34375V15.6412"
                        stroke="#F1FAEE"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M15.4092 12.6758V15.6412"
                        stroke="#F1FAEE"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M15.4619 1.83398H6.87143C3.87698 1.83398 2 3.95339 2 6.95371V15.0476C2 18.0479 3.86825 20.1673 6.87143 20.1673H15.4619C18.4651 20.1673 20.3333 18.0479 20.3333 15.0476V6.95371C20.3333 3.95339 18.4651 1.83398 15.4619 1.83398Z"
                        stroke="#F1FAEE"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                  </svg>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href={`/analytics`}
                  className={`menu-index-analytics ${pathname == "/analytics" ? "active" : ""} `}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={22}
                    height={22}
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <g opacity="0.2">
                      <path
                        d="M21.21 15.89A10 10 0 1 1 8 2.83"
                        stroke="#F1FAEE"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M22 12A10 10 0 0 0 12 2v10z"
                        stroke="#F1FAEE"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                  </svg>
                  Analytics
                </Link>
              </li>

              <li>
                <Link
                  href={`/my-listing`}
                  className={`menu-index-2 ${
                    pathname == "/my-listing" ? "active" : ""
                  } `}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={22}
                    height={22}
                    viewBox="0 0 22 22"
                    fill="none"
                  >
                    <g opacity="0.2">
                      <path
                        d="M10.0135 2.55687H6.58608C3.76733 2.55687 2 4.55245 2 7.37762V14.9988C2 17.824 3.75908 19.8195 6.58608 19.8195H14.6747C17.5027 19.8195 19.2617 17.824 19.2617 14.9988V11.3065"
                        stroke="#F1FAEE"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M7.57059 10.0111L14.4208 3.16086C15.2743 2.30836 16.6575 2.30836 17.5109 3.16086L18.6265 4.27644C19.4799 5.12986 19.4799 6.51403 18.6265 7.36653L11.7433 14.2498C11.3702 14.6229 10.8642 14.8328 10.3362 14.8328H6.90234L6.98851 11.3678C7.00134 10.8581 7.20943 10.3723 7.57059 10.0111Z"
                        stroke="#F1FAEE"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M13.3789 4.21875L17.5644 8.40425"
                        stroke="#F1FAEE"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                  </svg>
                  My Listing
                </Link>
              </li>
              
              
              <li>
                <Link
                  href={`/sale-report`}
                  className={`menu-index-sale-report ${
                    pathname == "/sale-report" ? "active" : ""
                  } `}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={22}
                    height={22}
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M4 7H20M4 12H20M4 17H14"
                      stroke="#F1FAEE"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      
                    />
                  </svg>
                  Sale Report
                </Link>
              </li>
              <li>
                <Link
                  href={`/finance-enquiries`}
                  className={`menu-index-finance ${
                    pathname == "/finance-enquiries" ? "active" : ""
                  } `}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={22}
                    height={22}
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"
                      stroke="#F1FAEE"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="#F1FAEE"
                    />
                  </svg>
                  Finance
                </Link>
              </li>
              <li>
                <Link
                  href={`/newsletter-subscribers`}
                  className={`menu-index-subscribers ${
                    pathname == "/newsletter-subscribers" ? "active" : ""
                  } `}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={22}
                    height={22}
                    viewBox="0 0 22 22"
                    fill="none"
                  >
                    <g opacity="0.2">
                      <path
                        d="M18.375 5.5H3.625C2.875 5.5 2.25 6.125 2.25 6.875V15.125C2.25 15.875 2.875 16.5 3.625 16.5H18.375C19.125 16.5 19.75 15.875 19.75 15.125V6.875C19.75 6.125 19.125 5.5 18.375 5.5Z"
                        stroke="#F1FAEE"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2.25 6.875L11 11.5L19.75 6.875"
                        stroke="#F1FAEE"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                  </svg>
                  Subscribers
                </Link>
              </li>
              {/* Enquiries Dropdown Menu Item */}
              <li className={`menu-index-leads ${isEnquiriesOpen ? "open" : ""}`}>
                <div
                  className={`${style["container"]} dropdown-toggle-wrapper`}
                  onClick={() => setIsEnquiriesOpen(!isEnquiriesOpen)}
                  style={{
                    cursor: "pointer",
                    fontSize: "16px",
                    fontWeight: 500,
                    display: "flex",
                    margin: "5px 0px",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 14px",
                    color: "#fff",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={22}
                      height={22}
                      viewBox="0 0 22 22"
                      fill="none"
                    >
                      <g opacity="0.2">
                        <path
                          d="M4.5 6.5H17.5C18.0523 6.5 18.5 6.94772 18.5 7.5V14.5C18.5 15.0523 18.0523 15.5 17.5 15.5H4.5C3.94772 15.5 3.5 15.0523 3.5 14.5V7.5C3.5 6.94772 3.94772 6.5 4.5 6.5Z"
                          stroke="#F1FAEE"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4.5 7.5L11 11.5L17.5 7.5"
                          stroke="#F1FAEE"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                    </svg>
                    Enquiries
                  </span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{
                      transform: isEnquiriesOpen
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.3s ease",
                      marginRight: "10px",
                    }}
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>

                {isEnquiriesOpen && (
                  <ul
                    className="sub-menu"
                    style={{
                      paddingLeft: "52px",
                      listStyle: "none",
                      marginTop: "5px",
                    }}
                  >
                    <li>
                      <Link
                        href="/test-drives"
                        className={pathname === "/test-drives" ? "active" : ""}
                        style={{
                          display: "block",
                          padding: "10px 0",
                          fontSize: "14px",
                          color: "#F1FAEE",
                          opacity: pathname === "/test-drives" ? 1 : 0.6,
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={22}
                          height={22}
                          viewBox="0 0 24 24"
                          fill="none"
                          style={{ marginLeft: "10px" }}
                        >
                          <g opacity="0.2">
                            <path
                              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                              stroke="#F1FAEE"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              fill="#F1FAEE"
                            />
                          </g>
                        </svg>
                        Test Drive Enquiry
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/leads"
                        className={pathname === "/leads" ? "active" : ""}
                        style={{
                          display: "block",
                          padding: "10px 0",
                          fontSize: "14px",
                          color: "#F1FAEE",
                          opacity: pathname === "/leads" ? 1 : 0.6,
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={22}
                          height={22}
                          viewBox="0 0 22 22"
                          fill="none"
                          style={{ marginLeft: "10px" }}
                        >
                          <g opacity="0.2">
                            <path
                              d="M4.5 6.5H17.5C18.0523 6.5 18.5 6.94772 18.5 7.5V14.5C18.5 15.0523 18.0523 15.5 17.5 15.5H4.5C3.94772 15.5 3.5 15.0523 3.5 14.5V7.5C3.5 6.94772 3.94772 6.5 4.5 6.5Z"
                              stroke="#F1FAEE"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M4.5 7.5L11 11.5L17.5 7.5"
                              stroke="#F1FAEE"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </g>
                        </svg>
                        Normal Enquiry
                      </Link>
                    </li>
                  </ul>
                )}
              </li>

              {/* Content Dropdown Menu Item */}
              <li className={`menu-index-3 ${isContentOpen ? "open" : ""}`}>
                <div
                  // CHANGE: Removed 'active' class from parent container to prevent it from getting the orange background
                  // when a child is selected. Use a custom style instead if you want a subtle highlight.
                  className={`${style["container"]} dropdown-toggle-wrapper`}
                  onClick={() => setIsContentOpen(!isContentOpen)}
                  style={{
                    cursor: "pointer",
                    fontSize: "16px",
                    fontWeight: 500,
                    display: "flex",
                    margin: "5px 0px",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 14px", // Match your theme's standard padding
                    color: "#fff",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <svg width={22} height={22} viewBox="0 0 22 22" fill="none">
                      <g opacity="0.2">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M2.34088 10.6318C1.35729 7.56096 2.50679 4.05104 5.73071 3.01246C7.42654 2.46521 9.29838 2.78788 10.7082 3.84846C12.042 2.81721 13.9825 2.46888 15.6765 3.01246C18.9005 4.05104 20.0573 7.56096 19.0746 10.6318C17.5438 15.4993 10.7082 19.2485 10.7082 19.2485C10.7082 19.2485 3.92304 15.5561 2.34088 10.6318Z"
                          stroke="#F1FAEE"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M14.375 6.14258C15.3558 6.45974 16.0488 7.33516 16.1322 8.36274"
                          stroke="#F1FAEE"
                          strokeWidth="1.5"
                        />
                      </g>
                    </svg>
                    Content
                  </span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{
                      transform: isContentOpen
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.3s ease",
                      marginRight: "10px", // CHANGE: Added margin to prevent arrow from hitting edge
                    }}
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>

                {isContentOpen && (
                  <ul
                    className="sub-menu"
                    style={{
                      paddingLeft: "52px", // CHANGE: Increased padding to align text with parent text (Icon 22px + Gap 12px + margin)
                      listStyle: "none",
                      marginTop: "5px",
                    }}
                  >
                    <li>
                      <Link
                        href="/content"
                        // CHANGE: The 'active' class in your CSS likely has a border-radius that creates the "pill"
                        // You may want to check your global CSS and ensure .sub-menu .active has a smaller border-radius or height.
                        className={pathname === "/content" ? "active" : ""}
                        style={{
                          display: "block",
                          padding: "10px 0",
                          fontSize: "14px", // Usually sub-items are slightly smaller
                          color: "#F1FAEE",

                          opacity: pathname === "/content" ? 1 : 0.6,
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={22}
                          height={22}
                          viewBox="0 0 24 24"
                          fill="none"
                          style={{ marginLeft: "10px" }}
                        >
                          <path
                            d="M3 10.5L12 3L21 10.5V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V10.5Z"
                            stroke="#F1FAEE"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M9 21V12H15V21"
                            stroke="#F1FAEE"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Home
                      </Link>
                    </li>
                    {/* <li>
                      <Link
                        href="/about-us"
                        className={pathname === "/about-us" ? "active" : ""}
                        style={{
                          display: "block",
                          padding: "10px 0",
                          color: "#F1FAEE",
                          opacity: pathname === "/about-us" ? 1 : 0.6,
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={22}
                          height={22}
                          viewBox="0 0 24 24"
                          fill="none"
                          style={{ marginLeft: "10px" }}
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="#F1FAEE"
                            strokeWidth="1.5"
                          />
                          <path
                            d="M12 16V12"
                            stroke="#F1FAEE"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                          <path
                            d="M12 8H12.01"
                            stroke="#F1FAEE"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                        About Us
                      </Link>
                    </li> */}
                  </ul>
                )}
              </li>

              <li>
                <Link
                  href={`/blog-management`}
                  className={`menu-index-3 ${pathname == "/blog-management" ? "active" : ""}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={22}
                    height={22}
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    {/* Add this group tag to match the other icons */}
                    <g opacity="0.2">
                      <path
                        d="M4 4H16L20 8V20H4V4Z"
                        stroke="#F1FAEE"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M16 4V8H20"
                        stroke="#F1FAEE"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8 12H16"
                        stroke="#F1FAEE"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M8 16H14"
                        stroke="#F1FAEE"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </g>
                  </svg>
                  Blog Management
                </Link>
              </li>

              <li>
                <Link
                  href={`/contact-messages`}
                  className={`menu-index-4 ${
                    pathname == "/contact-messages" ? "active" : ""
                  } `}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={22}
                    height={22}
                    viewBox="0 0 22 22"
                    fill="none"
                  >
                    <g opacity="0.2">
                      <path
                        d="M16.5756 8.11328L12.5026 11.4252C11.7331 12.0357 10.6504 12.0357 9.88082 11.4252L5.77344 8.11328"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M15.6665 19.25C18.4544 19.2577 20.3333 16.9671 20.3333 14.1518V7.85584C20.3333 5.04059 18.4544 2.75 15.6665 2.75H6.66687C3.87897 2.75 2 5.04059 2 7.85584V14.1518C2 16.9671 3.87897 19.2577 6.66687 19.25H15.6665Z"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                  </svg>
                  Contact Messages
                </Link>
              </li>
              <li>
                <Link
                  href={`/testimonials`}
                  className={`menu-index-testimonials ${
                    pathname == "/testimonials" ? "active" : ""
                  } `}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={22}
                    height={22}
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <g opacity="0.2">
                      <path
                        d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                        stroke="#F1FAEE"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9 10h.01M13 10h.01M17 10h.01"
                        stroke="#F1FAEE"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                  </svg>
                  Testimonials
                </Link>
              </li>
              <li>
                <Link
                  href={`/cars-review`}
                  className={`menu-index-cars-review ${
                    pathname == "/cars-review" ? "active" : ""
                  } `}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={22}
                    height={22}
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <g opacity="0.2">
                      <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                        stroke="#F1FAEE"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="#F1FAEE"
                      />
                    </g>
                  </svg>
                  Cars Review
                </Link>
              </li>
              <li>
                    <Link
    href="/my-profile"
    className={`menu-index-6 ${
      pathname == "/my-profile" ? "active" : ""
    } `}
  >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={22}
                    height={22}
                    viewBox="0 0 22 22"
                    fill="none"
                  >
                    <g opacity="0.2">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M10.5729 14.0684C7.02762 14.0684 4 14.6044 4 16.7511C4 18.8979 7.00841 19.4531 10.5729 19.4531C14.1183 19.4531 17.145 18.9162 17.145 16.7703C17.145 14.6245 14.1375 14.0684 10.5729 14.0684Z"
                        stroke="#F1FAEE"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M10.5726 11.0056C12.8992 11.0056 14.7849 9.11897 14.7849 6.79238C14.7849 4.46579 12.8992 2.58008 10.5726 2.58008C8.24599 2.58008 6.3594 4.46579 6.3594 6.79238C6.35154 9.11111 8.22503 10.9977 10.5429 11.0056H10.5726Z"
                        stroke="#F1FAEE"
                        strokeWidth="1.42857"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                  </svg>
                  Profile
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  className="menu-index-7"
                  onClick={() => dispatch(logout())}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "inherit",
                    width: "100%",
                    textAlign: "left",
                    marginLeft: "17px",
                    marginTop: "10px",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={22}
                    height={22}
                    viewBox="0 0 22 22"
                    fill="none"
                  >
                    <g opacity="0.2">
                      <path
                        d="M13.2237 6.77418V5.91893C13.2237 4.05352 11.7112 2.54102 9.84575 2.54102H5.377C3.5125 2.54102 2 4.05352 2 5.91893V16.1214C2 17.9868 3.5125 19.4993 5.377 19.4993H9.85492C11.7148 19.4993 13.2237 17.9914 13.2237 16.1315V15.2671"
                        stroke="#F1FAEE"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M19.4516 11.0208H8.41406"
                        stroke="#F1FAEE"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M16.7656 8.34766L19.4496 11.0197L16.7656 13.6927"
                        stroke="#F1FAEE"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                  </svg>

                  <span style={{ marginLeft: "10px" }}>Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </aside>
    </>
  );
}
