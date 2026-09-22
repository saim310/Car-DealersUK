import React from "react";

export default function Overview({ carItem }) {
  const listingDetails = [
    { title: "Year", value: carItem?.year || "2016" },
    { title: "VIN number", value: carItem?.vin_number || "N/A" },
    { title: "Engine size", value: carItem?.engine_size || "N/A" },
    { title: "Fuel type", value: carItem?.fuelType || "Hybrid" },   
    { title: "Doors", value: carItem?.door || "5" },
    { title: "Exterior color", value: carItem?.exterior_color || "N/A" },
    { 
      title: "Road tax", 
      value: carItem?.road_tax ? `£${carItem.road_tax}` : "N/A" 
    },
    { title: "Plate number", value: carItem?.plate_number || "N/A" },
    { title: "Transmission", value: carItem?.transmission || "Automatic" },
    { title: "Drive type", value: carItem?.drive_type || "4WD" },
    { title: "Seat capacity", value: carItem?.seat_capacity || "5" },
    { title: "Interior colour", value: carItem?.interior_color || "White" },
  ];

  // Split details into two equal columns for the side-by-side grid
  const midpoint = Math.ceil(listingDetails.length / 2);
  const leftColumn = listingDetails.slice(0, midpoint);
  const rightColumn = listingDetails.slice(midpoint);

  const renderRow = (item, index, isLast) => (
    <div
      key={index}
      style={{
        display: "flex",
        alignItems: "center",
        padding: "12px 0",
        borderBottom: isLast ? "none" : "1px dashed #eaeaea",
      }}
    >
      <span style={{ fontSize: "14px", color: "#6c757d", fontWeight: "400", width: "130px", flexShrink: 0 }}>
        {item.title}
      </span>
      <span style={{ fontSize: "14px", color: "#111", fontWeight: "600", textAlign: "left" }}>
        {item.value}
      </span>
    </div>
  );

  return (
    <div className="tfcl-listing-info tf-collapse-content mt-30">
      <h4 
        className="mb-3" 
        style={{ fontSize: "18px", fontWeight: "700", color: "#111" }}
      >
        Car overview
      </h4>

      {/* Main Card Container */}
      <div 
        className="bg-white p-4 rounded-3 border" 
        style={{ borderColor: "#eaeaea", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}
      >
        <div className="row">
          {/* Left Column */}
          <div className="col-lg-6 col-md-6 col-12 pe-lg-4">
            {leftColumn.map((item, index) => 
              renderRow(item, index, index === leftColumn.length - 1)
            )}
          </div>

          {/* Right Column */}
          <div className="col-lg-6 col-md-6 col-12 ps-lg-4">
            {rightColumn.map((item, index) => 
              renderRow(item, index, index === rightColumn.length - 1)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}