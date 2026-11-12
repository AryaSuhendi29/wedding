/**
 * ============================================================================
 * WEDDING INVITATION CONFIGURATION
 * Edit the values below to update the entire website automatically.
 * ============================================================================
 */
const WEDDING_CONFIG = {
  // Couple Details
  groom: {
    fullName: "XXX",
    shortName: "XXX",
    father: "XXX",
    mother: "XXX",
    instagram: "@xxx",
    photo: "assets/images/groom.jpg"
  },
  bride: {
    fullName: "XXX",
    shortName: "XXX",
    father: "XXX",
    mother: "XXX",
    instagram: "@xxx",
    photo: "assets/images/bride.jpg"
  },

  // Event Date & Time
  // Format for countdown: ISO 8601 string (YYYY-MM-DDTHH:MM:SS+07:00)
  // Replace "2026-12-20T10:00:00+07:00" with your actual wedding ISO date
  eventDateISO: "2026-12-20T10:00:00+07:00",
  eventEndDateISO: "2026-12-20T14:00:00+07:00",
  displayDate: "XXX", // e.g., "Sunday, December 20, 2026"
  displayTime: "XXX", // e.g., "10:00 AM – 02:00 PM WIB"

  // Venue Details
  venue: {
    name: "XXX",
    address: "XXX",
    // Google Maps Direct Link (opens when venue address is clicked)
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=XXX",
    // Optional: Google Maps Embed iframe src URL
    googleMapsEmbedUrl: "https://maps.google.com/maps?q=Jakarta&t=&z=14&ie=UTF8&iwloc=&output=embed"
  },

  // Google Calendar Save-The-Date Details
  calendar: {
    title: "The Wedding of XXX & XXX",
    description: "We joyfully invite you to celebrate the wedding of XXX & XXX. Your presence and blessings mean the world to us."
  },

  // Gift & Registry Details
  gifts: {
    sectionTitle: "Wanna give us some gifts?",
    subtitle: "Your presence at our wedding is the greatest gift of all. However, should you wish to honor us with a gift, a contribution or parcel would be warmly appreciated.",
    bankName: "XXX",
    accountNumber: "XXX",
    accountHolder: "XXX",
    deliveryRecipient: "XXX",
    deliveryPhone: "XXX",
    deliveryAddress: "XXX"
  },

  // Media Assets (Placed in folder: XXX -> mapped to assets/)
  media: {
    heroPoster: "assets/images/hero-poster.jpg",
    heroVideo: "assets/video/prewedding.mp4",
    backgroundMusic: "assets/audio/wedding-theme.mp3",
    gallery: [
      { src: "assets/images/gallery-1.jpg", caption: "Chapter I — The Beginning" },
      { src: "assets/images/gallery-2.jpg", caption: "Chapter II — Growing Together" },
      { src: "assets/images/gallery-3.jpg", caption: "Chapter III — Forever Starts Here" },
      { src: "assets/images/gallery-4.jpg", caption: "Chapter IV — Endless Love" }
    ]
  },

  // Google Sheets & Apps Script Web App URL
  // Paste your deployed Google Apps Script Web App URL below:
  googleAppsScriptUrl: "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL"
};
