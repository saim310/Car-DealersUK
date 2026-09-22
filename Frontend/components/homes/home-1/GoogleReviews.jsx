"use client";

import { useEffect } from "react";

export default function GoogleReviews() {
  useEffect(() => {
    // Create and append the SociableKIT script safely via DOM
    const script = document.createElement("script");
    script.src = "https://widgets.sociablekit.com/google-reviews/widget.js";
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <>
      <style jsx>{`
        .google-reviews-section {
          width: 100%;
          background-color: #ffffff;
          padding: 80px 20px;
        }
        .reviews-container {
          max-width: 1200px;
          margin: 0 auto;
        }
        .reviews-header {
          text-align: left;
          margin-bottom: 40px;
        }
        @media (max-width: 768px) {
          .reviews-header {
            text-align: center;
            margin-bottom: 30px;
          }
        }
        .reviews-subtitle {
          display: inline-block;
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: rgb(255, 107, 0);
          margin-bottom: 10px;
        }
        .reviews-title {
          font-size: 36px;
          font-weight: 800;
          color: #111111;
          margin: 0;
          line-height: 1.2;
        }
        .widget-wrapper {
          margin-top: 20px;
          width: 100%;
        }
      `}</style>

      <section className="google-reviews-section">
        <div className="reviews-container">
          <div className="reviews-header">
            <span className="reviews-subtitle">Verified Reviews</span>
            <h2 className="reviews-title">
              See What Our Clients<br />Say On Google
            </h2>
          </div>

          <div className="widget-wrapper">
            <div className="sk-ww-google-reviews" data-embed-id="25714303"></div>
          </div>
        </div>
      </section>
    </>
  );
}