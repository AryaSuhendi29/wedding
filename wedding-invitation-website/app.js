/**
 * Wedding Invitation Interactive Controller
 * Handles config hydration, countdown, Google Calendar/Maps deep links,
 * real-time RSVP submission to Google Sheets, and live Wedding Wishes wall.
 */
document.addEventListener("DOMContentLoaded", () => {
  hydrateConfig();
  initGuestUrlParam();
  initCoverAndAudio();
  initCountdown();
  initCalendarAndMaps();
  initGallery();
  initRsvpForm();
  loadWishes();
});

// Helper to resolve dot-notation keys from WEDDING_CONFIG
function getConfigValue(path) {
  return path.split(".").reduce((obj, key) => (obj && obj[key] !== undefined ? obj[key] : ""), WEDDING_CONFIG);
}

// 1. Hydrate all [data-config] elements
function hydrateConfig() {
  document.title = `The Wedding of ${WEDDING_CONFIG.groom.shortName} & ${WEDDING_CONFIG.bride.shortName}`;

  document.querySelectorAll("[data-config]").forEach((el) => {
    const key = el.getAttribute("data-config");
    const val = getConfigValue(key);
    if (val) el.textContent = val;
  });

  const groomImg = document.getElementById("groom-photo");
  const brideImg = document.getElementById("bride-photo");
  if (groomImg && WEDDING_CONFIG.groom.photo) groomImg.src = WEDDING_CONFIG.groom.photo;
  if (brideImg && WEDDING_CONFIG.bride.photo) brideImg.src = WEDDING_CONFIG.bride.photo;

  const heroVideo = document.getElementById("hero-video");
  if (heroVideo && WEDDING_CONFIG.media.heroVideo) {
    heroVideo.poster = WEDDING_CONFIG.media.heroPoster;
    heroVideo.src = WEDDING_CONFIG.media.heroVideo;
  }

  const bgMusic = document.getElementById("bg-music");
  if (bgMusic && WEDDING_CONFIG.media.backgroundMusic) {
    bgMusic.src = WEDDING_CONFIG.media.backgroundMusic;
  }
}

// Optional personalized URL parameter (?to=Guest+Name)
function initGuestUrlParam() {
  const params = new URLSearchParams(window.location.search);
  const guestName = params.get("to");
  if (guestName && guestName.trim()) {
    const badge = document.getElementById("guest-welcome-badge");
    const nameEl = document.getElementById("invited-guest-name");
    const inputEl = document.getElementById("guest-name");
    if (badge && nameEl) {
      nameEl.textContent = guestName.trim();
      badge.classList.remove("hidden");
    }
    if (inputEl && !inputEl.value) {
      inputEl.value = guestName.trim();
    }
  }
}

// 2. Opening Cover & Background Music Control
function initCoverAndAudio() {
  const overlay = document.getElementById("cover-overlay");
  const openBtn = document.getElementById("open-invitation-btn");
  const musicBtn = document.getElementById("music-toggle");
  const musicBars = document.getElementById("music-bars");
  const audio = document.getElementById("bg-music");

  document.body.classList.add("locked");

  const playMusic = () => {
    if (!audio || !audio.src) return;
    audio.play().then(() => {
      musicBars.classList.add("playing");
    }).catch(() => {
      // Autoplay blocked or missing audio file
      musicBars.classList.remove("playing");
    });
  };

  openBtn.addEventListener("click", () => {
    overlay.classList.add("opened");
    document.body.classList.remove("locked");
    playMusic();
    triggerRevealCheck();
  });

  musicBtn.addEventListener("click", () => {
    if (audio.paused) {
      playMusic();
    } else {
      audio.pause();
      musicBars.classList.remove("playing");
    }
  });

  // Intersection Observer for smooth fade-in transitions
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

  function triggerRevealCheck() {
    document.querySelectorAll(".reveal").forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) el.classList.add("visible");
    });
  }
}

