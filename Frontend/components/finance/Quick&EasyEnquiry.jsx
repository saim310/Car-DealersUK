"use client";
import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import useSubmit from '@/hooks/useSubmit';
import { CloudUpload } from "lucide-react";

const Apply = () => {
  const [formData, setFormData] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const { submit, loading: submitting } = useSubmit();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let payload;
      if (uploadedFiles && uploadedFiles.length > 0) {
        payload = new FormData();
        Object.entries(formData).forEach(([key, val]) => {
          if (val !== undefined && val !== null) {
            payload.append(key, val);
          }
        });
        uploadedFiles.forEach((file) => {
          payload.append("files", file);
        });
      } else {
        payload = { ...formData };
      }

      const response = await submit('/finance-enquiries', payload);
      if (response) {
        toast.success('Finance enquiry submitted successfully! We will contact you soon.');
        setFormData({});
        setUploadedFiles([]);
      } else {
        toast.error('Failed to submit enquiry. Please try again.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('An error occurred. Please try again later.');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (files) => {
    const allowedTypes = ['image/png', 'image/jpeg', 'application/pdf'];
    const maxSize = 5 * 1024 * 1024;
    Array.from(files).forEach(file => {
      if (!allowedTypes.includes(file.type)) {
        toast.error(`File type not allowed: ${file.name}. Please upload PNG, JPEG, or PDF files.`);
        return;
      }
      if (file.size > maxSize) {
        toast.error(`File too large: ${file.name}. Maximum size is 5MB.`);
        return;
      }
      if (uploadedFiles.some(f => f.name === file.name)) {
        toast.warning(`File already uploaded: ${file.name}`);
        return;
      }
      setUploadedFiles(prev => [...prev, file]);
      toast.success(`File uploaded: ${file.name}`);
    });
  };

  const handleFileInputChange = (e) => handleFileChange(e.target.files);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setIsDragActive(true);
    else if (e.type === 'dragleave') setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    handleFileChange(e.dataTransfer.files);
  };

  const handleRemoveFile = (index) => {
    setUploadedFiles(prev => {
      const newFiles = [...prev];
      const removedFile = newFiles.splice(index, 1);
      toast.info(`Removed: ${removedFile[0].name}`);
      return newFiles;
    });
  };

  const handleBrowseClick = () => fileInputRef.current?.click();

  return (
    <div className="apply-page">
      {/* HERO */}
      <section className="hero-section">
        <div className="container">
          <h1 className="main-heading">
            Quick & Easy <span className="highlight">Vehicle Finance</span>
          </h1>
          <p className="hero-description">
            At UKA Group, we make vehicle financing simple and stress-free. Whether you're self-employed or working 9-5,
            we'll tailor a finance package that fits your budget and lifestyle.
          </p>
          <p className="hero-description">
            We partner with trusted finance providers and are committed to responsible lending. Our goal is to help you make an informed choice that you are confident with.
          </p>
          <p className="hero-description">
            Each vehicle may show example repayment info – including interest rate deposit and term – so you can see how it all adds up. Adjust the term or deposit to view updated figures that suit your needs.
          </p>
        </div>
      </section>

      {/* FORM */}
      <section className="form-section">
        <div className="container form-container">
          <div className="form-card">
            <div className="form-header">
              <div className="badge">Finance Enquiry</div>
              <h2 style={{ color: '#fff' }}>Get Your Tailored Finance Quote</h2>
              <p>Complete the form below and our team will find the best finance package for you.</p>
            </div>

            <form onSubmit={handleSubmit} className="form-content">

              {/* Row 1: Borrow amount + Term */}
              <div className="form-grid">
                <div className="input-group">
                  <label>How much would you like to borrow?</label>
                  <input
                    type="text"
                    name="borrowAmount"
                    placeholder="15,000"
                    value={formData.borrowAmount || ''}
                    onChange={handleChange}
                  />
                </div>
                <div className="input-group">
                  <label>Over how many years?</label>
                  <select name="years" value={formData.years || ''} onChange={handleChange}>
                    <option value="" disabled>Select term</option>
                    {[1,2,3,4,5,6].map(y => (
                      <option key={y} value={y}>{y} Year{y > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Use type + Employment */}
              <div className="form-grid">
                <div className="input-group">
                  <label>Personal or Business Use?</label>
                  <select name="useType" value={formData.useType || ''} onChange={handleChange}>
                    <option value="" disabled>Select option</option>
                    <option value="Personal">Personal</option>
                    <option value="Business Use">Business Use</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Employment Status</label>
                  <select name="employmentStatus" value={formData.employmentStatus || ''} onChange={handleChange}>
                    <option value="" disabled>Select status</option>
                    <option value="Employed">Employed</option>
                    <option value="Self Employed">Self Employed</option>
                    <option value="Financially Supported by Partner">Financially Supported by Partner</option>
                    <option value="Centrelink - Family Tax Benefit / Other">Centrelink - Family Tax Benefit / Other</option>
                    <option value="Centrelink - New Start Only">Centrelink - New Start Only</option>
                    <option value="Unemployed">Unemployed</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Residency + Property */}
              <div className="form-grid">
                <div className="input-group">
                  <label>Current Residency Status</label>
                  <select name="residencyStatus" value={formData.residencyStatus || ''} onChange={handleChange}>
                    <option value="" disabled>Select residency</option>
                    <option value="UK Citizen">UK Citizen</option>
                    <option value="Permanent Resident">Permanent Resident</option>
                    <option value="Working Visa">Working Visa</option>
                    <option value="Bridging Visa">Bridging Visa</option>
                    <option value="Spouse Visa">Spouse Visa</option>
                    <option value="Temporary Visa">Temporary Visa</option>
                    <option value="Student Visa">Student Visa</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Are You a Property Owner?</label>
                  <select name="propertyOwner" value={formData.propertyOwner || ''} onChange={handleChange}>
                    <option value="" disabled>Select answer</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Finance history + Credit */}
              <div className="form-grid">
                <div className="input-group">
                  <label>Have You Had Finance Before?</label>
                  <select name="financeBefore" value={formData.financeBefore || ''} onChange={handleChange}>
                    <option value="" disabled>Select answer</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Your Credit History *</label>
                  <select name="creditHistory" value={formData.creditHistory || ''} onChange={handleChange}>
                    <option value="" disabled>Select credit history</option>
                    <option value="Excellent - No Issue">Excellent - No Issue</option>
                    <option value="Average - Defaults Under 1000 pounds">Average - Defaults Under 1000 pounds</option>
                    <option value="Poor - Multiple Defaults">Poor - Multiple Defaults</option>
                    <option value="Current/Discharged Bankrupt (Part 10)">Current/Discharged Bankrupt (Part 10)</option>
                    <option value="Current/Discharged Dept Agreement (Part 9)">Current/Discharged Dept Agreement (Part 9)</option>
                    <option value="Not Sure">Not Sure</option>
                  </select>
                </div>
              </div>

       

              {/* Row 5: Contact info */}
              <h3 style={{ 
                marginTop: 'clamp(20px, 4vw, 30px)', 
                marginBottom: 'clamp(30px, 5vw, 40px)', 
                color:"#fff", 
                textAlign:"center", 
                fontWeight:"700",
                fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)',
                letterSpacing: '0.5px'
              }}>Personal Information</h3>

              <div className="form-grid three-columns">
                
                <div className="input-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName || ''}
                    onChange={handleChange}
                  />
                </div>
                <div className="input-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter your phone number"
                    value={formData.phone || ''}
                    onChange={handleChange}
                  />
                </div>
                <div className="input-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={formData.email || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Message */}
              <div className="input-group">
                <label>Your Message / Additional Notes</label>
                <textarea
                  name="message"
                  rows="4"
                  placeholder="Any additional information that may help us..."
                  value={formData.message || ''}
                  onChange={handleChange}
                />
              </div>

              {/* File Upload */}
              <div className="input-group">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".png,.jpg,.jpeg,.pdf"
                  onChange={handleFileInputChange}
                  style={{ display: 'none' }}
                />
                <div
                  className={`upload-area ${isDragActive ? 'active' : ''}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={handleBrowseClick}
                >
                  <div className="upload-icon">
                    <CloudUpload className="h-8 w-8 text-brand" strokeWidth={1.5} />
                  </div>
                  <p>Drag & drop files here or <span className="browse-link">browse</span></p>
                  <p className="upload-hint">PNG, JPEG, PDF • Driving License, Payslips, etc.</p>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="uploaded-files">
                    <h4>Uploaded Files ({uploadedFiles.length})</h4>
                    <ul>
                      {uploadedFiles.map((file, index) => (
                        <li key={index} className="file-item">
                          <div className="file-info">
                            <span className="file-icon">
                              {file.type === 'application/pdf' ? '📄' : '🖼️'}
                            </span>
                            <div className="file-details">
                              <span className="file-name">{file.name}</span>
                              <span className="file-size">{(file.size / 1024).toFixed(2)} KB</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            className="remove-file-btn"
                            onClick={(e) => { e.stopPropagation(); handleRemoveFile(index); }}
                          >
                            ✕
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="submit-section">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="confirmed"
                    checked={formData.confirmed || false}
                    onChange={handleChange}
                    required
                  />
                  I confirm the details above are accurate and true
                </label>
                <button type="submit" className="submit-button" disabled={submitting}>
                  {submitting ? 'SUBMITTING...' : 'SUBMIT FINANCE APPLICATION'}
                </button>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="sidebar">
            <div className="sidebar-card">
              <h3>Why Choose UKA Group?</h3>
              <ul>
                <li>Fast application review with dedicated support</li>
                <li>No credit score impact for a quote</li>
                <li>Transparent process with clear next steps</li>
              </ul>
            </div>
            <div className="sidebar-card">
              <h3>Quick Checklist</h3>
              <ul>
                <li>✅ Driving License (Front & Back)</li>
                <li>✅ Last 3 months payslips</li>
                <li>✅ Visa approval / Proof of ID</li>
                <li>✅ Down payment will be calculated after reviewing the customer profile (0 deposit finance may be available, T&Cs apply)</li>
                <li>✅ After receiving the documents, one of our finance brokers will contact the customer to proceed</li>
                <li>✅ Customer must select a vehicle from our stock before starting the application</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .apply-page {
          background: white;
          color: black;
          font-family: 'Inter', system-ui, sans-serif;
          min-height: 100vh;
        }

        .container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 clamp(16px, 5vw, 24px);
        }

        /* ── Hero ── */
        .hero-section {
          padding: clamp(60px, 12vw, 100px) 0 clamp(50px, 10vw, 80px);
          text-align: center;
          background: linear-gradient(to bottom, #0f0f0f, #0a0a0a);
        }

        .main-heading {
          font-size: clamp(1.8rem, 6vw, 3.8rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          margin-bottom: clamp(16px, 3vw, 24px);
          line-height: 1.1;
          color: white;
        }

        .highlight { color: #FF6B00; }

        .hero-description {
          max-width: 1200px;
          margin: clamp(8px, 2vw, 12px) auto;
          font-size: clamp(0.95rem, 2vw, 1.15rem);
          line-height: 1.7;
          color: #b0b0b0;
          text-align: left;
        }

        /* ── Form section ── */
        .form-section {
          padding: clamp(40px, 8vw, 60px) 0 clamp(60px, 8vw, 100px);
        }

        .form-container {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: clamp(24px, 4vw, 40px);
          align-items: start;
        }

        .form-card {
          background: #161616;
          border-radius: clamp(20px, 4vw, 28px);
          overflow: hidden;
          border: 1px solid #222;
          box-shadow: 0 20px 60px rgba(0,0,0,0.6);
        }

        /* ── Form header — "Finance Inquiry" heading enlarged ── */
        .form-header {
          background: #1f1f1f;
          padding: clamp(24px, 6vw, 40px) clamp(20px, 5vw, 40px) clamp(18px, 4vw, 28px);
          text-align: center;
          border-bottom: 1px solid #222;
        }

        .badge {
          display: inline-block;
          background: rgba(255,107,0,0.15);
          color: #FF6B00;
          font-size: clamp(0.75rem, 1.5vw, 1rem);
          font-weight: 700;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          padding: clamp(6px, 1.5vw, 8px) clamp(16px, 3vw, 22px);
          border-radius: 50px;
          margin-bottom: clamp(12px, 2vw, 18px);
        }

        .form-header h2 {
          font-size: clamp(1.6rem, 4vw, 2.1rem);
          font-weight: 700;
          margin-bottom: clamp(8px, 1.5vw, 10px);
        }

        .form-header p {
          color: #aaa;
          font-size: clamp(0.9rem, 2vw, 1rem);
          margin: 0;
          line-height: 1.5;
        }

        /* ── Form body ── */
        .form-content {
          padding: clamp(20px, 4vw, 32px) clamp(16px, 4vw, 36px) clamp(20px, 4vw, 36px);
        }

        /* Tighter row spacing */
        .input-group {
          margin-bottom: clamp(14px, 2vw, 18px);
        }

        .input-group label {
          display: block;
          font-size: clamp(0.75rem, 1.5vw, 0.82rem);
          font-weight: 600;
          color: #aaa;
          margin-bottom: clamp(4px, 1vw, 6px);
          letter-spacing: 0.4px;
          text-transform: uppercase;
        }

        .input-group input,
        .input-group select,
        .input-group textarea {
          width: 100%;
          padding: clamp(10px, 2vw, 12px) clamp(12px, 2vw, 16px);
          background: #1f1f1f;
          border: 1px solid #2e2e2e;
          border-radius: 12px;
          color: white;
          font-size: clamp(0.88rem, 1.5vw, 0.95rem);
          transition: all 0.25s ease;
          appearance: auto;
        }

        .input-group input:focus,
        .input-group select:focus,
        .input-group textarea:focus {
          border-color: #FF6B00;
          outline: none;
          box-shadow: 0 0 0 3px rgba(255,107,0,0.12);
        }

        .input-group select option {
          background: #1f1f1f;
          color: white;
        }

        /* Grid gap */
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(12px, 2vw, 16px);
        }

        .three-columns {
          grid-template-columns: 1fr 1fr 1fr;
        }

        /* Divider */
        .divider {
          border: none;
          height: 1px;
          background: #2a2a2a;
          margin: clamp(16px, 3vw, 20px) 0;
        }

        /* Upload */
        .upload-area {
          border: 2px dashed #444;
          border-radius: 16px;
          padding: clamp(24px, 5vw, 36px) clamp(16px, 3vw, 20px);
          text-align: center;
          transition: all 0.3s ease;
          cursor: pointer;
          width: 100%;
        }

        .upload-area:hover,
        .upload-area.active {
          border-color: #FF6B00;
          background: rgba(255,107,0,0.05);
        }

        .upload-area.active { transform: scale(1.01); }

        .upload-icon { 
          font-size: clamp(1.8rem, 4vw, 2.5rem); 
          margin-bottom: clamp(8px, 1.5vw, 10px); 
        }

        .browse-link { color: #FF6B00; font-weight: 600; cursor: pointer; }

        .upload-hint { 
          font-size: clamp(0.7rem, 1.5vw, 0.78rem); 
          color: #666; 
          margin-top: clamp(4px, 1vw, 6px); 
        }

        /* Uploaded files */
        .uploaded-files {
          margin-top: clamp(10px, 2vw, 14px);
          padding: clamp(12px, 2vw, 16px);
          background: #0a0a0a;
          border: 1px solid #333;
          border-radius: 14px;
        }

        .uploaded-files h4 {
          color: #FF6B00;
          font-size: clamp(0.8rem, 1.5vw, 0.9rem);
          margin: 0 0 clamp(8px, 1.5vw, 12px);
          font-weight: 600;
        }

        .uploaded-files ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: clamp(6px, 1vw, 8px);
        }

        .file-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: clamp(8px, 1.5vw, 10px) clamp(10px, 2vw, 14px);
          background: #1f1f1f;
          border: 1px solid #333;
          border-radius: 10px;
          transition: all 0.25s ease;
        }

        .file-item:hover { border-color: #FF6B00; background: #252525; }

        .file-info { display: flex; align-items: center; gap: clamp(8px, 1.5vw, 10px); flex: 1; min-width: 0; }
        .file-icon { font-size: clamp(1.2rem, 2vw, 1.4rem); flex-shrink: 0; }
        .file-details { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
        .file-name { color: #fff; font-size: clamp(0.8rem, 1.5vw, 0.9rem); font-weight: 500; word-break: break-all; }
        .file-size { color: #888; font-size: clamp(0.65rem, 1vw, 0.75rem); }

        .remove-file-btn {
          background: transparent;
          border: none;
          color: #ff4444;
          font-size: clamp(0.9rem, 2vw, 1.1rem);
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 4px;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .remove-file-btn:hover { background: rgba(255,68,68,0.1); color: #ff6b6b; }

        /* Submit section */
        .submit-section { margin-top: clamp(18px, 3vw, 24px); }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: clamp(8px, 1.5vw, 10px);
          font-size: clamp(0.8rem, 1.5vw, 0.9rem);
          color: #ccc;
          margin-bottom: clamp(12px, 2vw, 18px);
          cursor: pointer;
          line-height: 1.5;
        }

        .submit-button {
          width: 100%;
          padding: clamp(12px, 2vw, 16px);
          background: linear-gradient(90deg, #FF6B00, #FF8C00);
          color: white;
          border: none;
          border-radius: 14px;
          font-size: clamp(0.9rem, 2vw, 1.05rem);
          font-weight: 700;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 24px rgba(255,107,0,0.28);
        }

        .submit-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(255,107,0,0.38);
        }

        .submit-button:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

        /* ── Sidebar ── */
        .sidebar-card {
          background: #111;
          border: 1px solid #222;
          border-radius: clamp(16px, 3vw, 20px);
          padding: clamp(20px, 4vw, 28px);
          margin-bottom: clamp(16px, 3vw, 20px);
        }

        .sidebar-card h3 {
          color: #FF6B00;
          font-size: clamp(1rem, 2vw, 1.05rem);
          margin-bottom: clamp(12px, 2vw, 16px);
          letter-spacing: 0.8px;
          font-weight: 600;
        }

        .sidebar-card ul { list-style: none; padding: 0; margin: 0; }

        .sidebar-card li {
          padding: clamp(6px, 1.5vw, 9px) 0;
          border-bottom: 1px solid #1a1a1a;
          color: #ccc;
          font-size: clamp(0.85rem, 1.5vw, 0.93rem);
          line-height: 1.5;
        }

        .sidebar-card li:last-child { border-bottom: none; }

        /* ── Responsive ── */
        @media (max-width: 1024px) {
          .form-container { 
            grid-template-columns: 1fr; 
          }
        }

        @media (max-width: 768px) {
          .container {
            padding: 0 clamp(14px, 4vw, 20px);
          }
          
          .form-header h2 {
            font-size: clamp(1.4rem, 5vw, 1.8rem);
          }
          
          .form-content { 
            padding: clamp(16px, 3vw, 24px) clamp(14px, 3vw, 20px); 
          }
          
          .form-grid,
          .three-columns { 
            grid-template-columns: 1fr; 
            gap: clamp(10px, 2vw, 14px);
          }
          
          .hero-section {
            padding: clamp(40px, 8vw, 60px) 0 clamp(30px, 6vw, 50px);
          }
          
          .main-heading {
            font-size: clamp(1.6rem, 7vw, 2.5rem);
            margin-bottom: clamp(12px, 2vw, 16px);
          }
        }

        @media (max-width: 640px) {
          .form-content { 
            padding: clamp(14px, 3vw, 20px) clamp(12px, 2.5vw, 16px); 
          }
          
          .form-header { 
            padding: clamp(20px, 4vw, 28px) clamp(16px, 3vw, 20px) clamp(16px, 3vw, 20px); 
          }
          
          .form-header h2 {
            font-size: clamp(1.3rem, 6vw, 1.6rem);
            margin-bottom: clamp(6px, 1vw, 8px);
          }
          
          .form-header p {
            font-size: clamp(0.8rem, 1.5vw, 0.9rem);
          }
          
          .badge {
            font-size: clamp(0.65rem, 1.2vw, 0.8rem);
            padding: clamp(5px, 1vw, 6px) clamp(12px, 2vw, 16px);
          }
          
          .main-heading {
            font-size: clamp(1.4rem, 8vw, 2rem);
          }
          
          .hero-description {
            font-size: clamp(0.88rem, 1.8vw, 1rem);
          }
          
          .submit-button {
            padding: clamp(10px, 2vw, 14px);
            font-size: clamp(0.85rem, 1.5vw, 0.95rem);
          }
          
          .checkbox-label {
            font-size: clamp(0.75rem, 1.3vw, 0.85rem);
          }
        }

        @media (max-width: 480px) {
        .form-header h2{
        font-size: 1.35rem;
        margin-bottom: 10px;
        letter-spacing: -.02em;
        }
          .container {
            padding: 0 12px;
          }
          
          .form-grid,
          .three-columns { 
            gap: 10px;
          }
          
          .input-group {
            margin-bottom: 12px;
          }
          
          .form-section {
            padding: 30px 0 50px;
          }
          
          .hero-section {
            padding: 30px 0 30px;
          }
          
          .main-heading {
            font-size: 1.35rem;
            margin-bottom: 20px;
            letter-spacing: -0.02em;

          }
          
          .hero-description {
            font-size: 0.85rem;
            margin: 6px auto;
          }
        }
      `}</style>
    </div>
  );
};

export default Apply;
