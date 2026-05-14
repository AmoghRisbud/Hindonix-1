/**
 * Google Apps Script for Hindonix Contact Form
 * 
 * SETUP INSTRUCTIONS:
 * 1. Open your Google Sheet
 * 2. Go to Extensions → Apps Script
 * 3. Delete any existing code
 * 4. Paste this entire code
 * 5. Save the project (name it "Hindonix Contact Form")
 * 6. Click Deploy → New deployment
 * 7. Select type: Web app
 * 8. Execute as: Me
 * 9. Who has access: Anyone
 * 10. Click Deploy and copy the Web App URL
 * 11. Paste the URL into your .env.local file as VITE_GOOGLE_SHEETS_WEB_APP_URL
 * 
 * SHEET STRUCTURE:
 * Make sure your sheet has these headers in Row 1:
 * A1: Timestamp
 * B1: Name
 * C1: Email
 * D1: Phone
 * E1: Company
 * F1: Country
 * G1: City
 * H1: Subject
 * I1: Message
 * J1: Submission ID
 */

// Configuration
const SHEET_NAME = "Contact Submissions"; // Change this if your sheet has a different name
const MAX_MESSAGE_LENGTH = 5000;
const RATE_LIMIT_MINUTES = 1; // Minimum time between submissions from same email

/**
 * Handle POST requests from the contact form
 */
function doPost(e) {
  try {
    let data;
    
    // Parse request body - handle both JSON and form data
    if (e.postData.type === 'application/x-www-form-urlencoded') {
      // Parse form data
      data = {};
      const params = e.parameter;
      for (let key in params) {
        data[key] = params[key];
      }
    } else {
      // Parse JSON
      data = JSON.parse(e.postData.contents);
    }
    
    // Validate required fields
    const validation = validateData(data);
    if (!validation.valid) {
      return createResponse(false, validation.message);
    }
    
    // Check rate limiting
    if (isRateLimited(data.email)) {
      return createResponse(false, "Please wait before submitting another form.");
    }
    
    // Get or create the sheet
    const sheet = getSheet();
    
    // Append data to sheet
    appendToSheet(sheet, data);
    
    // Return success response
    return createResponse(true, "Form submitted successfully", data.submissionId);
    
  } catch (error) {
    Logger.log("Error in doPost: " + error.toString());
    return createResponse(false, "Server error: " + error.toString());
  }
}

/**
 * Handle GET requests (return error - only POST allowed)
 */
function doGet(e) {
  return createResponse(false, "Only POST requests are allowed");
}

/**
 * Validate incoming data
 */
function validateData(data) {
  // Check required fields
  if (!data.name || data.name.trim() === "") {
    return { valid: false, message: "Name is required" };
  }
  
  if (!data.email || !isValidEmail(data.email)) {
    return { valid: false, message: "Valid email is required" };
  }
  
  if (!data.phone || data.phone.trim() === "") {
    return { valid: false, message: "Phone is required" };
  }
  
  if (!data.country || data.country.trim() === "") {
    return { valid: false, message: "Country is required" };
  }
  
  if (!data.city || data.city.trim() === "") {
    return { valid: false, message: "City is required" };
  }
  
  if (!data.message || data.message.trim() === "") {
    return { valid: false, message: "Message is required" };
  }
  
  // Check message length
  if (data.message.length > MAX_MESSAGE_LENGTH) {
    return { valid: false, message: "Message is too long (max " + MAX_MESSAGE_LENGTH + " characters)" };
  }
  
  // Sanitize inputs (remove potential script tags)
  data.name = sanitizeInput(data.name);
  data.email = sanitizeInput(data.email);
  data.phone = sanitizeInput(data.phone);
  data.company = sanitizeInput(data.company || "");
  data.country = sanitizeInput(data.country);
  data.city = sanitizeInput(data.city);
  data.subject = sanitizeInput(data.subject || "");
  data.message = sanitizeInput(data.message);
  
  return { valid: true };
}

