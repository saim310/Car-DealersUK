"use client";
import { GoogleMap, useLoadScript, OverlayView, useGoogleMap } from "@react-google-maps/api";
import { useState, useEffect, useRef } from "react";

const mapOptions = {
  zoomControl: true,
  disableDefaultUI: false,
  scrollwheel: true,
  styles: [
    {
      featureType: "all",
      elementType: "geometry.fill",
      stylers: [{ weight: "2.00" }],
    },
    {
      featureType: "all",
      elementType: "geometry.stroke",
      stylers: [{ color: "#9c9c9c" }],
    },
    {
      featureType: "landscape",
      elementType: "all",
      stylers: [{ color: "#ffffff" }],
    },
    {
      featureType: "road",
      elementType: "all",
      stylers: [{ saturation: -100 }, { lightness: 45 }],
    },
  ],
};

// Arrow SVG marker icon
const ArrowMarker = () => (
  <svg
    width="40"
    height="50"
    viewBox="0 0 40 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Arrow pointing down */}
    <path
      d="M20 0L30 20H10L20 0Z"
      fill="#FF6B35"
      stroke="#FFFFFF"
      strokeWidth="2"
    />
    {/* Circle body */}
    <circle cx="20" cy="28" r="12" fill="#FF6B35" stroke="#FFFFFF" strokeWidth="2" />
    {/* Pulsing shadow effect */}
    <circle cx="20" cy="28" r="14" fill="none" stroke="#FF6B35" strokeWidth="1" opacity="0.3" />
  </svg>
);

function MapContent({ address, markerPosition, zoom }) {
  const map = useGoogleMap();
  const geocoderRef = useRef(null);

  useEffect(() => {
    if (!map || !window.google) return;

    if (!geocoderRef.current) {
      geocoderRef.current = new window.google.maps.Geocoder();
    }

    if (!address || address.trim() === "") {
      map.setCenter({ lat: 32.7767, lng: -96.797 });
      map.setZoom(zoom);
      return;
    }

    geocoderRef.current.geocode({ address }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const location = results[0].geometry.location;
        const newPosition = {
          lat: location.lat(),
          lng: location.lng(),
        };
        map.setCenter(newPosition);
        map.setZoom(zoom);
        console.log("Geocoded location:", newPosition);
      } else {
        console.error("Geocoding failed:", status, address);
        map.setCenter({ lat: 32.7767, lng: -96.797 });
        map.setZoom(zoom);
      }
    });
  }, [map, address, zoom]);

  return markerPosition ? (
    <OverlayView
      position={markerPosition}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
    >
      <div
        style={{
          transform: "translate(-50%, -100%)",
          position: "relative",
          cursor: "pointer",
        }}
      >
        <ArrowMarker />
      </div>
    </OverlayView>
  ) : null;
}

export default function LocationMap({ address, height = "400px", zoom = 15, onError = null }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyAAz77U5XQuEME6TpftaMdX0bBelQxXRlM",
    libraries: ["places"],
  });

  const [markerPosition, setMarkerPosition] = useState(null);
  const [loading, setLoading] = useState(true);

  // Default location (Dallas, TX)
  const defaultLocation = { lat: 32.7767, lng: -96.797 };

  useEffect(() => {
    if (loadError) {
      console.error("Google Maps Load Error:", loadError);
      if (onError) onError(loadError);
      setLoading(false);
      return;
    }

    if (!isLoaded) {
      return;
    }

    setLoading(false);

    if (!address || address.trim() === "") {
      setMarkerPosition(defaultLocation);
      return;
    }

    if (window.google && window.google.maps) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          const location = results[0].geometry.location;
          setMarkerPosition({
            lat: location.lat(),
            lng: location.lng(),
          });
          console.log("Location found:", address, results[0].geometry.location);
        } else {
          console.warn("Geocoding failed for:", address, status);
          setMarkerPosition(defaultLocation);
        }
      });
    }
  }, [isLoaded, address, loadError, onError]);

  if (!isLoaded || loading) {
    return (
      <div
        style={{
          height: height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
        }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading map...</span>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div
        style={{
          height: height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffebee",
          borderRadius: "8px",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <p style={{ color: "#c62828", margin: 0 }}>
          Failed to load map. Please check your API key.
        </p>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: height, borderRadius: "8px" }}
      center={markerPosition || defaultLocation}
      zoom={zoom}
      options={mapOptions}
    >
      <MapContent address={address} markerPosition={markerPosition} zoom={zoom} />
    </GoogleMap>
  );
}
