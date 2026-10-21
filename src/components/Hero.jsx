import React from 'react';
import { Droplet, HeartHandshake, ShieldCheck, Users, Search, ArrowRight, Activity, FileSpreadsheet, Star, Phone } from 'lucide-react';

export const Hero = ({ setActiveTab, donorCount, bloodGroupCounts, onFilterSelect }) => {
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <div style={{ position: 'relative', overflow: 'hidden', padding: '2.5rem 0 2rem' }}>
      {/* Decorative Glows */}
      <div className="bg-decor bg-decor-1"></div>
      <div className="bg-decor bg-decor-2"></div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Main Two-Column Hero Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          alignItems: 'center',
          marginBottom: '3rem'
        }}>
          {/* Left Column: DYFI Content */}
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.4rem 1rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(217, 4, 41, 0.1)',
              border: '1.5px solid rgba(217, 4, 41, 0.25)',
              color: '#d90429',
              fontWeight: 800,
              fontSize: '0.85rem',
              marginBottom: '1rem',
              letterSpacing: '0.02em'
            }}>
              <Star style={{ width: '0.95rem', height: '0.95rem', fill: '#d90429' }} />
              DYFI കൂത്തുപറമ്പ് ബ്ലോക്ക് കമ്മിറ്റി (Kuthuparamba Block)
            </div>

            <h1 style={{
              fontSize: 'clamp(1.75rem, 4.5vw, 3.2rem)',
              lineHeight: 1.18,
              marginBottom: '1rem',
              color: 'var(--text-primary)',
              fontWeight: 800
            }}>
              വിളിപ്പുറം ദൂരത്തായി <br />
              <span style={{
                background: 'linear-gradient(135deg, #d90429 0%, #b3001e 60%, #800016 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                രക്തദാന സന്നദ്ധത
              </span>
            </h1>

            <div style={{
              display: 'inline-block',
              padding: '0.2rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#d90429',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '1rem',
              marginBottom: '1rem',
              letterSpacing: '0.05em'
            }}>
              DYFI മാനുഷം
            </div>

            <p style={{
              fontSize: '1.05rem',
              color: 'var(--text-secondary)',
              marginBottom: '1.75rem',
              lineHeight: 1.6
            }}>
              ഒരു ഫോൺ കോളിനപ്പുറം അടിയന്തര ഘട്ടങ്ങളിൽ ഏത് രക്തഗ്രൂപ്പും ലഭ്യമാക്കാൻ ഡിവൈഎഫ്ഐ സന്നദ്ധ രക്തദാന സംഘടന സദാസന്നദ്ധമാണ്. മാനുഷം പദ്ധതിയിലൂടെ നമുക്കൊന്നായി ജീവനുകൾ കാക്കാം.
            </p>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.85rem',
              marginBottom: '1.5rem'
            }}>
              <button 
                className="btn btn-primary"
                onClick={() => setActiveTab('register')}
                style={{ fontSize: '1rem', padding: '0.8rem 1.5rem' }}
              >
                <Droplet style={{ width: '1.1rem', height: '1.1rem', fill: 'white' }} />
                രക്തദാതാവാകാം (Register)
                <ArrowRight style={{ width: '1rem', height: '1rem' }} />
              </button>


              <button 
                className="btn btn-outline-danger"
                onClick={() => setActiveTab('admin')}
                style={{ fontSize: '0.92rem', padding: '0.8rem 1.25rem' }}
              >
                <FileSpreadsheet style={{ width: '1rem', height: '1rem' }} />
                അഡ്മിൻ പോർട്ടൽ
              </button>
            </div>
          </div>

          {/* Right Column: Official DYFI Banner Frame */}
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <div className="glass-card pulse-card" style={{
              position: 'relative',
              maxWidth: '540px',
              width: '100%',
              padding: '0.85rem',
              borderRadius: 'var(--radius-2xl)',
              border: '2px solid rgba(217, 4, 41, 0.35)',
              backgroundColor: 'var(--bg-card)',
              boxShadow: '0 20px 40px -10px rgba(217, 4, 41, 0.25)',
              textAlign: 'center'
            }}>
              <div style={{
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                backgroundColor: '#ffffff',
                boxShadow: '0 4px 15px rgba(0,0,0,0.06)'
              }}>
                <img 
                  src="/dyfi_maanusham.png" 
                  alt="DYFI രക്തദാന സന്നദ്ധത"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    objectFit: 'contain'
                  }}
                />
              </div>

              {/* Bottom Badge inside banner frame */}
              <div style={{
                marginTop: '0.75rem',
                padding: '0.5rem 0.75rem',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'rgba(217, 4, 41, 0.08)',
                border: '1px solid rgba(217, 4, 41, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}>
                <span style={{ color: '#d90429', fontWeight: 800, fontSize: '0.88rem' }}>
                  ★ DYFI രക്തദാന സന്നദ്ധ സംഘടന • കൂത്തുപറമ്പ് ബ്ലോക്ക് ★
                </span>
              </div>
            </div>
          </div>
        </div>


        {/* Quick Metrics Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem'
        }}>
          <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{
              width: '3.25rem',
              height: '3.25rem',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'rgba(217, 4, 41, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Users style={{ width: '1.75rem', height: '1.75rem', color: '#d90429' }} />
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
                {donorCount}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                രജിസ്റ്റർ ചെയ്ത ദാതാക്കൾ
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{
              width: '3.25rem',
              height: '3.25rem',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <HeartHandshake style={{ width: '1.75rem', height: '1.75rem', color: '#10b981' }} />
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
                8 / 8
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                എല്ലാ രക്തഗ്രൂപ്പുകളും
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{
              width: '3.25rem',
              height: '3.25rem',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShieldCheck style={{ width: '1.75rem', height: '1.75rem', color: '#3b82f6' }} />
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
                100%
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                സന്നദ്ധ സേവനം (Voluntary)
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
