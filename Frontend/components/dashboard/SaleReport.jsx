"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import useFetch from "@/hooks/useFetch";
import useSubmit from "@/hooks/useSubmit";
import { toast } from "react-toastify";

/* ─────────────────────────────────────────────
   MODAL – standalone so it never re-mounts on
   parent re-render, and its own state is local.
───────────────────────────────────────────── */
function SaleReportModal({ title, onClose, onSubmit, initialData }) {
  const EMPTY = {
    customer_name: "",
    phone: "",
    email: "",
    lead_source: "",
    sold_by: "",
    plate_number: "",
    sale_date: "",
    listing_id: null,
  };

  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (initialData) {
      setForm({
        customer_name: initialData.customer_name ?? "",
        phone:         initialData.phone         ?? "",
        email:         initialData.email         ?? "",
        lead_source:   initialData.lead_source   ?? "",
        sold_by:       initialData.sold_by       ?? "",
        plate_number:  initialData.plate_number  ?? "",
        sale_date:     initialData.sale_date
          ? initialData.sale_date.split("T")[0]
          : "",
        listing_id:    initialData.listing_id    ?? null,
      });
    } else {
      setForm(EMPTY);
    }
  }, [initialData]);

  // Key fix: use name attribute directly; don't rely on closure capturing stale state
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await onSubmit(form);
    setSubmitting(false);
  };

  // Close on backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const fields = [
    { label: "Customer Name", name: "customer_name", type: "text",  required: true },
    { label: "Phone",         name: "phone",         type: "tel",   required: true },
    { label: "Email",         name: "email",         type: "email", required: true },
    { label: "Lead Source",   name: "lead_source",   type: "text"  },
    { label: "Sold By",       name: "sold_by",       type: "text"  },
    { label: "Plate Number",  name: "plate_number",  type: "text"  },
    { label: "Sale Date",     name: "sale_date",     type: "date"  },

  ];

  return (
    <>
      {/* Inject styles once */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        .sr-backdrop {
          position: fixed; inset: 0;
          background: rgba(0,0,0,.45);
          backdrop-filter: blur(3px);
          z-index: 9999;
          display: flex; align-items: center; justify-content: center;
          animation: srFadeIn .18s ease;
        }
        @keyframes srFadeIn { from { opacity:0 } to { opacity:1 } }

        .sr-modal {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #fff;
          border-radius: 16px;
          padding: 0;
          width: 100%; max-width: 520px;
          box-shadow: 0 24px 60px rgba(0,0,0,.18);
          overflow: hidden;
          animation: srSlideUp .22s cubic-bezier(.22,1,.36,1);
        }
        @keyframes srSlideUp { from { transform:translateY(24px); opacity:0 } to { transform:translateY(0); opacity:1 } }

        .sr-modal-header {
          background: linear-gradient(135deg, #FF6B00, #FF9A3C);
          padding: 22px 28px 20px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .sr-modal-header h4 {
          margin: 0; color: #fff;
          font-size: 1.15rem; font-weight: 700; letter-spacing: -.01em;
        }
        .sr-close-btn {
          background: rgba(255,255,255,.22);
          border: none; border-radius: 50%;
          width: 32px; height: 32px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #fff; font-size: 18px; line-height: 1;
          transition: background .15s;
        }
        .sr-close-btn:hover { background: rgba(255,255,255,.38); }

        .sr-modal-body { padding: 24px 28px; }

        .sr-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

        .sr-field { display: flex; flex-direction: column; gap: 5px; }
        .sr-field label {
          font-size: .76rem; font-weight: 600; color: #9B6500; text-transform: uppercase; letter-spacing: .04em;
        }
        .sr-field input {
          border: 1.5px solid #E8E8E8;
          border-radius: 8px;
          padding: 9px 12px;
          font-size: .88rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #1a1a1a;
          transition: border-color .15s, box-shadow .15s;
          outline: none;
          background: #FAFAFA;
          width: 100%; box-sizing: border-box;
        }
        .sr-field input:focus {
          border-color: #FF6B00;
          box-shadow: 0 0 0 3px rgba(255,107,0,.13);
          background: #fff;
        }

        .sr-modal-footer {
          padding: 16px 28px 22px;
          display: flex; justify-content: flex-end; gap: 10px;
        }

        .sr-btn {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 600; font-size: .88rem;
          padding: 10px 22px; border-radius: 8px;
          border: none; cursor: pointer;
          transition: all .15s;
        }
        .sr-btn-cancel {
          background: #F2F2F2; color: #555;
        }
        .sr-btn-cancel:hover { background: #E5E5E5; }
        .sr-btn-save {
          background: linear-gradient(135deg, #FF6B00, #FF9A3C);
          color: #fff; min-width: 100px;
          box-shadow: 0 4px 14px rgba(255,107,0,.3);
        }
        .sr-btn-save:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(255,107,0,.4); }
        .sr-btn-save:disabled { opacity: .65; transform: none; cursor: not-allowed; }
      `}</style>

      <div className="sr-backdrop" onClick={handleBackdropClick}>
        <div className="sr-modal" onClick={(e) => e.stopPropagation()}>

          <div className="sr-modal-header">
            <h4>{title}</h4>
            <button className="sr-close-btn" type="button" onClick={onClose} aria-label="Close">×</button>
          </div>

          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="sr-modal-body">
              <div className="sr-grid">
                {fields.map(({ label, name, type, required }) => (
                  <div className="sr-field" key={name}>
                    <label htmlFor={`sr-${name}`}>{label}{required && " *"}</label>
                    <input
                      id={`sr-${name}`}
                      name={name}
                      type={type}
                      value={form[name]}
                      onChange={handleChange}
                      required={required}
                      autoComplete="off"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="sr-modal-footer">
              <button type="button" className="sr-btn sr-btn-cancel" onClick={onClose} disabled={submitting}>
                Cancel
              </button>
              <button type="submit" className="sr-btn sr-btn-save" disabled={submitting}>
                {submitting ? "Saving…" : "Save"}
              </button>
            </div>
          </form>

        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function SaleReport() {
  const { data, loading, refetch } = useFetch("/sale-reports");
  const { submit } = useSubmit();

  const [deleting,       setDeleting]       = useState(null);
  const [searchText,     setSearchText]     = useState("");
  const [showAddModal,   setShowAddModal]   = useState(false);
  const [showEditModal,  setShowEditModal]  = useState(false);
  const [editReport,     setEditReport]     = useState(null);

  /* ── Handlers ── */
  const handleAddReport = async (form) => {
    const response = await submit("/sale-reports", form, { method: "POST" });
    if (response?.id) {
      toast.success("Sale report added successfully!");
      setShowAddModal(false);
      refetch?.();
    } else {
      toast.error("Failed to add sale report");
    }
  };

  const handleEditReport = async (form) => {
    if (!editReport) return;
    const response = await submit(`/sale-reports/${editReport.id}`, form, { method: "PUT" });
    if (response) {
      toast.success("Sale report updated successfully!");
      setShowEditModal(false);
      setEditReport(null);
      refetch?.();
    } else {
      toast.error("Failed to update sale report");
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm("Remove this sale report? The listing will be marked as available again.")) return;
    setDeleting(reportId);
    const response = await submit(`/sale-reports/${reportId}`, {}, { method: "DELETE" });
    if (response) {
      toast.success("Sale report removed successfully!");
      refetch?.();
    } else {
      toast.error("Failed to delete sale report");
    }
    setDeleting(null);
  };

  /* ── Filtered list ── */
  const reports = useMemo(() => {
    const source = Array.isArray(data) ? data : [];
    const term   = searchText.trim().toLowerCase();
    const noSpace = term.replace(/\s+/g, "");
    if (!term) return source;
    return source.filter((r) => {
      const basic = [r.customer_name, r.phone, r.email, r.lead_source, r.sold_by]
        .filter(Boolean).some((v) => String(v).toLowerCase().includes(term));
      const plate = r.plate_number && (
        String(r.plate_number).toLowerCase().includes(term) ||
        String(r.plate_number).toLowerCase().replace(/\s+/g, "").includes(noSpace)
      );
      return basic || plate;
    });
  }, [data, searchText]);

  const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" }) : "—";

  /* ── Render ── */
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .sr-page { font-family: 'Plus Jakarta Sans', sans-serif; padding: 28px 0; }

        /* Hero */
        .sr-hero {
          background: linear-gradient(135deg, #FF6B00 0%, #FF9A3C 100%);
          border-radius: 16px;
          padding: 28px 32px;
          margin-bottom: 24px;
          display: flex; align-items: center; justify-content: space-between;
          box-shadow: 0 8px 30px rgba(255,107,0,.22);
        }
        .sr-hero h1 { margin:0; font-size: 1.6rem; font-weight:800; color:#fff; letter-spacing:-.02em; }
        .sr-hero p  { margin: 4px 0 0; color: rgba(255,255,255,.82); font-size:.9rem; }
        .sr-btn-add {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #fff; color: #FF6B00;
          border: none; border-radius: 10px;
          padding: 11px 26px; font-weight: 700; font-size:.9rem;
          cursor: pointer; white-space: nowrap;
          box-shadow: 0 4px 16px rgba(0,0,0,.1);
          transition: all .15s;
        }
        .sr-btn-add:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(0,0,0,.15); }

        /* Stats */
        .sr-stats { display:grid; grid-template-columns: repeat(auto-fit,minmax(180px,1fr)); gap:16px; margin-bottom:24px; }
        .sr-stat-card {
          background:#fff; border-radius:12px;
          padding:18px 22px;
          border: 1.5px solid #FFE0C4;
          box-shadow: 0 2px 10px rgba(255,107,0,.06);
        }
        .sr-stat-card .label { font-size:.75rem; font-weight:600; text-transform:uppercase; letter-spacing:.05em; color:#FF8C3C; }
        .sr-stat-card strong { display:block; font-size:1.5rem; font-weight:800; color:#1a1a1a; margin-top:4px; }

        /* Note banner */
        .sr-note {
          background: #FFF7F0; border: 1.5px solid #FFD4A8;
          border-radius: 10px; padding: 13px 18px;
          font-size:.85rem; color:#7A3D00; margin-bottom:22px;
        }
        .sr-note strong { color:#FF6B00; }

        /* Toolbar */
        .sr-toolbar {
          display:flex; align-items:center; justify-content:space-between;
          flex-wrap:wrap; gap:12px; margin-bottom:16px;
        }
        .sr-search-wrap { position:relative; }
        .sr-search-wrap svg {
          position:absolute; left:12px; top:50%; transform:translateY(-50%);
          color:#FF8C3C; width:16px; height:16px; pointer-events:none;
        }
        .sr-search {
          font-family:'Plus Jakarta Sans',sans-serif;
          border:1.5px solid #E8E8E8; border-radius:10px;
          padding:9px 14px 9px 38px;
          font-size:.88rem; color:#1a1a1a;
          width:280px; outline:none;
          transition:border-color .15s, box-shadow .15s;
        }
        .sr-search:focus { border-color:#FF6B00; box-shadow:0 0 0 3px rgba(255,107,0,.12); }
        .sr-result-text { font-size:.84rem; color:#888; }
        .sr-result-text b { color:#FF6B00; }

        /* Table card */
        .sr-table-card {
          background:#fff; border-radius:14px;
          border:1.5px solid #F0F0F0;
          overflow:hidden;
          box-shadow: 0 2px 12px rgba(0,0,0,.05);
        }
        .sr-table-card table { width:100%; border-collapse:collapse; }
        .sr-table-card thead th {
          background:#FFF3E8;
          padding:13px 16px;
          text-align:left; font-size:.76rem; font-weight:700;
          text-transform:uppercase; letter-spacing:.05em; color:#9B4F00;
          border-bottom:1.5px solid #FFE0C4;
          white-space:nowrap;
        }
        .sr-table-card tbody tr { border-bottom:1px solid #F5F5F5; transition:background .12s; }
        .sr-table-card tbody tr:last-child { border-bottom:none; }
        .sr-table-card tbody tr:hover { background:#FFFAF5; }
        .sr-table-card tbody td { padding:13px 16px; font-size:.87rem; color:#333; vertical-align:middle; }

        /* Action buttons */
        .sr-btn-edit {
          font-family:'Plus Jakarta Sans',sans-serif;
          background:#FFF3E8; color:#FF6B00;
          border:1.5px solid #FFD4A8; border-radius:7px;
          padding:5px 13px; font-size:.8rem; font-weight:600;
          cursor:pointer; transition:all .14s;
        }
        .sr-btn-edit:hover { background:#FF6B00; color:#fff; border-color:#FF6B00; }
        .sr-btn-del {
          font-family:'Plus Jakarta Sans',sans-serif;
          background:#FFF0F0; color:#D63031;
          border:1.5px solid #FFCFCF; border-radius:7px;
          padding:5px 13px; font-size:.8rem; font-weight:600;
          cursor:pointer; transition:all .14s;
        }
        .sr-btn-del:hover:not(:disabled) { background:#D63031; color:#fff; border-color:#D63031; }
        .sr-btn-del:disabled { opacity:.55; cursor:not-allowed; }

        /* Empty state */
        .sr-empty { text-align:center; padding:52px 20px; color:#aaa; }
        .sr-empty h4 { color:#555; font-size:1.1rem; margin-bottom:6px; }

        /* Badge */
        .sr-plate {
          background:#F0F0F0; color:#555;
          border-radius:5px; padding:2px 8px;
          font-size:.8rem; font-family:monospace; letter-spacing:.05em;
        }
      `}</style>

      <div className="container sr-page">

        {/* Hero */}
        <div className="sr-hero">
          <div>
            <h1>Sale Reports</h1>
            <p>Add customer sale data and review sale history from one place.</p>
          </div>
          <button className="sr-btn-add" onClick={() => setShowAddModal(true)}>+ Add Record</button>
        </div>

        {/* Stats */}
        <div className="sr-stats">
          <div className="sr-stat-card">
            <span className="label">Total Sales Recorded</span>
            <strong>{Array.isArray(data) ? data.length : 0}</strong>
          </div>
          <div className="sr-stat-card">
            <span className="label">Latest Record</span>
            <strong style={{ fontSize:"1rem" }}>
              {Array.isArray(data) && data.length ? data[0].customer_name || data[0].email : "No records yet"}
            </strong>
          </div>
        </div>

        {/* Note */}
        <div className="sr-note">
          <strong>Tip:</strong> To record a sale, click the <strong>"Sold"</strong> button on any listing in the Dashboard.
          This opens a form to capture customer and sale details, saved directly to this report.
        </div>

        {/* Toolbar */}
        <div className="sr-toolbar">
          <div className="sr-search-wrap">
          
            <input
              className="sr-search"
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search customer, phone, plate…"
            />
          </div>
          <span className="sr-result-text">
            <b>{reports.length}</b> {loading ? "loading…" : "results found"}
          </span>
        </div>

        {/* Table */}
        <div className="sr-table-card">
          <div style={{ overflowX:"auto" }}>
            <table>
              <thead>
                <tr>
                  <th>Customer Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Lead Source</th>
                  <th>Sold By</th>
                  <th>Plate No.</th>
                  <th>Sale Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={8} style={{ textAlign:"center", padding:32, color:"#aaa" }}>Loading sale reports…</td></tr>
                ) : !reports.length ? (
                  <tr>
                    <td colSpan={8}>
                      <div className="sr-empty">
                        <h4>No sale reports found</h4>
                        <p>{searchText ? "Try another keyword or clear the search." : "No entries yet. Click 'Sold' on listings to record a sale."}</p>
                      </div>
                    </td>
                  </tr>
                ) : reports.map((r) => (
                  <tr key={r.id}>
                    <td><strong style={{ color:"#1a1a1a" }}>{r.customer_name}</strong></td>
                    <td>{r.phone}</td>
                    <td>{r.email}</td>
                    <td>{r.lead_source || "—"}</td>
                    <td>{r.sold_by || "—"}</td>
                    <td>{r.plate_number ? <span className="sr-plate">{r.plate_number}</span> : "—"}</td>
                    <td>{fmtDate(r.sale_date)}</td>
                    <td>
                      <div style={{ display:"flex", gap:7 }}>
                        <button className="sr-btn-edit" onClick={() => { setEditReport(r); setShowEditModal(true); }}>Edit</button>
                        <button
                          className="sr-btn-del"
                          disabled={deleting === r.id}
                          onClick={() => handleDeleteReport(r.id)}
                        >
                          {deleting === r.id ? "…" : "Remove"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modals */}
        {showAddModal && (
          <SaleReportModal
            title="Add Sale Report"
            onClose={() => setShowAddModal(false)}
            onSubmit={handleAddReport}
          />
        )}
        {showEditModal && editReport && (
          <SaleReportModal
            title="Edit Sale Report"
            initialData={editReport}
            onClose={() => { setShowEditModal(false); setEditReport(null); }}
            onSubmit={handleEditReport}
          />
        )}

      </div>
    </>
  );
}