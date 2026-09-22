"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import useSubmit from "@/hooks/useSubmit";
import { useSelector } from "react-redux";

export default function TestDriveForm({ carItem }) {
  const { user } = useSelector((state) => state.auth);
  const { submit, loading } = useSubmit();

  const [formData, setFormData] = useState({
    name:"",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    postcode: "",
    driverLicenseNumber: "",
    preferredDate: "",
    preferredTime: "",
    message: "",
    carId: carItem?.id,
    carTitle: carItem?.title,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.name ||
      !formData.phone ||
      !formData.email ||
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.postcode ||
      !formData.driverLicenseNumber ||
      !formData.preferredDate ||
      !formData.preferredTime
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const response = await submit("/test-drives", formData, {
        method: "POST",
      });

      if (response) {
        toast.success("Test drive request submitted successfully!");
        setFormData({
          name: user?.user?.name || user?.name || "",
          phone: user?.user?.phone || user?.phone || "",
          email: user?.user?.email || user?.email || "",
          address: user?.user?.address || user?.address || "",
          city: user?.user?.city || user?.city || "",
          state: user?.user?.state || user?.state || "",
          postcode: user?.user?.postcode || user?.postcode || "",
          driverLicenseNumber: "",
          preferredDate: "",
          preferredTime: "",
          message: "",
          carId: carItem?.id,
          carTitle: carItem?.title,
        });
      }
    } catch (error) {
      toast.error("Failed to submit test drive request");
      console.error("Error:", error);
    }
  };

  return (
    <div className="test-drive-form-container">
      <div className="form-header mb-30">
        <h3>Request a Test Drive</h3>
        <p>
          Fill in your details below and we'll get back to you shortly to
          confirm your test drive appointment.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="test-drive-form">
        <div className="form-group mb-20">
          <label htmlFor="name" className="form-label">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter your full name"
            required
          />
        </div>

        <div className="form-group mb-20">
          <label htmlFor="phone" className="form-label">
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter your phone number"
            required
          />
        </div>

        <div className="form-group mb-20">
          <label htmlFor="email" className="form-label">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter your email address"
            required
          />
        </div>

        <div className="form-group mb-20">
          <label htmlFor="address" className="form-label">
            Address *
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter your address"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group mb-20">
            <label htmlFor="city" className="form-label">
              City *
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your city"
              required
            />
          </div>

          <div className="form-group mb-20">
            <label htmlFor="state" className="form-label">
              State *
            </label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your state"
              required
            />
          </div>

          <div className="form-group mb-20">
            <label htmlFor="postcode" className="form-label">
              Postcode *
            </label>
            <input
              type="text"
              id="postcode"
              name="postcode"
              value={formData.postcode}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your postcode"
              required
            />
          </div>
        </div>

        <div className="form-group mb-20">
          <label htmlFor="driverLicenseNumber" className="form-label">
            Driver License Number *
          </label>
          <input
            type="text"
            id="driverLicenseNumber"
            name="driverLicenseNumber"
            value={formData.driverLicenseNumber}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter your driver license number"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group mb-20">
            <label htmlFor="preferredDate" className="form-label">
              Preferred Date *
            </label>
            <input
              type="date"
              id="preferredDate"
              name="preferredDate"
              value={formData.preferredDate}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group mb-20">
            <label htmlFor="preferredTime" className="form-label">
              Preferred Time *
            </label>
            <select
              id="preferredTime"
              name="preferredTime"
              value={formData.preferredTime}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="">Select a time</option>
              <option value="09:00 AM">09:00 AM</option>
              <option value="10:00 AM">10:00 AM</option>
              <option value="11:00 AM">11:00 AM</option>
              <option value="12:00 PM">12:00 PM</option>
              <option value="01:00 PM">01:00 PM</option>
              <option value="02:00 PM">02:00 PM</option>
              <option value="03:00 PM">03:00 PM</option>
              <option value="04:00 PM">04:00 PM</option>
              <option value="05:00 PM">05:00 PM</option>
            </select>
          </div>
        </div>

        <div className="form-group mb-20">
          <label htmlFor="message" className="form-label">
            Additional Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="form-control"
            placeholder="Any additional information..."
            rows="4"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn w-100 Submit-test-drive"
          style={{ backgroundColor: "#FF7101", color: "white" }}
        >
          {loading ? "Submitting..." : "Submit Test Drive Request"}
        </button>
      </form>

      <style jsx>{`



        .test-drive-form-container {
          padding: 20px;
          background: #f5f5f5;
          border-radius: 8px;
          margin-bottom: 30px;
        }

        .form-header h3 {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 10px;
        }

        .form-header p {
          font-size: 14px;
          color: #666;
        }

        .test-drive-form {
          background: white;
          padding: 20px;
          border-radius: 8px;
        }

        .form-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-label {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 8px;
          color: #333;
        }

        .form-control {
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          font-family: inherit;
          transition: border-color 0.3s;
        }

        .form-control:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
        }

        .btn-primary {
          padding: 12px 24px;
          background-color: rgb(255, 152, 0);
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .btn-primary:hover:not(:disabled) {
          background-color: #0056b3;
        }

        .btn-primary:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .test-drive-form-container {
            padding: 20px;
          }

          .form-row {
            grid-template-columns: 1fr;
            gap: 15px;
          }
        }
          @media (max-width: 560px) {
.Submit-test-drive{
font-size:14px
}
      }
      `}</style>
    </div>
  );
}
