import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiURL, getImageUrl } from "../utils/exports";

export const fetchCarDetails = createAsyncThunk(
  "carDetails/fetchCarDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${apiURL}/listings/${id}`,
      );
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Car not found");
        }
        throw new Error("Failed to fetch car details");
      }
      const listing = await response.json();

      // Transform single listing data
      const carData = {
        id: listing.id,
        title: listing.listing_title,
        price: parseFloat(listing.price) || 0,
        imgSrc: getImageUrl(listing.images && listing.images.length > 0 ? listing.images[0] : null),
        images: (listing.images || []).map((img) => getImageUrl(img)),
        km: parseInt(listing.mileage) || 0,
        fuelType: listing.fuel_type || "N/A",
        transmission: listing.transmission || "N/A",
        year: (() => {
          const y = parseInt(listing.years);
          return y >= 2000 && y <= 2030 ? y : new Date().getFullYear();
        })(),
        body: listing.type || "Sedan",
        make: listing.brand ,
        model: listing.model || listing.listing_title,
        condition: listing.condition || "Used",
        door: parseInt(listing.doors) || 4,
        cylinder: parseInt(listing.cylinders) || 4,
        // color: listing.color || "White",
          exterior_color: listing.exterior_color || "White",
          interior_color: listing.interior_color || "Black",
        vin_number: listing.vin_number || "N/A",
        seats: parseInt(listing.seats) || 5,
        engine_size: listing.engine_size || "N/A",
        video_url: listing.video_url || "",
        description: listing.description || "",
        location: listing.full_address || listing.map_location ,
        plate_number: listing.plate_number || "N/A",
        road_tax: listing.road_tax || "N/A",
        features: listing.features || [],
        attachments: listing.attachments || [],
        author: "Admin",
        authorImage: "/assets/images/author/avt-1.jpg",
        authorName: "Admin",
        type: listing.type || "Sedan",
        drive_type: listing.drive_type || "FWD",
        city_mpg: listing.city_mpg || "N/A",
        highway_mpg: listing.highway_mpg || "N/A",
        created_at: listing.created_at,
      };

      return carData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const initialState = {
  carItem: null,
  loading: false,
  error: null,
};

const carDetailsSlice = createSlice({
  name: "carDetails",
  initialState,
  reducers: {
    clearCarDetails: (state) => {
      state.carItem = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCarDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCarDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.carItem = action.payload;
        state.error = null;
      })
      .addCase(fetchCarDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCarDetails } = carDetailsSlice.actions;

export default carDetailsSlice.reducer;
