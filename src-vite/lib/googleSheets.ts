// Google Sheets integration for contact form submissions
import { ENV } from "./env";

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  country: string;
  city: string;
  subject?: string;
  message: string;
}

export interface GoogleSheetsResponse {
  success: boolean;
  message: string;
  submissionId?: string;
}

/**
 * Generate a unique submission ID
 */
function generateSubmissionId(): string {
  return `SUB-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Submit contact form data to Google Sheets via Apps Script Web App
 * @param formData - The contact form data
 * @returns Promise resolving to the submission response
 * @throws Error if submission fails or web app URL is not configured
 */
export const submitToGoogleSheets = async (
  formData: ContactFormData
): Promise<GoogleSheetsResponse> => {
  const webAppUrl = ENV.GOOGLE_SHEETS_WEB_APP_URL;

  if (!webAppUrl) {
    throw new Error(
      "Google Sheets Web App URL not configured. Please set VITE_GOOGLE_SHEETS_WEB_APP_URL in environment variables."
    );
  }

  // Add timestamp and submission ID
  const submissionData = {
    ...formData,
    timestamp: new Date().toISOString(),
    submissionId: generateSubmissionId(),
  };

  try {
    // Send as URLSearchParams to avoid CORS preflight
    const params = new URLSearchParams();
    Object.entries(submissionData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });

    const response = await fetch(webAppUrl, {
      method: "POST",
      body: params,
      redirect: "follow",
    });

    // Check if request was successful
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    return {
      success: result.success || true,
      message: result.message || "Form submitted successfully",
      submissionId: submissionData.submissionId,
    };
  } catch (error) {
    console.error("Google Sheets submission error:", error);
    
    // Check if it's a network error
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        "Network error. Please check your internet connection and try again."
      );
    }

    throw new Error(
      "Failed to submit form. Please try again or contact us directly."
    );
  }
};

/**
 * Submit contact form with retry logic
 * @param formData - The contact form data
 * @param maxRetries - Maximum number of retry attempts (default: 2)
 * @returns Promise resolving to the submission response
 */
export const submitToGoogleSheetsWithRetry = async (
  formData: ContactFormData,
  maxRetries: number = 2
): Promise<GoogleSheetsResponse> => {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await submitToGoogleSheets(formData);
    } catch (error) {
      lastError = error as Error;
      console.error(`Submission attempt ${attempt + 1} failed:`, error);

      // Don't retry if it's a configuration error
      if (error instanceof Error && error.message.includes("not configured")) {
        throw error;
      }

      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  // All retries failed
  throw lastError || new Error("Failed to submit form after multiple attempts");
};
