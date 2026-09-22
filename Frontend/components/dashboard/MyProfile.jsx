"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import LocationMap from "../common/LocationMap";

export default function MyProfile() {
  const [preview, setPreview] = useState(
    "/assets/images/dashboard/avt-profile.jpg",
  );
  const [avatarFile, setAvatarFile] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    company: "",
    job: "",
    email: "",
    phone: "",
    location: "",
    socials: "",
  });

  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          "https://apis.ukaautotrade.co.uk/api/users/admin/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (res.ok) {
          const data = await res.json();
          setFormData({
            name: data.name || "",
            description: data.description || "",
            company: data.company || "",
            job: data.job || "",
            email: data.email || "",
            phone: data.phone || "",
            location: data.location || "",
            socials: data.socials || "",
          });
          if (data.avatar) {
            setPreview(
              `https://apis.ukaautotrade.co.uk/${data.avatar}`,
            );
          }
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };
    if (token) {
      fetchProfile();
    }
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = new FormData();
    Object.keys(formData).forEach((key) => {
      submitData.append(key, formData[key]);
    });
    if (avatarFile) {
      submitData.append("avatar", avatarFile);
    }

    try {
      const res = await fetch(
        "https://apis.ukaautotrade.co.uk/api/users/admin/profile",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: submitData,
        },
      );
      if (res.ok) {
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile.");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating profile.");
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div className="content-area">
            <main id="main" className="main-content">
              <div className="tfcl-dashboard">
                <h1 className="admin-title mb-3">Edit profile</h1>
                <div className="tfcl-add-listing profile-inner">
                  <h3>Avatar</h3>
                  <div className="tfcl_choose_avatar">
                    <div className="avatar">
                      <div className="form-group">
                        <Image
                          loading="lazy"
                          decoding="async"
                          width={158}
                          height={138}
                          id="tfcl_avatar_thumbnail"
                          alt="avatar"
                          src={preview}
                        />
                      </div>
                      <div className="choose-box">
                        <label>Upload a new Avatar</label>
                        <div className="form-group relative pb-2 pt-2">
                          <input
                            type="file"
                            className="form-control ip-file"
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                          <label htmlFor="tfcl_avatar">
                            <button type="button">Choose file</button>
                          </label>
                        </div>
                        <span className="notify-avatar">
                          PNG, JPG, SVG dimension (400 * 400) max file not more
                          then size 4 mb
                        </span>
                      </div>
                    </div>
                  </div>
                  <h3 className="form-title">Information</h3>
                  <div className="form-group">
                    <label htmlFor="name">Full name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                      name="description"
                      id="description"
                      placeholder="Your description"
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group-4">
                    <div className="form-group">
                      <label htmlFor="company">Your company</label>
                      <input
                        type="text"
                        className="form-control"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="job">Job</label>
                      <input
                        type="text"
                        className="form-control"
                        name="job"
                        value={formData.job}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email address</label>
                      <input
                        type="text"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">Your phone</label>
                      <input
                        type="text"
                        className="form-control"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="location">Location</label>
                    <input
                      type="text"
                      className="form-control"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                    />
                  </div>
                  <div id="map-single" style={{ marginBottom: "20px" }}>
                    <LocationMap address={formData.location} height="400px" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="socials">Socials</label>
                    <input
                      type="text"
                      className="form-control"
                      name="socials"
                      value={formData.socials}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="group-button-submit left mb-3">
                    <button
                      className="pre-btn"
                      type="button"
                      onClick={handleSubmit}
                    >
                      Save &amp; Update
                    </button>
                  </div>
                  <h3>Change passwords</h3>
                  <div className="tfcl-add-listing profile-password">
                    <div className="form-group">
                      <label htmlFor="listing_title">Old password</label>
                      <input
                        type="text"
                        className="form-control"
                        name="listing_title"
                        placeholder="Old password"
                        defaultValue=""
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="listing_title">New password</label>
                      <input
                        type="text"
                        className="form-control"
                        name="listing_title"
                        placeholder="New password"
                        defaultValue=""
                      />
                    </div>
                    <ul className="list-check-req mb-3">
                      <li className="check">
                        <span>One number</span>
                      </li>
                      <li>
                        <span>One lowercase character</span>
                      </li>
                      <li>
                        <span>One uppercase character</span>
                      </li>
                      <li>
                        <span>8 characters minimum</span>
                      </li>
                    </ul>
                    <div className="form-group">
                      <label htmlFor="listing_title">Confirm password</label>
                      <input
                        type="text"
                        className="form-control"
                        name="listing_title"
                        placeholder="Confirm password"
                        defaultValue=""
                      />
                    </div>
                    <div className="group-button-submit left mb-0">
                      <button className="pre-btn">Change passwords</button>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
