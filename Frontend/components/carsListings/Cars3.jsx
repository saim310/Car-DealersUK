"use client";
import React, { useEffect, useReducer, useState, useMemo } from "react";
import { getImageUrl, kmToMiles } from "@/utils/exports";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { initialState, reducer } from "@/reducer/carFilterReducer";
import DropdownSelect from "../common/DropDownSelect";
import Pagination from "../common/Pagination";
import Pricing from "../common/Pricing";
import StatusBadge from "../common/StatusBadge";
import { featureOptions } from "@/data/filterOptions";
import ListGridToggler from "./ListGridToggler";
import FilterSidebar from "./FilterSidebar";
import useFetch from "@/hooks/useFetch"; // Use your custom hook

const categories = ["All car", "New car", "Used car"];

export default function Cars3() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
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
    exterior_color,
    features,
    filtered,
    sortingOption,
    sorted,
    currentPage,
    itemPerPage,
  } = state;

  // 1. Fetch real-time data from your backend
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

  // Default item per page
  useEffect(() => {
    allProps.setItemPerPage(12);
  }, []);

  // 2. Main Filtering Logic (Now using liveCars and Category Tabs)
  useEffect(() => {
    if (!liveCars) return;

    let results = [...liveCars];

    // Filter by Tab (All, New, Used)
    const activeCategory = categories[activeIndex];
    if (activeCategory === "New car") {
      results = results.filter((car) => car.condition?.toLowerCase() === "new");
    } else if (activeCategory === "Used car") {
      results = results.filter(
        (car) => car.condition?.toLowerCase() === "used",
      );
    }

    // Features filter
    if (features.length) {
      results = results.filter((elm) =>
        features.every((f) => elm.features?.includes(f)),
      );
    }

    // Basic dropdown filters
    if (body !== "Any Body")
      results = results.filter((elm) => body === elm.body);
    if (make !== "Any Make")
      results = results.filter((elm) => make === elm.brand);
    if (model !== "Any Model")
      results = results.filter((elm) => model === elm.model);
    if (fuel !== "Any Fuel")
      results = results.filter((elm) => fuel === elm.fuel_type);
    if (exterior_color !== "Any Color")
      results = results.filter((elm) => exterior_color === elm.exterior_color);

    // Range filters
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
    activeIndex,
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
    exterior_color,
    features,
  ]);

  // 3. Sorting Logic
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

  const [isGrid, setIsGrid] = useState(true);

  if (loading)
    return <div className="text-center py-5">Loading Inventory...</div>;

  return (
    <>
      <section className="listing-grid tf-section3">
        <div className="container2">
          <div className="row">
            <div className="col-lg-12">
              <div className="heading-section">
                <h2>{sorted.length}+ Quality Vehicles Available</h2>
              </div>
            </div>

            <div className="col-lg-12 flex gap-30 text-start">
              {/* Sidebar Filters - Shared component or logic */}
              <div className="sidebar-right-listing style-2">
                {/* ... (Keep your existing sidebar structure here) ... */}
              </div>

              <div className="sidebar-left-listing">
                <div className="row">
                  <div className="col-lg-12 listing-list-car-wrap listing-grid-car-wrap">
                    <div className="flat-tabs themesflat-tabs category-filter">
                      <div className="box-tab center flex-two mb-40 flex-wrap gap-20">
                        {/* Tab Menu */}
                        <ul className="menu-tab tab-title style1 flex">
                          {categories.map((category, index) => (
                            <li
                              key={index}
                              className={`item-title ${activeIndex === index ? "active" : ""}`}
                              onClick={() => setActiveIndex(index)}
                            >
                              <h5 className="inner">{category}</h5>
                            </li>
                          ))}
                        </ul>

                        <div className="box-2 flex gap-8 flex-wrap">
                          <ListGridToggler
                            isGrid={isGrid}
                            setIsGrid={setIsGrid}
                          />
                          <div className="wd-find-select flex gap-8">
                            <DropdownSelect
                              onChange={(v) =>
                                allProps.setItemPerPage(
                                  parseInt(v.match(/\d+/)[0]),
                                )
                              }
                              options={["Show: 12", "Show: 16", "Show: 20"]}
                            />
                            <DropdownSelect
                              selectedValue={sortingOption}
                              onChange={allProps.setSortingOption}
                              options={[
                                "Sort by (Default)",
                                "Price Ascending",
                                "Price Descending",
                              ]}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="content-tab">
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
                                  <div className="year flag-tag">
                                    {car.years}
                                  </div>
                                  <div style={{ position: "absolute", top: "10px", right: "10px", zIndex: 10 }}>
                                    <StatusBadge status={car.status} />
                                  </div>
                                  <div className="img-style">
                                    <Image
                                      alt={car.listing_title}
                                      src={
                                        car.images?.[0] ||
                                        "/assets/images/placeholder.jpg"
                                      }
                                      width={450}
                                      height={338}
                                    />
                                  </div>
                                </div>
                                <div className="content">
                                  <div className="inner1">
                                    <div className="text-address">
                                      <p className="text-color-3 font">
                                        {car.type}
                                      </p>
                                    </div>
                                    <h5 className="link-style-1">
                                      <Link
                                        href={`/listing-detail-v1/${car.id}`}
                                      >
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
                      </div>
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
