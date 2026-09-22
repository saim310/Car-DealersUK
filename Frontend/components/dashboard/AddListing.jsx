"use client";

export const dynamic = "force-dynamic";
import styles from "../../public/assets/css/dashboard/features.module.css"
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import DropdownSelect from "../common/DropDownSelect";

import "react-image-crop/dist/ReactCrop.css";
import useFetch from "@/hooks/useFetch";
import useSubmit from "@/hooks/useSubmit";
import ImageUploadManager from "./ImageUploadManager";
import { apiURL, ALLOWED_BODY_TYPES, kmToMiles, milesToKm } from "@/utils/exports";
import { Trash2, Edit3, Plus, Check } from 'lucide-react';

const initialForm = {
  listing_title: "",
  model: "",
  brand: "",
  units:"",
  type: "",
  years: "",
  condition: "",
  mileage: "",
  transmission: "",
  engine_size: "",
  cylinders: "",
  fuel_type: "",
  doors: "",
  // color: "",
  exterior_color: "",
  interior_color: "",
    vin_number: "",
  seats: "",
  description: "",
  price: "",
  city_mpg: "",
  highway_mpg: "",
  drive_type: "",
  plate_number: "",
  road_tax: "",
  location: "",
  full_address: "",
  map_location: "",
  video_url: "",
  status: "in_stock",
};

const MAX_IMAGES = 30;
const MAX_ATTACHMENTS = 10;
const API_BASE_URL = apiURL.replace(/\/api\/?$/, "");

const makeClientId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

const normalizeStoredPath = (value) => {
  if (!value) return "";
  return String(value).replace(/\\/g, "/").replace(/^\/+/, "");
};

const getStoredPathFromUrl = (url) => {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    return normalizeStoredPath(parsed.pathname);
  } catch (_error) {
    return normalizeStoredPath(url);
  }
};

const fileNameFromPathOrUrl = (value) => {
  const source = getStoredPathFromUrl(value);
  if (!source) return "attachment.pdf";
  const segments = source.split("/");
  const tail = segments[segments.length - 1] || "attachment.pdf";
  return decodeURIComponent(tail);
};

const getPublicUrl = (storedPath) => {
  const normalized = normalizeStoredPath(storedPath);
  if (!normalized) return "";
  if (/^https?:\/\//i.test(normalized)) {
    return normalized.replace(/^http:\/\//i, "https://");
  }
  return `${API_BASE_URL}/${normalized}`;
};

const createImageItem = (file) => ({
  id: makeClientId(),
  file,
  previewUrl: URL.createObjectURL(file),
  isExisting: false,
  storagePath: "",
});

const createAttachmentItem = (file) => ({
  id: makeClientId(),
  file,
  name: file.name || "attachment.pdf",
  isExisting: false,
  storagePath: "",
  url: "",
});

const revokeImageObjectUrls = (items = []) => {
  items.forEach((item) => {
    if (!item?.isExisting && item.previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(item.previewUrl);
    }
  });
};

export default function AddListing() {

 useEffect(() => {
  // Define an async function inside the effect
  const fetchBrands = async () => {
    try {
      const res = await fetch(`${apiURL}/brands`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // Note: Avoid sending a 'body' in a GET request. 
        // Use query params if you need to pass the email.
      });

      if (res.ok) {
        const data = await res.json(); 
        setBrandsData(data);
        // Wait for the JSON to parse
        console.log("Brands data:", data);
      } else {
        console.error("Server returned an error:", res.status);
      }
    } catch (err) {
      console.error("Network or parsing error:", err);
    }
  };

  fetchBrands();
}, []);

  /********************/

  const router = useRouter();
  const searchParams = useSearchParams();

  const listingId = searchParams.get("id");
  const isEditMode = searchParams.get("edit") === "true" && Boolean(listingId);

  const [formData, setFormData] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [images, setImages] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [features, setFeatures] = useState([]);
  const [featureInputValue, setFeatureInputValue] = useState("");
  const [featureEditingId, setFeatureEditingId] = useState(null);
  const [featureEditValue, setFeatureEditValue] = useState("");
  const imagesRef = useRef([]);
  const [brandsData, setBrandsData] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);

