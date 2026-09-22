"use client";
import {
  GoogleMap,
  OverlayView,
  useLoadScript,
  InfoWindow,
} from "@react-google-maps/api";
import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import useFetch from "@/hooks/useFetch"; // 1. Import your dynamic fetch hook
import { getImageUrl, kmToMiles } from "@/utils/exports";

const option = {
  zoomControl: true,
  disableDefaultUI: true,
  scrollwheel: false,
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
      featureType: "all",
      elementType: "labels.text",
      stylers: [{ visibility: "on" }],
    },
    {
      featureType: "landscape",
      elementType: "all",
      stylers: [{ color: "#f2f2f2" }],
    },
    {
      featureType: "landscape",
      elementType: "geometry.fill",
      stylers: [{ color: "#ffffff" }],
    },
    {
      featureType: "landscape.man_made",
      elementType: "geometry.fill",
      stylers: [{ color: "#ffffff" }],
    },
    {
      featureType: "poi",
      elementType: "all",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "road",
      elementType: "all",
      stylers: [{ saturation: -100 }, { lightness: 45 }],
    },
    {
      featureType: "road",
      elementType: "geometry.fill",
      stylers: [{ color: "#eeeeee" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#7b7b7b" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#ffffff" }],
    },
    {
      featureType: "road.highway",
      elementType: "all",
      stylers: [{ visibility: "simplified" }],
    },
    {
      featureType: "road.arterial",
      elementType: "labels.icon",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "transit",
      elementType: "all",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "water",
      elementType: "all",
      stylers: [{ color: "#46bcec" }, { visibility: "on" }],
    },
    {
      featureType: "water",
      elementType: "geometry.fill",
      stylers: [{ color: "#c8d7d4" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#070707" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#ffffff" }],
    },
  ],
};

const containerStyle = {
  width: "100%",
  height: "100%",
};

export default function ListingMap() {
  const [getLocation, setLocation] = useState(null);

  // 2. Fetch the live backend listings
  const { data: backendListings } = useFetch("/listings");
  const [mapCars, setMapCars] = useState([]);

  const { isLoaded } = useLoadScript({
    // Tip: Move this key to your .env.local file later! (e.g., process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY)
    googleMapsApiKey: "AIzaSyAAz77U5XQuEME6TpftaMdX0bBelQxXRlM",
  });

  const defaultCenterLat = 32.411201277163975;
  const defaultCenterLng = -96.12394824867293;

  const center = useMemo(
    () => ({ lat: defaultCenterLat, lng: defaultCenterLng }),
    [],
  );

  // 3. Map the backend data to the format the map expects
  useEffect(() => {
    if (backendListings) {
      const mapped = backendListings.map((item) => {
        // Safe check for DB coordinates. If they don't exist yet, plot them near the map center randomly.
        const dbLat = parseFloat(item.lat || item.latitude);
        const dbLng = parseFloat(item.long || item.lng || item.longitude);

        const finalLat = !isNaN(dbLat)
          ? dbLat
          : defaultCenterLat + (Math.random() * 2 - 1);
        const finalLng = !isNaN(dbLng)
          ? dbLng
          : defaultCenterLng + (Math.random() * 2 - 1);

        return {
          id: item.id,
          lat: finalLat,
          long: finalLng,
          type: item.type,
          title: item.listing_title || item.title,
          km: parseInt(item.mileage) || 0,
          fuelType: item.fuel_type || "N/A",
          transmission: item.transmission || "N/A",
          price: parseFloat(item.price) || 0,
          imgSrc: getImageUrl(item.images && item.images.length > 0 ? item.images[0] : null),
        };
      });

      setMapCars(mapped);
    }
  }, [backendListings]);

  const CustomMarker = ({ elm }) => {
    return (
      <div className="marker-container" onClick={() => setLocation(elm)}>
        <div className="marker-card">
          <div className="front face">
            <div />
          </div>
          <div className="back face">
            <div />
          </div>
          <div className="marker-arrow" />
        </div>
      </div>
    );
  };

  const closeCardHandler = () => {
    setLocation(null);
  };

  return (
    <>
      {!isLoaded ? (
        <p style={{ textAlign: "center", padding: "2rem" }}>Loading Map...</p>
      ) : (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={4}
          options={option}
        >
          {/* Iterate over the dynamic data instead of the static cars array */}
          {mapCars.map((marker, i) => (
            <OverlayView
              key={marker.id || i}
              position={{
                lat: marker.lat,
                lng: marker.long,
              }}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <CustomMarker elm={marker} />
            </OverlayView>
          ))}

          {getLocation !== null && (
            <InfoWindow
              position={{
                lat: getLocation.lat,
                lng: getLocation.long,
              }}
              onCloseClick={closeCardHandler}
            >
              <div className="map-listing-item">
                <div className="inner-box">
                  <div className="image-box">
                    <figure className="image">
                      <img
                        src={getLocation.imgSrc}
                        alt={getLocation.title}
                        style={{ objectFit: "cover" }}
                      />
                    </figure>
                  </div>
                  <div className="content">
                    <p className="text-color-3 font">{getLocation.type}</p>
                    <h5>
                      {/* Fixed routing from property-detail to listing-detail */}
                      <Link href={`/listing-detail-v1/${getLocation.id}`}>
                        {getLocation.title}
                      </Link>
                    </h5>
                    <div className="flex flex-wrap gap-8">
                      <p className="location">
                        <i className="icon-autodeal-km1" />
                        {kmToMiles(getLocation.km).toLocaleString()} Miles
                      </p>
                      <p className="location">
                        <i className="icon-autodeal-diesel" />
                        {getLocation.fuelType}
                      </p>
                      <p className="location">
                        <i className="icon-autodeal-automatic" />
                        {getLocation.transmission}
                      </p>
                    </div>
                    <h3>
                      <a>${getLocation.price?.toLocaleString()}</a>
                    </h3>
                  </div>
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      )}
    </>
  );
}