// 3. Live Countdown Timer
function initCountdown() {
  const targetTime = new Date(WEDDING_CONFIG.eventDateISO).getTime();
  const daysEl = document.getElementById("cd-days");
  const hoursEl = document.getElementById("cd-hours");
  const minsEl = document.getElementById("cd-minutes");
  const secsEl = document.getElementById("cd-seconds");

  function update() {
    const now = Date.now();
    const diff = Math.max(0, targetTime - now);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    daysEl.textContent = String(days).padStart(2, "0");
    hoursEl.textContent = String(hours).padStart(2, "0");
    minsEl.textContent = String(minutes).padStart(2, "0");
    secsEl.textContent = String(seconds).padStart(2, "0");
  }

  update();
  setInterval(update, 1000);
}

// 4. Google Calendar Save-The-Date & Google Maps Venue Links
function initCalendarAndMaps() {
  const calLink = document.getElementById("save-the-date-link");
  const mapLink = document.getElementById("venue-map-link");
  const mapIframe = document.getElementById("google-map-iframe");

  // Format ISO dates to Google Calendar UTC format (YYYYMMDDTHHMMSSZ)
  const formatGCalDate = (iso) => {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "20261220T030000Z";
    return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  };

  const startStr = formatGCalDate(WEDDING_CONFIG.eventDateISO);
  const endStr = formatGCalDate(WEDDING_CONFIG.eventEndDateISO);
  const locationText = `${WEDDING_CONFIG.venue.name}, ${WEDDING_CONFIG.venue.address}`;

  const gcalParams = new URLSearchParams({
    action: "TEMPLATE",
    text: WEDDING_CONFIG.calendar.title,
    dates: `${startStr}/${endStr}`,
    details: WEDDING_CONFIG.calendar.description,
    location: locationText
  });

  if (calLink) {
    calLink.href = `https://calendar.google.com/calendar/render?${gcalParams.toString()}`;
  }

  if (mapLink) {
    mapLink.href = WEDDING_CONFIG.venue.googleMapsUrl;
  }

  if (mapIframe && WEDDING_CONFIG.venue.googleMapsEmbedUrl) {
    mapIframe.src = WEDDING_CONFIG.venue.googleMapsEmbedUrl;
  }

  // Copy buttons for Gift section
  document.querySelectorAll(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-copy-target");
      const targetEl = document.getElementById(targetId);
      if (!targetEl) return;
      navigator.clipboard.writeText(targetEl.textContent.trim()).then(() => {
        const orig = btn.textContent;
        btn.textContent = "Copied!";
        setTimeout(() => (btn.textContent = orig), 2000);
      });
    });
  });
}

// 5. Render Pre-Wedding Gallery
function initGallery() {
  const grid = document.getElementById("gallery-grid");
  if (!grid || !Array.isArray(WEDDING_CONFIG.media.gallery)) return;

  grid.innerHTML = WEDDING_CONFIG.media.gallery
    .map(
      (item, idx) => `
      <figure class="gallery-item">
        <img src="${item.src}" alt="${item.caption}" loading="lazy"
          onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22533%22 viewBox=%220 0 400 533%22><rect fill=%22%23E6DEC8%22 width=%22400%22 height=%22533%22/><text x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22Georgia,serif%22 font-size=%2220%22 fill=%22%238A7963%22>Photo ${idx + 1}</text></svg>'" />
      </figure>
    `
    )
    .join("");
}

// 6. RSVP Submission -> Real-Time Sync to Google Sheets & Wishes Wall
const DEFAULT_WISHES = [
  {
    fullName: "Ade Fitriyani",
    attendance: "Attending",
    wishes: "Wishing you both a lifetime of happiness!"
  }
];

