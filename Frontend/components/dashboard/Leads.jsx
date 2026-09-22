"use client";

import React, { useMemo, useState, useEffect } from "react";
import useFetch from "@/hooks/useFetch";
import useSubmit from "@/hooks/useSubmit";
import { toast } from "react-toastify";

export default function Leads() {
  const { data, loading, refetch } = useFetch("/leads");
  const { submit } = useSubmit();
  
  const [showModal, setShowModal] = useState(false);
  const [currentLead, setCurrentLead] = useState(null);
  const [isDeleting, setIsDeleting] = useState(null);

  const leads = useMemo(() => (Array.isArray(data) ? data : []), [data]);
  const totalLeads = leads.length;
  const latestLead = leads[0];

  const handleEdit = (lead) => {
    setCurrentLead(lead);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this inquiry?")) return;
    setIsDeleting(id);
    const res = await submit(`/leads/${id}`, {}, { method: "DELETE" });
    if (res) {
      toast.success("Inquiry deleted successfully");
      refetch();
    }
    setIsDeleting(null);
  };

  const handleSubmitLead = async (formData) => {
    const method = currentLead ? "PUT" : "POST";
    const url = currentLead ? `/leads/${currentLead.id}` : "/leads";
    const res = await submit(url, formData, { method });
    if (res) {
      toast.success(currentLead ? "Inquiry updated" : "Inquiry added");
      setShowModal(false);
      refetch();
    }
  };

  return (
    <div className="leads-dashboard">
      <style jsx>{`
        .leads-dashboard { --orange: #ff6b00; --orange-hover: #e66000; padding: 20px; font-family: sans-serif; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .stat-card { background: white; padding: 20px; border-radius: 8px; border-left: 5px solid var(--orange); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
        .stat-card span { color: #666; font-size: 0.9rem; display: block; margin-bottom: 5px; }
        .stat-card strong { font-size: 1.4rem; color: #333; }
        
        /* TABLE RESPONSIVE WRAPPER */
        .table-container { 
          background: white; 
          border-radius: 8px; 
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
          width: 100%;
          overflow-x: auto; /* Enables horizontal scroll on small tablets */
        }

        table { width: 100%; border-collapse: collapse; min-width: 600px; }
        thead { background: #fff5f0; }
        th { text-align: left; padding: 15px; color: var(--orange); font-weight: 600; font-size: 0.85rem; text-transform: uppercase; }
        td { padding: 15px; border-bottom: 1px solid #eee; font-size: 0.9rem; color: #444; }
        .action-btns { display: flex; gap: 8px; }
        .btn-edit { color: #ff9800; background: none; border: 1px solid #ff9800; padding: 6px 12px; border-radius: 4px; cursor: pointer; }
        .btn-delete { color: #f44336; background: none; border: 1px solid #f44336; padding: 6px 12px; border-radius: 4px; cursor: pointer; }

        /* MOBILE STACKED LAYOUT (Breakpoint: 768px) */
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: 1fr; }
          
          table, thead, tbody, th, td, tr { display: block; }
          thead { display: none; } /* Hide headers on mobile */
          
          tr { 
            margin-bottom: 15px; 
            border: 1px solid #eee; 
            border-radius: 8px; 
            padding: 10px;
            background: #fff;
          }
          
          td { 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            border: none; 
            padding: 8px 5px; 
            text-align: right; 
            border-bottom: 1px solid #f9f9f9;
          }

          /* This adds the label before the data on mobile */
          td::before {
            content: attr(data-label);
            font-weight: 700;
            color: var(--orange);
            text-align: left;
            font-size: 0.75rem;
            text-transform: uppercase;
            flex: 1;
          }

          td:last-child { border-bottom: none; }
          .action-btns { justify-content: flex-end; width: 100%; margin-top: 10px; }
        }
      `}</style>

      <div className="stats-grid">
        <div className="stat-card">
          <span>Total inquiries</span>
          <strong>{totalLeads}</strong>
        </div>
        <div className="stat-card">
          <span>Latest inquiry</span>
          <strong>{latestLead ? latestLead.full_name : "N/A"}</strong>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Message</th>
              <th>Plate</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8" style={{ textAlign: "center" }}>Loading records...</td></tr>
            ) : leads.length === 0 ? (
              <tr><td colSpan="8" style={{ textAlign: "center" }}>No inquiries found.</td></tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead.id}>
                  <td data-label="Name" style={{ fontWeight: "600" }}>{lead.full_name}</td>
                  <td data-label="Email">{lead.email}</td>
                  <td data-label="Phone">{lead.phone}</td>
                  <td data-label="Message">
                    <div style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {lead.message}
                    </div>
                  </td>
                  <td data-label="Plate">{lead.plate_number}</td>
                  <td data-label="Status" style={{ textTransform: "capitalize" }}>{lead.status || "-"}</td>
                  <td data-label="Date">{new Date(lead.created_at).toLocaleDateString()}</td>
                  <td data-label="Actions">
                    <div className="action-btns">
                      <button className="btn-edit" onClick={() => handleEdit(lead)}>Edit</button>
                      <button 
                        className="btn-delete" 
                        onClick={() => handleDelete(lead.id)}
                        disabled={isDeleting === lead.id}
                      >
                        {isDeleting === lead.id ? "..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <LeadModal 
          isOpen={showModal} 
          onClose={() => setShowModal(false)} 
          onSubmit={handleSubmitLead} 
          initialData={currentLead} 
        />
      )}
    </div>
  );
}

// --- Internal Modal Component ---
function LeadModal({ onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    full_name: "", email: "", phone: "", message: "", listing_id: "", plate_number: ""
  });

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="modal-overlay">
      <style jsx>{`
        .modal-overlay { position: fixed; top:0; left:0; right:0; bottom:0; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; padding: 15px; }
        .modal-content { background: white; padding: 25px; border-radius: 12px; width: 100%; max-width: 500px; max-height: 90vh; overflow-y: auto; }
        .modal-header h2 { color: #ff6b00; margin: 0 0 15px 0; font-size: 1.3rem; border-bottom: 2px solid #fff5f0; padding-bottom: 10px; }
        .form-group { margin-bottom: 12px; }
        .form-group label { display: block; margin-bottom: 4px; font-weight: 600; font-size: 0.8rem; color: #555; }
        .form-group input, .form-group textarea { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; }
        .modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 15px; }
        .btn-save { background: #ff6b00; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; }
        .btn-cancel { background: #eee; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; }
      `}</style>
      <div className="modal-content">
        <div className="modal-header">
          <h2>{initialData ? "Edit Inquiry" : "Add New Inquiry"}</h2>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }}>
          <div className="form-group"><label>Full Name</label><input name="full_name" value={formData.full_name} onChange={handleChange} required /></div>
          <div className="form-group"><label>Email</label><input name="email" type="email" value={formData.email} onChange={handleChange} required /></div>
          <div className="form-group"><label>Phone</label><input name="phone" value={formData.phone} onChange={handleChange} required /></div>
          <div className="form-group"><label>Plate Number</label><input name="plate_number" value={formData.plate_number} onChange={handleChange} required /></div>
          <div className="form-group"><label>Message</label><textarea name="message" rows="3" value={formData.message} onChange={handleChange} required /></div>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-save">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}