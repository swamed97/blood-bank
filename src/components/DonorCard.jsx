import React from 'react';
import { Droplet, Award, CheckCircle, Phone, MapPin, Building, Calendar, Share2, Printer } from 'lucide-react';

export const DonorCard = ({ donor, onReset }) => {
  if (!donor) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ maxWidth: '550px', margin: '0 auto' }}>
      <div className="glass-card pulse-card" style={{
        position: 'relative',
        overflow: 'hidden',
        border: '2px solid rgba(220, 38, 38, 0.4)',
        background: 'linear-gradient(145deg, var(--bg-card) 0%, rgba(220, 38, 38, 0.05) 100%)',
        padding: '2rem'
      }}>
        {/* Top Header Card Banner */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '1.25rem',
          marginBottom: '1.25rem',
          borderBottom: '1.5px dashed var(--border-color)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '3rem',
              height: '3rem',
              borderRadius: '0.75rem',
              background: '#d90429',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(217, 4, 41, 0.4)',
              overflow: 'hidden',
              padding: '2px'
            }}>
              <img src="/dyfi_maanusham.png" alt="DYFI" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--text-primary)', fontWeight: 800 }}>
                DYFI മാനുഷം പാസ്സ്
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                സന്നദ്ധ രക്തദാതാവ് ID: <span style={{ color: '#d90429' }}>{donor.id}</span>
              </p>
            </div>
          </div>

          <div style={{
            padding: '0.4rem 0.9rem',
            borderRadius: '9999px',
            backgroundColor: '#dc2626',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '1.2rem',
            fontFamily: 'var(--font-heading)',
            boxShadow: '0 4px 12px rgba(220, 38, 38, 0.4)'
          }}>
            {donor.bloodGroup}
          </div>
        </div>

        {/* Donor Info Rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              Donor Name
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
              {donor.name}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.85rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Phone style={{ width: '0.75rem', height: '0.75rem' }} /> Mobile Number
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {donor.mobile}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                Gender
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {donor.gender || 'Male'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Building style={{ width: '0.75rem', height: '0.75rem' }} /> Unit Name
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {donor.unitName}
              </div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <MapPin style={{ width: '0.75rem', height: '0.75rem' }} /> Address
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              {donor.address}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Status: </span>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#10b981' }}>
                ● {donor.availability || 'Available'}
              </span>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Registered: </span>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                {donor.registeredDate || new Date().toISOString().split('T')[0]}
              </span>
            </div>
          </div>
        </div>

        {/* QR Code Mockup & Verification Stamp */}
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'rgba(220, 38, 38, 0.06)',
          border: '1px solid rgba(220, 38, 38, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle style={{ width: '1.25rem', height: '1.25rem', color: '#10b981' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Saved to Admin Database
            </span>
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={handlePrint} 
              className="btn btn-secondary"
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
            >
              <Printer style={{ width: '0.85rem', height: '0.85rem' }} /> Print Pass
            </button>
          </div>
        </div>
      </div>

      {/* Register Another button */}
      <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        <button 
          onClick={onReset}
          className="btn btn-secondary"
        >
          Register Another Donor
        </button>
      </div>
    </div>
  );
};
