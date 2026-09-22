"use client";

import React, { useEffect, useReducer, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import FlatFilter3 from "../common/FlatFilter3";
import StatusBadge from "../common/StatusBadge";
import Pagination from "../common/Pagination";
import { useSearchParams } from "next/navigation";
import { 
  apiURL, 
  sortCarsWithRegistrationPriority, 
  normalizeBodyType, 
  filterAndSortBodyTypes, 
  kmToMiles 
} from "@/utils/exports";
import { initialState, reducer } from "@/reducer/carFilterReducer";

export default function Cars2() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");
  const [state, dispatch] = useReducer(reducer, initialState);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    price, km, year, engineSize, body, bodies, make, makes, model, models, fuel, fuels,
    transmission, transmissions, location, locations, door, cylinder, units, units_list, color,
    exterior_color, exterior_colors, condition, conditions, road_tax, search, vin_number, features,
    filtered, sortingOption, sorted, currentPage,
  } = state;

  const allProps = {
    ...state,
    setPrice: (v) => { dispatch({ type: "SET_PRICE", payload: v }); dispatch({ type: "SET_CURRENT_PAGE", payload: 1 }); },
    setYear: (v) => { dispatch({ type: "SET_YEAR", payload: v }); dispatch({ type: "SET_CURRENT_PAGE", payload: 1 }); },
    setEngineSize: (v) => { dispatch({ type: "SET_ENGINE_SIZE", payload: v }); dispatch({ type: "SET_CURRENT_PAGE", payload: 1 }); },
    setModel: (v) => { dispatch({ type: "SET_MODEL", payload: v }); dispatch({ type: "SET_CURRENT_PAGE", payload: 1 }); },
    setModels: (v) => { dispatch({ type: "SET_MODELS", payload: v }); dispatch({ type: "SET_CURRENT_PAGE", payload: 1 }); },
    setKM: (v) => { dispatch({ type: "SET_KM", payload: v }); dispatch({ type: "SET_CURRENT_PAGE", payload: 1 }); },
    setBody: (v) => { dispatch({ type: "SET_BODY", payload: v }); dispatch({ type: "SET_CURRENT_PAGE", payload: 1 }); },
    setBodies: (v) => { dispatch({ type: "SET_BODIES", payload: v }); dispatch({ type: "SET_CURRENT_PAGE", payload: 1 }); },
    setMake: (v) => {
      dispatch({ type: "SET_MAKE", payload: v });
      dispatch({ type: "SET_MAKES", payload: v === "Any Make" ? [] : [v] });
      dispatch({ type: "SET_CURRENT_PAGE", payload: 1 });
    },
    setMakes: (v) => { dispatch({ type: "SET_MAKES", payload: v }); dispatch({ type: "SET_CURRENT_PAGE", payload: 1 }); },
    setFuel: (v) => { dispatch({ type: "SET_FUEL", payload: v }); dispatch({ type: "SET_CURRENT_PAGE", payload: 1 }); },
    setFuels: (v) => { dispatch({ type: "SET_FUELS", payload: v }); dispatch({ type: "SET_CURRENT_PAGE", payload: 1 }); },
    setTransmission: (v) => { dispatch({ type: "SET_TRANSMISSION", payload: v }); dispatch({ type: "SET_CURRENT_PAGE", payload: 1 }); },
    setTransmissions: (v) => { dispatch({ type: "SET_TRANSMISSIONS", payload: v }); dispatch({ type: "SET_CURRENT_PAGE", payload: 1 }); },
    setLocation: (v) => { dispatch({ type: "SET_LOCATION", payload: v }); dispatch({ type: "SET_CURRENT_PAGE", payload: 1 }); },
    setLocations: (v) => { dispatch({ type: "SET_LOCATIONS", payload: v }); dispatch({ type: "SET_CURRENT_PAGE", payload: 1 }); },
    setDoor: (v) => { dispatch({ type: "SET_DOOR", payload: v }); dispatch({ type: "SET_CURRENT_PAGE", payload: 1 }); },
    setCylinder: (v) => { dispatch({ type: "SET_CYLINDER", payload: v }); dispatch({ type: "SET_CURRENT_PAGE", payload: 1 }); },
    setUnits: (v) => { dispatch({ type: "SET_UNITS", payload: v }); dispatch({ type: "SET_CURRENT_PAGE", payload: 1 }); },
    setUnitsList: (v) => { dispatch({ type: "SET_UNITS_LIST", payload: v }); dispatch({ type: "SET_CURRENT_PAGE", payload: 1 }); },
    setExteriorColor: (v) => { dispatch({ type: "SET_EXTERIOR_COLOR", payload: v }); dispatch({ type: "SET_CURRENT_PAGE", payload: 1 }); },
    setExteriorColors: (v) => { dispatch({ type: "SET_EXTERIOR_COLORS", payload: v }); dispatch({ type: "SET_CURRENT_PAGE", payload: 1 }); },
    setConditions: (v) => { dispatch({ type: "SET_CONDITIONS", payload: v }); dispatch({ type: "SET_CURRENT_PAGE", payload: 1 }); },
    setSearch: (v) => { dispatch({ type: "SET_SEARCH", payload: v }); dispatch({ type: "SET_CURRENT_PAGE", payload: 1 }); },
    setVinNumber: (v) => { dispatch({ type: "SET_VIN_NUMBER", payload: v }); dispatch({ type: "SET_CURRENT_PAGE", payload: 1 }); },
    setFeatures: (f) => {
      const updated = features.includes(f) ? features.filter((e) => e !== f) : [...features, f];
      dispatch({ type: "SET_FEATURES", payload: updated });
      dispatch({ type: "SET_CURRENT_PAGE", payload: 1 });
    },
    setSortingOption: (v) => dispatch({ type: "SET_SORTING_OPTION", payload: v }),
    setCurrentPage: (v) => dispatch({ type: "SET_CURRENT_PAGE", payload: v }),
    setItemPerPage: (v) => {
      dispatch({ type: "SET_CURRENT_PAGE", payload: 1 });
      dispatch({ type: "SET_ITEM_PER_PAGE", payload: v });
    },
  };

  const calculateMonthlyPayment = (carPrice) => {
    if (!carPrice || carPrice <= 0) return 0;
    const principal = carPrice;
    const annualInterestRate = 0.15;
    const monthlyInterestRate = annualInterestRate / 12;
    const numberOfMonths = 5 * 12;
    const monthlyPayment =
      (principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfMonths)) /
      (Math.pow(1 + monthlyInterestRate, numberOfMonths) - 1);
    return Math.round(monthlyPayment);
  };

  // Fetch listings from backend API
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const baseUrl = apiURL || "https://apis.ukaautotrade.co.uk/api";
        let url = `${baseUrl}/listings`;
        const params = new URLSearchParams();

        if (typeParam) params.append("type", typeParam);
        if (bodies && bodies.length > 0) params.append("type", bodies.join(","));
        else if (body && body !== "Any Body") params.append("type", body);

        if (makes && makes.length > 0) params.append("makes", makes.join(","));
        else if (make && make !== "Any Make") params.append("brand", make);

        if (models && models.length > 0) params.append("models", models.join(","));
        else if (model && model !== "Any Model") params.append("model", model);

        if (fuels && fuels.length > 0) params.append("fuel_type", fuels.join(","));
        else if (fuel && fuel !== "Any Fuel") params.append("fuel_type", fuel);

        if (transmissions && transmissions.length > 0) params.append("transmission", transmissions.join(","));
        else if (transmission && transmission !== "Any Transmission") params.append("transmission", transmission);

        if (price) {
          if (price[0] > 0) params.append("minPrice", price[0]);
          if (price[1] < 30000) params.append("maxPrice", price[1]);
        }

        if ([...params].length > 0) url += `?${params.toString()}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch listings");
        const data = await res.json();

        const transformed = data.map((l) => ({
          id: l.id,
          title: l.listing_title,
          price: parseFloat(l.price) || 0,
          imgSrc: l.images?.length > 0 ? l.images[0] : "/assets/images/car-list/car1.jpg",
          km: parseInt(l.mileage) || 0,
          fuelType: l.fuel_type || "N/A",
          transmission: l.transmission || "N/A",
          engineSize: l.engine_size ? `${l.engine_size}L` : "2.0L",
          year: (() => { const y = parseInt(l.years); return y >= 2000 && y <= 2030 ? y : new Date().getFullYear(); })(),
          body: normalizeBodyType(l.type) || l.type || "MPV",
          make: l.brand,
          model: l.model || l.listing_title,
          vin: l.vin_number || l.vin || "",
          plateNumber: l.plate_number || l.registration_number || l.plateNumber || "",
          condition: l.condition || "Used",
          door: 4, cylinder: 4,
          units: l.units || "Any Units",
          exterior_color: l.exterior_color || "White",
          road_tax: l.road_tax ? `£${l.road_tax}` : "N/A",
          location: l.full_address,
          features: [],
          status: l.status || "in_stock",
        }));

        setListings(transformed);
        setError(null);
      } catch (err) {
        setError(err.message);
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    if (typeParam) dispatch({ type: "SET_BODY", payload: typeParam });
    fetchListings();
  }, [typeParam, body, bodies, make, makes, model, models, fuel, fuels, transmission, transmissions, price]);

  // Client-side filtering
  useEffect(() => {
    let results = [...listings];
    
    if (search?.trim()) {
      const q = search.toLowerCase();
      results = results.filter((c) => 
        [c.title, c.make, c.model, c.vin, c.plateNumber, c.location, c.body]
          .filter(Boolean)
          .some((f) => f.toLowerCase().includes(q))
      );
    }

    if (bodies && bodies.length > 0) results = results.filter((c) => bodies.includes(c.body));
    else if (body && body !== "Any Body") results = results.filter((c) => body === c.body);

    if (makes && makes.length > 0) results = results.filter((c) => makes.includes(c.make));
    else if (make && make !== "Any Make") results = results.filter((c) => make === c.make);

    if (units_list && units_list.length > 0) {
      results = results.filter((c) => units_list.includes(c.units));
    } else if (units && units !== "Any Units") {
      results = results.filter((c) => units === c.units);
    }

    if (exterior_colors && exterior_colors.length > 0) {
      results = results.filter((c) => exterior_colors.includes(c.exterior_color));
    } else if (exterior_color && exterior_color !== "Any Color" && exterior_color !== "Any Exterior Color") {
      results = results.filter((c) => exterior_color === c.exterior_color);
    }

    if (price) {
      const minP = isNaN(price[0]) ? 0 : price[0];
      const maxP = isNaN(price[1]) ? Infinity : price[1];
      results = results.filter((c) => c.price >= minP && c.price <= maxP);
    }

    if (km) {
      const minK = isNaN(km[0]) ? 0 : km[0];
      const maxK = isNaN(km[1]) ? Infinity : km[1];
      results = results.filter((c) => {
        const carMiles = kmToMiles(c.km);
        return carMiles >= minK && carMiles <= maxK;
      });
    }

    if (year) {
      const minY = isNaN(year[0]) ? 2000 : year[0];
      const maxY = isNaN(year[1]) ? Infinity : year[1];
      results = results.filter((c) => c.year >= minY && c.year <= maxY);
    }

    dispatch({ type: "SET_FILTERED", payload: results });
  }, [search, body, bodies, make, makes, units, units_list, exterior_color, exterior_colors, price, km, year, listings]);

  // Sorting
  useEffect(() => {
    let s = [...filtered];
    switch (sortingOption) {
      case "Lowest Price": s.sort((a, b) => a.price - b.price); break;
      case "Highest Price": s.sort((a, b) => b.price - a.price); break;
      case "Low Mileage": s.sort((a, b) => a.km - b.km); break;
      case "High Mileage": s.sort((a, b) => b.km - a.km); break;
      case "Newest First": s.sort((a, b) => b.year - a.year); break;
      case "Oldest First": s.sort((a, b) => a.year - b.year); break;
      default: s = sortCarsWithRegistrationPriority(s);
    }
    dispatch({ type: "SET_SORTED", payload: s });
  }, [filtered, sortingOption]);

  const dynamicMakes = Array.from(new Set(listings.map((l) => l.make).filter(Boolean))).sort((a, b) => a.localeCompare(b));
  const modelFilteredListings = makes && makes.length > 0
    ? listings.filter((l) => makes.includes(l.make))
    : listings;
  const dynamicModels = Array.from(new Set(modelFilteredListings.map((l) => l.model).filter(Boolean))).sort((a, b) => a.localeCompare(b));

  const dynamicBodies = filterAndSortBodyTypes(listings.map((l) => l.body));
  const dynamicFuels = Array.from(new Set(listings.map((l) => l.fuelType).filter(Boolean))).sort((a, b) => a.localeCompare(b));
  const dynamicTransmissions = Array.from(new Set(listings.map((l) => l.transmission).filter(Boolean))).sort((a, b) => a.localeCompare(b));
  const dynamicLocations = Array.from(new Set(listings.map((l) => l.location).filter(Boolean))).sort((a, b) => a.localeCompare(b));
  const dynamicUnits = Array.from(new Set(listings.map((l) => l.units).filter(Boolean))).sort((a, b) => a.localeCompare(b));
  const dynamicColors = Array.from(new Set(listings.map((l) => l.exterior_color).filter(Boolean))).sort((a, b) => a.localeCompare(b));
  const dynamicConditions = Array.from(new Set(listings.map((l) => l.condition).filter(Boolean))).sort((a, b) => a.localeCompare(b));

  const yrs = listings.map((l) => l.year).filter(Boolean);
  const minYear = yrs.length ? Math.min(...yrs) : 2000;
  const maxYear = yrs.length ? Math.max(...yrs) : 2030;
  const prices = listings.map((l) => l.price).filter((p) => p > 0);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 30000;
  const kms = listings.map((l) => kmToMiles(l.km)).filter((k) => k >= 0);
  const minKM = kms.length ? Math.min(...kms) : 0;
  const maxKM = kms.length ? Math.max(...kms) : 500000;

  const filterOptions = {
    makes: dynamicMakes,
    models: dynamicModels,
    bodies: dynamicBodies,
    fuels: dynamicFuels,
    transmissions: dynamicTransmissions,
    locations: dynamicLocations,
    units: dynamicUnits,
    exterior_colors: dynamicColors,
    conditions: dynamicConditions,
    minYear,
    maxYear,
    minPrice,
    maxPrice,
    minKM,
    maxKM,
  };

  return (
    <>
      <style>{`
        body { background-color: #ffffff; color: #222; }
        
        .breadcrumb-bar {
          background: #ffffff;
          padding: 12px 25px;
          border-bottom: 1px solid #e5e7eb;
        }
        .breadcrumb-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 600;
        }

        .layout-container {
          display: flex;
          align-items: flex-start;
          gap: 20px;
          max-width: 1200px;
          margin: 0 auto;
          padding: 10px 15px 20px 15px;
          box-sizing: border-box;
        }
        .sidebar-filter-area {
          width: 260px;
          flex-shrink: 0;
        }
        .main-content-area {
          flex-grow: 1;
          min-width: 0;
        }

        .cars2-top-row {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          background: #ffffff;
          padding: 16px 20px;
          border-radius: 14px;
          border: 1px solid #eaeaea;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
        }
        .cars2-sort-group {
          display: flex; 
          align-items: center; 
          gap: 8px;
        }
        .cars2-sort-select {
          padding: 8px 12px; 
          border-radius: 8px; 
          border: 1px solid #ddd; 
          font-size: 13px; 
          background: #fff;
          outline: none;
        }
        .cars2-sort-select:focus {
          border-color: #ff5500;
          box-shadow: 0 0 0 1px #ff5500;
        }

        .cars2-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .car-grid-card {
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid #eaeaea;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          width: 100%;
          height: 100%;
          padding: 12px;
        }
        .car-grid-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        }
        .card-image-container {
          position: relative;
          width: 100%;
          height: 200px;
          background: #f3f4f6;
          overflow: hidden;
          flex-shrink: 0;
          border-radius: 12px;
        }
        .card-image-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .badge-in-stock {
          position: absolute;
          top: 12px;
          left: 12px;
          background: #00e676;
          color: #ffffff;
          font-size: 11px;
          font-weight: 800;
          padding: 6px 12px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 4px;
          z-index: 5;
        }

        .card-content-area {
          padding: 12px 4px 4px 4px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          gap: 12px;
        }
        .car-title-clamp {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          font-size: 18px;
          font-weight: 800;
          color: #111827;
          margin: 0;
          line-height: 1.3;
          text-decoration: none;
        }
        
        .car-meta-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: -2px;
        }
        .car-location-group {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 700;
          color: #4b5563;
        }
        .car-location-group svg {
          width: 16px;
          height: 16px;
          color: #ef4444;
        }
        .car-body-type-right {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 700;
          color: #ff5500;
        }
        .car-body-type-right svg {
          width: 18px;
          height: 18px;
          color: #ff5500;
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }
        .price-box {
          background: #f8fafc;
          border: 1px solid #f1f5f9;
          border-radius: 10px;
          padding: 10px 12px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 2px;
        }
        .price-box.highlighted {
          background: #f8fafc;
          border: 1px solid #f1f5f9;
        }
        .price-label {
          font-size: 10px;
          font-weight: 800;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .price-amount-large {
          font-size: 20px;
          font-weight: 900;
          color: #0f172a;
        }
        .price-subtext {
          font-size: 11px;
          font-weight: 600;
          color: #64748b;
        }
        .road-tax-inline {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 700;
          color: #475569;
          margin-top: 2px;
        }
        .road-tax-inline svg {
          width: 13px;
          height: 13px;
          color: #475569;
        }

        /* 3-Column Specs Grid matching reference design exactly */
        .specs-grid-3col {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          align-items: center;
          border-top: 1px solid #f1f5f9;
          border-bottom: 1px solid #f1f5f9;
          padding: 10px 0;
        }
        .spec-item-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          text-align: center;
        }
        .spec-item-col:not(:last-child) {
          border-right: 1px solid #f1f5f9;
        }
        .spec-icon-box {
          width: 18px;
          height: 18px;
          color: #334155;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 2px;
        }
        .spec-val-text {
          font-size: 14px;
          font-weight: 800;
          color: #0f172a;
          white-space: nowrap;
        }
        .spec-label-text {
          font-size: 10px;
          font-weight: 600;
          color: #64748b;
        }
        
        .card-button-wrapper {
          margin-top: auto;
          padding-top: 2px;
        }
        
        .view-vehicle-btn {
          width: 100%;
          background: #ff5500;
          color: #ffffff;
          font-weight: 700;
          font-size: 14px;
          height: 44px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          text-decoration: none;
          transition: background 0.2s;
        }
        .view-vehicle-btn:hover {
          background: #e04b00;
        }

        @media (max-width: 1100px) { 
          .cars2-grid { grid-template-columns: repeat(2, 1fr); } 
        }
        @media (max-width: 900px) {
          .layout-container { flex-direction: column; }
          .sidebar-filter-area { width: 100%; }
          .cars2-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) { 
          .cars2-grid { grid-template-columns: 1fr; } 
        }
      `}</style>

      {/* Breadcrumb Section */}
      <div className="breadcrumb-bar">
        <div className="breadcrumb-inner">
          <Link href="/" style={{ color: "#ff5500", textDecoration: "none" }}>Home</Link>
          <span style={{ color: "#d1d5db" }}>/</span>
          <Link href="/cars" style={{ color: "#4b5563", textDecoration: "none" }}>Used Cars</Link>
          <span style={{ color: "#d1d5db" }}>/</span>
          <span style={{ color: "#111827" }}>All Cars</span>
        </div>
      </div>

      <div className="layout-container">
        {/* Left Side Sticky Filter Sidebar */}
        <aside className="sidebar-filter-area">
          <FlatFilter3
            draftFilters={state}
            handleDraftChange={(field, value) => {
              dispatch({ type: `SET_${field.toUpperCase()}`, payload: value });
            }}
            handleApply={() => {
              dispatch({ type: "SET_CURRENT_PAGE", payload: 1 });
            }}
            allOptions={filterOptions}
          />
        </aside>

        {/* Right Side Main Content & Grid */}
        <main className="main-content-area">
          <div className="cars2-top-row">
            <div>
              <h2 style={{ fontSize: "18px", fontWeight: "800", margin: 0, color: "#111827" }}>Used Cars For Sale</h2>
              {loading && <p style={{ margin: "4px 0 0", fontSize: "12px" }}>Loading listings...</p>}
              {error && <p style={{ margin: "4px 0 0", fontSize: "12px", color: "red" }}>Error: {error}</p>}
              {!loading && !error && (
                <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#6b7280" }}>Search Results ({sorted.length})</p>
              )}
            </div>

            <div className="cars2-sort-group">
              <label htmlFor="sort-dropdown" style={{ fontSize: "12px", fontWeight: "600", whiteSpace: "nowrap", color: "#4b5563" }}>Sort By:</label>
              <select
                id="sort-dropdown"
                value={sortingOption}
                onChange={(e) => allProps.setSortingOption(e.target.value)}
                className="cars2-sort-select"
              >
                <option value="Sort by (Default)">Sort by (Default)</option>
                <option value="Lowest Price">Lowest Price</option>
                <option value="Highest Price">Highest Price</option>
                <option value="Low Mileage">Low Mileage</option>
                <option value="High Mileage">High Mileage</option>
                <option value="Newest First">Newest First</option>
                <option value="Oldest First">Oldest First</option>
              </select>
            </div>
          </div>

          <div className="cars2-grid">
            {loading ? (
              <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "40px" }}>
                <p>Loading listings from backend...</p>
              </div>
            ) : sorted.length === 0 ? (
              <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "40px" }}>
                <p>No listings found</p>
              </div>
            ) : (
              sorted
                .slice((currentPage - 1) * 12, currentPage * 12)
                .map((car, i) => (
                  <div key={car.id || i} className="car-grid-card">
                    <div className="card-image-container">
                      <div className="badge-in-stock">
                        ✓ IN STOCK
                      </div>
                      <Image
                        src={car.imgSrc}
                        alt={car.title || "Vehicle Image"}
                        fill
                        sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{ objectFit: "cover", objectPosition: "center" }}
                      />
                    </div>

                    <div className="card-content-area">
                      <Link href={`/listing-detail-v1/${car.id}`} style={{ textDecoration: "none" }}>
                        <h3 className="car-title-clamp">
                          {car.title}
                        </h3>
                      </Link>

                      {/* Location & Body Type on the Right */}
                      <div className="car-meta-row">
                        <div className="car-location-group">
                          <svg fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M12 2c-4.418 0-8 3.582-8 8 0 5.25 7.133 11.353 7.441 11.614a.75.75 0 00.118.086l.002.001.002-.001a.75.75 0 00.118-.086C12.867 21.353 20 15.25 20 10c0-4.418-3.582-8-8-8zm0 11a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                          </svg>
                          <span>{car.location || "Birmingham"}</span>
                        </div>
                        <div className="car-body-type-right">
                          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18.7 10H5.3L3.5 11.1C2.7 11.3 2 12.1 2 13v3c0 .6.4 1 1 1h2m14 0a2 2 0 11-4 0m4 0a2 2 0 10-4 0m-10 0a2 2 0 11-4 0m4 0a2 2 0 10-4 0m1-9l1.5-3h9L17 8" />
                          </svg>
                          <span>{car.body}</span>
                        </div>
                      </div>

                      <div className="pricing-grid">
                        <div className="price-box">
                          <span className="price-label">PAY MONTHLY</span>
                          <span className="price-amount-large">£{calculateMonthlyPayment(car.price)}</span>
                          <span className="price-subtext">per month</span>
                        </div>
                        <div className="price-box highlighted">
                          <span className="price-label">FULL PRICE</span>
                          <span className="price-amount-large">£{car.price ? car.price.toLocaleString() : "N/A"}</span>
                          <div className="road-tax-inline">
                            <svg fill="currentColor" viewBox="0 0 24 24">
                              <path fillRule="evenodd" d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zM5 20V9h14l.002 11H5z" clipRule="evenodd" />
                            </svg>
                            <span>{car.road_tax} Road tax</span>
                          </div>
                        </div>
                      </div>

                      {/* 3-Column Specs Grid (Mileage, Fuel Type, Transmission) */}
                      <div className="specs-grid-3col">
                        <div className="spec-item-col">
                          <div className="spec-icon-box">
                            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="18" height="18">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <span className="spec-val-text">{kmToMiles(car.km).toLocaleString()} mi</span>
                          <span className="spec-label-text">Mileage</span>
                        </div>
                        <div className="spec-item-col">
                          <div className="spec-icon-box">
                            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="18" height="18">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <span className="spec-val-text">{car.fuelType}</span>
                          <span className="spec-label-text">Fuel Type</span>
                        </div>
                        <div className="spec-item-col">
                          <div className="spec-icon-box">
                            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="18" height="18">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <span className="spec-val-text">{car.transmission}</span>
                          <span className="spec-label-text">Transmission</span>
                        </div>
                      </div>

                      <div className="card-button-wrapper">
                        <Link href={`/listing-detail-v1/${car.id}`} className="view-vehicle-btn">
                          View Vehicle
                          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>

          <div className="themesflat-pagination pagination-style1 clearfix center mt-30">
            <ul>
              <Pagination
                currentPage={currentPage}
                setPage={(v) => allProps.setCurrentPage(v)}
                itemLength={sorted.length}
                itemPerPage={12}
              />
            </ul>
          </div>
        </main>
      </div>
    </>
  );
}