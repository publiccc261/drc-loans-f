import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoanApplication } from '../LoanApplicationContext';
import './LoanCalculator.css';

export default function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState(2500);
  const [loanTerm, setLoanTerm] = useState(12);
  const navigate = useNavigate();
  
  // Get context functions
  const { updateCalculatorData, updateLoanApplicationData } = useLoanApplication();

  // Calculate monthly payment (simple interest formula for demonstration)
  const calculateMonthlyPayment = () => {
    const interestRate = 0.08; // 8% annual interest
    const monthlyRate = interestRate / 12;
    const payment = (loanAmount * (1 + monthlyRate * loanTerm)) / loanTerm;
    return payment.toFixed(2);
  };
  
  const handleApplyNow = () => {
    // Save calculator data to context
    updateCalculatorData({
      loanAmount,
      loanTerm,
      monthlyPayment: calculateMonthlyPayment()
    });
    
    // Pre-fill loan application form with calculator values
    updateLoanApplicationData({
      loanAmount: loanAmount.toString(),
      loanTerm: `${loanTerm} Mois`
    });
    
    navigate('/loan-application');
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <span className="logo-name">DEMANDE DE PRÊT AIRTEL</span>
        </div>
        <button className="menu-btn" aria-label="Menu">
          <div className="menu-line"></div>
          <div className="menu-line"></div>
          <div className="menu-line"></div>
        </button>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          <h1 className="title">DEMANDEZ VOTRE PRÊT AVEC <img src="https://cdn-webportal.airtelstream.net/website/zambia/assets/images/logo.svg" alt="" /></h1>
          <p className="subtitle">Approbation rapide • Taux compétitifs • Conditions flexibles</p>

          {/* Loan Calculator */}
          <div className="calculator">
            <h2 className="calculator-title">Calculateur de Prêt</h2>
            
            {/* Loan Amount Slider */}
            <div className="input-group">
              <div className="input-header">
                <span className="input-label">Montant du Prêt</span>
                <span className="input-value">${loanAmount.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min="100" 
                max="5000" 
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="slider"
              />
              <div className="range-labels">
                <span>$100</span>
                <span>$5,000</span>
              </div>
            </div>

            {/* Loan Term Slider */}
            <div className="input-group">
              <div className="input-header">
                <span className="input-label">Durée du Prêt</span>
                <span className="input-value">{loanTerm} mois</span>
              </div>
              <input 
                type="range" 
                min="6" 
                max="60" 
                value={loanTerm}
                onChange={(e) => setLoanTerm(Number(e.target.value))}
                className="slider"
              />
              <div className="range-labels">
                <span>6 mois</span>
                <span>60 mois</span>
              </div>
            </div>

            {/* Monthly Payment Display */}
            <div className="payment-box">
              <span className="payment-label">Paiement Mensuel</span>
              <span className="payment-amount">${calculateMonthlyPayment()}</span>
            </div>
          </div>

          {/* Apply Button */}
          <button className="apply-btn" onClick={handleApplyNow}>POSTULER MAINTENANT</button>

          {/* Features */}
          <div className="features">
            <div className="feature">
              <div className="feature-icon">⚡</div>
              <div className="feature-title">Approbation Rapide</div>
              <div className="feature-subtitle">Sous 24 heures</div>
            </div>
            <div className="feature">
              <div className="feature-icon">💰</div>
              <div className="feature-title">Taux Bas</div>
              <div className="feature-subtitle">À partir de 8%</div>
            </div>
            <div className="feature">
              <div className="feature-icon">🔒</div>
              <div className="feature-title">Sécurisé</div>
              <div className="feature-subtitle">Niveau bancaire</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        © 2025 Airtel Congo. Tous droits réservés.
      </footer>
    </div>
  );
}