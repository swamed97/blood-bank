/**
 * Central Database Configuration (Google Sheet)
 * 
 * Configured as a central hardcoded database so all visitors and donors
 * across all devices automatically sync without requiring individual browser configuration.
 */

export const HARDCODED_SHEETS_CONFIG = {
  // Google Sheet Public URL (optional for direct CSV export or direct sheet link)
  sheetUrl: '',

  // Google Apps Script Web App URL
  webhookUrl: 'https://script.google.com/macros/s/AKfycbxhLwY_Rp9zQtHKiZym6mnK4kKt7rHxB5eBrtaq6cknKd1DUgFEOsFcTOFFuDUoNHZv/exec'
};
