"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import useFetch from "@/hooks/useFetch";
import { toast } from "react-toastify";
import useSubmit from "@/hooks/useSubmit";
import { getImageUrl, apiURL } from "@/utils/exports";
import { 
  Eye, 
  Trash2, 
  X, 
  Download, 
  ExternalLink, 
  FileText, 
  Image as ImageIcon,
  User, 
  CreditCard, 
  Car, 
  FileCheck, 
  Calendar,
  AlertCircle,
  Loader2,
  File
} from "lucide-react";

export default function FinanceEnquiries() {
  const { data, loading, refetch } = useFetch("/finance-enquiries");
  const enquiries = useMemo(() => (Array.isArray(data) ? data : []), [data]);
  const { submit } = useSubmit();

  // Modal & Enquiry Details State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [enquiryDetails, setEnquiryDetails] = useState(null);
  const [fetchingDetails, setFetchingDetails] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  // Lightbox / Image Preview State
  const [previewImage, setPreviewImage] = useState(null);

  // Lock background body scrolling when modal or image lightbox is open
  useEffect(() => {
    if (isModalOpen || previewImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen, previewImage]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this enquiry?")) {
      try {
        await submit(`/finance-enquiries/${id}`, {}, { method: "DELETE" });
        toast.success("Enquiry deleted successfully");
        if (isModalOpen && selectedId === id) {
          closeModal();
        }
        refetch();
      } catch (error) {
        toast.error("Failed to delete enquiry");
      }
    }
  };

  const handleView = useCallback(async (enquiry) => {
    setSelectedId(enquiry.id);
    setEnquiryDetails(enquiry); // Immediate display with list row data
    setIsModalOpen(true);
    setFetchingDetails(true);
    setFetchError(null);

    try {
      const res = await fetch(`${apiURL}/finance-enquiries/${enquiry.id}`);
      if (!res.ok) {
        throw new Error(`Failed to load enquiry details (Status ${res.status})`);
      }
      const json = await res.json();
      setEnquiryDetails(json);
    } catch (err) {
      console.error("Error fetching enquiry details:", err);
      setFetchError(err.message || "Unable to fetch complete details from server.");
    } finally {
      setFetchingDetails(false);
    }
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedId(null);
    setEnquiryDetails(null);
    setFetchError(null);
  };

  // Helper for rendering readable fields safely
  const safeVal = (val, prefix = "") => {
    if (val === null || val === undefined || val === "" || String(val).trim() === "") {
      return "N/A";
    }
    return `${prefix}${val}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return dateStr;
    }
  };

  // Helper to format documents array
  const getDocumentsList = (enquiry) => {
    if (!enquiry) return [];
    const docs = enquiry.documents;
    if (!docs) return [];
    if (Array.isArray(docs)) return docs;
    if (typeof docs === "string") {
      try {
        const parsed = JSON.parse(docs);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [{ name: "Document", url: docs }];
      }
    }
    return [];
  };

  const isImageFile = (doc) => {
    const str = (typeof doc === "string" ? doc : (doc.type || doc.url || doc.name || "")).toLowerCase();
    return str.includes("image") || /\.(jpg|jpeg|png|webp|gif|avif)($|\?)/i.test(str);
  };

  const isPdfFile = (doc) => {
    const str = (typeof doc === "string" ? doc : (doc.type || doc.url || doc.name || "")).toLowerCase();
    return str.includes("pdf") || /\.pdf($|\?)/i.test(str);
  };

  const getDocUrl = (doc) => {
    const rawUrl = typeof doc === "string" ? doc : (doc.url || doc.path || "");
    return getImageUrl(rawUrl, "");
  };

  const getDocName = (doc, index) => {
    if (typeof doc === "string") {
      return doc.split("/").pop() || `Document ${index + 1}`;
    }
    return doc.name || doc.originalname || `Document ${index + 1}`;
  };

  const formatFileSize = (bytes) => {
    if (!bytes || isNaN(bytes)) return null;
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const activeEnquiry = enquiryDetails || (enquiries.find((e) => e.id === selectedId) || null);
  const documents = getDocumentsList(activeEnquiry);

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div className="content-area">
            <main id="main" className="main-content">
              <div className="tfcl-dashboard my-listing-enhanced">
                
                {/* HERO HEADER */}
                <div className="my-listing-hero mb-3">
                  <div>
                    <h1 className="admin-title mb-1">Finance Enquiries</h1>
                    <p className="my-listing-subtitle mb-0">
                      View and manage all customer finance enquiries and uploaded documents from one place.
                    </p>
                  </div>
                </div>

                {/* STATS CARDS */}
                <div className="my-listing-stats-grid mb-3">
                  <div className="my-listing-stat-card">
                    <span className="label">Total Enquiries</span>
                    <strong>{enquiries.length}</strong>
                  </div>
                  <div className="my-listing-stat-card">
                    <span className="label">Latest Applicant</span>
                    <strong>
                      {enquiries.length ? enquiries[0].full_name : "No enquiries yet"}
                    </strong>
                  </div>
                </div>

                {/* MAIN TABLE */}
                <div className="tfcl-dashboard-middle mt-2">
                  <div className="row">
                    <div className="tfcl-dashboard-middle-left col-md-12">
                      <div className="tfcl-dashboard-listing">
                        <div className="tfcl-table-listing">
                          <div className="table-responsive">
                            <table className="table" style={{ width: "100%" }}>
                              <thead>
                                <tr>
                                  <th>Full Name</th>
                                  <th>Phone</th>
                                  <th>Email</th>
                                  <th>Borrow Amount</th>
                                  <th>Term</th>
                                  <th>Use Type</th>
                                  <th>Employment</th>
                                  <th>Residency</th>
                                  <th>Credit History</th>
                                  <th>Date</th>
                                  <th style={{ minWidth: "150px" }}>Actions</th>
                                </tr>
                              </thead>
                              <tbody className="tfcl-table-content">
                                {loading ? (
                                  <tr>
                                    <td colSpan={11} className="text-center py-4">
                                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                                        <Loader2 className="animate-spin" size={18} />
                                        <span>Loading enquiries...</span>
                                      </div>
                                    </td>
                                  </tr>
                                ) : !enquiries.length ? (
                                  <tr>
                                    <td colSpan={11} className="text-center py-4 text-muted">
                                      No finance enquiries found.
                                    </td>
                                  </tr>
                                ) : (
                                  enquiries.map((enquiry) => (
                                    <tr key={enquiry.id}>
                                      <td>
                                        <strong>{enquiry.full_name}</strong>
                                      </td>
                                      <td>{enquiry.phone || "-"}</td>
                                      <td>{enquiry.email || "-"}</td>
                                      <td>
                                        {enquiry.borrow_amount
                                          ? enquiry.borrow_amount.startsWith("£")
                                            ? enquiry.borrow_amount
                                            : `£${enquiry.borrow_amount}`
                                          : "-"}
                                      </td>
                                      <td>{enquiry.years ? `${enquiry.years} Year${enquiry.years > 1 ? 's' : ''}` : "-"}</td>
                                      <td>{enquiry.use_type || "-"}</td>
                                      <td>{enquiry.employment_status || "-"}</td>
                                      <td>{enquiry.residency_status || "-"}</td>
                                      <td>{enquiry.credit_history || "-"}</td>
                                      <td>
                                        {enquiry.created_at
                                          ? new Date(enquiry.created_at).toLocaleDateString("en-US", {
                                              year: "numeric",
                                              month: "short",
                                              day: "2-digit",
                                            })
                                          : "-"}
                                      </td>
                                      <td>
                                        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                                          {/* EYE / VIEW BUTTON */}
                                          <button
                                            type="button"
                                            onClick={() => handleView(enquiry)}
                                            className="btn-action-view"
                                            title="View Complete Details"
                                          >
                                            <Eye size={14} />
                                            <span>View</span>
                                          </button>

                                          {/* DELETE BUTTON */}
                                          <button
                                            type="button"
                                            className="btn-action tfcl-dashboard-action-delete"
                                            onClick={() => handleDelete(enquiry.id)}
                                            title="Delete Enquiry"
                                            style={{ padding: "5px 10px", fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "4px" }}
                                          >
                                            <Trash2 size={14} />
                                            <span>Delete</span>
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </main>
          </div>
        </div>
      </div>

      {/* VIEW DETAILS MODAL */}
      {isModalOpen && activeEnquiry && (
        <div className="modal-backdrop-custom" onClick={closeModal}>
          <div className="modal-container-custom" onClick={(e) => e.stopPropagation()}>
            
            {/* MODAL HEADER */}
            <div className="modal-header-custom">
              <div className="modal-header-title">
                <h3>Finance Enquiry Details</h3>
                <span className="enquiry-ref-tag">Ref #{activeEnquiry.id}</span>
              </div>
              <button type="button" className="modal-close-btn" onClick={closeModal} title="Close Modal">
                <X size={20} />
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="modal-body-custom">
              {fetchingDetails && (
                <div className="fetching-bar">
                  <Loader2 className="animate-spin" size={16} />
                  <span>Loading full record details...</span>
                </div>
              )}

              {fetchError && (
                <div className="error-banner">
                  <AlertCircle size={18} />
                  <span>{fetchError} (Showing cached summary details below)</span>
                </div>
              )}

              {/* APPLICANT DETAILS SECTION */}
              <div className="modal-section">
                <div className="section-title">
                  <User size={18} className="section-icon" />
                  <h4>Applicant & Personal Information</h4>
                </div>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Full Name</span>
                    <strong className="detail-value">{safeVal(activeEnquiry.full_name)}</strong>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Email Address</span>
                    <span className="detail-value">
                      {activeEnquiry.email ? (
                        <a href={`mailto:${activeEnquiry.email}`} className="link-text">
                          {activeEnquiry.email}
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Phone Number</span>
                    <span className="detail-value">
                      {activeEnquiry.phone ? (
                        <a href={`tel:${activeEnquiry.phone}`} className="link-text">
                          {activeEnquiry.phone}
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Residency Status</span>
                    <span className="detail-value">{safeVal(activeEnquiry.residency_status)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Employment Status</span>
                    <span className="detail-value">{safeVal(activeEnquiry.employment_status)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Property Owner</span>
                    <span className="detail-value">{safeVal(activeEnquiry.property_owner)}</span>
                  </div>
                  {activeEnquiry.address && (
                    <div className="detail-item full-width">
                      <span className="detail-label">Address</span>
                      <span className="detail-value">{safeVal(activeEnquiry.address)}</span>
                    </div>
                  )}
                  {activeEnquiry.dob && (
                    <div className="detail-item">
                      <span className="detail-label">Date of Birth</span>
                      <span className="detail-value">{safeVal(activeEnquiry.dob)}</span>
                    </div>
                  )}
                  {activeEnquiry.income && (
                    <div className="detail-item">
                      <span className="detail-label">Income / Salary</span>
                      <span className="detail-value">{safeVal(activeEnquiry.income)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* FINANCE DETAILS SECTION */}
              <div className="modal-section">
                <div className="section-title">
                  <CreditCard size={18} className="section-icon" />
                  <h4>Finance & Loan Requirements</h4>
                </div>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Borrow Amount</span>
                    <strong className="detail-value highlight-amount">
                      {activeEnquiry.borrow_amount
                        ? activeEnquiry.borrow_amount.startsWith("£")
                          ? activeEnquiry.borrow_amount
                          : `£${activeEnquiry.borrow_amount}`
                        : "N/A"}
                    </strong>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Loan Term</span>
                    <span className="detail-value">
                      {activeEnquiry.years ? `${activeEnquiry.years} Year${activeEnquiry.years > 1 ? 's' : ''}` : "N/A"}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Usage Type</span>
                    <span className="detail-value">{safeVal(activeEnquiry.use_type)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Previous Finance</span>
                    <span className="detail-value">{safeVal(activeEnquiry.finance_before)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Credit History</span>
                    <span className="detail-value">{safeVal(activeEnquiry.credit_history)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Application Status</span>
                    <span className="status-pill">
                      {activeEnquiry.status || (activeEnquiry.confirmed ? "Submitted / Confirmed" : "Pending")}
                    </span>
                  </div>
                </div>
              </div>

              {/* VEHICLE DETAILS SECTION (IF PRESENT) */}
              {(activeEnquiry.car_title || activeEnquiry.vehicle_details || activeEnquiry.car_id || activeEnquiry.listing_id) && (
                <div className="modal-section">
                  <div className="section-title">
                    <Car size={18} className="section-icon" />
                    <h4>Associated Vehicle Information</h4>
                  </div>
                  <div className="detail-grid">
                    {activeEnquiry.car_title && (
                      <div className="detail-item full-width">
                        <span className="detail-label">Vehicle Title</span>
                        <strong className="detail-value">{activeEnquiry.car_title}</strong>
                      </div>
                    )}
                    {activeEnquiry.vehicle_details && (
                      <div className="detail-item full-width">
                        <span className="detail-label">Vehicle Details</span>
                        <span className="detail-value">{activeEnquiry.vehicle_details}</span>
                      </div>
                    )}
                    {(activeEnquiry.car_id || activeEnquiry.listing_id) && (
                      <div className="detail-item">
                        <span className="detail-label">Listing ID</span>
                        <span className="detail-value">#{activeEnquiry.car_id || activeEnquiry.listing_id}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* MESSAGE & NOTES SECTION */}
              <div className="modal-section">
                <div className="section-title">
                  <FileText size={18} className="section-icon" />
                  <h4>Customer Message / Additional Notes</h4>
                </div>
                <div className="message-box">
                  {activeEnquiry.message ? (
                    <p>{activeEnquiry.message}</p>
                  ) : (
                    <span className="text-muted italic">No additional message provided.</span>
                  )}
                </div>
              </div>

              {/* UPLOADED DOCUMENTS SECTION */}
              <div className="modal-section">
                <div className="section-title">
                  <FileCheck size={18} className="section-icon" />
                  <h4>Uploaded Documents & Attachments ({documents.length})</h4>
                </div>

                {!documents || documents.length === 0 ? (
                  <div className="no-docs-box">
                    <File size={28} className="text-muted mb-1" />
                    <p className="mb-0">No documents uploaded</p>
                    <small className="text-muted">The applicant did not attach any files to this enquiry.</small>
                  </div>
                ) : (
                  <div className="docs-grid">
                    {documents.map((doc, idx) => {
                      const docUrl = getDocUrl(doc);
                      const docName = getDocName(doc, idx);
                      const isImg = isImageFile(doc);
                      const isPdf = isPdfFile(doc);
                      const fileSize = typeof doc === "object" ? formatFileSize(doc.size) : null;
                      const uploadDate = typeof doc === "object" && doc.uploaded_at ? formatDate(doc.uploaded_at) : null;

                      return (
                        <div key={idx} className="doc-card">
                          <div className="doc-card-header">
                            {isImg ? (
                              <div 
                                className="img-thumbnail-container"
                                onClick={() => setPreviewImage(docUrl)}
                                title="Click to view full image"
                              >
                                <img src={docUrl} alt={docName} className="img-thumbnail" />
                                <div className="img-overlay">
                                  <Eye size={16} />
                                  <span>Preview</span>
                                </div>
                              </div>
                            ) : (
                              <div className={`doc-icon-box ${isPdf ? 'pdf-icon' : 'generic-icon'}`}>
                                <FileText size={32} />
                                <span className="doc-type-tag">{isPdf ? "PDF" : "FILE"}</span>
                              </div>
                            )}
                          </div>

                          <div className="doc-card-body">
                            <span className="doc-filename" title={docName}>{docName}</span>
                            <div className="doc-meta-info">
                              {fileSize && <span className="doc-meta-item">{fileSize}</span>}
                              {uploadDate && <span className="doc-meta-item">{uploadDate}</span>}
                            </div>
                          </div>

                          <div className="doc-card-actions">
                            <a
                              href={docUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-doc-action btn-doc-view"
                              title="Open/View Document in New Tab"
                            >
                              <ExternalLink size={14} />
                              <span>View</span>
                            </a>

                            <a
                              href={docUrl}
                              download={docName}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-doc-action btn-doc-download"
                              title="Download File"
                            >
                              <Download size={14} />
                              <span>Download</span>
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* TIMESTAMPS & META */}
              <div className="modal-meta-footer">
                <div className="meta-footer-item">
                  <Calendar size={14} />
                  <span>Created: {formatDate(activeEnquiry.created_at)}</span>
                </div>
                {activeEnquiry.updated_at && (
                  <div className="meta-footer-item">
                    <Calendar size={14} />
                    <span>Updated: {formatDate(activeEnquiry.updated_at)}</span>
                  </div>
                )}
              </div>

            </div>

            {/* MODAL FOOTER */}
            <div className="modal-footer-custom">
              <button
                type="button"
                className="btn-modal-delete"
                onClick={() => handleDelete(activeEnquiry.id)}
              >
                <Trash2 size={15} />
                <span>Delete Enquiry</span>
              </button>

              <button
                type="button"
                className="btn-modal-close"
                onClick={closeModal}
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* LIGHTBOX FOR FULL IMAGE PREVIEW */}
      {previewImage && (
        <div className="lightbox-backdrop" onClick={() => setPreviewImage(null)}>
          <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setPreviewImage(null)}>
              <X size={24} />
            </button>
            <img src={previewImage} alt="Document Preview" className="lightbox-img" />
          </div>
        </div>
      )}

      {/* COMPONENT SCOPED STYLES */}
      <style jsx>{`
        /* Action Buttons in Table */
        .btn-action-view {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 12px;
          font-size: 0.85rem;
          font-weight: 600;
          background-color: #eff6ff;
          color: #2563eb;
          border: 1px solid #bfdbfe;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-action-view:hover {
          background-color: #2563eb;
          color: #ffffff;
          border-color: #2563eb;
        }

        /* Modal Overlay & Card */
        .modal-backdrop-custom {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1050;
          padding: 20px;
          animation: fadeIn 0.2s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-container-custom {
          background: #ffffff;
          border-radius: 16px;
          width: 100%;
          max-width: 860px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          overflow: hidden;
          animation: slideUp 0.25s ease-out;
        }

        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        /* Modal Header */
        .modal-header-custom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }

        .modal-header-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .modal-header-title h3 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
        }

        .enquiry-ref-tag {
          background: #ff6b0018;
          color: #ff6b00;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 20px;
          letter-spacing: 0.5px;
        }

        .modal-close-btn {
          background: transparent;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 6px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .modal-close-btn:hover {
          background: #e2e8f0;
          color: #0f172a;
        }

        /* Modal Body */
        .modal-body-custom {
          padding: 24px;
          overflow-y: auto;
          overscroll-behavior: contain;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .fetching-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: #eff6ff;
          color: #1d4ed8;
          font-size: 0.85rem;
          border-radius: 8px;
        }

        .error-banner {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
          font-size: 0.85rem;
          border-radius: 8px;
        }

        /* Sections */
        .modal-section {
          background: #ffffff;
          border: 1px solid #f1f5f9;
          border-radius: 12px;
          padding: 18px 20px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
          padding-bottom: 10px;
          border-bottom: 1px solid #f1f5f9;
        }

        .section-icon {
          color: #ff6b00;
        }

        .section-title h4 {
          margin: 0;
          font-size: 1.05rem;
          font-weight: 700;
          color: #1e293b;
        }

        /* Detail Grid */
        .detail-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 16px;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .detail-item.full-width {
          grid-column: 1 / -1;
        }

        .detail-label {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #64748b;
        }

        .detail-value {
          font-size: 0.95rem;
          color: #334155;
          word-break: break-word;
        }

        .highlight-amount {
          color: #ff6b00;
          font-size: 1.1rem;
          font-weight: 700;
        }

        .link-text {
          color: #2563eb;
          text-decoration: none;
        }

        .link-text:hover {
          text-decoration: underline;
        }

        .status-pill {
          display: inline-block;
          padding: 4px 12px;
          background: #dcfce7;
          color: #15803d;
          font-size: 0.8rem;
          font-weight: 600;
          border-radius: 20px;
          width: fit-content;
        }

        /* Message Box */
        .message-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 14px 18px;
          font-size: 0.95rem;
          color: #334155;
          line-height: 1.6;
        }

        /* Uploaded Documents Section */
        .no-docs-box {
          text-align: center;
          padding: 24px;
          background: #f8fafc;
          border: 2px dashed #cbd5e1;
          border-radius: 12px;
          color: #64748b;
        }

        .docs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 16px;
        }

        .doc-card {
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          transition: all 0.2s ease;
        }

        .doc-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          border-color: #cbd5e1;
        }

        .doc-card-header {
          height: 130px;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .img-thumbnail-container {
          width: 100%;
          height: 100%;
          cursor: pointer;
          position: relative;
        }

        .img-thumbnail {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .img-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.4);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 0.85rem;
          font-weight: 600;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .img-thumbnail-container:hover .img-overlay {
          opacity: 1;
        }

        .doc-icon-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          color: #64748b;
        }

        .doc-icon-box.pdf-icon {
          color: #dc2626;
        }

        .doc-type-tag {
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 1px;
          background: #e2e8f0;
          padding: 2px 6px;
          border-radius: 4px;
          color: #475569;
        }

        .doc-card-body {
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }

        .doc-filename {
          font-size: 0.88rem;
          font-weight: 600;
          color: #1e293b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .doc-meta-info {
          display: flex;
          gap: 8px;
          font-size: 0.75rem;
          color: #94a3b8;
        }

        .doc-card-actions {
          display: flex;
          border-top: 1px solid #f1f5f9;
        }

        .btn-doc-action {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 10px;
          font-size: 0.8rem;
          font-weight: 600;
          text-decoration: none;
          transition: background 0.2s;
        }

        .btn-doc-view {
          color: #2563eb;
          border-right: 1px solid #f1f5f9;
        }

        .btn-doc-view:hover {
          background: #eff6ff;
        }

        .btn-doc-download {
          color: #059669;
        }

        .btn-doc-download:hover {
          background: #ecfdf5;
        }

        /* Meta Footer */
        .modal-meta-footer {
          display: flex;
          gap: 20px;
          padding: 10px 16px;
          background: #f8fafc;
          border-radius: 8px;
          font-size: 0.8rem;
          color: #64748b;
        }

        .meta-footer-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* Modal Footer */
        .modal-footer-custom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
        }

        .btn-modal-delete {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-modal-delete:hover {
          background: #dc2626;
          color: white;
        }

        .btn-modal-close {
          background: #0f172a;
          color: white;
          border: none;
          padding: 8px 20px;
          border-radius: 8px;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-modal-close:hover {
          background: #334155;
        }

        /* Lightbox */
        .lightbox-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(5px);
          z-index: 1100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .lightbox-container {
          position: relative;
          max-width: 90vw;
          max-height: 90vh;
        }

        .lightbox-img {
          max-width: 100%;
          max-height: 85vh;
          border-radius: 8px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
        }

        .lightbox-close {
          position: absolute;
          top: -40px;
          right: 0;
          background: transparent;
          border: none;
          color: white;
          cursor: pointer;
        }

        /* Responsive Breakpoints */
        @media (max-width: 768px) {
          .modal-container-custom {
            max-height: 95vh;
          }

          .detail-grid {
            grid-template-columns: 1fr;
          }

          .docs-grid {
            grid-template-columns: 1fr;
          }

          .modal-meta-footer {
            flex-direction: column;
            gap: 6px;
          }
        }
      `}</style>
    </div>
  );
}
