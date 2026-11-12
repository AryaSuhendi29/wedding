/**
 * ============================================================================
 * GOOGLE APPS SCRIPT — REAL-TIME WEDDING RSVP & WISHES BACKEND
 * Bound to Spreadsheet: "Wedding RSVP & Wishes Database"
 * ============================================================================
 */

const SHEET_NAME = "RSVPs";

/**
 * Handles GET requests to fetch all submitted Wedding Wishes in reverse chronological order.
 */
function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      return createJsonResponse({ status: "error", message: "Sheet not found", wishes: [] });
    }

    const lastRow = sheet.getLastRow();
    if (lastRow < 2) {
      return createJsonResponse({ status: "success", wishes: [] });
    }

    // Columns: [Timestamp, Full Name, Attendance, Guest Count, Wishes]
    const values = sheet.getRange(2, 1, lastRow - 1, 5).getValues();
    const wishes = values
      .filter((row) => row[1] && row[4])
      .map((row) => ({
        timestamp: row[0],
        fullName: String(row[1]),
        attendance: String(row[2] || "Attending"),
        guestCount: Number(row[3] || 0),
        wishes: String(row[4])
      }))
      .reverse(); // Newest wishes appear first

    return createJsonResponse({ status: "success", wishes: wishes });
  } catch (err) {
    return createJsonResponse({ status: "error", message: err.toString(), wishes: [] });
  }
}

/**
 * Handles POST requests from the Wedding Invitation RSVP form.
 * Appends a new row in real-time with thread-safe locking.
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const rawData = e.postData ? e.postData.contents : "{}";
    const data = JSON.parse(rawData);

    const fullName = (data.fullName || "").trim();
    const attendance = (data.attendance || "Attending").trim();
    const guestCount = attendance === "Attending" ? Number(data.guestCount || 1) : 0;
    const wishes = (data.wishes || "").trim();

    if (!fullName || !wishes) {
      return createJsonResponse({ status: "error", message: "Full Name and Wishes are required." });
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(["Timestamp", "Full Name", "Attendance", "Guest Count", "Wishes"]);
    }

    sheet.appendRow([new Date(), fullName, attendance, guestCount, wishes]);

    return createJsonResponse({
      status: "success",
      message: "RSVP recorded successfully."
    });
  } catch (err) {
    return createJsonResponse({ status: "error", message: err.toString() });
  } finally {
    lock.releaseLock();
  }
}

function createJsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
