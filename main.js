(function () {
  const config = window.INVITE_CONFIG || {};

  function buildNavigateUrl(event) {
    if (event.mapUrl && event.mapUrl.trim()) {
      return event.mapUrl.trim();
    }
    const query = (event.address || event.venueName || "").trim();
    if (!query) return "";
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
  }

  function buildCalendarUrl(event) {
    if (!event?.start || !event?.end) return "#";
    const toCal = (iso) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: event.calendarTitle || "Wedding Event",
      dates: `${toCal(event.start)}/${toCal(event.end)}`,
      details: "Prudhvi & Harini — digital invitation",
    });
    const loc = (event.address || event.venueName || "").trim();
    if (loc) params.set("location", loc);
    return `https://calendar.google.com/calendar/render?${params}`;
  }

  const TZ = "Asia/Kolkata";

  function eventWeekday(iso) {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("en-IN", {
      weekday: "long",
      timeZone: TZ,
    });
  }

  function eventTimeLabel(iso) {
    if (!iso) return "";
    return new Date(iso).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: TZ,
    });
  }

  function setupEventDate(card, event) {
    if (!card || !event?.start) return;

    const tile = card.querySelector(".date-tile");
    const monthEl = card.querySelector(".date-tile__month");
    const dayEl = card.querySelector(".date-tile__day");
    const yearEl = card.querySelector(".date-tile__year");
    const timeTextEl = card.querySelector(".date-showcase__time-text");
    const start = new Date(event.start);

    if (tile) {
      tile.dateTime = event.start.slice(0, 10);
    }
    if (monthEl) {
      monthEl.textContent = start.toLocaleDateString("en-IN", { month: "long", timeZone: TZ });
    }
    if (dayEl) {
      dayEl.textContent = start.toLocaleDateString("en-IN", { day: "numeric", timeZone: TZ });
    }
    if (yearEl) {
      yearEl.textContent = start.toLocaleDateString("en-IN", { year: "numeric", timeZone: TZ });
    }
    if (timeTextEl) {
      timeTextEl.textContent = eventTimeLabel(event.start);
    }
  }

  function setupEvent(prefix, event) {
    if (!event) return;

    const card = document.getElementById(prefix);
    const venueNameEl = document.getElementById(`${prefix}-venue-name`);
    const landmarkEl = document.getElementById(`${prefix}-landmark`);
    const addressEl = document.getElementById(`${prefix}-address`);
    const noteEl = document.getElementById(`${prefix}-venue-note`);
    const weekdayEl = document.getElementById(`${prefix}-weekday`);
    const navigateEl = document.getElementById(`${prefix}-navigate`);
    const calendarEl = document.getElementById(`${prefix}-calendar`);
    const copyEl = document.getElementById(`${prefix}-copy`);
    const hintEl = document.getElementById(`${prefix}-map-hint`);

    setupEventDate(card, event);

    if (weekdayEl && event.start) {
      weekdayEl.textContent = eventWeekday(event.start);
    }

    if (venueNameEl && event.venueName) {
      venueNameEl.textContent = event.venueName;
    }

    if (landmarkEl) {
      const landmark = (event.landmark || "").trim();
      if (landmark) {
        landmarkEl.textContent = landmark;
        landmarkEl.hidden = false;
      } else {
        landmarkEl.hidden = true;
      }
    }

    if (noteEl && event.venueNote) {
      noteEl.textContent = event.venueNote;
    }

    const address = (event.address || "").trim();
    if (addressEl) {
      if (address) {
        addressEl.textContent = address;
        addressEl.hidden = false;
      } else {
        addressEl.hidden = true;
      }
    }

    const navUrl = buildNavigateUrl(event);
    if (navigateEl) {
      if (navUrl) {
        navigateEl.href = navUrl;
        navigateEl.hidden = false;
      } else {
        navigateEl.hidden = true;
      }
    }

    if (calendarEl) {
      calendarEl.href = buildCalendarUrl(event);
    }

    if (copyEl) {
      if (address) {
        copyEl.hidden = false;
        copyEl.addEventListener("click", async () => {
          try {
            await navigator.clipboard.writeText(address);
            const label = copyEl.textContent;
            copyEl.textContent = "Copied!";
            setTimeout(() => {
              copyEl.textContent = label;
            }, 2000);
          } catch {
            copyEl.textContent = "Copy failed";
          }
        });
      } else {
        copyEl.hidden = true;
      }
    }

    if (hintEl) {
      hintEl.hidden = Boolean(navUrl);
    }
  }

  setupEvent("wedding", config.wedding);
  setupEvent("reception", config.reception);

  /* Countdown */
  const countdownTarget = config.countdownTarget
    ? new Date(config.countdownTarget)
    : new Date("2026-06-24T20:57:00+05:30");

  const daysEl = document.getElementById("timer-days");
  const hoursEl = document.getElementById("timer-hours");
  const minsEl = document.getElementById("timer-mins");
  const countdownSection = document.getElementById("countdown");
  const countdownLabel = document.getElementById("countdown-date-label");

  if (countdownLabel && config.countdownLabel) {
    countdownLabel.textContent = config.countdownLabel;
  }

  function pad(n) {
    return String(Math.max(0, n)).padStart(2, "0");
  }

  function updateTimer() {
    const diff = countdownTarget.getTime() - Date.now();

    if (diff <= 0) {
      if (daysEl) daysEl.textContent = "00";
      if (hoursEl) hoursEl.textContent = "00";
      if (minsEl) minsEl.textContent = "00";
      const eyebrow = countdownSection?.querySelector(".countdown__eyebrow");
      if (eyebrow) eyebrow.textContent = "Today is our wedding day!";
      return;
    }

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);

    if (daysEl) daysEl.textContent = pad(days);
    if (hoursEl) hoursEl.textContent = pad(hours);
    if (minsEl) minsEl.textContent = pad(mins);
  }

  if (!Number.isNaN(countdownTarget.getTime())) {
    updateTimer();
    setInterval(updateTimer, 1000);
  }

  /* ——— Impressive opening experience ——— */
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const intro = document.getElementById("intro");
  const inviteShell = document.getElementById("invite-shell");
  let opened = false;

  function fireConfetti() {
    const canvas = document.getElementById("confetti");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const colors = ["#c9a962", "#dfc07a", "#f5e6c0", "#8a7344", "#1a1a1a", "#f0e0b8"];
    const pieces = Array.from({ length: 100 }, () => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height * 0.4,
      w: 4 + Math.random() * 5,
      h: 8 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 3,
      vy: 2 + Math.random() * 4,
      rot: Math.random() * 360,
      vr: (Math.random() - 0.5) * 10,
    }));
    let frame = 0;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05;
        p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      frame += 1;
      if (frame < 130) requestAnimationFrame(draw);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    draw();
  }

  function initSparkles() {
    const el = document.getElementById("sparkles");
    if (!el) return;
    for (let i = 0; i < 28; i += 1) {
      const s = document.createElement("span");
      s.className = "sparkle";
      s.style.left = `${Math.random() * 100}%`;
      s.style.top = `${Math.random() * 100}%`;
      s.style.animationDelay = `${Math.random() * 4}s`;
      s.style.animationDuration = `${2 + Math.random() * 3}s`;
      el.appendChild(s);
    }
  }

  function initIntroParticles() {
    const el = document.getElementById("intro-particles");
    if (!el) return;
    for (let i = 0; i < 20; i += 1) {
      const p = document.createElement("span");
      p.className = "intro__particle";
      p.style.left = `${Math.random() * 100}%`;
      p.style.top = `${Math.random() * 100}%`;
      p.style.animationDelay = `${Math.random() * 3}s`;
      el.appendChild(p);
    }
  }

  function initScrollReveal() {
    const items = document.querySelectorAll(".reveal");
    if (prefersReducedMotion) {
      items.forEach((el) => el.classList.add("reveal--in"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal--in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
    );
    items.forEach((el) => observer.observe(el));
  }

  function openInvite() {
    if (opened) return;
    opened = true;
    document.body.style.overflow = "";

    if (!prefersReducedMotion) fireConfetti();

    if (intro) {
      intro.classList.add("intro--out");
      setTimeout(() => intro.remove(), 900);
    }

    if (inviteShell) {
      inviteShell.hidden = false;
      requestAnimationFrame(() => inviteShell.classList.add("invite-shell--visible"));
    }

    initScrollReveal();
  }

  if (intro && !prefersReducedMotion) {
    document.body.style.overflow = "hidden";
    initIntroParticles();
    intro.addEventListener("click", openInvite);
    intro.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openInvite();
      }
    });
  } else {
    if (intro) intro.remove();
    if (inviteShell) {
      inviteShell.hidden = false;
      inviteShell.classList.add("invite-shell--visible");
    }
    initScrollReveal();
  }

  initSparkles();

  const petalsContainer = document.querySelector(".petals");
  if (petalsContainer && !prefersReducedMotion) {
    for (let i = 0; i < 14; i += 1) {
      const petal = document.createElement("span");
      petal.className = "petal";
      petal.style.left = `${Math.random() * 100}%`;
      petal.style.animationDuration = `${14 + Math.random() * 12}s`;
      petal.style.animationDelay = `${Math.random() * 10}s`;
      petal.style.width = `${6 + Math.random() * 8}px`;
      petal.style.height = petal.style.width;
      petalsContainer.appendChild(petal);
    }
  }

  window.addEventListener(
    "resize",
    () => {
      const canvas = document.getElementById("confetti");
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    },
    { passive: true }
  );
})();
