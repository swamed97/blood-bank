import { SUPABASE_CONFIG } from '../config/supabaseConfig';

/**
 * Fetch all donors from Supabase PostgreSQL database
 */
export const fetchDonorsFromSupabase = async () => {
  const { url, anonKey } = SUPABASE_CONFIG;
  if (!url || !anonKey) {
    return { 
      success: false, 
      donors: [], 
      error: 'Please add your Supabase URL and Anon Key in src/config/supabaseConfig.js' 
    };
  }

  try {
    const cleanUrl = url.replace(/\/+$/, '');
    const res = await fetch(`${cleanUrl}/rest/v1/donors?select=*&order=created_at.desc`, {
      method: 'GET',
      headers: {
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      const errText = await res.text();
      return { success: false, donors: [], error: `Supabase error (${res.status}): ${errText}` };
    }

    const rows = await res.json();
    const donors = rows.map(r => ({
      id: String(r.id || ''),
      name: String(r.name || ''),
      gender: r.gender || 'Male',
      mobile: String(r.mobile || ''),
      bloodGroup: String(r.blood_group || r.bloodGroup || '').toUpperCase().trim(),
      unitName: String(r.unit_name || r.unitName || ''),
      address: String(r.address || ''),
      age: r.age,
      weight: r.weight,
      availability: r.availability || 'Available',
      registeredDate: r.created_at ? r.created_at.split('T')[0] : (r.registeredDate || '')
    }));

    return { success: true, donors, source: 'Supabase Database' };
  } catch (err) {
    return { success: false, donors: [], error: err.message };
  }
};

/**
 * Insert a new donor into Supabase
 */
export const postDonorToSupabase = async (donorData) => {
  const { url, anonKey } = SUPABASE_CONFIG;
  if (!url || !anonKey) {
    console.warn('Supabase not configured, saving locally only.');
    return { success: true, mode: 'local' };
  }

  try {
    const cleanUrl = url.replace(/\/+$/, '');
    const payload = {
      id: donorData.id || `DON-${Date.now().toString().slice(-4)}`,
      name: donorData.name,
      gender: donorData.gender || 'Male',
      mobile: donorData.mobile,
      blood_group: donorData.bloodGroup,
      unit_name: donorData.unitName,
      address: donorData.address || '',
      age: parseInt(donorData.age, 10) || 25,
      weight: parseInt(donorData.weight, 10) || 60,
      availability: donorData.availability || 'Available'
    };

    const res = await fetch(`${cleanUrl}/rest/v1/donors`, {
      method: 'POST',
      headers: {
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn('Supabase insert error:', errText);
      return { success: false, error: errText };
    }

    return { success: true, mode: 'remote' };
  } catch (error) {
    console.warn('Supabase post error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Delete a donor from Supabase by ID
 */
export const deleteDonorFromSupabase = async (id) => {
  const { url, anonKey } = SUPABASE_CONFIG;
  if (!url || !anonKey) return { success: false };

  try {
    const cleanUrl = url.replace(/\/+$/, '');
    const res = await fetch(`${cleanUrl}/rest/v1/donors?id=eq.${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: {
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`
      }
    });

    return { success: res.ok };
  } catch (err) {
    return { success: false, error: err.message };
  }
};
