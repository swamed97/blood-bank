import { getSheetsConfig } from './storage';

/**
 * Sends donor registration payload directly to client's Google Apps Script Webhook
 * @param {Object} donorData 
 */
export const postToGoogleSheet = async (donorData) => {
  const config = getSheetsConfig();
  if (!config.webhookUrl) {
    console.log('No Google Sheet Webhook configured. Stored locally.');
    return { success: true, mode: 'local' };
  }

  try {
    const payload = {
      timestamp: new Date().toISOString(),
      id: donorData.id || `DON-${Date.now().toString().slice(-4)}`,
      name: donorData.name,
      gender: donorData.gender || 'Male',
      mobile: donorData.mobile,
      bloodGroup: donorData.bloodGroup,
      unitName: donorData.unitName,
      address: donorData.address,
      age: donorData.age,
      weight: donorData.weight,
      lastDonated: donorData.lastDonated || '',
      availability: donorData.availability || 'Available'
    };

    // mode: 'no-cors' allows browser to post to Google Apps Script without CORS preflight block
    await fetch(config.webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    return { success: true, mode: 'remote' };
  } catch (error) {
    console.warn('Google Sheet Webhook post error:', error);
    return { success: false, mode: 'error', error };
  }
};

// Parse Google Sheets CSV export into structured donors
const parseCSV = (csvText) => {
  const lines = [];
  let currentRow = [];
  let currentField = '';
  let insideQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentField += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      currentRow.push(currentField.trim());
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      currentRow.push(currentField.trim());
      if (currentRow.some(cell => cell.length > 0)) {
        lines.push(currentRow);
      }
      currentRow = [];
      currentField = '';
    } else {
      currentField += char;
    }
  }
  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some(cell => cell.length > 0)) {
      lines.push(currentRow);
    }
  }

  if (lines.length <= 1) return [];

  const header = lines[0].map(h => h.toLowerCase());
  const nameIdx = header.findIndex(h => h.includes('name') || h.includes('donor'));
  const genderIdx = header.findIndex(h => h.includes('gender') || h.includes('sex'));
  const bloodIdx = header.findIndex(h => h.includes('blood'));
  const mobileIdx = header.findIndex(h => h.includes('mobile') || h.includes('phone'));
  const unitIdx = header.findIndex(h => h.includes('unit'));
  const addrIdx = header.findIndex(h => h.includes('address'));
  const ageIdx = header.findIndex(h => h.includes('age'));
  const wtIdx = header.findIndex(h => h.includes('weight'));
  const statusIdx = header.findIndex(h => h.includes('status') || h.includes('avail'));
  const idIdx = header.findIndex(h => h.includes('id'));
  const timeIdx = header.findIndex(h => h.includes('time') || h.includes('date'));

  const donors = [];
  for (let i = 1; i < lines.length; i++) {
    const row = lines[i];
    const name = row[nameIdx !== -1 ? nameIdx : 2] || '';
    if (!name) continue;

    donors.push({
      id: row[idIdx !== -1 ? idIdx : 1] || `DON-${i}`,
      name: name,
      gender: genderIdx !== -1 ? (row[genderIdx] || '') : '',
      mobile: (row[mobileIdx !== -1 ? mobileIdx : 3] || '').replace(/^'/, ''),
      bloodGroup: (row[bloodIdx !== -1 ? bloodIdx : 4] || '').toUpperCase().trim(),
      unitName: row[unitIdx !== -1 ? unitIdx : 5] || '',
      address: row[addrIdx !== -1 ? addrIdx : 6] || '',
      age: row[ageIdx !== -1 ? ageIdx : 7] || '',
      weight: row[wtIdx !== -1 ? wtIdx : 8] || '',
      availability: row[statusIdx !== -1 ? statusIdx : 9] || 'Available',
      registeredDate: (row[timeIdx !== -1 ? timeIdx : 0] || '').split('T')[0] || ''
    });
  }

  return donors;
};

export const fetchDonorsFromGoogleSheet = async () => {
  const config = getSheetsConfig();

  // Method 1: Direct Google Sheet CSV export (Instant, zero CORS issues if sheet is viewable)
  if (config.sheetUrl) {
    const match = config.sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) {
      const sheetId = match[1];
      try {
        const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
        const res = await fetch(csvUrl);
        if (res.ok) {
          const csvText = await res.text();
          const parsed = parseCSV(csvText);
          if (parsed && parsed.length > 0) {
            return { success: true, donors: parsed, source: 'Google Sheet Link' };
          }
        }
      } catch (err) {
        console.warn('Direct CSV fetch error:', err);
      }
    }
  }

  // Method 2: Google Apps Script Webhook GET request
  if (config.webhookUrl) {
    try {
      const response = await fetch(config.webhookUrl);
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        if (data && Array.isArray(data.donors)) {
          return { success: true, donors: data.donors, source: 'Apps Script Webhook' };
        }
      } catch (parseErr) {
        return {
          success: false,
          donors: [],
          error: 'Your Google Apps Script returned plain text. Please copy the updated script from "Google Sheets Setup" and re-deploy it.'
        };
      }
    } catch (err) {
      return {
        success: false,
        donors: [],
        error: 'Network error connecting to Google Apps Script. Check your internet connection.'
      };
    }
  }

  return {
    success: false,
    donors: [],
    error: 'Please open "Google Sheets Setup" and paste your Google Sheet Link or Webhook URL.'
  };
};

/**
 * Returns ready-to-copy Google Apps Script code for your client
 */
export const generateGoogleAppsScriptCode = () => {
  return `// ====================================================
// BLOOD BOND - GOOGLE SHEETS AUTOMATION SCRIPT
// Paste this code into Google Sheets -> Extensions -> Apps Script
// ====================================================

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000); // Prevent concurrent write conflicts

  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getActiveSheet();
    
    // Auto-create Header Row if Sheet is blank
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp", 
        "Donor ID", 
        "Full Name", 
        "Gender",
        "Mobile Number", 
        "Blood Group", 
        "Unit Name", 
        "Address", 
        "Age", 
        "Weight (kg)", 
        "Status"
      ]);
      sheet.getRange("1:1").setFontWeight("bold").setBackground("#fee2e2");
    }

    var data = {};
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    }
    
    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.id || "DON-NEW",
      data.name || "Unknown Donor",
      data.gender || "Male",
      "'" + (data.mobile || ""), // Single quote forces string phone format
      data.bloodGroup || "",
      data.unitName || "",
      data.address || "",
      data.age || "",
      data.weight || "",
      data.availability || "Available"
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ "result": "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "error", "error": err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getActiveSheet();
    var rows = sheet.getDataRange().getValues();
    
    if (rows.length <= 1) {
      return ContentService
        .createTextOutput(JSON.stringify({ "result": "success", "donors": [] }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    var donors = [];
    for (var i = 1; i < rows.length; i++) {
      var row = rows[i];
      if (row[2]) { // If full name exists
        donors.push({
          id: String(row[1] || ("DON-" + i)),
          name: String(row[2] || ""),
          gender: String(row[3] || ""),
          mobile: String(row[4] || "").replace(/^'/, ""),
          bloodGroup: String(row[5] || ""),
          unitName: String(row[6] || ""),
          address: String(row[7] || ""),
          age: String(row[8] || ""),
          weight: String(row[9] || ""),
          availability: String(row[10] || "Available"),
          registeredDate: row[0] ? String(row[0]).split("T")[0] : ""
        });
      }
    }

    return ContentService
      .createTextOutput(JSON.stringify({ "result": "success", "donors": donors }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "error", "error": err.toString(), "donors": [] }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;
};
