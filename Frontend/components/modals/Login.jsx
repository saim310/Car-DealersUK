"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthError, loginUser, logout } from "@/reducer/authSlice";

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loginStatus, token, user, error } = useSelector(
    (state) => state.auth,
  );

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Redirect if already logged in
  useEffect(() => {
    if (token && user) {
      router.push("/dashboard");
    }
  }, [token, user, router]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch(clearAuthError());

    const action = await dispatch(loginUser(formData));

    if (loginUser.fulfilled.match(action)) {
      // Data is already in Redux, useEffect will handle redirection
      // or you can manually trigger it here:
      router.push("/dashboard");
    }
  };

  // Prevent flicker while redirecting
  if (token && user) return null;

  return (
    <div
      className="modal fade popup login-form"
      id="popup_bid"
      tabIndex={-1}
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <button type="button" className="close" data-bs-dismiss="modal">
            ×
          </button>
          <div className="modal-body space-y-20 pd-40">
            <div className="wrap-modal flex">
              <div className="images flex-none">
                <Image
                  alt="login"
                  src="/assets/images/section/login.jpg"
                  width={380}
                  height={640}
                />
              </div>
              <div className="content">
                <h1 className="title-login">Login</h1>
                <form
                  onSubmit={handleSubmit}
                  className="comment-form form-submit"
                >
                  <fieldset>
                    <label className="fw-6">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="tb-my-input"
                      placeholder="Your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </fieldset>
                  <fieldset className="style-wrap">
                    <label className="fw-6">Password</label>
                    <input
                      type="password"
                      name="password"
                      className="input-form"
                      placeholder="Your password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </fieldset>

                  <button
                    className="sc-button"
                    type="submit"
                    disabled={loginStatus === "loading"}
                  >
                    <span>
                      {loginStatus === "loading" ? "Logging in..." : "Login"}
                    </span>
                  </button>

                  {error && (
                    <p
                      className="fs-14"
                      style={{ color: "#cf1322", marginTop: 12 }}
                    >
                      {error}
                    </p>
                  )}
                </form>

                {/* Example of showing full data if login was successful but page hasn't swapped */}
                {user && (
                  <div className="user-preview" style={{ marginTop: 20 }}>
                    <p>
                      Welcome back, <strong>{user.name}</strong> from{" "}
                      {user.company}
                    </p>
                    <p>Location: {user.location}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
