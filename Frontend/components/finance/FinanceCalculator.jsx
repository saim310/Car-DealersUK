"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";

const FinanceCalculator = () => {



  const [loanAmount, setLoanAmount] = useState(5000);



  const [loanTerm, setLoanTerm] = useState(12);



  const [interestRate, setInterestRate] = useState(2.5);







  const loanTermOptions = [12, 24, 36, 48, 60, 72, 84];







  // Calculate monthly payment using the loan payment formula



  // M = P * [r(1+r)^n] / [(1+r)^n - 1]



  const calculatePayment = useMemo(() => {



    const principal = loanAmount;



    const monthlyRate = interestRate / 100 / 12;



    const numPayments = loanTerm;







    if (monthlyRate === 0) {



      // If no interest, simple division



      return {



        monthlyPayment: principal / numPayments,



        weeklyPayment: (principal / numPayments) / (52 / 12),



      };



    }







    const monthlyPayment =



      (principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /



      (Math.pow(1 + monthlyRate, numPayments) - 1);







    const weeklyPayment = monthlyPayment / (52 / 12);







    return {



      monthlyPayment: monthlyPayment,



      weeklyPayment: weeklyPayment,



    };



  }, [loanAmount, loanTerm, interestRate]);







  const handleLoanAmountChange = (e) => {



    setLoanAmount(Number(e.target.value));



  };







  const handleInterestRateChange = (e) => {



    setInterestRate(Number(e.target.value));



  };







  const handleLoanTermChange = (e) => {



    setLoanTerm(Number(e.target.value));



  };

  return (




    <div className="finance-calculator-wrapper">
      <div className="calculator-container">
        <div className="calculator-header">
          <h2>FINANCE CALCULATOR</h2>
          <p>Estimate your repayments instantly</p>
        </div>

        <div className="calculator-content">
          {/* Left Side - Inputs */}
          <div className="calculator-inputs">
            <div className="input-group loan-term-group">
              <label htmlFor="loan-term">Loan Term</label>
              <select
                id="loan-term"
                value={loanTerm}
                onChange={handleLoanTermChange}
                className="term-select"
              >
                {loanTermOptions.map((term) => (
                  <option key={term} value={term}>
                    {term} Months
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <div className="label-row">
                <label htmlFor="loan-amount">Loan Amount</label>
                <span className="display-value">£{loanAmount.toLocaleString()}</span>
              </div>
              <input
                id="loan-amount"
                type="range"
                min="1000"
                max="200000"
                step="500"
                value={loanAmount}
                onChange={handleLoanAmountChange}
                className="slider"
              />
            </div>

            <div className="input-group">
              <div className="label-row">
                <label htmlFor="interest-rate">Interest Rate</label>
                <span className="display-value">{interestRate.toFixed(2)}%</span>
              </div>
              <input
                id="interest-rate"
                type="range"
                min="2.5"
                max="5"
                step="0.25"
                value={interestRate}
                onChange={handleInterestRateChange}
                className="slider"
              />
            </div>
          </div>

          {/* Right Side - Results */}
          <div className="calculator-results">
            <div className="repayment-card">
              <div className="repayment-header">ESTIMATED REPAYMENT</div>
              
              <div className="repayment-main">
                <span className="currency">£</span>
                <span className="amount">
                  {calculatePayment.monthlyPayment.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                <span className="period">/month</span>
              </div>

              <div className="repayment-secondary">
                <span>or <strong>£{calculatePayment.weeklyPayment.toFixed(2)}</strong> per week</span>
              </div>
            </div>

            <div className="summary-details">
              <div className="detail-row">
                <span className="detail-label">Principal Amount</span>
                <span className="detail-value">£{loanAmount.toLocaleString()}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Annual Interest</span>
                <span className="detail-value">{interestRate}%</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Duration</span>
                <span className="detail-value">{loanTerm} Months</span>
              </div>
            </div>

            <Link href="/finance/quick-enquiry">
             <span className="apply-button">APPLY NOW</span>
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .finance-calculator-wrapper {
        overflow-x: hidden;
          padding: 40px 20px;
          background: #f8f9fa;
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .calculator-container {
          background: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          max-width: 1000px;
          width: 100%;
          border: 1px solid #eaeaea;
        }

        .calculator-header {
          background: #ffffff;
          padding: 30px 40px;
          border-bottom: 3px solid #ff6b00;
        }

        .calculator-header h2 {
          margin: 0;
          font-size: 1.4rem;
          font-weight: 800;
          color: #1a1a1a;
          letter-spacing: 0.5px;
        }

        .calculator-header p {
          margin: 5px 0 0;
          color: #6c757d;
          font-size: 0.9rem;
        }

        .calculator-content {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
        }

        .calculator-inputs {
          padding: 40px;
          display: flex;
          flex-direction: column;
          gap: 35px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .input-group label {
          color: #495057;
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .display-value {
          color: #ff6b00;
          font-weight: 800;
          font-size: 1.1rem;
        }

        .term-select {
          padding: 12px;
          background: #ffffff;
          border: 2px solid #edeff2;
          border-radius: 8px;
          color: #1a1a1a;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: border-color 0.2s;
        }

        .term-select:focus {
          border-color: #ff6b00;
          outline: none;
        }

        .slider {
          -webkit-appearance: none;
          width: 100%;
          height: 6px;
          background: #edeff2;
          border-radius: 3px;
          outline: none;
           min-width: 0;
        }

        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 22px;
          height: 22px;
          background: #ff6b00;
          border: 4px solid #ffffff;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
          transition: transform 0.1s;
        }

        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
        }

        .calculator-results {
          background: #fffcf9;
          padding: 40px;
          display: flex;
          flex-direction: column;
          gap: 25px;
          border-left: 1px solid #f0f0f0;
        }

        .repayment-card {
          background: #ffffff;
          padding: 25px;
          border-radius: 12px;
          border: 1px solid #ffe8d6;
          text-align: center;
          box-shadow: 0 4px 12px rgba(255, 107, 0, 0.05);
        }

        .repayment-header {
          font-size: 0.75rem;
          font-weight: 700;
          color: #9a9ea4;
          margin-bottom: 15px;
          letter-spacing: 1px;
        }

        .repayment-main {
          display: flex;
          align-items: baseline;
          justify-content: center;
          color: #1a1a1a;
        }

        .currency {
          font-size: 1.5rem;
          font-weight: 700;
          margin-right: 2px;
        }

        .amount {
          font-size: 2.8rem;
          font-weight: 900;
          letter-spacing: -1px;
        }

        .period {
          font-size: 1rem;
          color: #6c757d;
          margin-left: 5px;
        }

        .repayment-secondary {
          margin-top: 10px;
          font-size: 0.9rem;
          color: #6c757d;
        }

        .repayment-secondary strong {
          color: #ff6b00;
          font-size:26px;
          font-weight:bold;
        }

        .summary-details {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px dashed #edeff2;
        }

        .detail-label {
          color: #6c757d;
          font-size: 0.9rem;
        }

        .detail-value {
          color: #1a1a1a;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .apply-button {
          background: #ff6b00;
          color: white;
          border: none;
          padding: 16px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.2s;
          margin-top: 10px;
        }

        .apply-button:hover {
          background: #e66000;
        }

       @media (max-width: 800px) {
  .calculator-content {
    grid-template-columns: 1fr;

  }

  .calculator-inputs,
  .calculator-results {
    padding: 20px;
  }

  .calculator-results {
    border-left: none;
    border-top: 1px solid #f0f0f0;
        margin-bottom: 22px;
  }

  @
  .label-row {
    flex-direction: row;
    justify-content: space-between;
    gap:5;
      }

  .display-value {
    font-size: 1rem;
  }
}
     @media (max-width: 500px) {
  .finance-calculator-wrapper {
    padding: 20px 10px;
  }

  .calculator-container {
    border-radius: 12px;
  }

  .calculator-header {
    padding: 18px 16px;
  }

  .calculator-header h2 {
    font-size: 1.1rem;
  }

  .calculator-header p {
    font-size: 0.8rem;
  }

  .calculator-inputs,
  .calculator-results {
    padding: 16px;
    gap: 20px;
  }

  .input-group {
    gap: 8px;
  }

  .label-row {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .input-group label {
    font-size: 0.75rem;
  }

  .display-value {
    font-size: 0.95rem;
  }

  .term-select {
    padding: 10px;
    font-size: 0.9rem;
  }

  .slider {
    height: 5px;
  }

  .slider::-webkit-slider-thumb {
    width: 18px;
    height: 18px;
  }

  .repayment-card {
    padding: 18px;
  }

  .currency {
    font-size: 1.2rem;
  }

  .amount {
    font-size: 2rem;
  }

  .period {
    font-size: 0.85rem;
  }

  .repayment-secondary strong {
    font-size: 20px;
  }

  .detail-row {
    flex-direction: row;
    justify-content: space-between;
  }

  .detail-label,
  .detail-value {
    font-size: 0.8rem;
  }

  .apply-button {
    padding: 12px;
    font-size: 0.9rem;
  }
}
   

@media (max-width: 350px) {
  .calculator-content {
    display: flex;
    flex-direction: column;
  }

  .calculator-inputs,
  .calculator-results {
    padding: 14px;
  }
}
     `}</style>
    </div>
  );
};

export default FinanceCalculator;