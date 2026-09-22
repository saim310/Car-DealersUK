import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiURL, getImageUrl } from "../utils/exports";

export const fetchAllListings = createAsyncThunk(
  "listings/fetchAllListings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${apiURL}/listings`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch listings");
      }
      const data = await response.json();

      // Transform backend listings to match frontend dashboard format
      return data.map((listing) => ({
        id: listing.id,
        title: listing.listing_title,
        price: parseFloat(listing.price) || 0,
        imgSrc: getImageUrl(listing.images && listing.images.length > 0 ? listing.images[0] : null),
        images: listing.images || [],
        km: parseInt(listing.mileage) || 0,
        fuelType: listing.fuel_type || "N/A",
        transmission: listing.transmission || "N/A",
        year: (() => {
          const y = parseInt(listing.years);
          return y >= 2000 && y <= 2030 ? y : new Date().getFullYear();
        })(),
        type: listing.type || "Sedan",
        brand: listing.brand ,
        model: listing.model || listing.listing_title,
        condition: listing.condition || "Used",
        status: listing.status,
        vin_number: listing.vin_number || "", // Defaulting to Approved if status missing
        created_at: listing.created_at,
        full_address: listing.full_address ,
        plate_number: listing.plate_number,
      }));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const initialState = {
  listings: [],
  loading: false,
  error: null,
};

const listingsSlice = createSlice({
  name: "listings",
  initialState,
  reducers: {
    clearListings: (state) => {
      state.listings = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllListings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllListings.fulfilled, (state, action) => {
        state.loading = false;
        state.listings = action.payload;
        state.error = null;
      })
      .addCase(fetchAllListings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearListings } = listingsSlice.actions;
export default listingsSlice.reducer;
