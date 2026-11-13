import React from 'react';
import { Heart } from 'lucide-react';

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
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '2.5rem',
          marginBottom: '2.5rem'
        }}>
          {/* Brand Info */}
          <div style={{ maxWidth: '520px', flex: '1 1 300px' }}>
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
                DYFI അതിജീവനം
              </span>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              ഡെമോക്രാറ്റിക് യൂത്ത് ഫെഡറേഷൻ ഓഫ് ഇന്ത്യ (DYFI) ചെറുവാഞ്ചേരി വെസ്റ്റ് മേഖലയുടെ ജീവകാരുണ്യ രക്തദാന പദ്ധതി. വിളിപ്പുറം ദൂരത്തായി രക്തദാന സന്നദ്ധത.
            </p>
          </div>

          {/* Quick Navigation Links */}
          <div style={{ flex: '0 0 auto' }}>
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
            © {new Date().getFullYear()} DYFI അതിജീവനം • ചെറുവാഞ്ചേരി വെസ്റ്റ് മേഖല.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span>അതിജീവനം രക്തദാന സന്നദ്ധ സംഘടന</span>
            <Heart style={{ width: '0.85rem', height: '0.85rem', color: '#d90429', fill: '#d90429' }} />
          </div>
        </div>
      </div>
    </footer>
  );
};
