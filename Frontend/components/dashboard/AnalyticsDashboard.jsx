"use client";

import React, { useMemo } from "react";
import useFetch from "@/hooks/useFetch";

const BRAND_ORANGE = "#ff7101";
const NO_IMAGE_SVG = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='45' viewBox='0 0 60 45'><rect width='60' height='45' fill='%23f1f3f5'/><text x='50%21' y='50%21' font-family='sans-serif' font-size='8' fill='%23adb5bd' text-anchor='middle' dy='.3em'>NO IMAGE</text></svg>`;

export default function AnalyticsDashboard() {
  const { data, loading, error } = useFetch("/analytics/stats", {
    immediate: true,
    isAuth: true,
  });

  const topPages = data?.topPages || [];
  const topProperties = data?.topProperties || [];

  const maxViews = useMemo(
    () =>
      topProperties.length > 0
        ? Math.max(...topProperties.map((p) => p.view_count))
        : 1,
    [topProperties],
  );

  if (loading)
    return (
      <div className="p-5 text-center">
        <div className="spinner-border" style={{ color: BRAND_ORANGE }} />
      </div>
    );

  return (
    <div className="container-fluid py-4 bg-light min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-4 px-2">
        <h2 className="fw-bold">Inventory Performance</h2>
        <span className="badge bg-white text-success border px-3 py-2 rounded-pill shadow-sm">
          ● Live Data
        </span>
      </div>

      <div className="row g-4">
        {/* TOP PROPERTIES TABLE */}
        <div className="col-xl-8">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="card-header bg-white py-4 border-0">
              <h5 className="mb-0 fw-bold">Top Listings</h5>
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light">
                  <tr className="small text-uppercase text-muted">
                    <th className="ps-4 border-0">Vehicle</th>
                    <th className="border-0 text-end">Price</th>
                    <th className="border-0 px-4">Popularity</th>
                    <th className="border-0 text-center pe-4">Views</th>
                  </tr>
                </thead>
                <tbody>
                  {topProperties.map((car) => (
                    <tr key={car.listing_id}>
                      <td className="ps-4 py-3">
                        <div className="d-flex align-items-center">
                          <div
                            className="rounded-3 border me-3"
                            style={{
                              width: "60px",
                              height: "45px",
                              backgroundImage: `url(${car.thumbnail}), url("${NO_IMAGE_SVG}")`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          />
                          <div>
                            <div className="fw-bold">{car.listing_title}</div>
                            <small className="text-muted">
                              {car.brand} • {car.condition}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td
                        className="text-end fw-bold"
                        style={{ color: BRAND_ORANGE }}
                      >
                        £{car.price.toLocaleString()}
                      </td>
                      <td className="px-4">
                        <div
                          className="progress rounded-pill"
                          style={{ height: "6px" }}
                        >
                          <div
                            className="progress-bar"
                            style={{
                              width: `${(car.view_count / maxViews) * 100}%`,
                              backgroundColor: BRAND_ORANGE,
                            }}
                          />
                        </div>
                      </td>
                      <td className="text-center pe-4 fw-bold">
                        {car.view_count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* STATS SIDEBAR */}
        <div className="col-xl-4">
          <div
            className="card border-0 shadow-sm rounded-4 text-white mb-4"
            style={{ backgroundColor: BRAND_ORANGE }}
          >
            <div className="card-body p-4 text-center">
              <p className="small text-uppercase fw-bold opacity-75 mb-1">
                Total Page Visits
              </p>
              <h2 className="display-6 fw-bold mb-0 text-white">
                {topPages
                  .reduce((s, p) => s + p.visit_count, 0)
                  .toLocaleString()}
              </h2>
            </div>
          </div>

          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="card-header bg-white py-4 px-4 border-0">
              <h5 className="mb-0 fw-bold">Traffic by Path</h5>
            </div>
            <div className="card-body px-4 pt-0">
              {topPages.map((page, i) => (
                <div key={i} className="mb-4">
                  <div className="d-flex justify-content-between mb-1">
                    <code
                      className="small fw-bold"
                      style={{ color: BRAND_ORANGE }}
                    >
                      {page.page_path}
                    </code>
                    <span className="small text-muted">{page.visit_count}</span>
                  </div>
                  <div className="progress" style={{ height: "3px" }}>
                    <div
                      className="progress-bar opacity-50"
                      style={{
                        width: `${(page.visit_count / (topPages[0]?.visit_count || 1)) * 100}%`,
                        backgroundColor: BRAND_ORANGE,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
