import React from 'react';
import { Droplet, Shield, Moon, Sun, UserPlus, Search, LayoutDashboard, FileSpreadsheet } from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab, darkMode, setDarkMode, donorCount }) => {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      backgroundColor: 'var(--bg-glass)',
      borderBottom: '1px solid var(--border-color)',
      transition: 'all 0.3s ease'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '4.5rem'
      }}>
        {/* Logo & Brand */}
        <div 
          onClick={() => setActiveTab('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', cursor: 'pointer' }}
        >
          <div style={{
            width: '2.8rem',
            height: '2.8rem',
            borderRadius: '0.85rem',
            background: 'linear-gradient(135deg, #d90429 0%, #b3001e 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(217, 4, 41, 0.4)',
            overflow: 'hidden',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            flexShrink: 0
          }}>
            <img 
              src="/dyfi_maanusham.png" 
              alt="DYFI Maanusham" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.35rem',
              fontWeight: 800,
              lineHeight: 1.1,
              color: '#d90429',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}>
              <span>DYFI മാനുഷം</span>
              <span style={{ fontSize: '0.9rem', color: '#d90429' }}>★</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.02em' }}>
              രക്തദാന സന്നദ്ധത • കൂത്തുപറമ്പ് ബ്ലോക്ക് (Kuthuparamba Block)
            </div>
          </div>
        </div>

        {/* Center Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <button 
            className={`nav-tab ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            Home
          </button>
          
          <button 
            className={`nav-tab ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => setActiveTab('register')}
          >
            <UserPlus style={{ width: '1rem', height: '1rem' }} />
            Register Donor
          </button>


          <button 
            className={`nav-tab ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveTab('admin')}
            style={{ position: 'relative' }}
          >
            <LayoutDashboard style={{ width: '1rem', height: '1rem' }} />
            Admin Portal
            {donorCount > 0 && (
              <span style={{
                fontSize: '0.7rem',
                backgroundColor: 'rgba(220, 38, 38, 0.15)',
                color: '#dc2626',
                padding: '0.1rem 0.45rem',
                borderRadius: '9999px',
                fontWeight: 700
              }}>
                {donorCount}
              </span>
            )}
          </button>
        </nav>

        {/* Right Action Tools */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <button 
            onClick={() => setDarkMode(!darkMode)}
            title="Toggle Dark / Light Mode"
            style={{
              padding: '0.6rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
          >
            {darkMode ? (
              <Sun style={{ width: '1.15rem', height: '1.15rem', color: '#f59e0b' }} />
            ) : (
              <Moon style={{ width: '1.15rem', height: '1.15rem', color: '#475569' }} />
            )}
          </button>

          <button 
            className="btn btn-primary"
            onClick={() => setActiveTab('register')}
            style={{ fontSize: '0.88rem', padding: '0.55rem 1rem' }}
          >
            <span style={{ fontSize: '1rem' }}>★</span>
            രക്തദാനം ചെയ്യാം
          </button>
        </div>
      </div>
    </header>
  );
};
