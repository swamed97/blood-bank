import React, { useState } from 'react';
import { X, Copy, Check, FileSpreadsheet, ExternalLink, ShieldCheck, Send, AlertCircle } from 'lucide-react';
import { generateGoogleAppsScriptCode, postToGoogleSheet } from '../utils/googleSheetService';
import { getSheetsConfig, saveSheetsConfig } from '../utils/storage';

export const GoogleSheetSetupModal = ({ isOpen, onClose, onSaved }) => {
  if (!isOpen) return null;

  const [config, setConfig] = useState(getSheetsConfig());
  const [webhookUrlInput, setWebhookUrlInput] = useState(config.webhookUrl || '');
  const [sheetUrlInput, setSheetUrlInput] = useState(config.sheetUrl || '');
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [testStatus, setTestStatus] = useState('');

  const scriptCode = generateGoogleAppsScriptCode();

  const handleCopyCode = () => {
    navigator.clipboard.writeText(scriptCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleTestSync = async () => {
    if (!webhookUrlInput.trim()) {
      setTestStatus('Please paste your Web App URL first!');
      return;
    }

    setTestStatus('Sending test donor entry to Google Sheet...');

    // Save temporary config
    saveSheetsConfig({
      webhookUrl: webhookUrlInput.trim(),
      sheetUrl: sheetUrlInput.trim()
    });

    const testDonor = {
      id: 'TEST-999',
      name: 'Test Donor (Verification)',
      mobile: '9999999999',
      bloodGroup: 'O+',
      unitName: 'Test Unit',
      address: 'Test Address 123',
      age: 25,
      weight: 65,
      availability: 'Available'
    };

    await postToGoogleSheet(testDonor);
    setTestStatus('✅ Test entry sent! Check your Google Sheet now for "Test Donor".');
  };

  const handleSave = (e) => {
    e.preventDefault();
    const newConfig = {
      webhookUrl: webhookUrlInput.trim(),
      sheetUrl: sheetUrlInput.trim()
    };
    saveSheetsConfig(newConfig);
    setSavedSuccess(true);
    if (onSaved) onSaved();
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.25rem'
    }}>
      <div className="glass-card" style={{
        maxWidth: '700px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        backgroundColor: 'var(--bg-card)',
        padding: '2rem',
        position: 'relative',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '0.4rem',
            borderRadius: 'var(--radius-md)'
          }}
        >
          <X style={{ width: '1.4rem', height: '1.4rem' }} />
        </button>

        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '0.65rem',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FileSpreadsheet style={{ width: '1.5rem', height: '1.5rem' }} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.35rem', color: 'var(--text-primary)', margin: 0 }}>
              Google Sheets Live Sync Setup
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
              Connect donor submissions directly to your client's Google Sheet
            </p>
          </div>
        </div>

        {/* 3 Step Setup Guide */}
        <div style={{
          backgroundColor: 'rgba(220, 38, 38, 0.05)',
          border: '1px solid rgba(220, 38, 38, 0.15)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem',
          marginBottom: '1.5rem'
        }}>
          <h4 style={{ fontSize: '0.95rem', color: '#dc2626', marginBottom: '0.75rem' }}>
            📋 Easy 3-Step Setup Instructions for Client:
          </h4>

          <ol style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', paddingLeft: '1.2rem', lineHeight: 1.6 }}>
            <li style={{ marginBottom: '0.4rem' }}>
              Open your <strong>Google Sheet</strong> → click <strong>Extensions</strong> → <strong>Apps Script</strong>.
            </li>
            <li style={{ marginBottom: '0.4rem' }}>
              Delete any existing code, paste the script code below, and click <strong>Save</strong>.
            </li>
            <li style={{ marginBottom: '0.4rem' }}>
              Click <strong>Deploy</strong> → <strong>New deployment</strong> → Select type: <strong>Web App</strong> → Set <em>"Who has access"</em> to <strong>Anyone</strong> → Click Deploy and copy the Web App URL!
            </li>
          </ol>

          {/* Copy Script Code Button */}
          <div style={{ marginTop: '1rem' }}>
            <button
              type="button"
              onClick={handleCopyCode}
              className="btn btn-secondary"
              style={{ width: '100%', fontSize: '0.88rem', gap: '0.5rem' }}
            >
              {copied ? (
                <>
                  <Check style={{ width: '1rem', height: '1rem', color: '#10b981' }} />
                  Apps Script Code Copied to Clipboard!
                </>
              ) : (
                <>
                  <Copy style={{ width: '1rem', height: '1rem' }} />
                  Copy Google Apps Script Code
                </>
              )}
            </button>
          </div>
        </div>

        {/* Webhook Form */}
        <form onSubmit={handleSave}>
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">
              Google Apps Script Web App URL (Webhook)
            </label>
            <input
              type="url"
              className="form-input"
              value={webhookUrlInput}
              onChange={e => setWebhookUrlInput(e.target.value)}
              placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
            />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Paste the Web App URL generated after deploying your Apps Script.
            </span>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">
              Direct Google Sheet Link (Optional for quick admin access button)
            </label>
            <input
              type="url"
              className="form-input"
              value={sheetUrlInput}
              onChange={e => setSheetUrlInput(e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/d/..."
            />
          </div>

          {testStatus && (
            <div style={{
              padding: '0.65rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: testStatus.includes('✅') ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
              color: testStatus.includes('✅') ? '#10b981' : '#ef4444',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '1.25rem'
            }}>
              {testStatus}
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <button 
              type="button" 
              onClick={handleTestSync} 
              className="btn btn-outline-danger"
              style={{ fontSize: '0.85rem' }}
            >
              <Send style={{ width: '0.9rem', height: '0.9rem' }} /> Test Sync with Google Sheet
            </button>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="button" onClick={onClose} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-success">
                {savedSuccess ? 'Saved Connected!' : 'Save Integration Settings'}
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};
