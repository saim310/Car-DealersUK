"use client";

import React, { useState, useEffect } from "react";

export default function FlatFilter3({ draftFilters, handleDraftChange, handleApply, allOptions }) {
  // Accumulate static filter options (makes, bodies, fuels, etc.) so they never disappear
  const [masterOptions, setMasterOptions] = useState({
    makes: [],
    bodies: [],
    fuels: [],
    transmissions: [],
    locations: [],
    units: [],
    exterior_colors: [],
  });

  // Cache models for the currently selected make so they don't shrink when a model is chosen
  const [cachedModels, setCachedModels] = useState([]);

  useEffect(() => {
    if (allOptions) {
      setMasterOptions((prev) => ({
        ...prev,
        makes: Array.from(new Set([...(prev.makes || []), ...(allOptions.makes || [])])),
        bodies: Array.from(new Set([...(prev.bodies || []), ...(allOptions.bodies || [])])),
        fuels: Array.from(new Set([...(prev.fuels || []), ...(allOptions.fuels || [])])),
        transmissions: Array.from(new Set([...(prev.transmissions || []), ...(allOptions.transmissions || [])])),
        locations: Array.from(new Set([...(prev.locations || []), ...(allOptions.locations || [])])),
        units: Array.from(new Set([...(prev.units || []), ...(allOptions.units || [])])),
        exterior_colors: Array.from(new Set([...(prev.exterior_colors || []), ...(allOptions.exterior_colors || [])])),
      }));
    }
  }, [allOptions]);

  useEffect(() => {
    if (!draftFilters?.make) {
      setCachedModels([]);
    } else if (!draftFilters?.model && allOptions?.models) {
      setCachedModels(allOptions.models);
    }
  }, [allOptions?.models, draftFilters?.model, draftFilters?.make]);

  const models = cachedModels.length > 0 ? cachedModels : (allOptions?.models || []);
  const makes = masterOptions?.makes.length > 0 ? masterOptions.makes : (allOptions?.makes || []);
  const bodies = masterOptions?.bodies.length > 0 ? masterOptions.bodies : (allOptions?.bodies || []);
  const fuels = masterOptions?.fuels.length > 0 ? masterOptions.fuels : (allOptions?.fuels || []);
  const transmissions = masterOptions?.transmissions.length > 0 ? masterOptions.transmissions : (allOptions?.transmissions || []);
  const locations = masterOptions?.locations.length > 0 ? masterOptions.locations : (allOptions?.locations || []);
  const unitsList = masterOptions?.units.length > 0 ? masterOptions.units : (allOptions?.units || []);
  const exteriorColors = masterOptions?.exterior_colors.length > 0 ? masterOptions.exterior_colors : (allOptions?.exterior_colors || []);

  const minPriceLimit = allOptions?.minPrice ?? 0;
  const maxPriceLimit = allOptions?.maxPrice ?? 50000;
  const minKmLimit = allOptions?.minKM ?? 0;
  const maxKmLimit = allOptions?.maxKM ?? 200000;
  const minYearLimit = allOptions?.minYear ?? 2010;
  const maxYearLimit = allOptions?.maxYear ?? 2026;

  const [minPrice, setMinPrice] = useState(draftFilters?.price?.[0] ?? minPriceLimit);
  const [maxPrice, setMaxPrice] = useState(draftFilters?.price?.[1] ?? maxPriceLimit);
  const [minKM, setMinKM] = useState(draftFilters?.km?.[0] ?? minKmLimit);
  const [maxKM, setMaxKM] = useState(draftFilters?.km?.[1] ?? maxKmLimit);
  const [minYear, setMinYear] = useState(draftFilters?.year?.[0] ?? minYearLimit);
  const [maxYear, setMaxYear] = useState(draftFilters?.year?.[1] ?? maxYearLimit);

  const [isOpenMobile, setIsOpenMobile] = useState(false);

  useEffect(() => {
    setMinPrice(draftFilters?.price?.[0] ?? minPriceLimit);
    setMaxPrice(draftFilters?.price?.[1] ?? maxPriceLimit);
    setMinKM(draftFilters?.km?.[0] ?? minKmLimit);
    setMaxKM(draftFilters?.km?.[1] ?? maxKmLimit);
    setMinYear(draftFilters?.year?.[0] ?? minYearLimit);
    setMaxYear(draftFilters?.year?.[1] ?? maxYearLimit);
  }, [draftFilters, minPriceLimit, maxPriceLimit, minKmLimit, maxKmLimit, minYearLimit, maxYearLimit]);

  const handlePriceChange = (min, max) => {
    setMinPrice(min);
    setMaxPrice(max);
    handleDraftChange("price", [min, max]);
  };

  const handleKmChange = (min, max) => {
    setMinKM(min);
    setMaxKM(max);
    handleDraftChange("km", [min, max]);
  };

  const handleYearChange = (min, max) => {
    setMinYear(min);
    setMaxYear(max);
    handleDraftChange("year", [min, max]);
  };

  const handleMakeChange = (val) => {
    handleDraftChange("make", val);
    handleDraftChange("model", ""); 
    if (!val) {
      setCachedModels([]);
    }
    if (typeof handleApply === "function") {
      setTimeout(() => handleApply(), 0);
    }
  };

  return (
    <div className="vertical-filter-card">
      <style>{`
        .vertical-filter-card {
          background: #ffffff;
          border-radius: 10px;
          padding: 16px;
          border: 1px solid #e5e5e5;
          box-shadow: 0 4px 12px rgba(0,0,0,0.06);
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
          box-sizing: border-box;
        }
        .filter-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
        }
        .filter-title-side {
          font-size: 16px;
          font-weight: 700;
          color: #111;
          margin: 0;
        }
        .mobile-filter-toggle-btn {
          display: none;
          background: #ff5500;
          color: #fff;
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }
        .filter-body-content {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .filter-field-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .filter-field-group label {
          font-size: 11px;
          font-weight: 600;
          color: #555;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }
        .vertical-filter-select, .range-search-input {
          width: 100%;
          height: 38px;
          padding: 0 12px;
          border-radius: 6px;
          border: 1px solid #ddd;
          background: #ffffff;
          font-size: 13px;
          color: #1f2937;
          outline: none;
          box-sizing: border-box;
        }
        .vertical-filter-select:focus, .range-search-input:focus {
          border-color: #ff5500;
          box-shadow: 0 0 0 1px #ff5500;
        }
        .vertical-filter-select {
          appearance: none;
          background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          background-size: 9px;
        }
        .vertical-filter-search-btn {
          width: 100%;
          background: #ff5500;
          color: #ffffff;
          font-weight: 700;
          height: 40px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          font-size: 13px;
          margin-top: 4px;
          transition: background 0.2s;
        }
        .vertical-filter-search-btn:hover {
          background: #e04b00;
        }

        @media (max-width: 991px) {
          .mobile-filter-toggle-btn {
            display: inline-block;
          }
          .filter-body-content {
            display: ${isOpenMobile ? "flex" : "none"};
            margin-top: 12px;
          }
        }
      `}</style>

      <div className="filter-header-row" onClick={() => setIsOpenMobile(!isOpenMobile)}>
        <h3 className="filter-title-side">Filters</h3>
        <button type="button" className="mobile-filter-toggle-btn">
          {isOpenMobile ? "Hide Filters ▲" : "Show Filters ▼"}
        </button>
      </div>

      <div className="filter-body-content">
        <div className="filter-field-group">
          <label>Keyword Search</label>
          <input
            type="text"
            className="range-search-input"
            placeholder="Search make, model, reg e.g. BX66VHG"
            value={draftFilters?.search || ""}
            onChange={(e) => handleDraftChange("search", e.target.value)}
          />
        </div>

        <div className="filter-field-group">
          <label>Make</label>
          <select
            className="vertical-filter-select"
            value={draftFilters?.make || ""}
            onChange={(e) => handleMakeChange(e.target.value)}
          >
            <option value="">Select Make(s)</option>
            {makes.map((m, idx) => (
              <option key={idx} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="filter-field-group">
          <label>Model</label>
          <select
            className="vertical-filter-select"
            value={draftFilters?.model || ""}
            onChange={(e) => handleDraftChange("model", e.target.value)}
          >
            <option value="">Select Model(s)</option>
            {models.map((m, idx) => (
              <option key={idx} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="filter-field-group">
          <label>Transmission</label>
          <select
            className="vertical-filter-select"
            value={draftFilters?.transmission || ""}
            onChange={(e) => handleDraftChange("transmission", e.target.value)}
          >
            <option value="">Select Transmission</option>
            {transmissions.map((t, idx) => (
              <option key={idx} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="filter-field-group">
          <label>Body Type</label>
          <select
            className="vertical-filter-select"
            value={draftFilters?.body || ""}
            onChange={(e) => handleDraftChange("body", e.target.value)}
          >
            <option value="">Select Body Type</option>
            {bodies.map((b, idx) => (
              <option key={idx} value={b}>{b}</option>
            ))}
          </select>
        </div>

        <div className="filter-field-group">
          <label>Fuel Type</label>
          <select
            className="vertical-filter-select"
            value={draftFilters?.fuel || ""}
            onChange={(e) => handleDraftChange("fuel", e.target.value)}
          >
            <option value="">Select Fuel Type</option>
            {fuels.map((f, idx) => (
              <option key={idx} value={f}>{f}</option>
            ))}
          </select>
        </div>

        <div className="filter-field-group">
          <label>Location</label>
          <select
            className="vertical-filter-select"
            value={draftFilters?.location || ""}
            onChange={(e) => handleDraftChange("location", e.target.value)}
          >
            <option value="">Select Location(s)</option>
            {locations.map((l, idx) => (
              <option key={idx} value={l}>{l}</option>
            ))}
          </select>
        </div>

        <div className="filter-field-group">
          <label>Units</label>
          <select
            className="vertical-filter-select"
            value={draftFilters?.units || ""}
            onChange={(e) => handleDraftChange("units", e.target.value)}
          >
            <option value="">Select Units</option>
            {unitsList.map((u, idx) => (
              <option key={idx} value={u}>{u}</option>
            ))}
          </select>
        </div>

        <div className="filter-field-group">
          <label>Exterior Color</label>
          <select
            className="vertical-filter-select"
            value={draftFilters?.exterior_color || ""}
            onChange={(e) => handleDraftChange("exterior_color", e.target.value)}
          >
            <option value="">Select Color(s)</option>
            {exteriorColors.map((c, idx) => (
              <option key={idx} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Max Price Dropdown Selector */}
        <div className="filter-field-group">
          <label>Max Price (£)</label>
          <select
            className="vertical-filter-select"
            value={maxPrice}
            onChange={(e) => handlePriceChange(minPriceLimit, Number(e.target.value))}
          >
            <option value={maxPriceLimit}>Any Price</option>
            <option value={5000}>Up to £5,000</option>
            <option value={10000}>Up to £10,000</option>
            <option value={15000}>Up to £15,000</option>
            <option value={20000}>Up to £20,000</option>
            <option value={30000}>Up to £30,000</option>
            <option value={50000}>Up to £50,000</option>
          </select>
        </div>

        {/* Max Mileage Dropdown Selector (Updated up to 200,000) */}
        <div className="filter-field-group">
          <label>Max Mileage</label>
          <select
            className="vertical-filter-select"
            value={maxKM}
            onChange={(e) => handleKmChange(minKmLimit, Number(e.target.value))}
          >
            <option value={maxKmLimit}>Any Mileage</option>
            <option value={30000}>Up to 30,000</option>
            <option value={50000}>Up to 50,000</option>
            <option value={75000}>Up to 75,000</option>
            <option value={100000}>Up to 100,000</option>
            <option value={150000}>Up to 150,000</option>
            <option value={200000}>Up to 200,000</option>
          </select>
        </div>

        {/* Min Year Dropdown Selector */}
        <div className="filter-field-group">
          <label>Min Year</label>
          <select
            className="vertical-filter-select"
            value={minYear}
            onChange={(e) => handleYearChange(Number(e.target.value), maxYearLimit)}
          >
            <option value={minYearLimit}>Any Year</option>
            <option value={2015}>2015 and newer</option>
            <option value={2018}>2018 and newer</option>
            <option value={2020}>2020 and newer</option>
            <option value={2022}>2022 and newer</option>
          </select>
        </div>

        <button
          type="button"
          className="vertical-filter-search-btn"
          onClick={() => {
            handleApply();
            setIsOpenMobile(false);
          }}
        >
          Search
        </button>
      </div>
    </div>
  );
}