const SECRET_CODE = "Abdullah loves Ruman"; // Change this to whatever secret code you want

(function enforcePasscode() {
  const userEntry = prompt("Enter the Password to view this page:");
  if (userEntry !== SECRET_CODE) {
    document.body.innerHTML = "<h2 style='color:white; text-align:center; margin-top:20%; font-family:sans-serif;'>Access Denied. Incorrect Code.</h2>";
    throw new Error("Unauthorized access.");
  }
})();

/* ============================================================
   LOVE OS — cinematic birthday experience
   script.js

   EASY-TO-EDIT CONFIG lives right below. Everything else is
   the reusable scene engine and should rarely need changes.
   ============================================================ */

const CONFIG = {

  recipientName: "Umme Ruman",

  /* ---- SCENE 3: photo slideshow -----------------------------
     Add / remove / reorder photos here. `duration` is how long
     that photo stays on screen (ms). `caption` is optional —
     leave it as "" for no caption. Put files in /images/. */
  photos: [
    { src: "images/photo01.JPG", caption: "The day it all began…",         duration: 4200 },
    { src: "images/photo02.JPG", caption: "A moment I never want to forget", duration: 4200 },
    { src: "images/photo03.JPG", caption: "Your smile, my favorite view",   duration: 4200 },
    { src: "images/photo04.JPG", caption: "My favorite notification will always be a picture from you. 📸💗", duration: 4200 },
    { src: "images/photo05.JPG", caption: "You have no idea how effortlessly you steal my attention", duration: 4200 },
    { src: "images/photo06.JPG", caption: "I want to pull you close, kiss your neck, and forget about the world for a while", duration: 4200 },
    { src: "images/photo07.JPG", caption: "You are my favorite distraction and my deepest desire", duration: 4200 },
    { src: "images/photo08.JPG", caption: "You make me smile in my problems", duration: 4200 },
    { src: "images/photo09.JPG", caption: "You are a great blessing from Allah to me", duration: 4200 },
    { src: "images/photo10.JPG", caption: "I love you soooo much", duration: 4200 },
  ],
  slideTransitionDuration: 1200, // ms crossfade between photos

  /* ---- SCENE 4: birthday message ---------------------------
     Each array item becomes its own paragraph. */
  message: {
    paragraphs: [
      "Umme Ruman, today is more than just another date on the calendar… it is the day someone truly special came into this world. 🎂✨ And somehow, knowing that you are here makes this day feel special to me too. ❤️",
      "Even though I can't be there beside you to celebrate your birthday, I hope these little moments on this screen can make you feel how much you mean to me. Distance may keep us apart for now, but it cannot stop me from remembering you, praying for you, and wishing the very best for you. 🌙💜",
      "On your birthday, I wish you a life filled with happiness that lasts, peace that stays in your heart, dreams that come true, and countless reasons to smile. May every difficult road become easier, every silent prayer find its way to an answer, and every new chapter of your life bring something beautiful. 🦋✨",
      "And perhaps, one day, In Sha Allah, this distance will only be a memory… and instead of wishing you through a screen, I'll be able to wish you right beside you. Until that day, keep smiling, keep shining, and always remember that somewhere, someone is genuinely praying for your happiness. ❤️🌙"
    ],
    revealDelay: 400,
    holdAfter: 2000,
  },

  /* ---- SCENE 5: Islamic dua ---------------------------------- */
  dua: {
    lines: [
      "May your life always be surrounded by happiness, peace, and barakah. May Allah protect your heart, ease every worry you carry, and fill your days with countless beautiful moments. 🤍✨",
      "May your dreams come closer to reality, may every difficult path become easier for you, and may you always find reasons to smile. May Allah bless you with success, peace of mind, and a future more beautiful than you imagine. 🌙🦋",
      "May Allah keep you protected wherever life takes you, surround you with people who genuinely care for you, and guide every step you take toward what is best for you. May every sincere prayer you make find its way to a beautiful answer. 🤲🏻✨",
      "And if it is written in our destiny and is خير for both of us, may Allah make this distance temporary. May we meet one day, at the right time and in the right way, and may He make our journey toward a beautiful halal marriage easy, blessed, and full of happiness. ❤️🌙",
      "Until that day, may you keep smiling, keep shining, and keep believing that the most beautiful things are sometimes worth waiting for. May Allah write a beautiful future for you… and, if it is meant to be, a beautiful future for us together. Ameen. 🤍"
    ],
    revealDelay: 500,
    holdAfter: 2500,
  },

  /* ---- Scene timings (ms) ---- */
  timings: {
    terminalLineTypeSpeed: 22,
    terminalLinePause: 260,
    terminalProgressDuration: 1600,
    terminalEndHold: 900,
    revealHold: 3200,
    sceneFadeBuffer: 250,
  },
};

