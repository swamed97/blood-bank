import React, { useState } from 'react';
import { User, Phone, MapPin, Building, Heart, CheckCircle2, AlertCircle, Droplet, Sparkles, Send, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';
import { saveDonor } from '../utils/storage';
import { postToGoogleSheet } from '../utils/googleSheetService';
import { postDonorToSupabase } from '../utils/supabaseService';
import { DonorCard } from './DonorCard';

export const DonorForm = ({ onDonorAdded }) => {
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const [formData, setFormData] = useState({
    name: '',
    gender: 'Male',
    mobile: '',
    bloodGroup: 'O+',
    unitName: '',
    address: '',
    age: '25',
    weight: '65',
    lastDonatedMonth: '',
    lastDonatedYear: '',
    availability: 'Available',
    agreedToTerms: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdDonor, setCreatedDonor] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Basic Validation
    if (!formData.name.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }

    if (!formData.mobile.trim() || formData.mobile.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number');
      return;
    }

    if (!formData.unitName.trim()) {
      setErrorMessage('Please enter your Organization Unit Name');
      return;
    }

    if (!formData.address.trim()) {
      setErrorMessage('Please enter your address');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name.trim(),
        gender: formData.gender || 'Male',
        mobile: formData.mobile.trim(),
        bloodGroup: formData.bloodGroup,
        unitName: formData.unitName.trim(),
        address: formData.address.trim(),
        age: parseInt(formData.age) || 25,
        weight: parseInt(formData.weight) || 60,
        lastDonatedMonth: formData.lastDonatedMonth || '',
        lastDonatedYear: formData.lastDonatedYear || '',
        lastDonated: formData.lastDonatedMonth && formData.lastDonatedYear 
          ? `${formData.lastDonatedMonth} ${formData.lastDonatedYear}` 
          : (formData.lastDonatedYear || formData.lastDonatedMonth || 'First Time / Never'),
        availability: formData.availability
      };

      // 1. Save locally
      const saved = saveDonor(payload);

      // 2. Post to Supabase database (cloud)
      await postDonorToSupabase(saved);

      // 3. Post to Google Sheet Webhook if configured (backup)
      await postToGoogleSheet(saved);

      // 3. Trigger confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // Confetti fallback
      }

      setCreatedDonor(saved);
      if (onDonorAdded) onDonorAdded();

    } catch (err) {
      setErrorMessage('Failed to save donor record. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setCreatedDonor(null);
    setFormData({
      name: '',
      gender: 'Male',
      mobile: '',
      bloodGroup: 'O+',
      unitName: '',
      address: '',
      age: '25',
      weight: '65',
      lastDonatedMonth: '',
      lastDonatedYear: '',
      availability: 'Available',
      agreedToTerms: true
    });
  };

  if (createdDonor) {
    return (
      <div className="container" style={{ padding: '2.5rem 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '4rem',
            height: '4rem',
            borderRadius: '50%',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem'
          }}>
            <Sparkles style={{ width: '2.2rem', height: '2.2rem' }} />
          </div>
          <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>
            Thank You for Registering!
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '500px', margin: '0.5rem auto 0' }}>
            Your details have been saved to the database. Here is your digital donor pass:
          </p>
        </div>

        <DonorCard donor={createdDonor} onReset={handleReset} />
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1rem', maxWidth: '800px' }}>
      <div className="glass-card donor-form-card">
        
        {/* Form Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '4.5rem',
            height: '4.5rem',
            borderRadius: '1.25rem',
            background: 'linear-gradient(135deg, #d90429 0%, #b3001e 100%)',
            padding: '4px',
            boxShadow: '0 8px 20px rgba(217, 4, 41, 0.35)',
            marginBottom: '1rem',
            overflow: 'hidden'
          }}>
            <img 
              src="/dyfi_maanusham.png" 
              alt="DYFI Maanusham" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '1rem' }} 
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
            <span style={{ color: '#d90429', fontWeight: 800 }}>★ DYFI അതിജീവനം ★</span>
          </div>

          <h2 style={{ fontSize: '1.85rem', color: 'var(--text-primary)', marginBottom: '0.4rem', fontWeight: 800 }}>
            രക്തദാതാക്കളുടെ രജിസ്ട്രേഷൻ ഫോം
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            വിളിപ്പുറം ദൂരത്തായി രക്തദാന സന്നദ്ധത. ഒരു ഫോൺ കോളിനപ്പുറം ജീവൻ രക്ഷിക്കാൻ നമ്മളും പങ്കാളിയാകാം.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div style={{
            padding: '0.85rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontSize: '0.9rem',
            fontWeight: 600,
            marginBottom: '1.5rem'
          }}>
            <AlertCircle style={{ width: '1.2rem', height: '1.2rem', shrink: 0 }} />
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          {/* Blood Group Picker Pills */}
          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label className="form-label" style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>
              <Droplet style={{ width: '1rem', height: '1rem', color: '#dc2626' }} /> Select Blood Group *
            </label>
            <div className="blood-group-grid">
              {bloodGroups.map(bg => (
                <div
                  key={bg}
                  className={`blood-pill ${formData.bloodGroup === bg ? 'selected' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, bloodGroup: bg }))}
                >
                  {bg}
                </div>
              ))}
            </div>
          </div>

          {/* Grid Inputs: Name, Gender & Mobile */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">
                <User style={{ width: '0.9rem', height: '0.9rem', color: 'var(--text-muted)' }} /> Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Gender *
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="Male">Male (പുരുഷൻ)</option>
                <option value="Female">Female (സ്ത്രീ)</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                <Phone style={{ width: '0.9rem', height: '0.9rem', color: 'var(--text-muted)' }} /> Mobile Number *
              </label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className="form-input"
                maxLength={10}
                required
              />
            </div>
          </div>

          {/* Unit Name & Location */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">
                <Building style={{ width: '0.9rem', height: '0.9rem', color: 'var(--text-muted)' }} /> Organization Unit Name *
              </label>
              <input
                type="text"
                name="unitName"
                value={formData.unitName}
                onChange={handleChange}
                placeholder="e.g. Muthiyanga East Unit"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Heart style={{ width: '0.9rem', height: '0.9rem', color: 'var(--text-muted)' }} /> Availability Status
              </label>
              <select
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Available">Available Anytime</option>
                <option value="Emergency Only">Emergency Only</option>
              </select>
            </div>
          </div>

          {/* Address */}
          <div className="form-group">
            <label className="form-label">
              <MapPin style={{ width: '0.9rem', height: '0.9rem', color: 'var(--text-muted)' }} /> Full Address / City / Pincode *
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="form-textarea"
              rows={2}
              required
            />
          </div>

          {/* Age & Weight */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Age (Years)</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min={18}
                max={65}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Weight (kg)</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                min={45}
                max={150}
                className="form-input"
              />
            </div>
          </div>

          {/* Last Blood Donated (Month & Year) */}
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">
              <Calendar style={{ width: '0.9rem', height: '0.9rem', color: '#dc2626' }} /> Last Blood Donated (അവസാനം രക്തം നൽകിയ മാസം & വർഷം)
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <select
                name="lastDonatedMonth"
                value={formData.lastDonatedMonth}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">-- Select Month --</option>
                <option value="January">January (ജനുവരി)</option>
                <option value="February">February (ഫെബ്രുവരി)</option>
                <option value="March">March (മാർച്ച്)</option>
                <option value="April">April (ഏപ്രിൽ)</option>
                <option value="May">May (മേയ്)</option>
                <option value="June">June (ജൂൺ)</option>
                <option value="July">July (ജൂലൈ)</option>
                <option value="August">August (ഓഗസ്റ്റ്)</option>
                <option value="September">September (സെപ്റ്റംബർ)</option>
                <option value="October">October (ഒക്ടോബർ)</option>
                <option value="November">November (നവംബർ)</option>
                <option value="December">December (ഡിസംബർ)</option>
              </select>

              <select
                name="lastDonatedYear"
                value={formData.lastDonatedYear}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">-- Select Year --</option>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020 or earlier">2020 or earlier</option>
                <option value="Never / First Time">Never / First Time (ആദ്യമായി)</option>
              </select>
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              ആദ്യമായി രക്തം ദാനം ചെയ്യുന്ന ആളാണെങ്കിൽ "Never / First Time" തിരഞ്ഞെടുക്കുക.
            </span>
          </div>

          {/* Submit Button */}
          <div style={{ marginTop: '1.75rem' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '0.95rem',
                fontSize: '1.1rem',
                borderRadius: 'var(--radius-lg)'
              }}
            >
              {isSubmitting ? (
                'Saving...'
              ) : (
                <>
                  <Send style={{ width: '1.1rem', height: '1.1rem' }} />
                  Submit Registration
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
