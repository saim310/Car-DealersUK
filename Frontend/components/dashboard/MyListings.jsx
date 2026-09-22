"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import StatusBadge from "../common/StatusBadge";
import useFetch from "@/hooks/useFetch";
import useSubmit from "@/hooks/useSubmit";
import { getImageUrl } from "@/utils/exports";

const PLACEHOLDER_IMAGE = "/assets/images/section/compare.jpg";

const getListingCoverImage = (listing) => {
  if (!listing || !Array.isArray(listing.images) || !listing.images.length) {
    return PLACEHOLDER_IMAGE;
  }

  return getImageUrl(listing.images[0], PLACEHOLDER_IMAGE);
};

const formatPostingDate = (value) => {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function MyListings() {
  const [searchText, setSearchText] = useState("");
  const { data, loading, refetch } = useFetch("/listings", { immediate: true });
  const { submit, loading: deleting } = useSubmit();

  const listings = useMemo(() => {
    const source = Array.isArray(data) ? data : [];
    const term = searchText.trim().toLowerCase();
    const termWithoutSpaces = term.replace(/\s+/g, "");

    if (!term) {
      return source;
    }

    return source.filter((item) => {
      // Check regular fields (title, model, brand)
      const regularFieldsMatch = [item.listing_title, item.model, item.brand]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term));

      // Check plate number with space handling
      const plateNumberMatch = 
        item.plate_number &&
        (String(item.plate_number).toLowerCase().includes(term) ||
         String(item.plate_number).toLowerCase().replace(/\s+/g, "").includes(termWithoutSpaces));

      // Check VIN number with space handling (partial, ignore spaces)
      const vin = item.vin_number || "";
      const vinMatch = vin.toLowerCase().includes(term) || vin.replace(/\s+/g, "").includes(termWithoutSpaces);

      return regularFieldsMatch || plateNumberMatch || vinMatch;
    });
  }, [data, searchText]);

  const totalListings = listings.length;
  const pricedListings = useMemo(
    () =>
      listings.filter(
        (item) =>
          item.price !== null && item.price !== undefined && item.price !== "",
      ).length,
    [listings],
  );

  const latestPosting = useMemo(() => {
    const timestamps = listings
      .map((item) =>
        item.created_at ? new Date(item.created_at).getTime() : 0,
      )
      .filter(Boolean);

    if (!timestamps.length) {
      return "-";
    }

    return formatPostingDate(new Date(Math.max(...timestamps)));
  }, [listings]);

  const handleDelete = async (id) => {
    const shouldDelete = window.confirm("Delete this listing?");

    if (!shouldDelete) {
      return;
    }

    const response = await submit(`/listings/${id}`, {}, { method: "DELETE" });

    if (!response) {
      return;
    }

    toast.success("Listing deleted");
    refetch("/listings");
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div className="content-area">
            <main id="main" className="main-content">
              <div className="tfcl-dashboard my-listing-enhanced">
                <div className="my-listing-hero mb-3">
                  <div>
                    <h1 className="admin-title mb-1">My listing</h1>
                    <p className="my-listing-subtitle mb-0">
                      Manage your inventory, update details, and keep your
                      listings fresh.
                    </p>
                  </div>
                  <Link
                    href="/add-listing"
                    className="pre-btn my-listing-add-btn"
                  >
                    Add New Listing
                  </Link>
                </div>

                <div className="my-listing-stats-grid mb-3">
                  <div className="my-listing-stat-card">
                    <span className="label">Visible Listings</span>
                    <strong>{totalListings}</strong>
                  </div>
                  <div className="my-listing-stat-card">
                    <span className="label">Priced Listings</span>
                    <strong>{pricedListings}</strong>
                  </div>
                  <div className="my-listing-stat-card">
                    <span className="label">Latest Posting</span>
                    <strong>{latestPosting}</strong>
                  </div>
                </div>

                <div className="tfcl-dashboard-middle mt-2">
                  <div className="row">
                    <div className="tfcl-dashboard-middle-left col-md-12">
                      <div className="tfcl-dashboard-listing">
                        <div className="row align-items-center my-listing-toolbar gy-3">
                          <div className="col-xl-4 col-lg-7">
                            <div className="group-input-icon search">
                              <input
                                type="text"
                                name="title_search"
                                id="title_search"
                                value={searchText}
                                onChange={(event) =>
                                  setSearchText(event.target.value)
                                }
                                placeholder="Search by title, model, brand, or plate number..."
                              />
                            </div>
                          </div>
                          <div className="col-xl-8 col-lg-5 text-lg-end">
                            <span className="result-text my-listing-result-text">
                              <b>{listings.length}</b>{" "}
                              {loading ? "loading..." : "results found"}
                            </span>
                          </div>
                        </div>

                        <div className="tfcl-table-listing">
                          {!loading && !listings.length ? (
                            <div className="my-listing-empty-state">
                              <h4>No listings found</h4>
                              <p>
                                {searchText
                                  ? "Try another keyword or clear the search to view all listings."
                                  : "Start by creating your first listing to appear here."}
                              </p>
                              <Link
                                href="/add-listing"
                                className="pre-btn my-listing-add-btn"
                              >
                                Create Listing
                              </Link>
                            </div>
                          ) : null}

                          <div className="table-responsive">
                            <table className="table my-listing-table">
                              <thead>
                                <tr>
                                  <th>Vehicle</th>
                                  <th>Status</th>
                                  <th>Posting date</th>
                                  <th>Actions</th>
                                </tr>
                              </thead>

                              <tbody className="tfcl-table-content">
                                {loading ? (
                                  <tr>
                                    <td colSpan={4}>Loading listings...</td>
                                  </tr>
                                ) : null}

                                {!loading
                                  ? listings.map((item) => (
                                      <tr key={item.id}>
                                        <td className="column-listing">
                                          <div className="tfcl-listing-product">
                                            <img
                                              alt={
                                                item.listing_title ||
                                                "listing image"
                                              }
                                              src={getListingCoverImage(item)}
                                              width={168}
                                              height={95}
                                            />

                                            <div className="tfcl-listing-summary">
                                              <h4 className="tfcl-listing-title">
                                                {item.listing_title}
                                              </h4>
                                              <div className="my-listing-meta">
                                                <span>
                                                  {item.model || "Model n/a"}
                                                </span>
                                                <span>
                                                  {item.brand || "Brand n/a"}
                                                </span>
                                              </div>
                                              <div className="price">
                                                <div className="inner tfcl-listing-price">
                                                  {item.price === null ||
                                                  item.price === undefined
                                                    ? "Price not set"
                                                    : `£${Number(item.price).toLocaleString()}`}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </td>

                                        <td className="column-status">
                                          <StatusBadge status={item.status} />
                                        </td>

                                        <td className="column-date">
                                          <div className="tfcl-listing-date">
                                            {formatPostingDate(item.created_at)}
                                          </div>
                                        </td>

                                        <td className="column-controller">
                                          <div className="inner-controller">
                                            <Link
                                              href={`/add-listing?id=${item.id}&edit=true`}
                                              className="btn-action my-listing-action-edit"
                                            >
                                              Edit
                                            </Link>
                                          </div>
                                          <div className="inner-controller">
                                            <button
                                              type="button"
                                              className="btn-action my-listing-action-delete"
                                              onClick={() =>
                                                handleDelete(item.id)
                                              }
                                              disabled={deleting}
                                            >
                                              Delete
                                            </button>
                                          </div>
                                        </td>
                                      </tr>
                                    ))
                                  : null}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
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