/* ============================================================
   Small utilities
   ============================================================ */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/* ============================================================
   Audio Setup & Helpers
   ============================================================ */
const introAudio = document.getElementById("intro-audio");
const birthdayAudio = document.getElementById("birthday-audio");

if (introAudio) introAudio.volume = 0.75;
if (birthdayAudio) birthdayAudio.volume = 0.55;

function fadeOutAudio(audio, duration = 1000) {
  return new Promise((resolve) => {
    if (!audio) return resolve();
    const startVolume = audio.volume;
    const startTime = performance.now();

    function fade(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      audio.volume = startVolume * (1 - progress);

      if (progress < 1) {
        requestAnimationFrame(fade);
      } else {
        audio.pause();
        audio.currentTime = 0;
        audio.volume = startVolume;
        resolve();
      }
    }

    requestAnimationFrame(fade);
  });
}

function fadeInAudio(audio, targetVolume = 0.55, duration = 1200) {
  if (!audio) return;
  audio.volume = 0;
  audio.currentTime = 0;

  const playPromise = audio.play();

  if (playPromise !== undefined) {
    playPromise.catch((error) => {
      console.warn("Audio could not start:", error);
    });
  }

  const startTime = performance.now();

  function fade(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    audio.volume = targetVolume * progress;

    if (progress < 1) {
      requestAnimationFrame(fade);
    }
  }

  requestAnimationFrame(fade);
}

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

function qs(sel, ctx = document) { return ctx.querySelector(sel); }
function qsa(sel, ctx = document) { return [...ctx.querySelectorAll(sel)]; }

/* ============================================================
   Scene engine
   ============================================================ */
const SCENES = ["opening", "terminal", "reveal", "slideshow", "message", "dua", "finale"];

function showScene(name) {
  qsa(".scene").forEach((el) => el.classList.remove("active"));
  const target = qs(`#scene-${name}`);
  if (target) target.classList.add("active");
}

async function transitionToScene(name, holdBefore = 0) {
  if (holdBefore) await delay(holdBefore);
  showScene(name);
}

/* ============================================================
   Ambient particle field (canvas)
   ============================================================ */
