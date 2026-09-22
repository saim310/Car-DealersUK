"use client";

import ReviewSubmissionForm from "@/components/common/ReviewSubmissionForm";
import { Toaster } from "react-hot-toast";

export default function SubmitReviewPage() {
  return (
    <>
      <Toaster position="top-right" />
      <main className="main">
        {/* Hero Section */}
        <section style={{ background: "#f9f9f9", padding: "60px 0 40px" }}>
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div style={{ textAlign: "center", marginBottom: "40px" }}>
                  <h1
                    style={{
                      fontSize: "42px",
                      fontWeight: "bold",
                      marginBottom: "15px",
                      color: "#333",
                    }}
                  >
                    Share Your Experience
                  </h1>
                  <p
                    style={{
                      fontSize: "18px",
                      color: "#666",
                      maxWidth: "600px",
                      margin: "0 auto",
                    }}
                  >
                    Your review helps other customers discover the right vehicle
                    and understand what to expect from our dealership.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section style={{ padding: "60px 0" }}>
          <div className="container">
            <div className="row">
              <div className="col-lg-8 offset-lg-2">
                <ReviewSubmissionForm />
              </div>
            </div>
          </div>
        </section>

       

        {/* Tips Section */}
        <section style={{ padding: "60px 0" }}>
          <div className="container">
            <div className="row">
              <div className="col-lg-8 offset-lg-2">
                <h2
                  style={{
                    marginBottom: "30px",
                    fontSize: "28px",
                    fontWeight: "bold",
                  }}
                >
                  Tips for a Great Review
                </h2>
                <ul style={{ listStyle: "none", padding: "0" }}>
                  <li
                    style={{
                      padding: "15px 0",
                      borderBottom: "1px solid #eee",
                      fontSize: "16px",
                    }}
                  >
                    <strong>Be Specific:</strong> Share details about the
                    vehicle's performance, comfort, features, and value for money.
                  </li>
                  <li
                    style={{
                      padding: "15px 0",
                      borderBottom: "1px solid #eee",
                      fontSize: "16px",
                    }}
                  >
                    <strong>Be Honest:</strong> We appreciate both positive and
                    constructive feedback. Your honest opinion helps us improve.
                  </li>
                  <li
                    style={{
                      padding: "15px 0",
                      borderBottom: "1px solid #eee",
                      fontSize: "16px",
                    }}
                  >
                    <strong>Add Photos:</strong> Include images of the vehicle or
                    your experience to help other customers visualize the product.
                  </li>
                  <li
                    style={{
                      padding: "15px 0",
                      borderBottom: "1px solid #eee",
                      fontSize: "16px",
                    }}
                  >
                    <strong>Rate Accurately:</strong> Use the star rating to
                    reflect your overall satisfaction with the vehicle.
                  </li>
                  <li
                    style={{
                      padding: "15px 0",
                      fontSize: "16px",
                    }}
                  >
                    <strong>Professional Tone:</strong> Keep your review
                    professional and respectful to maintain a helpful community.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
