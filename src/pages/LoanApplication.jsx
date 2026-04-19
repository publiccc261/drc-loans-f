import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoanApplication } from '../LoanApplicationContext';
import './LoanApplication.css';

export default function LoanApplication() {
  const navigate = useNavigate();
  
  // Get context data and functions
  const { loanApplicationData, updateLoanApplicationData } = useLoanApplication();
  
  // Form state - initialize with data from context
  const [formData, setFormData] = useState({
    loanType: loanApplicationData.loanType || 'Prêt Personnel',
    loanAmount: loanApplicationData.loanAmount || '',
    loanTerm: loanApplicationData.loanTerm || '12 Mois',
    purpose: loanApplicationData.purpose || ''
  });

  // Update form if context data changes (e.g., from calculator)
  useEffect(() => {
    if (loanApplicationData.loanAmount) {
      setFormData(prev => ({
        ...prev,
        loanAmount: loanApplicationData.loanAmount,
        loanTerm: loanApplicationData.loanTerm
      }));
    }
  }, [loanApplicationData]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Save form data to context
    updateLoanApplicationData(formData);
    
    // Navigate to next step
    navigate('/details');
  };

  // Handle back button
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="app-container">
      
      {/* ==================== HEADER ==================== */}
      <header className="header">
        <button className="back-btn" onClick={handleBack}>
          ← Retour
        </button>
        <div className="logo">
          <img src="https://cdn-webportal.airtelstream.net/website/zambia/assets/images/logo.svg" alt="airtel logo" />
        </div>
        <button className="menu-btn" aria-label="Menu">
          <div className="menu-line"></div>
          <div className="menu-line"></div>
          <div className="menu-line"></div>
        </button>
      </header>

      {/* ==================== MAIN CONTENT ==================== */}
      <main className="main-content">
        <div className="container">
          
          {/* Title Section */}
          <h1 className="form-title">Demande de Prêt</h1>
          <p className="form-subtitle">Étape 1 sur 3</p>

          {/* Progress Indicator */}
          <div className="progress-indicator">
            <div className="progress-dot active"></div>
            <div className="progress-dot"></div>
            <div className="progress-dot"></div>
          </div>

          {/* Application Form */}
          <form onSubmit={handleSubmit}>
            
            {/* Loan Type */}
            <div className="form-group">
              <label className="form-label">Type de Prêt</label>
              <select 
                name="loanType"
                value={formData.loanType}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Prêt Personnel">Prêt Personnel</option>
                <option value="Prêt Commercial">Prêt Commercial</option>
                <option value="Prêt Immobilier">Prêt Immobilier</option>
                <option value="Prêt Automobile">Prêt Automobile</option>
                <option value="Prêt Éducation">Prêt Éducation</option>
              </select>
            </div>

            {/* Loan Amount */}
            <div className="form-group">
              <label className="form-label">Montant du Prêt (USD)</label>
              <input 
                type="number"
                name="loanAmount"
                value={formData.loanAmount}
                onChange={handleChange}
                placeholder="Entrer le montant"
                className="form-input"
                required
              />
            </div>

            {/* Loan Term */}
            <div className="form-group">
              <label className="form-label">Durée du Prêt</label>
              <select 
                name="loanTerm"
                value={formData.loanTerm}
                onChange={handleChange}
                className="form-select"
              >
                <option value="6 Mois">6 Mois</option>
                <option value="12 Mois">12 Mois</option>
                <option value="18 Mois">18 Mois</option>
                <option value="24 Mois">24 Mois</option>
                <option value="36 Mois">36 Mois</option>
                <option value="48 Mois">48 Mois</option>
                <option value="60 Mois">60 Mois</option>
              </select>
            </div>

            {/* Purpose of Loan */}
            <div className="form-group">
              <label className="form-label">Objet du Prêt</label>
              <textarea 
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                placeholder="À quoi servira le prêt?"
                className="form-textarea"
                required
              ></textarea>
            </div>

            {/* Submit Button */}
            <button type="submit" className="next-btn">
              ÉTAPE SUIVANTE
            </button>
          </form>

        </div>
      </main>

      {/* ==================== FOOTER ==================== */}
      <footer className="footer">
        © 2025 Airtel. Tous droits réservés.
      </footer>
    </div>
  );
}