/**
 * Donor Blood Donation Eligibility & Cooldown Manager
 * 
 * Rules:
 * - Male: 90 days cooldown (approx 3 months) before eligible again
 * - Female: 120 days cooldown (approx 4 months) before eligible again
 */

export const COOLDOWN_DAYS = {
  male: 90,
  female: 120
};

/**
 * Calculates current eligibility and cooldown stats for a donor
 * @param {Object} donor
 * @returns {Object} eligibility details
 */
export const getDonorEligibility = (donor) => {
  if (!donor) {
    return {
      isEligible: true,
      status: 'Available',
      cooldownDays: 90,
      daysElapsed: 0,
      daysRemaining: 0,
      nextEligibleDate: null,
      lastDonatedDate: null
    };
  }

  const genderStr = (donor.gender || 'Male').toLowerCase().trim();
  const isFemale = genderStr.includes('female') || genderStr.includes('സ്ത്രീ') || genderStr === 'f';
  const cooldownDays = isFemale ? COOLDOWN_DAYS.female : COOLDOWN_DAYS.male;

  // Extract donation date if present (support YYYY-MM-DD)
  let dateStr = donor.lastDonatedDate;
  if (!dateStr && donor.lastDonated && /^\d{4}-\d{2}-\d{2}$/.test(donor.lastDonated)) {
    dateStr = donor.lastDonated;
  }

  // If donor has no recorded donation date and is not marked as Donated
  if (!dateStr && donor.availability !== 'Donated') {
    return {
      isEligible: true,
      status: donor.availability || 'Available',
      cooldownDays,
      daysElapsed: 0,
      daysRemaining: 0,
      nextEligibleDate: null,
      lastDonatedDate: null
    };
  }

  // If donor has a recorded donation date
  if (dateStr) {
    try {
      const parts = dateStr.split('-');
      const donatedTime = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10)).getTime();
      const today = new Date();
      const todayTime = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();

      const diffMs = todayTime - donatedTime;
      const daysElapsed = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      // If cooldown period has elapsed, donor is automatically Available
      if (daysElapsed >= cooldownDays) {
        return {
          isEligible: true,
          status: 'Available',
          cooldownDays,
          daysElapsed,
          daysRemaining: 0,
          nextEligibleDate: null,
          lastDonatedDate: dateStr
        };
      }

      // Still in cooldown period
      const daysRemaining = cooldownDays - daysElapsed;
      const nextDate = new Date(donatedTime + (cooldownDays * 24 * 60 * 60 * 1000));
      const nextYear = nextDate.getFullYear();
      const nextMonth = String(nextDate.getMonth() + 1).padStart(2, '0');
      const nextDay = String(nextDate.getDate()).padStart(2, '0');
      const nextEligibleDate = `${nextYear}-${nextMonth}-${nextDay}`;

      return {
        isEligible: false,
        status: 'Donated',
        cooldownDays,
        daysElapsed: Math.max(0, daysElapsed),
        daysRemaining: Math.max(1, daysRemaining),
        nextEligibleDate,
        lastDonatedDate: dateStr
      };
    } catch (e) {
      console.warn('Error parsing lastDonatedDate:', e);
    }
  }

  // Fallback if marked 'Donated' but date is missing
  if (donor.availability === 'Donated') {
    return {
      isEligible: false,
      status: 'Donated',
      cooldownDays,
      daysElapsed: 0,
      daysRemaining: cooldownDays,
      nextEligibleDate: null,
      lastDonatedDate: null
    };
  }

  return {
    isEligible: true,
    status: 'Available',
    cooldownDays,
    daysElapsed: 0,
    daysRemaining: 0,
    nextEligibleDate: null,
    lastDonatedDate: null
  };
};

/**
 * Format a date string (YYYY-MM-DD) into readable format (e.g. 14 Nov 2026)
 */
export const formatReadableDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    const [year, month, day] = dateStr.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${parseInt(day, 10)} ${months[parseInt(month, 10) - 1]} ${year}`;
  } catch {
    return dateStr;
  }
};
