import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
//import { fetchAllListings } from "@/reducer/listingsSlice";

export default function ProfileInfo() {
  const {carItem} = useSelector((state) => state.carDetails);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "", plate_number: carItem?.plate_number || "", status: carItem?.status || "" });
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState("");
  const params = useParams();
const listingId = params.id;


useEffect(() => {
  const fetchListings = async () => {
    try {
      const res = await fetch("https://apis.ukaautotrade.co.uk/api/listings");
      const data = await res.json();

      const car = data.find(
        (l) => String(l.id) === String(listingId)
      );

      setStatus(car?.status || "in_stock");

      console.log("Car Status:", car?.status);
    } catch (err) {
      console.error(err);
    }
  };

  fetchListings();
}, [listingId]);


  // useEffect(() => {
  //   const fetchAdminProfile = async () => {
  //     try {
  //       const res = await fetch(
  //         "https://apis.ukaautotrade.co.uk/api/users/public/admin-profile",
  //       );
  //       if (res.ok) {
  //         const data = await res.json();
  //         setProfile(data);
  //         setFormData({
  //           name: data.name || "",
  //           email: data.email || "",
  //         });
  //       }
  //     } catch (error) {
  //       console.error("Failed to fetch admin profile:", error);
  //     }
  //   };
  //   fetchAdminProfile();
  // }, []);

  const avatarSrc = profile?.avatar
    ? `https://apis.ukaautotrade.co.uk/${profile.avatar}`
    : "/assets/images/author/avt1.jpg";
  const sellerName = profile?.name || "Car Empire";
  const locationText =
    profile?.location || "2972 Westheimer Rd. Santa Ana, Illinois 85486";
  const phoneNumber = profile?.phone || "";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);

    // Create the payload to match your Node.js Controller requirements
    const payload = {
      full_name: formData.name, // Mapping 'name' to 'full_name'
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
      listing_id: listingId,
      plate_number: formData.plate_number,
      status: status || "in_stock",
    };

    console.log("Payload for lead submission:", payload);

    try {
      const res = await fetch(
        "https://apis.ukaautotrade.co.uk/api/leads/submit-inquiry",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload), // Send the payload, not the raw formData
        },
      );

      if (res.ok) {
        const data = await res.json();
        alert("Enquiry submitted successfully!");
      } else {
        // If the backend returns 400, it's likely a missing field
        const errorData = await res.json();
        alert(`Error: ${errorData.message || "Failed to submit"}`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Network error. Is your server running on port 4000?");
    } finally {
      setIsSaving(false);
    }
  };
  const styles = {
    profileCard: {
      backgroundColor: "#f8fafc",
      borderRadius: "12px",
      padding: "24px",
      marginBottom: "24px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
      border: "1px solid #e2e8f0",
    },
    title: {
      fontSize: "18px",
      fontWeight: "700",
      color: "#1a202c",
      marginBottom: "20px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    inputGroup: {
      marginBottom: "18px",
    },
    label: {
      display: "block",
      fontSize: "14px",
      fontWeight: "600",
      color: "#2d3748",
      marginBottom: "8px",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    input: {
      width: "100%",
      padding: "12px 16px",
      fontSize: "14px",
      border: "1.5px solid #cbd5e0",
      borderRadius: "8px",
      transition: "all 0.3s ease",
      backgroundColor: "#ffffff",
      fontFamily: "inherit",
      boxSizing: "border-box",
    },
    inputFocus: {
      borderColor: "#1565c0",
      boxShadow: "0 0 0 3px rgba(21, 101, 192, 0.1)",
    },
    buttonContainer: {
      display: "flex",
      gap: "12px",
      marginTop: "24px",
    },
    saveButton: {
      padding: "12px 32px",
      fontSize: "14px",
      fontWeight: "600",
      color: "#ffffff",
      backgroundColor: "rgb(255, 152, 0)",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      boxShadow: "0 4px 12px rgba(21, 101, 192, 0.25)",
    },
  };

  return (
    <>
     
     

        <div style={styles.inputGroup}>
          <label htmlFor="name" style={styles.label}>
            Full Name *
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            style={styles.input}
            onFocus={(e) => (e.target.style.borderColor = "#1565c0")}
            onBlur={(e) => (e.target.style.borderColor = "#cbd5e0")}
          />
        </div>

        <div style={styles.inputGroup}>
          <label htmlFor="email" style={styles.label}>
            Email Address *
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email address"
            style={styles.input}
            onFocus={(e) => (e.target.style.borderColor = "#1565c0")}
            onBlur={(e) => (e.target.style.borderColor = "#cbd5e0")}
          />
        </div>

        <div style={styles.inputGroup}>
          <label htmlFor="phone" style={styles.label}>
            Phone Number *
          </label>
          <input
            id="phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            style={styles.input}
            onFocus={(e) => (e.target.style.borderColor = "#1565c0")}
            onBlur={(e) => (e.target.style.borderColor = "#cbd5e0")}
          />
        </div>
         <div style={styles.inputGroup}>
          <label htmlFor="phone" style={styles.label}>
            Your Message *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Enter your message"
            style={styles.input}
            onFocus={(e) => (e.target.style.borderColor = "#1565c0")}
            onBlur={(e) => (e.target.style.borderColor = "#cbd5e0")}
          />
        </div>

       

        <div style={styles.buttonContainer}>
          <button
            onClick={handleSave}
            disabled={isSaving}
            style={{
              ...styles.saveButton,
              opacity: isSaving ? 0.7 : 1,
              cursor: isSaving ? "not-allowed" : "pointer"
            }}
            onMouseEnter={(e) => {
              if (!isSaving) e.target.style.backgroundColor = "#0d47a1";
            }}
            onMouseLeave={(e) => {
              if (!isSaving) e.target.style.backgroundColor = "#1565c0";
            }}
          >
            {isSaving ? "Saving..." : "Send Enquiry"}
          </button>
        </div>


    </>
  );
}
