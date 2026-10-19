// Key for browser localStorage
const STORAGE_KEY = 'bloodbond_donors_db';
const CONFIG_KEY = 'bloodbond_sheets_config';

// Empty default array for production use
const DEFAULT_DONORS = [];

// Initialize and get all donors
export const getStoredDonors = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Auto-filter any old dummy demo records (DON-1001 to DON-1008)
      const legacyDummyIds = ['DON-1001', 'DON-1002', 'DON-1003', 'DON-1004', 'DON-1005', 'DON-1006', 'DON-1007', 'DON-1008'];
      const cleaned = parsed.filter(d => !legacyDummyIds.includes(d.id));
      if (cleaned.length !== parsed.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
      }
      return cleaned;
    }
    return [];
  } catch (err) {
    console.error('Failed to parse stored donors:', err);
    return [];
  }
};

// Save new donor
export const saveDonor = (donorData) => {
  const current = getStoredDonors();
  const newDonor = {
    id: `DON-${Date.now().toString().slice(-4)}`,
    ...donorData,
    registeredDate: new Date().toISOString().split('T')[0]
  };
  const updated = [newDonor, ...current];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newDonor;
};

// Delete donor
export const deleteDonor = (id) => {
  const current = getStoredDonors();
  const updated = current.filter(d => d.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

// Clear all donor records
export const clearAllDonors = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  return [];
};

// Reset to sample donors if needed
export const resetToSampleDonors = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  return [];
};

// Google Sheet webhook configuration
export const getSheetsConfig = () => {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    return raw ? JSON.parse(raw) : { webhookUrl: '', sheetUrl: '' };
  } catch (e) {
    return { webhookUrl: '', sheetUrl: '' };
  }
};

export const saveSheetsConfig = (config) => {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
};

// Export to CSV helper
export const exportToCSV = (donors) => {
  const headers = ['ID', 'Full Name', 'Gender', 'Mobile Number', 'Blood Group', 'Unit Name', 'Address', 'Age', 'Weight (kg)', 'Status', 'Registered Date'];
  const rows = donors.map(d => [
    d.id,
    `"${(d.name || '').replace(/"/g, '""')}"`,
    `"${d.gender || ''}"`,
    `"${d.mobile || ''}"`,
    d.bloodGroup,
    `"${(d.unitName || '').replace(/"/g, '""')}"`,
    `"${(d.address || '').replace(/"/g, '""')}"`,
    d.age,
    d.weight,
    d.availability || 'Available',
    d.registeredDate
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `BloodBond_Donors_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
