"use client";
import React from "react";

export default function AboutUsBanner() {
  return (
    <section className="tf-banner style-1">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="content relative z-2">
              <div className="heading">
                <h1 className="text-color-1">
                  About UKA Japan Motors
                </h1>
                <p className="text-color-1 fs-18 fw-4 lh-22 font">
                  Bringing the most reliable Japanese cars to discerning customers across the United Kingdom
                </p>
                <div className="stats-row flex gap-20 mt-30">
                  <div className="stat-item">
                    <span className="number text-color-1 fw-7 fs-24">25+</span>
                    <span className="label text-color-1 fs-14">Years Experience</span>
                  </div>
                  <div className="stat-item">
                    <span className="number text-color-1 fw-7 fs-24">1999</span>
                    <span className="label text-color-1 fs-14">Founded</span>
                  </div>
                  <div className="stat-item">
                    <span className="number text-color-1 fw-7 fs-24">10+</span>
                    <span className="label text-color-1 fs-14">Countries</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .stats-row {
          display: flex;
          gap: 40px;
          margin-top: 30px;
        }
        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .stat-item .number {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 5px;
        }
        .stat-item .label {
          font-size: 14px;
          opacity: 0.9;
        }
        @media (max-width: 768px) {
          .stats-row {
            flex-direction: column;
            gap: 15px;
          }
          .stat-item {
            padding: 15px;
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}