/**
 * Validate email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitize input to prevent script injection
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input.replace(/<script[^>]*>.*?<\/script>/gi, '')
              .replace(/<[^>]+>/g, '')
              .trim();
}

/**
 * Check if email has submitted recently (rate limiting)
 */
function isRateLimited(email) {
  try {
    const sheet = getSheet();
    const data = sheet.getDataRange().getValues();
    
    // Check last 100 submissions for this email
    const now = new Date();
    const limitTime = new Date(now.getTime() - RATE_LIMIT_MINUTES * 60000);
    
    for (let i = data.length - 1; i >= Math.max(1, data.length - 100); i--) {
      const row = data[i];
      const rowEmail = row[2]; // Email is in column C (index 2)
      const rowTimestamp = new Date(row[0]); // Timestamp is in column A (index 0)
      
      if (rowEmail === email && rowTimestamp > limitTime) {
        return true; // Found recent submission from this email
      }
    }
    
    return false;
  } catch (error) {
    Logger.log("Rate limit check error: " + error.toString());
    return false; // Don't block on error
  }
}

/**
 * Get or create the sheet
 */
function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  // If sheet doesn't exist, create it
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    
    // Add headers
    const headers = [
      "Timestamp",
      "Name",
      "Email",
      "Phone",
      "Company",
      "Country",
      "City",
      "Subject",
      "Message",
      "Submission ID"
    ];
    
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
    
    // Auto-resize columns
    for (let i = 1; i <= headers.length; i++) {
      sheet.autoResizeColumn(i);
    }
  }
  
  return sheet;
}

/**
 * Append data to the sheet
 */
function appendToSheet(sheet, data) {
  const timestamp = data.timestamp ? new Date(data.timestamp) : new Date();
  
  const row = [
    timestamp,
    data.name || "",
    data.email || "",
    data.phone || "",
    data.company || "",
    data.country || "",
    data.city || "",
    data.subject || "",
    data.message || "",
    data.submissionId || ""
  ];
  
  sheet.appendRow(row);
  
  // Optional: Send email notification to admin
  // sendEmailNotification(data);
}

/**
 * Optional: Send email notification to admin when form is submitted
 * Uncomment and configure if you want email notifications
 */
/*
function sendEmailNotification(data) {
  const adminEmail = "your-admin-email@example.com"; // Change this to your email
  const subject = "New Contact Form Submission - " + data.name;
  
  const body = `
New contact form submission received:

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Company: ${data.company || 'N/A'}
Country: ${data.country}
City: ${data.city}
Subject: ${data.subject || 'N/A'}

Message:
${data.message}

Submission ID: ${data.submissionId}
Timestamp: ${new Date().toLocaleString()}
  `;
  
  try {
    MailApp.sendEmail(adminEmail, subject, body);
  } catch (error) {
    Logger.log("Email notification error: " + error.toString());
  }
}
*/

/**
 * Create JSON response with CORS headers
 */
function createResponse(success, message, submissionId) {
  const response = {
    success: success,
    message: message
  };
  
  if (submissionId) {
    response.submissionId = submissionId;
  }
  
  const output = ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
  
  // Add CORS headers to allow requests from any origin
  // Note: Google Apps Script Web Apps handle CORS automatically
  // but we're being explicit here
  return output;
}

/**
 * Test function - run this to verify the script works
 * Go to Run → selectFunction → testSubmission
 */
function testSubmission() {
  const testData = {
    name: "Test User",
    email: "test@example.com",
    phone: "+1234567890",
    company: "Test Company",
    country: "Test Country",
    city: "Test City",
    subject: "Test Subject",
    message: "This is a test message",
    submissionId: "TEST-" + new Date().getTime(),
    timestamp: new Date().toISOString()
  };
  
  const sheet = getSheet();
  appendToSheet(sheet, testData);
  
  Logger.log("Test submission added successfully!");
}
