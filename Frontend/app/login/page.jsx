"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthError, loginUser } from "@/reducer/authSlice";

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();

  const auth = useSelector((state) => state.auth || {});
  const { loginStatus, token, user, error } = auth;

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (token && user) {
      router.push("/dashboard");
    }
  }, [token, user, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearAuthError());
    const action = await dispatch(loginUser(formData));
    if (loginUser.fulfilled.match(action)) {
      router.push("/dashboard");
    }
  };

  return (
    <div style={styles.container}>
      {/* Background decoration */}
      <div style={styles.circle1}></div>
      <div style={styles.circle2}></div>

      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Login</h2>
          <p style={styles.subtitle}>Please enter your details to login</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              name="email"
              
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
             
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <button
            type="submit"
            disabled={loginStatus === "loading"}
            style={{
              ...styles.button,
              opacity: loginStatus === "loading" ? 0.7 : 1,
              cursor: loginStatus === "loading" ? "not-allowed" : "pointer",
            }}
          >
            {loginStatus === "loading" ? "Authenticating..." : "Sign In"}
          </button>

          {error && (
            <div style={styles.errorBox}>
               <span style={{marginRight: '8px'}}>⚠️</span> {error}
            </div>
          )}
        </form>

        <div style={styles.footer}>
            <p style={styles.footerText}>© 2026 Admin Dashboard System</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #fff5f0 0%, #ffe0d1 100%)",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },
  // Background Decorations
  circle1: {
    position: "absolute",
    top: "-10%",
    right: "-5%",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "rgba(255, 107, 0, 0.05)",
  },
  circle2: {
    position: "absolute",
    bottom: "-10%",
    left: "-5%",
    width: "300px",
    height: "300px",
    borderRadius: "50%",
    background: "rgba(255, 107, 0, 0.05)",
  },
  card: {
    padding: "40px",
    background: "#fff",
    borderRadius: "20px",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
    zIndex: 1,
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
  },
  logoBadge: {
    width: "50px",
    height: "50px",
    background: "#ff6b00",
    color: "#fff",
    borderRadius: "12px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "24px",
    fontWeight: "bold",
    margin: "0 auto 15px",
    boxShadow: "0 10px 15px rgba(255, 107, 0, 0.2)",
  },
  title: {
    margin: "0",
    fontSize: "24px",
    color: "#333",
    fontWeight: "700",
  },
  subtitle: {
    margin: "5px 0 0",
    fontSize: "14px",
    color: "#777",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#555",
    marginLeft: "2px",
  },
  input: {
    padding: "12px 16px",
    fontSize: "15px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    outline: "none",
    transition: "border-color 0.2s",
    background: "#fafafa",
  },
  button: {
    marginTop: "10px",
    padding: "14px",
    background: "#ff6b00",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "600",
    boxShadow: "0 8px 15px rgba(255, 107, 0, 0.25)",
    transition: "transform 0.2s, background 0.2s",
  },
  errorBox: {
    padding: "12px",
    background: "#fff1f0",
    color: "#d85140",
    borderRadius: "8px",
    fontSize: "13px",
    border: "1px solid #ffa39e",
    textAlign: "center",
  },
  footer: {
    marginTop: "30px",
    textAlign: "center",
    borderTop: "1px solid #eee",
    paddingTop: "20px",
  },
  footerText: {
    fontSize: "12px",
    color: "#aaa",
    margin: 0,
  }
};