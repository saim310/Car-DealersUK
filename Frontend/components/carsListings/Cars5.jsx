"use client";
import Link from "next/link";
import { getImageUrl, kmToMiles } from "@/utils/exports";
import { useEffect, useReducer, useState } from "react";
import { initialState, reducer } from "@/reducer/carFilterReducer";
import DropdownSelect from "../common/DropDownSelect";
import StatusBadge from "../common/StatusBadge";
import FilterSidebar from "./FilterSidebar";
import Pagination from "../common/Pagination";
import ListGridToggler from "./ListGridToggler";
import ListingMap from "./ListingMap";
import useFetch from "@/hooks/useFetch"; // Use your custom hook

export default function Cars5() {
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
    features,
    filtered,
    sortingOption,
    sorted,
    currentPage,
    itemPerPage,
  } = state;

  // 1. Fetch live inventory from your API
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

  // 2. Main Filtering Logic (Using liveCars from API)
  useEffect(() => {
    if (!liveCars) return;

    let results = [...liveCars];

    if (features.length) {
      results = results.filter((elm) =>
        features.every((f) => elm.features?.includes(f)),
      );
    }
    if (body !== "Any Body")
      results = results.filter((elm) => body === elm.body);
    if (make !== "Any Make")
      results = results.filter((elm) => make === elm.brand);
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

  const [isGrid, setIsGrid] = useState(false);

  if (loading)
    return <div className="text-center py-5">Loading Live Inventory...</div>;

  return (
    <>
      <div className="wrap-map flat-featured listing-grid style flex listing-wrap-map">
        <div className="content-left wg-dream sidebar-left-listing listing-list-car-wrap">
          <div className="category-filter flex justify-space align-center mb-30 flex-wrap gap-20">
            <div className="box-1">
              <h2 className="heading-listing">
                {sorted.length} Cars Available
              </h2>
            </div>
            <div className="box-2 flex flex-wrap gap-8">
              <ListGridToggler isGrid={isGrid} setIsGrid={setIsGrid} />
              <div className="wd-find-select flex flex-wrap gap-20">
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
              <a
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasRight"
                className="filter"
              >
                Filter <i className="icon-autodeal-filter" />
              </a>
            </div>
          </div>

          <div
            className={`list-car-1 list-car-list-1 map-listing-car ${isGrid ? "list-car-grid-1" : ""}`}
          >
            {sorted.length ? (
              sorted
                .slice((currentPage - 1) * 4, currentPage * 4)
                .map((car, i) => (
                  <div
                    key={car.id || i}
                    className="box-car-list style-2 hv-one mb-20"
                  >
                    <div className="image-group relative">
                      <div className="year flag-tag">{car.years}</div>
                      <div style={{ position: "absolute", top: "10px", right: "10px", zIndex: 10 }}>
                        <StatusBadge status={car.status} />
                      </div>
                      <ul className="change-heart flex">
                        <li className="box-icon w-32">
                          <Link href={`/my-favorite`} className="icon">
                            <i className="far fa-heart" />
                          </Link>
                        </li>
                      </ul>
                      <div className="img-style">
                        <Image
                          className="lazyload"
                          alt={car.listing_title}
                          src={
                            car.images?.[0] || "/assets/images/placeholder.jpg"
                          }
                          width={615}
                          height={462}
                        />
                      </div>
                    </div>
                    <div className="content">
                      <div className="text-address">
                        <p className="text-color-3 font">{car.type}</p>
                      </div>
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
                        <div className="icons flex-three">
                          <i className="icon-autodeal-automatic" />
                          <span>{car.transmission}</span>
                        </div>
                      </div>
                      <div className="money fs-20 fw-5 lh-25 text-color-3">
                        {car.price ? `$${Number(car.price).toLocaleString()}` : "Price upon request"}
                      </div>
                      <div className="days-box flex justify-space align-center flex-wrap">
                        <div className="img-author">
                          <span className="font text-color-2 fw-5">
                            {car.brand} {car.model}
                          </span>
                        </div>
                        <Link
                          href={`/listing-detail-v1/${car.id}`}
                          className="view-car"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <div className="fs-16 p-4">
                No vehicles found. Try adjusting your filters.
              </div>
            )}
          </div>

          <div className="themesflat-pagination clearfix mt-40">
            <Pagination
              currentPage={currentPage}
              setPage={(v) => allProps.setCurrentPage(v)}
              itemLength={sorted.length}
              itemPerPage={4}
            />
          </div>
        </div>

        {/* Map Section */}
        <div className="content-right fixed-space po-sticky">
          <div id="map" className="row-height">
            {/* Passing sorted list to map for dynamic pins */}
            <ListingMap cars={sorted} />
          </div>
        </div>
      </div>
      <FilterSidebar clearFilter={clearFilter} allProps={allProps} />
    </>
  );
}
