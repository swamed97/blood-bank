import React from 'react';
import { Droplet, Heart, Phone, Mail, Shield, FileSpreadsheet } from 'lucide-react';

export const Footer = ({ setActiveTab }) => {
  return (
    <footer style={{
      backgroundColor: 'var(--bg-card)',
      borderTop: '1px solid var(--border-color)',
      padding: '3rem 0 2rem',
      marginTop: '4rem'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2rem',
          marginBottom: '2.5rem'
        }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <div style={{
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '0.75rem',
                background: '#d90429',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                padding: '2px'
              }}>
                <img src="/dyfi_maanusham.png" alt="DYFI" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#d90429' }}>
                DYFI മാനുഷം
              </span>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              ഡെമോക്രാറ്റിക് യൂത്ത് ഫെഡറേഷൻ ഓഫ് ഇന്ത്യ (DYFI) കൂത്തുപറമ്പ് ബ്ലോക്ക് കമ്മിറ്റിയുടെ ജീവകാരുണ്യ രക്തദാന പദ്ധതി. വിളിപ്പുറം ദൂരത്തായി രക്തദാന സന്നദ്ധത.
            </p>
          </div>

          {/* Quick Navigation Links */}
          <div>
            <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem' }}>
              <li>
                <a onClick={() => setActiveTab('home')} style={{ cursor: 'pointer', color: 'var(--text-secondary)', textDecoration: 'none' }}>
                  Home Page
                </a>
              </li>
              <li>
                <a onClick={() => setActiveTab('register')} style={{ cursor: 'pointer', color: 'var(--text-secondary)', textDecoration: 'none' }}>
                  Register as a Donor
                </a>
              </li>
              <li>
                <a onClick={() => setActiveTab('admin')} style={{ cursor: 'pointer', color: '#dc2626', fontWeight: 600, textDecoration: 'none' }}>
                  Admin Database Portal
                </a>
              </li>
            </ul>
          </div>

          {/* Emergency Helpline */}
          <div>
            <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>
              Emergency Helpline
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone style={{ width: '1rem', height: '1rem', color: '#dc2626' }} />
                <span>24/7 Helpline: <strong>+91 1800-BLOOD-SAVE</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail style={{ width: '1rem', height: '1rem', color: '#dc2626' }} />
                <span>Support: <strong>helpline@bloodbond.org</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.82rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            © {new Date().getFullYear()} DYFI മാനുഷം • കൂത്തുപറമ്പ് ബ്ലോക്ക് കമ്മിറ്റി.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span>മാനുഷം രക്തദാന സന്നദ്ധ സേന</span>
            <Heart style={{ width: '0.85rem', height: '0.85rem', color: '#d90429', fill: '#d90429' }} />
          </div>
        </div>
      </div>
    </footer>
  );
};