const imageSectionRef = useRef(null);

  const handleDragStart = (index) => {
  setDraggedIndex(index);
};

const handleDropImage = (index) => {
  if (draggedIndex === null) return;

  const updatedImages = [...images];
  const draggedItem = updatedImages[draggedIndex];

  // remove dragged item
  updatedImages.splice(draggedIndex, 1);

  // insert at new position
  updatedImages.splice(index, 0, draggedItem);

  setImages(updatedImages);
  setDraggedIndex(null);
};

  const detailsEndpoint = useMemo(
    () => (isEditMode ? `/listings/${listingId}` : null),
    [isEditMode, listingId],
  );

  const {
    data: listingDetails,
    loading: loadingDetails,
    refetch: refetchDetails,
  } = useFetch(detailsEndpoint, { immediate: Boolean(detailsEndpoint) });

  const { submit } = useSubmit();

  useEffect(() => {
    if (isEditMode && detailsEndpoint) {
      refetchDetails(detailsEndpoint);
    }
  }, [isEditMode, detailsEndpoint, refetchDetails]);

  useEffect(() => {
    if (isEditMode && Array.isArray(listingDetails?.features)) {
      setFeatures(
        listingDetails.features
          .map((name, index) => ({
            id: `feature-${index}-${makeClientId()}`,
            name: String(name).trim(),
          }))
          .filter((feature) => feature.name),
      );
    } else if (!isEditMode) {
      setFeatures([]);
    }
  }, [isEditMode, listingDetails]);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    return () => {
      revokeImageObjectUrls(imagesRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isEditMode) {
      revokeImageObjectUrls(imagesRef.current);
      setFormData(initialForm);
      setImages([]);
      setAttachments([]);
      return;
    }

    if (listingDetails) {
      setFormData({
        listing_title: listingDetails.listing_title || "",
        model: listingDetails.model || "",
        brand: listingDetails.brand || "",
        units: listingDetails.units || "",
        type: listingDetails.type || "",
        years: listingDetails.years || "",
        condition: listingDetails.condition || "",
        mileage: listingDetails.mileage ? String(listingDetails.mileage) : "",
        transmission: listingDetails.transmission || "",
        engine_size: listingDetails.engine_size || "",
       
        fuel_type: listingDetails.fuel_type || "",
        doors: listingDetails.doors || "",
        // color: listingDetails.color || "",
        exterior_color: listingDetails.exterior_color || "",
        interior_color: listingDetails.interior_color || "",
        vin_number: listingDetails.vin_number || "",
        seats: listingDetails.seats || "",
        description: listingDetails.description || "",
        price:
          listingDetails.price === null || listingDetails.price === undefined
            ? ""
            : String(listingDetails.price),
        city_mpg: listingDetails.city_mpg || "",
        highway_mpg: listingDetails.highway_mpg || "",
        drive_type: listingDetails.drive_type || "",
        plate_number: listingDetails.plate_number || "",
        road_tax: listingDetails.road_tax || "",    
        location: listingDetails.location || listingDetails.full_address || "",
        full_address: listingDetails.full_address || listingDetails.location || "",
        map_location: listingDetails.map_location || "",
        video_url: listingDetails.video_url || "",
        status: listingDetails.status || "in_stock",
      });

      revokeImageObjectUrls(imagesRef.current);
      setImages(
        (listingDetails.images || [])
          .slice(0, MAX_IMAGES)
          .map((url, index) => ({
            id: `existing-image-${index}-${makeClientId()}`,
            file: null,
            previewUrl: getPublicUrl(url),
            isExisting: true,
            storagePath:
              normalizeStoredPath((listingDetails.image_paths || [])[index]) ||
              getStoredPathFromUrl(url),
          })),
      );

      setAttachments(
        (listingDetails.attachments || [])
          .slice(0, MAX_ATTACHMENTS)
          .map((url, index) => ({
            id: `existing-attachment-${index}-${makeClientId()}`,
            file: null,
            name: fileNameFromPathOrUrl(url),
            isExisting: true,
            storagePath:
              normalizeStoredPath(
                (listingDetails.attachment_paths || [])[index],
              ) || getStoredPathFromUrl(url),
            url: getPublicUrl(url),
          })),
      );
    }
  }, [isEditMode, listingDetails]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDropdownChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "units" && value !== "registered") {
        updated.plate_number = "";
      }
      return updated;
    });
  };

  const appendImageFiles = (fileList) => {
    if (!fileList.length) return;
    const onlyImages = fileList.filter((file) =>
      file.type.startsWith("image/"),
    );
    if (!onlyImages.length) {
      toast.error("Please select valid image files");
      return;
    }

    setImages((prev) => {
      const availableSlots = MAX_IMAGES - prev.length;
      if (availableSlots <= 0) {
        toast.error(`You can upload up to ${MAX_IMAGES} photos`);
        return prev;
      }
      const accepted = onlyImages.slice(0, availableSlots).map(createImageItem);
      return [...prev, ...accepted];
    });
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files || []);
    appendImageFiles(files);
    event.target.value = "";
  };

  const handleDeleteImage = (id) => {
    setImages((prev) => {
      const target = prev.find((item) => item.id === id);
      if (
        target &&
        !target.isExisting &&
        target.previewUrl?.startsWith("blob:")
      ) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  const appendAttachmentFiles = (fileList) => {
    if (!fileList.length) return;
    const onlyPdf = fileList.filter(
      (file) =>
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf"),
    );
    if (!onlyPdf.length) {
      toast.error("Only PDF attachments are allowed");
      return;
    }

    setAttachments((prev) => {
      const availableSlots = MAX_ATTACHMENTS - prev.length;
      if (availableSlots <= 0) {
        toast.error(`You can upload up to ${MAX_ATTACHMENTS} attachments`);
        return prev;
      }
      const accepted = onlyPdf
        .slice(0, availableSlots)
        .map((file) => createAttachmentItem(file));
      return [...prev, ...accepted];
    });
  };

  const handleAttachmentChange = (event) => {
    const files = Array.from(event.target.files || []);
    appendAttachmentFiles(files);
    event.target.value = "";
  };

  const handleDeleteAttachment = (id) => {
    setAttachments((prev) => prev.filter((item) => item.id !== id));
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const files = Array.from(event.dataTransfer.files || []);
    appendImageFiles(files);
  };

  const handleSubmit = async (event) => {  
    event.preventDefault();
    const payload = { ...formData };

    
    if (!payload.listing_title ) {
      toast.error("Title is required");
      return;
    }

    if (!payload.model) {
      toast.error("Model is required");
      return;
    }

    if (!payload.brand) {
      toast.error("Brand is required");
      return;
    }

    if (!payload.units) {
      toast.error("Units is required");
      return;
    }

    Object.keys(payload).forEach((key) => {
      if (typeof payload[key] === "string") payload[key] = payload[key].trim();
    });

  console.log("payload", payload);


    if (!images.length) {
      toast.error("Please upload at least one photo");
      return;
    }

    const multipartFormData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      multipartFormData.append(key, value);
    });

    const existingImages = images
      .filter((item) => item.isExisting && !item.file && item.storagePath)
      .map((item) => item.storagePath);
    const existingAttachments = attachments
      .filter((item) => item.isExisting && item.storagePath)
      .map((item) => item.storagePath);

    multipartFormData.append("existing_images", JSON.stringify(existingImages));
    multipartFormData.append(
      "existing_attachments",
      JSON.stringify(existingAttachments),
    );

    multipartFormData.append(
      "features",
      JSON.stringify(features.map((feature) => feature.name)),
    );

    images
      .filter((item) => !item.isExisting || item.file)
      .forEach((item) => multipartFormData.append("images", item.file));
    attachments
      .filter((item) => !item.isExisting && item.file)
      .forEach((item) => multipartFormData.append("attachments", item.file));

    console.log("Submitting listing with", {
      title: payload.listing_title,
      model: payload.model,
      brand: payload.brand,
      imageCount: images.filter((item) => !item.isExisting).length,
      existingImageCount: existingImages.length,
    });

    setIsSubmitting(true);
    const endpoint = isEditMode ? `/listings/${listingId}` : "/listings";
    const method = isEditMode ? "PUT" : "POST";

    try {
      const response = await submit(endpoint, multipartFormData, { method });
      setIsSubmitting(false);

      if (response) {
        console.log("Listing saved successfully:", response);
        toast.success(isEditMode ? "Listing updated successfully!" : "Listing created successfully!");
        setTimeout(() => {
          router.push("/my-listing");
        }, 500);
      } else {
        console.error("No response received from server");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setIsSubmitting(false);
      toast.error("Failed to save listing. Check console for details.");
    }
  };

  const addFeature = () => {
    const featureName = featureInputValue.trim();
    if (!featureName) return;

    setFeatures((prev) => {
      if (
        prev.some(
          (feature) => feature.name.toLowerCase() === featureName.toLowerCase(),
        )
      ) {
        return prev;
      }

      return [...prev, { id: makeClientId(), name: featureName }];
    });

    setFeatureInputValue("");
  };

  const deleteFeature = (id) => {
    setFeatures((prev) => prev.filter((feature) => feature.id !== id));
  };

  const startEdit = (feature) => {
    setFeatureInputValue("");
    setFeatureEditingId(feature.id);
    setFeatureEditValue(feature.name);
  };

  const saveEdit = (id) => {
    const updatedValue = featureEditValue.trim();
    if (!updatedValue) return;

    setFeatures((prev) =>
      prev.map((feature) =>
        feature.id === id ? { ...feature, name: updatedValue } : feature,
      ),
    );
    setFeatureEditValue("");
    setFeatureEditingId(null);
  };

  return (
    <div className="container add-listing-enhanced">
      <div className="row">
        <div className="col-md-12">
          <div className="content-area">
            <main id="main" className="main-content">
              <div className="tfcl-dashboard">
                <div className="tfcl-add-listing add-listing-hero mb-3">
                  <h1 className="admin-title mb-1">
                    {isEditMode ? "Update Listing" : "Add Listing"}
                  </h1>
                  <p className="add-listing-subtitle mb-0">
                    Fill in the details, upload media, and publish with
                    confidence.
                  </p>
                  <div className="add-listing-stats">
                    <span>
                      {images.length} / {MAX_IMAGES} photos
                    </span>
                    <span>
                      {attachments.length} / {MAX_ATTACHMENTS} attachments
                    </span>
                  </div>
                </div>

                <form
                  className="tfcl-add-listing car-details"
                  onSubmit={handleSubmit}
                >
                  <h3>Car details</h3>

                  {isEditMode && loadingDetails ? (
                    <p>Loading listing details...</p>
                  ) : null}

                  <div className="form-group">
                    <label htmlFor="listing_title">Listing Title *</label>
                    <input
                      id="listing_title"
                      type="text"
                      className="form-control"
                      name="listing_title"
                      placeholder="Enter title"
                      value={formData.listing_title}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group-2">
                    <div className="form-group">
                      <label htmlFor="model">Model *</label>
                      <input
                        id="model"
                        type="text"
                        className="form-control"
                        name="model"
                        placeholder="Enter model"
                        value={formData.model}
                        onChange={handleChange}
                        required
                      />
                    </div>

<div className="form-group">
  <label htmlFor="brand">Brand *</label>
  <input
    list="brand-options"
    id="brand"
    name="brand"
    className="form-control"
    placeholder="Select or type a brand"
    value={formData.brand}
    onChange={handleChange}
    required
  />
  <datalist id="brand-options">
    {brandsData.map((b) => (
      <option key={b.id || b.name} value={b.name} />
    ))}
  </datalist>
</div>
                   {/* <div className="form-group">
  <label htmlFor="brand">Brand *</label>
  <DropdownSelect
    addtionalParentClass="form-control"
    defaultOption="Select Brand"
    selectedValue={formData.brand}
    onChange={(value) => handleDropdownChange("brand", value)}
    // Map the array of objects [{id: 5, name: 'amplitude'}] to ['amplitude', 'Adobe', ...]
    options={brandsData.map((b) => b.name)} 
    required
  />
</div> */}
                  </div>
                <div className={styles.responsiveRow + " responsive-row"}>
                   
                    <div className="form-group mb-0 responsive-col">
                      <label htmlFor="price">Price {formData.status === "in_stock" && <span style={{color: "red"}}>*</span>}</label>
                      <input
                        id="price"
                        type="number"
                        min="0"
                        step="0.01"
                        className="form-control"
                        name="price"
                        placeholder="Enter price"
                        value={formData.price}
                        onChange={handleChange}
                        required={formData.status === "in_stock"}
                      />
                    </div>

                    <div className="form-group responsive-col" style={{margin:"30px 0px"}}>
                      <label htmlFor="status">Listing Status *</label>
                      <select
                        id="status"
                        className="form-control"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        required
                      >
                        <option value="in_stock">In Stock</option>
                        <option value="in_transit">In Transit</option>
                        <option value="on_order">On Order</option>
                      </select>
                    </div>

                    <div className="form-group responsive-col">
                      <label>Road Tax</label>
                      <input
                        type="text"
                        className="form-control"
                        name="road_tax"
                        placeholder="Enter road tax"
                        value={formData.road_tax}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className={styles.responsiveRow + " responsive-row"}>
                    <div className="form-group responsive-col">
                      <label>Units *</label>
                      <DropdownSelect
                        addtionalParentClass="form-control"
                        defaultOption="Select Type"
                        selectedValue={formData.units}
                        onChange={(value) => handleDropdownChange("units", value)}
                        options={["registered", "unregistered"]}
                        required
                      />
                    </div>

                    <div className="form-group responsive-col">
                      <label
                        style={{
                          color: formData.units === "registered" ? "#000" : "#999",
                          fontWeight: formData.units === "registered" ? 600 : 400,
                        }}
                      >
                        Plate Number:
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="plate_number"
                        placeholder="License Plate (e.g., AB21XYZ)"
                        value={formData.plate_number}
                        onChange={handleChange}
                        disabled={formData.units !== "registered"}
                      />
                    </div>
                  </div>

                  {/* Image Upload Section */}
                  <ImageUploadManager 
  images={images} 
  setImages={setImages} 
  maxImages={MAX_IMAGES}
  isDragging={isDragging}
  setIsDragging={setIsDragging}
/>
                  <div className="tfcl-add-listing car-details mt-40">
                    <h3>More Car details</h3>
                    <div className={styles.responsiveRow + " responsive-row form-group-4"}>
                      <div className="form-group responsive-col-3">
                        <label>Body Type</label>
                        <DropdownSelect
                          addtionalParentClass="form-control"
                          defaultOption="Select Type"
                          selectedValue={formData.type}
                          onChange={(value) => handleDropdownChange("type", value)}
                          options={ALLOWED_BODY_TYPES}
                        />
                      </div>
                      <div className="form-group responsive-col-3">
                        <label>Years</label>
                        <input
                          type="text"
                          className="form-control"
                          name="years"
                          placeholder="Years"
                          value={formData.years}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group responsive-col-3">
                        <label>Condition</label>
                        <input
                          type="text"
                          className="form-control"
                          name="condition"
                          placeholder="Condition"
                          value={formData.condition}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className={styles.responsiveRow + " responsive-row form-group-4"}>
                      <div className="form-group responsive-col-3">
                        <label>Mileage (Miles)</label>
                        <input
                          type="text"
                          className="form-control"
                          name="mileage"
                          placeholder="Enter mileage in miles"
                          value={formData.mileage}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group responsive-col-3">
                        <label>Transmission</label>
                        <DropdownSelect
                          addtionalParentClass="form-control"
                          defaultOption="Select"
                          selectedValue={formData.transmission}
                          onChange={(value) => handleDropdownChange("transmission", value)}
                          options={["Automatic", "Manual"]}
                        />
                      </div>
                      <div className="form-group responsive-col-3">
                        <label>Engine Size</label>
                        <input
                          type="text"
                          className="form-control"
                          name="engine_size"
                          placeholder="Enter engine"
                          value={formData.engine_size}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className={styles.responsiveRow + " responsive-row form-group-4"}>
                      {/* <div className="form-group responsive-col-3">
                        <label>Cylinders</label>
                        <input
                          type="text"
                          className="form-control"
                          name="cylinders"
                          placeholder="Cylinders"
                          value={formData.cylinders}
                          onChange={handleChange}
                        />
                      </div> */}
                      <div className="form-group responsive-col-3">
                        <label>Fuel Type</label>
                        <input
                          type="text"
                          className="form-control"
                          name="fuel_type"
                          placeholder="Fuel type"
                          value={formData.fuel_type}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group responsive-col-3">
                        <label>Doors</label>
                        <input
                          type="text"
                          className="form-control"
                          name="doors"
                          placeholder="Doors"
                          value={formData.doors}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group responsive-col-3">
                        <label>Drive Type</label>
                        <DropdownSelect
                          addtionalParentClass="form-control"
                          defaultOption="Select Drive Type"
                          selectedValue={formData.drive_type}
                          onChange={(value) => handleDropdownChange("drive_type", value)}
                          options={["2WD", "4WD"]}
                        />
                      </div>
                    </div>

                    <div className={styles.responsiveRow + " responsive-row form-group-4"}>
                      <div className="form-group responsive-col-3">
                        <label>City MPG</label>
                        <input
                          type="text"
                          className="form-control"
                          name="city_mpg"
                          placeholder="City MPG"
                          value={formData.city_mpg}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group responsive-col-3">
                        <label>Highway MPG</label>
                        <input
                          type="text"
                          className="form-control"
                          name="highway_mpg"
                          placeholder="Highway MPG"
                          value={formData.highway_mpg}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group responsive-col-3">
                        <label>Exterior Color</label>
                        <input
                          type="text"
                          className="form-control"
                          name="exterior_color"
                          placeholder="Exterior Color"
                          value={formData.exterior_color}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className={"form-group-4 " + styles.responsiveRow + " responsive-row"}>
                      <div className="form-group responsive-col-3">
                        <label>Interior Color</label>
                        <input
                          type="text"
                          className="form-control"
                          name="interior_color"
                          placeholder="Interior Color"
                          value={formData.interior_color}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group responsive-col-3">
                        <label>Vin Number</label>
                        <input
                          type="text"
                          className="form-control"
                          name="vin_number"
                          placeholder="Vin Number"
                          value={formData.vin_number}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group responsive-col-3">
                        <label>Seats</label>
                        <input
                          type="text"
                          className="form-control"
                          name="seats"
                          placeholder="Seats"
                          value={formData.seats}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="form-group mb-0">
                      <label>Description</label>
                      <textarea
                        name="description"
                        placeholder="Your description"
                        value={formData.description}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                
                {/************ New Feature **************/}

                <div className={styles['tfcl-add-listing car-features mt-40 feature-manager-container']}>
                  <h3 className="mb-3">Vehicle Features</h3>

                  <div className={styles['feature-input-group'] + " mb-4"}>
                    <input
                      type="text"
                      className={styles['custom-input']}
                      placeholder="Enter a new feature (e.g. Sunroof)"
                      value={featureInputValue}
                      onChange={(e) => setFeatureInputValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addFeature();
                        }
                      }}
                    />
                    <button
                      type="button"
                      className={styles['btn-add-feature']}
                      onClick={addFeature}
                    >
                      <Plus size={18} /> Add
                    </button>
                  </div>

                  <div className={styles['feature-list-wrapper']}>
                    {features.length === 0 ? (
                      <p className={styles['text-muted'] + " text-center py-4"}>
                        No features added yet.
                      </p>
                    ) : (
                      <div className={styles['feature-scroll-area']}>
                        {features.map((feature) => (
                          <div key={feature.id} className={styles['feature-item-card']}>
                            {featureEditingId === feature.id ? (
                              <div className={styles['edit-mode']}>
                                <input
                                  className={styles['custom-input']}
                                  value={featureEditValue}
                                  onChange={(e) => setFeatureEditValue(e.target.value)}
                                  autoFocus
                                />
                                <button
                                  type="button"
                                  className={styles['btn-save']}
                                  onClick={() => saveEdit(feature.id)}
                                >
                                  <Check size={16} />
                                </button>
                              </div>
                            ) : (
                              <>
                                <span className={styles['feature-name']}>
                                  {feature.name}
                                </span>
                                <div className={styles['feature-actions']}>
                                  <button
                                    type="button"
                                    className={styles['btn-icon'] + " " + styles['edit']}
                                    onClick={() => startEdit(feature)}
                                  >
                                    <Edit3 size={16} />
                                  </button>
                                  <button
                                    type="button"
                                    className={styles['btn-icon'] + " " + styles['delete']}
                                    onClick={() => deleteFeature(feature.id)}
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                  {/* Location Section */}
                  <div className="tfcl-add-listing car-location mt-40">
                    <h3>Location</h3>
                    <div className="form-group mb-0">
                      <label htmlFor="location">Location Name</label>
                      <input
                        id="location"
                        type="text"
                        className="form-control"
                        name="location"
                        placeholder="Enter location name (e.g. London, Manchester)"
                        value={formData.location || formData.full_address || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData((prev) => ({
                            ...prev,
                            location: val,
                            full_address: val,
                          }));
                        }}
                      />
                    </div>
                  </div>

                  {/* Video URL */}
                  <div className="tfcl-add-listing car-video mt-40">
                    <h3>Video</h3>
                    <div className="form-group mb-0">
                      <label>Video URL</label>
                      <input
                        type="text"
                        className="form-control"
                        name="video_url"
                        placeholder="Your URL"
                        value={formData.video_url}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Attachments */}
                  <div className="tfcl-add-listing car-attr mt-40">
                    <h3>Attachments (PDF)</h3>
                    <ul className="list-attrach">
                      {attachments.map((attachmentItem) => (
                        <li
                          className="item enhanced-attachment-item"
                          key={attachmentItem.id}
                        >
                          <span className="pdf-pill">PDF</span>
                          <span className="attachment-name">
                            {attachmentItem.name}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteAttachment(attachmentItem.id)
                            }
                          >
                            Delete
                          </button>
                        </li>
                      ))}
                      <li className="item upload">
                        <label className="inner add-listing-upload-button">
                          <div className="upload">
                            Upload file
                            <input
                              type="file"
                              className="ip-file"
                              accept="application/pdf"
                              multiple
                              onChange={handleAttachmentChange}
                            />
                          </div>
                        </label>
                      </li>
                    </ul>
                  </div>

                  <div className="group-button-submit mt-40">
                    <button
                      type="submit"
                      className="pre-btn"
                      disabled={isSubmitting || loadingDetails}
                    >
                      {isSubmitting
                        ? isEditMode
                          ? "Updating..."
                          : "Creating..."
                        : isEditMode
                          ? "Update Listing"
                          : "Create Listing"}
                    </button>
                    <button
                      type="button"
                      className="second-btn"
                      onClick={() => router.push("/my-listing")}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