function initParticles() {
  const canvas = qs("#bg-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let particles = [];
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const COUNT = window.innerWidth < 640 ? 34 : 60;
  const colors = ["rgba(242,87,141,0.55)", "rgba(155,107,255,0.55)", "rgba(232,201,163,0.4)"];

  function makeParticle() {
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.4,
      speed: Math.random() * 0.15 + 0.03,
      drift: (Math.random() - 0.5) * 0.15,
      color: colors[Math.floor(Math.random() * colors.length)],
      twinklePhase: Math.random() * Math.PI * 2,
    };
  }

  particles = Array.from({ length: COUNT }, makeParticle);

  let frame;
  function tick(t) {
    ctx.clearRect(0, 0, w, h);
    for (const p of particles) {
      p.y -= p.speed;
      p.x += p.drift;
      if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;

      const twinkle = 0.6 + 0.4 * Math.sin(t / 900 + p.twinklePhase);
      ctx.beginPath();
      ctx.fillStyle = p.color;
      ctx.globalAlpha = twinkle;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    frame = requestAnimationFrame(tick);
  }

  if (!prefersReducedMotion) {
    frame = requestAnimationFrame(tick);
  } else {
    tick(0);
    cancelAnimationFrame(frame);
  }
}

/* ============================================================
   SCENE 1 — LOVE_OS Terminal
   ============================================================ */
const TERMINAL_SCRIPT = [
  { text: "LOVE_OS v1.0", cls: "terminal-text-purple", pauseAfter: 500 },
  { text: "Initializing special protocol…", cls: "", pauseAfter: 400 },
  { text: "", raw: true },
  { text: "Loading memories…", cls: "terminal-text-dim" },
  { type: "progress", label: "" , pauseAfter: 500},
  { text: "", raw: true },
  { text: "Checking connection…", cls: "terminal-text-dim", pauseAfter: 350 },
  { text: "CONNECTED", cls: "terminal-text-purple", pauseAfter: 500 },
  { text: "", raw: true },
  { text: "Searching database…", cls: "terminal-text-dim", pauseAfter: 350 },
  { text: "Searching for someone special…", cls: "terminal-text-dim", pauseAfter: 700 },
  { text: "Match found.", cls: "terminal-text-gold", pauseAfter: 500 },
  { text: "", raw: true },
  { text: "Name:", cls: "terminal-text-dim" },
  { text: "UMME RUMAN", cls: "terminal-text-gold", pauseAfter: 450 },
  { text: "", raw: true },
  { text: "Birthday:", cls: "terminal-text-dim" },
  { text: "DETECTED", cls: "terminal-text-purple", pauseAfter: 450 },
  { text: "", raw: true },
  { text: "Status:", cls: "terminal-text-dim" },
  { text: "SPECIAL PERSON ❤", cls: "terminal-text-gold", pauseAfter: 450 },
];

async function typeText(el, text, speed) {
  for (let i = 0; i < text.length; i++) {
    el.textContent += text[i];
    if (!prefersReducedMotion) await delay(speed);
  }
}

async function typeLine(container, line, speed) {
  const span = document.createElement("span");
  if (line.cls) span.className = line.cls;
  container.appendChild(span);
  await typeText(span, line.text, speed);
  container.appendChild(document.createTextNode("\n"));
}

async function runProgressBar(container, duration) {
  const wrap = document.createElement("span");
  wrap.className = "terminal-text-purple";
  container.appendChild(wrap);

  const totalBlocks = 20;
  const stepTime = duration / totalBlocks;
  for (let i = 1; i <= totalBlocks; i++) {
    wrap.textContent = "█".repeat(i) + "░".repeat(totalBlocks - i) + `  ${Math.round((i / totalBlocks) * 100)}%`;
    if (!prefersReducedMotion) await delay(stepTime);
  }
  container.appendChild(document.createTextNode("\n"));
}

async function runTerminal() {
  const container = qs("#terminal-text");
  if (!container) return;
  container.textContent = "";
  const speed = CONFIG.timings.terminalLineTypeSpeed;

  for (const line of TERMINAL_SCRIPT) {
    if (line.raw) {
      container.appendChild(document.createTextNode("\n"));
      continue;
    }
    if (line.type === "progress") {
      await runProgressBar(container, CONFIG.timings.terminalProgressDuration);
    } else {
      await typeLine(container, line, speed);
    }
    if (line.pauseAfter) await delay(line.pauseAfter);
    else await delay(CONFIG.timings.terminalLinePause);

    const body = qs("#terminal-body");
    if (body) body.scrollTop = body.scrollHeight;
  }

  await delay(CONFIG.timings.terminalEndHold);
}

/* ============================================================
   SCENE 3 — Photo slideshow
   ============================================================ */
function buildSlideshowDots() {
  const wrap = qs("#slide-progress");
  if (!wrap) return [];
  wrap.innerHTML = "";
  CONFIG.photos.forEach(() => {
    const dot = document.createElement("span");
    dot.innerHTML = "<i></i>";
    wrap.appendChild(dot);
  });
  return qsa("#slide-progress span i");
}

async function startSlideshow() {
  const stage = qs("#slideshow-stage");
  const caption = qs("#slide-caption");
  if (!stage) return;
  stage.innerHTML = "";
  const dots = buildSlideshowDots();

  const slideEls = CONFIG.photos.map((photo, i) => {
    const div = document.createElement("div");
    div.className = "slide" + (i % 2 === 1 ? " zoom-out" : "");
    const img = document.createElement("img");
    img.src = photo.src;
    img.alt = photo.caption || `Photo ${i + 1}`;
    img.loading = "eager";
    img.onerror = () => { div.style.background = "linear-gradient(135deg, var(--bg-plum), var(--bg-plum-2))"; };
    div.appendChild(img);
    stage.appendChild(div);
    return div;
  });

  for (let i = 0; i < CONFIG.photos.length; i++) {
    const photo = CONFIG.photos[i];
    slideEls.forEach((el, idx) => el.classList.toggle("active", idx === i));
    if (caption) caption.textContent = photo.caption || "";

    const dotFill = dots[i];
    if (dotFill) {
      dotFill.style.transition = "none";
      dotFill.style.width = "0%";
      void dotFill.offsetWidth;
      dotFill.style.transition = `width ${photo.duration}ms linear`;
      dotFill.style.width = "100%";
    }

    await delay(photo.duration);
  }

  await delay(CONFIG.slideTransitionDuration);
}

/* ============================================================
   SCENE 4 — Message (progressive reveal)
   ============================================================ */
async function showMessage() {
  const container = qs("#message-text");
  if (!container) return;
  container.innerHTML = "";

  for (const text of CONFIG.message.paragraphs) {
    const p = document.createElement("p");
    p.textContent = text;
    container.appendChild(p);

    void p.offsetWidth;
    p.classList.add("show");

    const wordCount = text.trim().split(/\s+/).length;
    const readingTime = 5000 + (wordCount * 160);

    await delay(readingTime);
  }

  await delay(3500);
}

/* ============================================================
   SCENE 5 — Dua (progressive reveal)
   ============================================================ */
async function showDua() {
  const container = qs("#dua-text");
  if (!container) return;
  container.innerHTML = "";

  for (const text of CONFIG.dua.lines) {
    const p = document.createElement("p");
    p.textContent = text;
    container.appendChild(p);

    void p.offsetWidth;
    p.classList.add("show");

    const wordCount = text.trim().split(/\s+/).length;
    const readingTime = 6000 + (wordCount * 170);

    await delay(readingTime);
  }

  await delay(4500);
}

/* ============================================================
   SCENE 6 — Finale
   ============================================================ */
function showFinale() {
  const canvas = qs("#finale-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const colors = ["#f2578d", "#9b6bff", "#e8c9a3", "#ff9dc0"];
  let sparks = [];

  function burst(x, y) {
    const count = prefersReducedMotion ? 0 : 26;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = Math.random() * 2.6 + 1.2;
      sparks.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
  }

  function scheduleBursts() {
    const points = [
      [0.3, 0.35], [0.7, 0.3], [0.5, 0.5], [0.25, 0.6], [0.75, 0.55],
    ];
    points.forEach(([fx, fy], i) => {
      setTimeout(() => burst(w * fx, h * fy), i * 700);
    });
    setTimeout(scheduleBursts, points.length * 700 + 2600);
  }

  function tick() {
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = "lighter";
    sparks.forEach((s) => {
      s.x += s.vx;
      s.y += s.vy;
      s.vy += 0.02;
      s.life -= 0.012;
      ctx.beginPath();
      ctx.fillStyle = s.color;
      ctx.globalAlpha = Math.max(s.life, 0);
      ctx.arc(s.x, s.y, 2.2, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
    sparks = sparks.filter((s) => s.life > 0);
    requestAnimationFrame(tick);
  }

  scheduleBursts();
  requestAnimationFrame(tick);
}

/* ============================================================
   Master sequence
   ============================================================ */
async function runExperience() {
  await transitionToScene("terminal");
  await runTerminal();

  await transitionToScene("reveal");

  // Fade out hacking music & fade in romantic birthday music
  await fadeOutAudio(introAudio, 1000);
  fadeInAudio(birthdayAudio, 0.55, 1200);

  await delay(CONFIG.timings.revealHold);

  await transitionToScene("slideshow");
  await startSlideshow();

  await transitionToScene("message");
  await showMessage();

  await transitionToScene("dua");
  await showDua();

  await transitionToScene("finale");
  showFinale();
}

/* ============================================================
   Boot
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  initParticles();
  showScene("opening");

  const beginBtn = qs("#begin-btn");

  if (beginBtn) {
    beginBtn.addEventListener("click", () => {
      beginBtn.disabled = true;

      // UNLOCK birthday audio silently so modern browsers allow play later
      if (birthdayAudio) {
        birthdayAudio.play().then(() => {
          birthdayAudio.pause();
          birthdayAudio.currentTime = 0;
        }).catch((e) => console.warn("Birthday unlock error:", e));
      }

      // Start intro music
      if (introAudio) {
        introAudio.currentTime = 0;
        introAudio.volume = 0.75;
        const playPromise = introAudio.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => console.warn("Intro audio start error:", error));
        }
      }

      runExperience();
    }, { once: true });
  }
});
