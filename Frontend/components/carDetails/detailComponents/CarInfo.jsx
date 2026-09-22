import React from "react";
import { kmToMiles } from "@/utils/exports";

export default function CarInfo({ carItem, showTitle = false }) {
  if (!carItem) return null;
  const formatNum = (num) => (num ? Number(num).toLocaleString() : "0");

  return (
    <>
      <style jsx>{`
        .car-info-wrapper {
          position: relative;
          background: #ffffff;
          border: 1px solid #eaeaea;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
        }

        /* ── Header Badges & Titles ── */
        .car-info-subtitle {
          font-size: 11px;
          font-weight: 750;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #ff6b00;
          margin-bottom: 8px;
        }

        .car-info-title {
          font-size: 24px;
          font-weight: 800;
          line-height: 1.25;
          color: #111827;
          margin-bottom: 6px;
        }

        .car-info-trim {
          font-size: 14px;
          font-weight: 650;
          color: #4b5563;
          margin-bottom: 16px;
          text-transform: uppercase;
          letter-spacing: 0.6px;
        }

        /* ── Price Tag Container ── */
        .car-price-box {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
          border: 1px solid #fed7aa;
          padding: 12px 18px;
          border-radius: 12px;
          margin-bottom: 18px;
        }

        .car-price-label {
          font-size: 12px;
          font-weight: 600;
          color: #9a3412;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .car-price {
          font-size: 28px;
          font-weight: 800;
          color: #ea580c;
          line-height: 1;
          letter-spacing: -0.5px;
        }

        /* ── Divider Lines ── */
        .car-info-divider {
          height: 1px;
          background: #f3f4f6;
          margin: 16px 0;
        }

        /* ── 2x2 Grid Specs Box ── */
        .car-spec-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 16px;
        }

        .car-spec-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13.5px;
          font-weight: 600;
          color: #1f2937;
          background: #f9fafb;
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid #f3f4f6;
          transition: all 0.2s ease;
        }

        .car-spec-item:hover {
          border-color: #e5e7eb;
          background: #f3f4f6;
        }

        .car-spec-item i {
          font-size: 16px;
          color: #ff6b00;
        }

        /* ── Bullet Highlights Checklist ── */
        .car-highlights {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin-bottom: 18px;
        }

        .highlight-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 4px;
          background: #fdf8f6;
          border: 1px solid #fdebe7;
          padding: 10px 6px;
          border-radius: 10px;
          font-size: 11.5px;
          color: #1f2937;
          font-weight: 650;
        }

        .highlight-badge i {
          color: #ff6b00;
          font-size: 14px;
        }

        /* ── Call Widget Card ── */
        .call-widget-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(135deg, #fffaf5 0%, #fff3ec 100%);
          border: 1px solid #fed7aa;
          padding: 14px 16px;
          border-radius: 14px;
          text-decoration: none;
          transition: all 0.25s ease;
          box-shadow: 0 4px 12px rgba(255, 107, 0, 0.05);
        }

        .call-widget-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(255, 107, 0, 0.12);
          border-color: #fb923c;
        }

        .call-widget-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .call-icon-circle {
          width: 42px;
          height: 42px;
          background: #ffffff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);
          color: #ff6b00;
          font-size: 18px;
        }

        .call-text-content {
          display: flex;
          flex-direction: column;
        }

        .call-title {
          font-size: 14.5px;
          font-weight: 750;
          color: #111827;
          line-height: 1.2;
        }

        .call-subtitle {
          font-size: 12px;
          font-weight: 500;
          color: #6b7280;
          margin-top: 2px;
        }

        .call-action-text {
          font-size: 13px;
          font-weight: 750;
          color: #ff6b00;
          margin-top: 3px;
        }

        .call-arrow-circle {
          width: 28px;
          height: 28px;
          background: rgba(255, 107, 0, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ff6b00;
          font-size: 12px;
          transition: transform 0.2s;
        }

        .call-widget-card:hover .call-arrow-circle {
          transform: translateX(3px);
          background: #ff6b00;
          color: #ffffff;
        }
      `}</style>

      <div className="car-info-wrapper">
        {/* Top Tag */}
        <div className="car-info-subtitle">
          {carItem.badge || carItem.category || "JAPANESE IMPORT"}
        </div>

        {/* Title (Includes Year, Brand, Model, and Variant/Trim together) */}
        <h2 className="car-info-title">
          {carItem.years} {carItem.brand} {carItem.model} {carItem.trim || ""}
        </h2>

        {/* Price Box */}
        <div className="car-price-box">
          <span className="car-price-label">Vehicle Price</span>
          <div className="car-price">£{formatNum(carItem.price)}</div>
        </div>

        {/* 2x2 Specs Grid */}
        <div className="car-spec-grid">
          <div className="car-spec-item">
            <i className="icon-autodeal-km1" />
            <span>{kmToMiles(carItem.km).toLocaleString()} Miles</span>
          </div>
          <div className="car-spec-item">
            <i className="icon-autodeal-diesel" />
            <span>{carItem.fuelType || "Hybrid"}</span>
          </div>
          <div className="car-spec-item">
            <i className="icon-autodeal-automatic" />
            <span>{carItem.transmission || "Automatic"}</span>
          </div>
          <div className="car-spec-item">
            <i className="icon-autodeal-condition" />
            <span>{carItem.condition || "Good"}</span>
          </div>
        </div>

        <div className="car-info-divider" />

        {/* Feature Highlights Grid */}
        <div className="car-highlights">
          <div className="highlight-badge">
            <i className="fa fa-check-circle" />
            <span>Quality Checked</span>
          </div>
          <div className="highlight-badge">
            <i className="fa fa-check-circle" />
            <span>Japanese Import</span>
          </div>
          <div className="highlight-badge">
            <i className="fa fa-check-circle" />
            <span>Finance Available</span>
          </div>
        </div>

        {/* Call Widget Section */}
        <a href="tel:+447383908070" className="call-widget-card">
          <div className="call-widget-left">
            <div className="call-icon-circle">
              <i className="fa fa-phone" />
            </div>
            <div className="call-text-content">
              <span className="call-title">Need help choosing?</span>
              <span className="call-subtitle">Speak with our vehicle specialist</span>
              <span className="call-action-text">Call UKA Auto Trade</span>
            </div>
          </div>
          <div className="call-arrow-circle">
            <i className="fa fa-chevron-right" />
          </div>
        </a>
      </div>
    </>
  );
}