function initRsvpForm() {
  const form = document.getElementById("rsvp-form");
  const attendanceRadios = document.querySelectorAll('input[name="attendance"]');
  const guestCountGroup = document.getElementById("guest-count-group");
  const submitBtn = document.getElementById("rsvp-submit-btn");
  const submitText = document.getElementById("submit-btn-text");
  const feedbackEl = document.getElementById("rsvp-feedback");

  attendanceRadios.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      guestCountGroup.style.display = e.target.value === "Not Attending" ? "none" : "block";
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    feedbackEl.textContent = "";
    feedbackEl.className = "form-feedback";

    const fullName = document.getElementById("guest-name").value.trim();
    const attendance = document.querySelector('input[name="attendance"]:checked').value;
    const guestCount = attendance === "Attending" ? document.getElementById("guest-count").value : "0";
    const wishes = document.getElementById("guest-wishes").value.trim();

    if (!fullName || !wishes) {
      feedbackEl.textContent = "Please fill in your full name and wedding wishes.";
      feedbackEl.classList.add("error");
      return;
    }

    const payload = { fullName, attendance, guestCount, wishes };

    submitBtn.disabled = true;
    submitText.textContent = "Sending RSVP...";

    try {
      const scriptUrl = WEDDING_CONFIG.googleAppsScriptUrl;

      // Immediately update UI optimistically & save locally as fallback cache
      saveLocalWish(payload);
      prependWishCard(payload);

      if (scriptUrl && scriptUrl !== "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL") {
        await fetch(scriptUrl, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(payload)
        });
        // Re-fetch authoritative sheet rows after short delay
        setTimeout(loadWishes, 1500);
      }

      feedbackEl.textContent = "Thank you! Your RSVP and wishes have been recorded.";
      feedbackEl.classList.add("success");
      form.reset();
      guestCountGroup.style.display = "block";
    } catch (err) {
      feedbackEl.textContent = "Saved locally, though network sync encountered an issue. Please try again.";
      feedbackEl.classList.add("error");
    } finally {
      submitBtn.disabled = false;
      submitText.textContent = "Send RSVP & Wishes";
    }
  });
}

// 7. Load & Render Real-Time Wedding Wishes from Google Sheets
async function loadWishes() {
  const scriptUrl = WEDDING_CONFIG.googleAppsScriptUrl;
  let wishes = getLocalWishes();

  if (scriptUrl && scriptUrl !== "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL") {
    try {
      const res = await fetch(`${scriptUrl}?action=getWishes&t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.wishes) && data.wishes.length > 0) {
          wishes = data.wishes;
          localStorage.setItem("wedding_wishes_cache", JSON.stringify(wishes));
        }
      }
    } catch (_) {
      // Fallback gracefully to cached/default wishes if offline
    }
  }

  renderWishesList(wishes);
}

function getLocalWishes() {
  try {
    const cached = JSON.parse(localStorage.getItem("wedding_wishes_cache"));
    return Array.isArray(cached) && cached.length ? cached : [...DEFAULT_WISHES];
  } catch {
    return [...DEFAULT_WISHES];
  }
}

function saveLocalWish(item) {
  const current = getLocalWishes();
  current.unshift(item);
  localStorage.setItem("wedding_wishes_cache", JSON.stringify(current));
}

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildWishHTML(item) {
  return `
    <article class="wish-card">
      <div class="wish-header">
        <span class="wish-author">${escapeHTML(item.fullName)}</span>
        <span class="wish-badge">${escapeHTML(item.attendance)}</span>
      </div>
      <p class="wish-message">&ldquo;${escapeHTML(item.wishes)}&rdquo;</p>
    </article>
  `;
}

function renderWishesList(list) {
  const container = document.getElementById("wishes-list");
  const countEl = document.getElementById("wishes-count");
  if (!container) return;

  container.innerHTML = list.map(buildWishHTML).join("");
  if (countEl) countEl.textContent = list.length;
}

function prependWishCard(item) {
  const container = document.getElementById("wishes-list");
  const countEl = document.getElementById("wishes-count");
  if (!container) return;

  container.insertAdjacentHTML("afterbegin", buildWishHTML(item));
  if (countEl) {
    countEl.textContent = container.querySelectorAll(".wish-card").length;
  }
}
