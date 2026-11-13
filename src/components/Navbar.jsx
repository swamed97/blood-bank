import React from 'react';
import { UserPlus, LayoutDashboard, Home } from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab, donorCount }) => {
  return (
    <header className="site-header">
      <div className="container header-container">
        {/* Logo & Brand */}
        <div 
          onClick={() => setActiveTab('home')}
          className="brand-section"
        >
          <div className="brand-logo">
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
            <div className="brand-title">
              <span>DYFI അതിജീവനം</span>
              <span className="brand-star">★</span>
            </div>
            <div className="brand-subtitle brand-subtitle-full">
              രക്തദാന സന്നദ്ധത • ചെറുവാഞ്ചേരി വെസ്റ്റ് മേഖല
            </div>
            <div className="brand-subtitle brand-subtitle-mobile">
              ചെറുവാഞ്ചേരി വെസ്റ്റ് മേഖല
            </div>
          </div>
        </div>

        {/* Center Navigation Tabs */}
        <nav className="header-nav">
          <button 
            className={`nav-tab ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            <Home style={{ width: '0.9rem', height: '0.9rem' }} />
            <span>Home</span>
          </button>
          
          <button 
            className={`nav-tab ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => setActiveTab('register')}
          >
            <UserPlus style={{ width: '0.9rem', height: '0.9rem' }} />
            <span className="nav-text-desktop">Register Donor</span>
            <span className="nav-text-mobile">Register</span>
          </button>

          <button 
            className={`nav-tab ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveTab('admin')}
            style={{ position: 'relative' }}
          >
            <LayoutDashboard style={{ width: '0.9rem', height: '0.9rem' }} />
            <span className="nav-text-desktop">Admin Portal</span>
            <span className="nav-text-mobile">Admin</span>
            {donorCount > 0 && (
              <span className="nav-badge">
                {donorCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};
