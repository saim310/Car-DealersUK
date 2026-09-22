"use client";

import React, { useMemo, useState } from "react";
import useFetch from "@/hooks/useFetch";

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function NewsletterSubscribers() {
  const [searchText, setSearchText] = useState("");
  const { data, loading, refetch } = useFetch("/newsletter", {
    immediate: true,
  });

  const subscribers = useMemo(() => {
    const source = Array.isArray(data) ? data : [];
    const term = searchText.trim().toLowerCase();
    if (!term) return source;

    return source.filter((item) =>
      item.email.toLowerCase().includes(term),
    );
  }, [data, searchText]);

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div className="content-area">
            <main id="main" className="main-content">
              <div className="tfcl-dashboard">
                <div className="dashboard-header mb-4">
                  <h1 className="admin-title mb-1">Newsletter Subscribers</h1>
                  <p className="my-listing-subtitle mb-0">
                    View the emails collected from the footer newsletter form.
                  </p>
                </div>

                <div className="tfcl-dashboard-middle mt-4">
                  <div className="row align-items-center gy-3 mb-3">
                    <div className="col-lg-6">
                      <div className="group-input-icon search">
                        <input
                          type="text"
                          name="subscriber_search"
                          value={searchText}
                          onChange={(event) => setSearchText(event.target.value)}
                          placeholder="Search by email..."
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 text-lg-end">
                      <span className="result-text">
                        {loading
                          ? "Loading subscribers..."
                          : `${subscribers.length} subscriber${
                              subscribers.length === 1 ? "" : "s"
                            } found`}
                      </span>
                    </div>
                  </div>

                  <div className="tfcl-table-listing">
                    <div className="table-responsive">
                      <table className="table my-listing-table" style={{ width: "100%" }}>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Email</th>
                            <th>Signup Date</th>
                          </tr>
                        </thead>
                        <tbody className="tfcl-table-content">
                          {loading ? (
                            <tr>
                              <td colSpan={3}>Loading subscribers...</td>
                            </tr>
                          ) : null}

                          {!loading && !subscribers.length ? (
                            <tr>
                              <td colSpan={3}>
                                No subscribers found. Try refreshing the page.
                              </td>
                            </tr>
                          ) : null}

                          {!loading && subscribers.length
                            ? subscribers.map((subscriber) => (
                                <tr key={subscriber.id}>
                                  <td>{subscriber.id}</td>
                                  <td>{subscriber.email}</td>
                                  <td>{formatDate(subscriber.signup_date)}</td>
                                </tr>
                              ))
                            : null}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
