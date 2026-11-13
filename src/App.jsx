import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { DonorForm } from './components/DonorForm';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { getStoredDonors } from './utils/storage';
import { fetchDonorsFromGoogleSheet } from './utils/googleSheetService';
import { fetchDonorsFromSupabase } from './utils/supabaseService';
import { Droplet, Search, MapPin, Phone, MessageSquare, Building, Filter, RefreshCw } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [donors, setDonors] = useState([]);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('ALL');
  const [searchFilterGroup, setSearchFilterGroup] = useState('ALL');
  const [searchUnit, setSearchUnit] = useState('ALL');
  const [isSyncing, setIsSyncing] = useState(false);

  // Sync donors on mount (prioritizing Supabase cloud database)
  const refreshDonors = async () => {
    setIsSyncing(true);
    try {
      // 1. Try Supabase cloud database
      const sbResult = await fetchDonorsFromSupabase();
      if (sbResult && sbResult.success && Array.isArray(sbResult.donors)) {
        setDonors(sbResult.donors);
        return sbResult;
      }

      // 2. Fallback to Google Sheet if configured
      const result = await fetchDonorsFromGoogleSheet();
      if (result && result.success && Array.isArray(result.donors)) {
        setDonors(result.donors);
        return result;
      } else {
        const local = getStoredDonors();
        setDonors(local);
        return result || { success: false, donors: local };
      }
    } catch (e) {
      const local = getStoredDonors();
      setDonors(local);
      return { success: false, donors: local, error: e.message };
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    refreshDonors();
  }, []);

  // Compute donor count per blood group
  const bloodGroupCounts = useMemo(() => {
    const counts = {};
    donors.forEach(d => {
      if (d.bloodGroup) {
        counts[d.bloodGroup] = (counts[d.bloodGroup] || 0) + 1;
      }
    });
    return counts;
  }, [donors]);

  // Donors for Public Search Tab
  const publicSearchDonors = useMemo(() => {
    return donors.filter(d => {
      if (searchFilterGroup !== 'ALL' && d.bloodGroup !== searchFilterGroup) return false;
      if (searchUnit !== 'ALL' && d.unitName !== searchUnit) return false;
      return true;
    });
  }, [donors, searchFilterGroup, searchUnit]);

  // Extract unique units for search
  const availableUnits = useMemo(() => {
    const set = new Set(donors.map(d => d.unitName).filter(Boolean));
    return ['ALL', ...Array.from(set)];
  }, [donors]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Navigation Header */}
      <Navbar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        donorCount={donors.length}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {activeTab === 'home' && (
          <Hero 
            setActiveTab={setActiveTab}
            donorCount={donors.length}
            bloodGroupCounts={bloodGroupCounts}
            onFilterSelect={(bg) => setSelectedBloodGroup(bg)}
          />
        )}

        {activeTab === 'register' && (
          <DonorForm 
            onDonorAdded={refreshDonors}
          />
        )}

        {activeTab === 'search' && (
          <div className="container" style={{ padding: '2.5rem 1rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)', fontWeight: 800 }}>
                രക്തദാതാക്കളെ കണ്ടെത്താം (Find Donors)
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                DYFI അതിജീവനം സന്നദ്ധ രക്തദാന ശൃംഖലയിലൂടെ രക്തഗ്രൂപ്പും മേഖലാ യൂണിറ്റും തിരഞ്ഞെടുത്ത് വേഗത്തിൽ ദാതാക്കളെ കണ്ടെത്താം.
              </p>
            </div>

            {/* Search Filter Pills */}
            <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Filter style={{ width: '1rem', height: '1rem', color: '#dc2626' }} /> Select Blood Group:
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                  {['ALL', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                    <button
                      key={bg}
                      onClick={() => setSearchFilterGroup(bg)}
                      style={{
                        padding: '0.4rem 0.85rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1.5px solid',
                        borderColor: searchFilterGroup === bg ? '#dc2626' : 'var(--border-color)',
                        backgroundColor: searchFilterGroup === bg ? '#dc2626' : 'var(--bg-card)',
                        color: searchFilterGroup === bg ? '#ffffff' : 'var(--text-primary)',
                        fontWeight: 700,
                        cursor: 'pointer',
                        fontFamily: 'var(--font-heading)',
                        fontSize: '0.85rem'
                      }}
                    >
                      {bg === 'ALL' ? 'ALL GROUPS' : bg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Unit Dropdown */}
              <div style={{ maxWidth: '350px' }}>
                <label style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', display: 'block' }}>
                  Filter by Organization Unit:
                </label>
                <select
                  value={searchUnit}
                  onChange={e => setSearchUnit(e.target.value)}
                  className="form-select"
                >
                  {availableUnits.map(unit => (
                    <option key={unit} value={unit}>
                      {unit === 'ALL' ? 'All Organization Units' : unit}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1.25rem'
            }}>
              {publicSearchDonors.map(donor => {
                const whatsappUrl = `https://wa.me/91${donor.mobile.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(donor.name)},%20urgent%20blood%20request%20for%20blood%20group%20${encodeURIComponent(donor.bloodGroup)}%20from%20BloodBank.`;

                return (
                  <div key={donor.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                        <span className="blood-badge" style={{ fontSize: '1rem', padding: '0.35rem 0.75rem' }}>
                          {donor.bloodGroup}
                        </span>
                        <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 700 }}>
                          ● {donor.availability || 'Available'}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                        {donor.name}
                      </h3>

                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.5rem' }}>
                        <Building style={{ width: '0.85rem', height: '0.85rem', color: 'var(--text-muted)' }} />
                        <span>{donor.unitName}</span>
                      </div>

                      {donor.lastDonated && (
                        <div style={{ fontSize: '0.82rem', color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                          <span>🩸 Last Donated:</span>
                          <span>{donor.lastDonated}</span>
                        </div>
                      )}

                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '1rem' }}>
                        <MapPin style={{ width: '0.85rem', height: '0.85rem', shrink: 0 }} />
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{donor.address}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn"
                        style={{
                          flex: 1,
                          padding: '0.55rem',
                          fontSize: '0.85rem',
                          backgroundColor: '#25D366',
                          color: '#ffffff',
                          borderRadius: 'var(--radius-md)',
                          textDecoration: 'none'
                        }}
                      >
                        <MessageSquare style={{ width: '0.9rem', height: '0.9rem' }} /> WhatsApp
                      </a>

                      <a
                        href={`tel:${donor.mobile}`}
                        className="btn btn-secondary"
                        style={{ padding: '0.55rem 0.9rem', fontSize: '0.85rem' }}
                      >
                        <Phone style={{ width: '0.9rem', height: '0.9rem' }} /> Call
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'admin' && (
          <AdminDashboard 
            donors={donors}
            setDonors={setDonors}
            selectedBloodGroup={selectedBloodGroup}
            setSelectedBloodGroup={setSelectedBloodGroup}
            setActiveTab={setActiveTab}
            refreshDonors={refreshDonors}
            isSyncing={isSyncing}
          />
        )}
      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}
