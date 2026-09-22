"use client";
import React, { useEffect, useReducer, useState, useMemo } from "react";
import Pricing from "../common/Pricing";
import Image from "next/image";
import Link from "next/link";
import DropdownSelect from "../common/DropDownSelect";
import StatusBadge from "../common/StatusBadge";
import { featureOptions } from "@/data/filterOptions";
import { initialState, reducer } from "@/reducer/carFilterReducer";
import Pagination from "../common/Pagination";
import ListGridToggler from "./ListGridToggler";
import FilterSidebar from "./FilterSidebar";
import useFetch from "@/hooks/useFetch"; // Use your custom hook
import { getImageUrl, kmToMiles } from "@/utils/exports";

export default function Cars1() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    price,
    km,
    year,
    body,
    make,
    model,
    fuel,
    transmission,
    location,
    door,
    cylinder,
    color,
    exterior_color,
    search,
    features,
    filtered,
    sortingOption,
    sorted,
    currentPage,
    itemPerPage,
  } = state;

  // 1. Fetch live data from your API
  const { data: liveCars, loading } = useFetch("/listings", {
    immediate: true,
  });

  const allProps = {
    ...state,
    setPrice: (value) => dispatch({ type: "SET_PRICE", payload: value }),
    setYear: (value) => dispatch({ type: "SET_YEAR", payload: value }),
    setModel: (value) => dispatch({ type: "SET_MODEL", payload: value }),
    setKM: (value) => dispatch({ type: "SET_KM", payload: value }),
    setBody: (value) => dispatch({ type: "SET_BODY", payload: value }),
    setMake: (value) => dispatch({ type: "SET_MAKE", payload: value }),
    setFuel: (value) => dispatch({ type: "SET_FUEL", payload: value }),
    setTransmission: (value) =>
      dispatch({ type: "SET_TRANSMISSION", payload: value }),
    setLocation: (value) => dispatch({ type: "SET_LOCATION", payload: value }),
    setDoor: (value) => dispatch({ type: "SET_DOOR", payload: value }),
    setCylinder: (value) => dispatch({ type: "SET_CYLINDER", payload: value }),
    setExteriorColor: (value) => dispatch({ type: "SET_EXTERIOR_COLOR", payload: value }),
    setSearch: (value) => dispatch({ type: "SET_SEARCH", payload: value }),
    setFeatures: (newFeature) => {
      const updated = [...features].includes(newFeature)
        ? features.filter((elm) => elm !== newFeature)
        : [...features, newFeature];
      dispatch({ type: "SET_FEATURES", payload: updated });
    },
    setSortingOption: (value) =>
      dispatch({ type: "SET_SORTING_OPTION", payload: value }),
    setCurrentPage: (value) =>
      dispatch({ type: "SET_CURRENT_PAGE", payload: value }),
    setItemPerPage: (value) => {
      dispatch({ type: "SET_CURRENT_PAGE", payload: 1 });
      dispatch({ type: "SET_ITEM_PER_PAGE", payload: value });
    },
  };

  const clearFilter = () => dispatch({ type: "CLEAR_FILTER" });

  // 2. Filter logic using the fetched 'liveCars' instead of 'allCars'
  useEffect(() => {
    if (!liveCars) return;

    let results = [...liveCars];

    if (search) {
      const query = search.toLowerCase();
      results = results.filter((elm) =>
        elm.listing_title?.toLowerCase().includes(query) ||
        elm.model?.toLowerCase().includes(query) ||
        elm.brand?.toLowerCase().includes(query) ||
        elm.plate_number?.toLowerCase().includes(query) ||
        elm.description?.toLowerCase().includes(query)
      );
    }

    if (features.length) {
      results = results.filter((elm) =>
        features.every((f) => elm.features?.includes(f)),
      );
    }
    if (body !== "Any Body")
      results = results.filter((elm) => body === elm.body);
    if (make !== "Any Make")
      results = results.filter((elm) => make === elm.brand); // Adjusted to 'brand' per your AddListing code
    if (model !== "Any Model")
      results = results.filter((elm) => model === elm.model);
    if (fuel !== "Any Fuel")
      results = results.filter((elm) => fuel === elm.fuel_type);

    results = results.filter((elm) => {
      const elmMiles = kmToMiles(elm.mileage);
      return (
        elm.price >= price[0] &&
        elm.price <= price[1] &&
        elmMiles >= km[0] &&
        elmMiles <= km[1] &&
        elm.years >= year[0] &&
        elm.years <= year[1]
      );
    });

    dispatch({ type: "SET_FILTERED", payload: results });
  }, [
    liveCars,
    price,
    km,
    year,
    body,
    make,
    model,
    fuel,
    transmission,
    location,
    door,
    cylinder,
    color,
    exterior_color,
    search,
    features,
  ]);

  // 3. Sorting logic
  useEffect(() => {
    let sortResult = [...filtered];
    if (sortingOption === "Price Ascending") {
      sortResult.sort((a, b) => a.price - b.price);
    } else if (sortingOption === "Price Descending") {
      sortResult.sort((a, b) => b.price - a.price);
    }
    dispatch({ type: "SET_SORTED", payload: sortResult });
    dispatch({ type: "SET_CURRENT_PAGE", payload: 1 });
  }, [filtered, sortingOption]);

  const [isGrid, setIsGrid] = useState(false);

  if (loading)
    return <div className="text-center py-5">Loading Inventory...</div>;

  return (
    <>
      <section className="listing-grid tf-section3">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="heading-section">
                <h2>{sorted.length}+ Quality Used Cars Found</h2>
              </div>
            </div>

            <div className="col-lg-12 flex gap-30 text-start">
              {/* Sidebar Filters */}
              <div className="sidebar-right-listing style-2">
                <div className="sidebar-title flex-two flex-wrap">
                  <h4>Filters</h4>
                  <a
                    className="fw-5 font clear text-color-2"
                    onClick={clearFilter}
                    style={{ cursor: "pointer" }}
                  >
                    <i className="icon-autodeal-plus" /> Clear
                  </a>
                </div>
                <div className="form-filter-siderbar">
                  <FilterSidebar allProps={allProps} clearFilter={clearFilter} />
                </div>
              </div>

              {/* Main Content Area */}
              <div className="sidebar-left-listing">
                <div className="row">
                  <div className="col-lg-12 listing-list-car-wrap">
                    <div className="category-filter flex justify-space align-center mb-30 flex-wrap gap-8">
                      <div className="box-1 flex align-center flex-wrap gap-8">
                        <p>
                          {sorted.length > 0
                            ? `Showing ${(currentPage - 1) * itemPerPage + 1} - ${Math.min(currentPage * itemPerPage, sorted.length)} of ${sorted.length} results`
                            : "No results found."}
                        </p>
                      </div>
                      <div className="box-2 flex flex-wrap gap-8">
                        <ListGridToggler
                          isGrid={isGrid}
                          setIsGrid={setIsGrid}
                        />
                      </div>
                    </div>

                    <div
                      className={`list-car-list-1 ${isGrid ? "list-car-grid-1" : ""}`}
                    >
                      {sorted
                        .slice(
                          (currentPage - 1) * itemPerPage,
                          currentPage * itemPerPage,
                        )
                        .map((car, i) => (
                          <div
                            key={car.id || i}
                            className="box-car-list style-2 hv-one"
onClick={() => router.push(`/listing-detail-v1/${car.id}`)}
                          >
                            <div className="image-group relative">
                              <div className="year flag-tag">{car.years}</div>
                              <div style={{ position: "absolute", top: "10px", right: "10px", zIndex: 10 }}>
                                <StatusBadge status={car.status} />
                              </div>
                              <div className="img-style">
                                <Image
                                  alt={car.listing_title}
                                  src={getImageUrl(car.images?.[0], "/assets/images/placeholder.jpg")}
                                  width={450}
                                  height={338}
                                />
                              </div>
                            </div>
                            <div className="content">
                              <div className="inner1">
                                <h5 className="link-style-1">
                                  <Link href={`/listing-detail-v1/${car.id}`}>
                                    {car.listing_title}
                                  </Link>
                                </h5>
                                <div className="icon-box flex flex-wrap">
                                  <div className="icons flex-three">
                                    <i className="icon-autodeal-km1" />
                                    <span>
                                      {kmToMiles(car.mileage).toLocaleString()} Miles
                                    </span>
                                  </div>
                                  <div className="icons flex-three">
                                    <i className="icon-autodeal-diesel" />
                                    <span>{car.fuel_type}</span>
                                  </div>
                                </div>
                                <div className="money fs-20 fw-5 lh-25 text-color-3">
                                  {car.price ? `$${Number(car.price).toLocaleString()}` : "Price upon request"}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>

                    <div className="themesflat-pagination clearfix mt-40">
                      <Pagination
                        currentPage={currentPage}
                        setPage={(v) => allProps.setCurrentPage(v)}
                        itemLength={sorted.length}
                        itemPerPage={itemPerPage}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <FilterSidebar allProps={allProps} clearFilter={clearFilter} />
    </>
  );
}
