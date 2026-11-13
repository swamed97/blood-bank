import React, { useState, useMemo, useEffect } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Phone, 
  MessageSquare, 
  Building, 
  RefreshCw, 
  FileSpreadsheet, 
  Lock, 
  Unlock,
  CheckCircle,
  Plus,
  Users,
  Droplet,
  KeyRound,
  X
} from 'lucide-react';

import { exportToCSV, deleteDonor, resetToSampleDonors, getSheetsConfig } from '../utils/storage';
import { 
  deleteDonorFromSupabase, 
  verifyAdminLogin, 
  updateAdminPassword 
} from '../utils/supabaseService';
import { SUPABASE_CONFIG } from '../config/supabaseConfig';

export const AdminDashboard = ({ 
  donors, 
  setDonors, 
  selectedBloodGroup, 
  setSelectedBloodGroup, 
  setActiveTab,
  refreshDonors,
  isSyncing
}) => {
  // Admin Authentication State - STRICT LOCKED BY DEFAULT
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null);

  // Change Password Modal State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordModalStatus, setPasswordModalStatus] = useState({ type: '', message: '' });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Filters & Search
  const [selectedUnit, setSelectedUnit] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const sheetsConfig = getSheetsConfig();

  const bloodGroups = ['ALL', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Extract unique unit names for dropdown filter
  const unitList = useMemo(() => {
    const set = new Set(donors.map(d => d.unitName).filter(Boolean));
    return ['ALL', ...Array.from(set)];
  }, [donors]);

  // Compute filtered donor records based on Blood Group, Unit, and Search Query
  const filteredDonors = useMemo(() => {
    return donors.filter(donor => {
      // Blood Group Filter
      if (selectedBloodGroup !== 'ALL' && donor.bloodGroup !== selectedBloodGroup) {
        return false;
      }
      // Unit Name Filter
      if (selectedUnit !== 'ALL' && donor.unitName !== selectedUnit) {
        return false;
      }
      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const nameMatch = donor.name?.toLowerCase().includes(query);
        const genderMatch = donor.gender?.toLowerCase().includes(query);
        const mobileMatch = donor.mobile?.includes(query);
        const addressMatch = donor.address?.toLowerCase().includes(query);
        const unitMatch = donor.unitName?.toLowerCase().includes(query);
        const idMatch = donor.id?.toLowerCase().includes(query);
        return nameMatch || genderMatch || mobileMatch || addressMatch || unitMatch || idMatch;
      }
      return true;
    });
  }, [donors, selectedBloodGroup, selectedUnit, searchQuery]);

  // Handle Username & Password Authentication via Supabase
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setIsLoggingIn(true);

    try {
      const isValid = await verifyAdminLogin(username, password);
      if (isValid) {
        setIsAuthenticated(true);
        setLoggedInUser(username.trim().toLowerCase());
        setAuthError('');
        setUsername('');
        setPassword('');
      } else {
        setAuthError('Invalid Username or Password! Access Denied.');
        setPassword('');
      }
    } catch (err) {
      setAuthError('Error authenticating. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoggedInUser('');
    setUsername('');
    setPassword('');
    setAuthError('');
  };

  // Handle Changing Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordModalStatus({ type: '', message: '' });

    if (newPassword.length < 6) {
      setPasswordModalStatus({ type: 'error', message: 'New password must be at least 6 characters long.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordModalStatus({ type: 'error', message: 'New passwords do not match!' });
      return;
    }

    setIsUpdatingPassword(true);
    try {
      // 1. Verify current password first
      const isCurrentValid = await verifyAdminLogin(loggedInUser, currentPassword);
      if (!isCurrentValid) {
        setPasswordModalStatus({ type: 'error', message: 'Current password is incorrect.' });
        setIsUpdatingPassword(false);
        return;
      }

      // 2. Update to new password in Supabase
      const res = await updateAdminPassword(loggedInUser, newPassword);
      if (res.success) {
        setPasswordModalStatus({ type: 'success', message: '✅ Password updated successfully in database!' });
        setTimeout(() => {
          setIsPasswordModalOpen(false);
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
          setPasswordModalStatus({ type: '', message: '' });
        }, 1500);
      } else {
        setPasswordModalStatus({ type: 'error', message: res.error || 'Failed to update password in database.' });
      }
    } catch (err) {
      setPasswordModalStatus({ type: 'error', message: 'Error updating password. Please try again.' });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // Delete Handler
  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete donor record for ${name}?`)) {
      await deleteDonorFromSupabase(id);
      const updated = deleteDonor(id);
      setDonors(updated);
    }
  };

  // Reset / Clear Data
  const handleResetSampleData = () => {
    if (window.confirm('Clear all donor records from database?')) {
      const reset = resetToSampleDonors();
      setDonors(reset);
    }
  };

  // Login Screen if locked
  if (!isAuthenticated) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', maxWidth: '480px' }}>
        <div className="glass-card" style={{ padding: '2.5rem 2rem', textAlign: 'center' }}>
          <div style={{
            width: '3.5rem',
            height: '3.5rem',
            borderRadius: '1rem',
            backgroundColor: 'rgba(220, 38, 38, 0.1)',
            color: '#dc2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem'
          }}>
            <Lock style={{ width: '2rem', height: '2rem' }} />
          </div>

          <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
            Admin Portal Login
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Restricted Access. Enter Admin credentials to manage donor records.
          </p>

          {authError && (
            <div style={{
              padding: '0.65rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              color: '#ef4444',
              fontSize: '0.85rem',
              marginBottom: '1.2rem',
              fontWeight: 600
            }}>
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} autoComplete="off">
            <div className="form-group" style={{ marginBottom: '1rem', textAlign: 'left' }}>
              <label className="form-label" style={{ fontSize: '0.82rem' }}>Username</label>
              <input
                type="text"
                name="admin_username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="form-input"
                autoComplete="off"
                required
                autoFocus
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
              <label className="form-label" style={{ fontSize: '0.82rem' }}>Password</label>
              <input
                type="password"
                name="admin_password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="form-input"
                autoComplete="new-password"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={isLoggingIn} style={{ width: '100%', padding: '0.85rem' }}>
              <Unlock style={{ width: '1rem', height: '1rem' }} /> {isLoggingIn ? 'Checking credentials...' : 'Login to Admin Portal'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1rem' }}>
      
      {/* Top Admin Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{
              padding: '0.25rem 0.6rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(220, 38, 38, 0.12)',
              color: '#dc2626',
              fontWeight: 700,
              fontSize: '0.8rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}>
              <ShieldCheck style={{ width: '0.9rem', height: '0.9rem' }} /> ADMIN MODE LOGGED IN
            </span>
          </div>

          <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginTop: '0.4rem', fontWeight: 800 }}>
            DYFI അതിജീവനം - രക്തദാതാക്കളുടെ മാനേജ്മെന്റ് പോർട്ടൽ
          </h2>
        </div>

        {/* Action Header Buttons */}
        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
          <button 
            onClick={() => exportToCSV(filteredDonors)}
            className="btn btn-success"
            style={{ fontSize: '0.88rem' }}
          >
            <Download style={{ width: '1rem', height: '1rem' }} />
            Export CSV ({filteredDonors.length})
          </button>

          <button 
            onClick={() => setActiveTab('register')}
            className="btn btn-primary"
            style={{ fontSize: '0.88rem' }}
          >
            <Plus style={{ width: '1rem', height: '1rem' }} />
            Add Donor
          </button>

          <button 
            onClick={() => {
              setIsPasswordModalOpen(true);
              setPasswordModalStatus({ type: '', message: '' });
              setCurrentPassword('');
              setNewPassword('');
              setConfirmPassword('');
            }}
            className="btn btn-secondary"
            style={{ fontSize: '0.88rem' }}
            title="Change Admin Password"
          >
            <KeyRound style={{ width: '0.9rem', height: '0.9rem', color: '#f59e0b' }} /> Change Password
          </button>

          <button 
            onClick={handleLogout}
            className="btn btn-secondary"
            style={{ fontSize: '0.88rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
            title="Log Out Admin"
          >
            <Lock style={{ width: '0.9rem', height: '0.9rem' }} /> Log Out
          </button>
        </div>
      </div>

      {/* Sync Status Banner */}
      {syncStatus && (
        <div style={{
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '1.5rem',
          fontSize: '0.9rem',
          fontWeight: 600,
          backgroundColor: syncStatus.type === 'success' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
          border: `1.5px solid ${syncStatus.type === 'success' ? '#10b981' : '#ef4444'}`,
          color: syncStatus.type === 'success' ? '#047857' : '#b91c1c',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>{syncStatus.message}</div>
          <button 
            onClick={() => setSyncStatus(null)} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, color: 'inherit' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* FILTER CONTROLS BAR */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Row 1: Blood Group Filter Selector */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
            <label style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Filter style={{ width: '1rem', height: '1rem', color: '#dc2626' }} />
              Filter by Blood Group:
            </label>

            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Showing {filteredDonors.length} of {donors.length} total donors
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
            {bloodGroups.map(bg => {
              const isSelected = selectedBloodGroup === bg;
              const count = bg === 'ALL' 
                ? donors.length 
                : donors.filter(d => d.bloodGroup === bg).length;

              return (
                <button
                  key={bg}
                  onClick={() => setSelectedBloodGroup(bg)}
                  style={{
                    padding: '0.45rem 0.9rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid',
                    borderColor: isSelected ? '#dc2626' : 'var(--border-color)',
                    backgroundColor: isSelected ? '#dc2626' : 'var(--bg-card)',
                    color: isSelected ? '#ffffff' : 'var(--text-primary)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.88rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{bg === 'ALL' ? 'ALL GROUPS' : bg}</span>
                  <span style={{
                    fontSize: '0.75rem',
                    padding: '0.1rem 0.4rem',
                    borderRadius: '9999px',
                    backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.25)' : 'rgba(220, 38, 38, 0.1)',
                    color: isSelected ? '#ffffff' : '#dc2626'
                  }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 2: Unit Filter & Search Query */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1rem',
          paddingTop: '1rem',
          borderTop: '1px solid var(--border-color)'
        }}>
          {/* Unit Dropdown */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">
              <Building style={{ width: '0.85rem', height: '0.85rem' }} /> Filter by Organization Unit:
            </label>
            <select
              value={selectedUnit}
              onChange={e => setSelectedUnit(e.target.value)}
              className="form-select"
            >
              {unitList.map(unit => (
                <option key={unit} value={unit}>
                  {unit === 'ALL' ? 'All Units & Branches' : unit}
                </option>
              ))}
            </select>
          </div>

          {/* Search Box */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">
              <Search style={{ width: '0.85rem', height: '0.85rem' }} /> Search Donor Name / Address / Phone:
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Type name, phone, address..."
              className="form-input"
            />
          </div>
        </div>
      </div>

      {/* DONOR DATA TABLE */}
      <div className="glass-card" style={{ padding: '1rem', overflow: 'hidden' }}>
        
        {filteredDonors.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
            <div style={{
              width: '3.5rem',
              height: '3.5rem',
              borderRadius: '50%',
              backgroundColor: 'rgba(220, 38, 38, 0.1)',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <Droplet style={{ width: '2rem', height: '2rem' }} />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>
              {donors.length === 0 ? 'No Donors Loaded Yet' : 'No Donors Found Matching Filter'}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', maxWidth: '480px', margin: '0 auto 1.5rem' }}>
              {donors.length === 0 
                ? 'Your database is currently empty. Click "Sync from Google Sheet" above or verify your Google Sheet link in "Google Sheets Setup".'
                : 'Try clearing the blood group or unit filter to see all donors.'
              }
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              {donors.length === 0 ? (
                <>
                  <button 
                    onClick={async () => {
                      if (refreshDonors) {
                        const res = await refreshDonors();
                        if (res && res.success) {
                          setSyncStatus({ type: 'success', message: `✅ Successfully loaded ${res.donors.length} donors from ${res.source || 'Google Sheet'}!` });
                        } else {
                          setSyncStatus({ type: 'error', message: res?.error || 'Could not fetch from Google Sheet. Check setup.' });
                        }
                      }
                    }}
                    className="btn btn-primary"
                  >
                    <RefreshCw style={{ width: '0.9rem', height: '0.9rem' }} /> Sync from Google Sheet
                  </button>
                  <button 
                    onClick={() => setIsSheetsModalOpen(true)}
                    className="btn btn-secondary"
                  >
                    <FileSpreadsheet style={{ width: '0.9rem', height: '0.9rem' }} /> Open Google Sheets Setup
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => {
                    setSelectedBloodGroup('ALL');
                    setSelectedUnit('ALL');
                    setSearchQuery('');
                  }}
                  className="btn btn-secondary"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Gender</th>
                  <th>Blood Group</th>
                  <th>Mobile Number</th>
                  <th>Unit Name</th>
                  <th>Address</th>
                  <th>Age / Wt</th>
                  <th>Last Donated</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDonors.map(d => {
                  const whatsappUrl = `https://wa.me/91${d.mobile.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(d.name)},%20urgent%20blood%20request%20for%20blood%20group%20${encodeURIComponent(d.bloodGroup)}%20from%20BloodBank%20network.`;
                  
                  return (
                    <tr key={d.id}>
                      <td style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {d.id}
                      </td>

                      <td style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                        {d.name}
                      </td>

                      <td style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        {d.gender || '-'}
                      </td>

                      <td>
                        <span className="blood-badge">
                          {d.bloodGroup}
                        </span>
                      </td>

                      <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>
                        {d.mobile}
                      </td>

                      <td style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                        {d.unitName}
                      </td>

                      <td style={{ maxWidth: '220px', whiteSpace: 'normal', fontSize: '0.85rem' }}>
                        {d.address}
                      </td>

                      <td style={{ fontSize: '0.85rem' }}>
                        {d.age ? `${d.age} yrs` : '-'} / {d.weight ? `${d.weight} kg` : '-'}
                      </td>

                      <td style={{ fontSize: '0.85rem', fontWeight: 600, color: d.lastDonated ? '#dc2626' : 'var(--text-muted)' }}>
                        {d.lastDonated || '-'}
                      </td>

                      <td>
                        <span style={{
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          color: d.availability === 'Emergency Only' ? '#f59e0b' : '#10b981',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '9999px',
                          backgroundColor: d.availability === 'Emergency Only' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(16, 185, 129, 0.12)'
                        }}>
                          ● {d.availability || 'Available'}
                        </span>
                      </td>

                      {/* Contact & Action Icons */}
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                          
                          {/* WhatsApp Action Button */}
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn"
                            style={{
                              padding: '0.35rem 0.65rem',
                              fontSize: '0.78rem',
                              backgroundColor: '#25D366',
                              color: '#ffffff',
                              borderRadius: 'var(--radius-md)',
                              textDecoration: 'none'
                            }}
                            title="Send WhatsApp Emergency Message"
                          >
                            <MessageSquare style={{ width: '0.85rem', height: '0.85rem' }} />
                            Chat
                          </a>

                          {/* Direct Call Button */}
                          <a
                            href={`tel:${d.mobile}`}
                            className="btn btn-secondary"
                            style={{ padding: '0.35rem 0.6rem', fontSize: '0.78rem' }}
                            title="Call Donor"
                          >
                            <Phone style={{ width: '0.85rem', height: '0.85rem' }} />
                          </a>

                          {/* Delete Action */}
                          <button
                            onClick={() => handleDelete(d.id, d.name)}
                            style={{
                              padding: '0.35rem 0.6rem',
                              backgroundColor: 'transparent',
                              border: '1px solid var(--border-color)',
                              borderRadius: 'var(--radius-md)',
                              color: '#ef4444',
                              cursor: 'pointer'
                            }}
                            title="Delete Record"
                          >
                            <Trash2 style={{ width: '0.85rem', height: '0.85rem' }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer controls inside Admin */}
        <div style={{
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          marginTop: '1.25rem',
          paddingTop: '1rem',
          borderTop: '1px solid var(--border-color)',
          fontSize: '0.85rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            Showing <strong>{filteredDonors.length}</strong> matching donor records
          </div>

          <button
            onClick={handleResetSampleData}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontSize: '0.8rem'
            }}
          >
            <RefreshCw style={{ width: '0.8rem', height: '0.8rem' }} /> Clear All Records
          </button>
        </div>

      </div>

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
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
            maxWidth: '440px',
            width: '100%',
            backgroundColor: 'var(--bg-card)',
            padding: '2rem',
            position: 'relative',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)'
          }}>
            {/* Close Button */}
            <button
              onClick={() => setIsPasswordModalOpen(false)}
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
              <X style={{ width: '1.3rem', height: '1.3rem' }} />
            </button>

            {/* Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
              <div style={{
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '0.65rem',
                backgroundColor: 'rgba(245, 158, 11, 0.15)',
                color: '#f59e0b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <KeyRound style={{ width: '1.35rem', height: '1.35rem' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: 0 }}>
                  Change Admin Password
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                  Logged in as: <strong>{loggedInUser || 'admin'}</strong>
                </p>
              </div>
            </div>

            {/* Status Alert */}
            {passwordModalStatus.message && (
              <div style={{
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.25rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                backgroundColor: passwordModalStatus.type === 'success' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                color: passwordModalStatus.type === 'success' ? '#10b981' : '#ef4444'
              }}>
                {passwordModalStatus.message}
              </div>
            )}

            <form onSubmit={handleChangePassword}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ fontSize: '0.82rem' }}>Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  className="form-input"
                  required
                  placeholder="Enter current password"
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ fontSize: '0.82rem' }}>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="form-input"
                  required
                  placeholder="At least 6 characters"
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label" style={{ fontSize: '0.82rem' }}>Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="form-input"
                  required
                  placeholder="Re-enter new password"
                />
              </div>

              <div style={{ display: 'flex', gap: '0.65rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.85rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="btn btn-primary"
                  style={{ fontSize: '0.85rem' }}
                >
                  {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
