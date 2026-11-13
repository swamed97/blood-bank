import { SUPABASE_CONFIG } from '../config/supabaseConfig';
import { getDonorEligibility } from './donorEligibility';

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
    const donors = rows.map(r => {
      const rawDate = r.last_donated_date || (r.last_donated && /^\d{4}-\d{2}-\d{2}$/.test(r.last_donated) ? r.last_donated : '');
      const rawAvailability = r.availability || 'Available';

      const donorObj = {
        id: String(r.id || ''),
        name: String(r.name || ''),
        gender: r.gender || 'Male',
        mobile: String(r.mobile || ''),
        bloodGroup: String(r.blood_group || r.bloodGroup || '').toUpperCase().trim(),
        unitName: String(r.unit_name || r.unitName || ''),
        address: String(r.address || ''),
        age: r.age,
        weight: r.weight,
        lastDonatedMonth: r.last_donated_month || r.lastDonatedMonth || '',
        lastDonatedYear: r.last_donated_year || r.lastDonatedYear || '',
        lastDonated: r.last_donated || r.lastDonated || '',
        lastDonatedDate: rawDate,
        availability: rawAvailability,
        registeredDate: r.created_at ? r.created_at.split('T')[0] : (r.registeredDate || '')
      };

      // Calculate automatic eligibility (90 days for Male, 120 days for Female)
      const eligibility = getDonorEligibility(donorObj);
      donorObj.eligibility = eligibility;
      donorObj.availability = eligibility.status;

      // If database had 'Donated' but the cooldown period (90/120 days) has passed, sync to Supabase
      if (rawAvailability === 'Donated' && eligibility.isEligible && r.id) {
        updateDonorInSupabase(r.id, { availability: 'Available' }).catch(() => {});
      }

      return donorObj;
    });

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
      last_donated: donorData.lastDonated || '',
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

/**
 * Update a donor in Supabase (e.g. donation status, last donated date)
 */
export const updateDonorInSupabase = async (id, updates) => {
  const { url, anonKey } = SUPABASE_CONFIG;
  if (!url || !anonKey) return { success: false, error: 'Database not configured' };

  try {
    const cleanUrl = url.replace(/\/+$/, '');
    const payload = {};
    if (updates.availability !== undefined) payload.availability = updates.availability;
    if (updates.lastDonated !== undefined) payload.last_donated = updates.lastDonated;
    if (updates.lastDonatedDate !== undefined) {
      payload.last_donated_date = updates.lastDonatedDate;
    }

    let res = await fetch(`${cleanUrl}/rest/v1/donors?id=eq.${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: {
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      // If last_donated_date column does not exist yet in Supabase, retry without it
      const fallbackPayload = {};
      if (updates.availability !== undefined) fallbackPayload.availability = updates.availability;
      if (updates.lastDonated !== undefined) fallbackPayload.last_donated = updates.lastDonated;
      else if (updates.lastDonatedDate !== undefined) fallbackPayload.last_donated = updates.lastDonatedDate;

      res = await fetch(`${cleanUrl}/rest/v1/donors?id=eq.${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: {
          'apikey': anonKey,
          'Authorization': `Bearer ${anonKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(fallbackPayload)
      });
    }

    if (!res.ok) {
      const errText = await res.text();
      return { success: false, error: errText };
    }

    const updatedRows = await res.json();
    if (Array.isArray(updatedRows) && updatedRows.length === 0) {
      return { 
        success: false, 
        error: 'Database permission denied: Supabase UPDATE policy is missing. Please run the SQL command in Supabase to allow updating donors.' 
      };
    }

    return { success: true, updated: updatedRows };
  } catch (err) {
    console.warn('Update donor in Supabase error:', err);
    return { success: false, error: err.message };
  }
};

/**
 * Verify admin credentials from Supabase admins table
 */
export const verifyAdminLogin = async (username, password) => {
  const { url, anonKey } = SUPABASE_CONFIG;
  if (!url || !anonKey) {
    // Fallback if Supabase not configured
    return username.trim().toLowerCase() === 'admin' && password === 'admin123';
  }

  try {
    const cleanUrl = url.replace(/\/+$/, '');
    const cleanUser = username.trim().toLowerCase();

    const res = await fetch(
      `${cleanUrl}/rest/v1/admins?username=eq.${encodeURIComponent(cleanUser)}&select=*`,
      {
        method: 'GET',
        headers: {
          'apikey': anonKey,
          'Authorization': `Bearer ${anonKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!res.ok) {
      console.warn('Admin check error, falling back to local credentials');
      return cleanUser === 'admin' && password === 'admin123';
    }

    const rows = await res.json();
    if (rows && rows.length > 0) {
      const admin = rows[0];
      return admin.password === password;
    }

    // Default fallback if table is empty
    return cleanUser === 'admin' && password === 'admin123';
  } catch (err) {
    console.warn('Admin login verify error:', err);
    return username.trim().toLowerCase() === 'admin' && password === 'admin123';
  }
};

/**
 * Update admin password in Supabase admins table
 */
export const updateAdminPassword = async (username, newPassword) => {
  const { url, anonKey } = SUPABASE_CONFIG;
  if (!url || !anonKey) {
    return { success: false, error: 'Database not configured' };
  }

  try {
    const cleanUrl = url.replace(/\/+$/, '');
    const cleanUser = username.trim().toLowerCase();

    const res = await fetch(
      `${cleanUrl}/rest/v1/admins?username=eq.${encodeURIComponent(cleanUser)}`,
      {
        method: 'PATCH',
        headers: {
          'apikey': anonKey,
          'Authorization': `Bearer ${anonKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({ password: newPassword })
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      return { success: false, error: errText };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
};



