"use client";

import React from 'react';
import Link from "next/link";
import { BadgeDollarSign, FileText, Calculator } from "lucide-react";
//import { useNavigate } from 'react-router-dom';

//import { useNavigate } from 'react-router-dom';

const ApplyForFinance = () => {
  // --- INTERNAL STYLES ---
  const styles = {
    sectionPadding: { padding: '60px 20px' },
    orangeText: { color: '#FF7101' },
    orangeBg: { backgroundColor: '#FF7101' },
    hero: {
      background: 'linear-gradient(135deg, #1a1a1a 0%, #333 100%)',
      padding: '80px 20px',
      textAlign: 'center',
      color: '#fff',
    },
    card: {
      backgroundColor: '#f8f9fa',
      borderRadius: '12px',
      padding: '30px',
      textAlign: 'center',
      boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      height: '100%'
    },
    iconBox: {
      backgroundColor: '#000',
      width: '60px',
      height: '60px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '20px',
      fontSize: '24px',
      color: '#fff'
    },
    btnPrimary: {
      backgroundColor: '#000',
      color: '#fff',
      padding: '12px 25px',
      borderRadius: '50px',
      border: 'none',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      cursor: 'pointer',
      marginTop: 'auto',
      fontSize: '14px'
    },
    bulletList: {
      listStyle: 'none',
      padding: 0,
    },
    bulletItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '12px',
      fontSize: '16px',
      color: '#444'
    },
    checkMark: {
      color: '#FF7101',
      fontWeight: 'bold',
      fontSize: '18px'
    }

   
  };

  //const navigate = useNavigate();

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#333', backgroundColor: '#fff' }}>
      
      {/* --- HERO SECTION --- */}
      <section style={styles.hero}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ color:"white", fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: '800', marginBottom: '20px' }}>
            APPLY FOR <span style={styles.orangeText}>USED CAR FINANCE</span> ONLINE
          </h1>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', opacity: 0.9, marginBottom: '30px' }}>
            At UKA Japan Motors, we make car financing simple and stress-free. Secure the lowest rates 
            possible and make your dream car a reality faster than ever.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
            <Link href={"/finance/quick-enquiry"} style={{ ...styles.btnPrimary, backgroundColor: '#FF7101', padding: '15px 89px' }}>Apply Now</Link>
            <Link href={"/finance/calculator"} style={{ ...styles.btnPrimary, backgroundColor: 'transparent', border: '2px solid #fff', padding: '15px 40px' }}>Finance Calculator </Link>
          </div>
        </div>
      </section>

      {/* --- CONTENT SECTION --- */}
      <section style={{ ...styles.sectionPadding, maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px', alignItems: 'start' }}>
          
          {/* Why Choose Us */}
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px', borderLeft: '5px solid #FF7101', paddingLeft: '15px' }}>
              Why Choose UKA Japan Motors
            </h2>
            <p style={{ marginBottom: '20px', color: '#666' }}>
              Used car finance options make it easier for you to buy your dream car sooner than expected. 
              Enjoy customized plans and financial flexibility.
            </p>
            <ul style={styles.bulletList}>
              {["Budget-friendly monthly payments", "Access to high quality Japanese import cars", "Financial flexibility customized to your needs"].map((text, i) => (
                <li key={i} style={styles.bulletItem}>
                  <span style={styles.checkMark}>✓</span> {text}
                </li>
              ))}
            </ul>
          </div>

          {/* Documents Required (Updated to Bullets) */}
          <div style={{ backgroundColor: '#fffaf5', padding: '30px', borderRadius: '12px', border: '1px solid #ffe8d6' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px', borderLeft: '5px solid #000', paddingLeft: '15px' }}>
              Documents Required
            </h2>
            <p style={{ fontSize: '14px', color: '#777', marginBottom: '20px', fontStyle: 'italic' }}>
              General list of documents and conditions needed for finance in Melbourne:
            </p>
            <ul style={styles.bulletList}>
              {[
                "Proof of Income",
                "Employment Status",
                "Credit History",
                "Regular payment improves Credit History",
                "Combined with warranties & insurance provides great value"
              ].map((text, i) => (
                <li key={i} style={styles.bulletItem}>
                  <span style={styles.checkMark}>{"\u203A"}</span> {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* --- CARDS SECTION (Like Image) --- */}
      <section style={{ backgroundColor: '#fff', padding: '60px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          
          {/* Card 1 */}
          <div style={styles.card}>
            <div style={styles.iconBox}><BadgeDollarSign size={32} strokeWidth={1.5} /></div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '15px' }}>QUICK FINANCE ENQUIRY</h3>
            <p style={{ color: '#666', fontSize: '15px', lineHeight: '1.5', marginBottom: '20px' }}>
              Provide your name, contact number, email, and the amount you are looking for. 
              This helps us reach out with the next steps quickly.
            </p>
            <Link href={"/finance/quick-enquiry"} style={styles.btnPrimary}>Apply Now</Link>
          </div>

          {/* Card 2 */}
          <div style={styles.card}>
            <div style={styles.iconBox}><FileText size={32} strokeWidth={1.5} /></div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '15px' }}>DETAILED APPLICATION FORM</h3>
            <p style={{ color: '#666', fontSize: '15px', lineHeight: '1.5', marginBottom: '20px' }}>
              Fill out the full used car finance application, including income and employment details 
              for an accurate financial assessment.
            </p>
            <Link href={"/finance/quick-enquiry"} style={styles.btnPrimary}>
              Apply Now
            </Link>
          </div>

          {/* Card 3 */}
          <div style={styles.card}>
            <div style={styles.iconBox}><Calculator size={32} strokeWidth={1.5} /></div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '15px' }}>FINANCE CALCULATOR</h3>
            <p style={{ color: '#666', fontSize: '15px', lineHeight: '1.5', marginBottom: '20px' }}>
              Use our simple used car finance repayment calculator to estimate your weekly, 
              fortnightly, or monthly repayments with ease.
            </p>
            <Link href={"/finance/calculator"} style={styles.btnPrimary}>
              Apply Now
            </Link>
          </div>

        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer style={{ backgroundColor: '#111', color: 'white', padding: '40px 20px', textAlign: 'center' }}>
        <p style={{ fontSize: '14px', opacity: 0.6 }}>© 2024 UKA Japan Motors | Trading Hours: Mon - Sat: 9:00 AM - 5:30 PM</p>
      </footer>

      {/* Mobile Responsive Helper (Internal CSS) */}
      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ApplyForFinance;