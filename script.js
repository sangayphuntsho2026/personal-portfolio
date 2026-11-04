document.addEventListener("DOMContentLoaded", () => {

  // 1. MOBILE MENU
  const menuBtn = document.getElementById("menu-btn");
  const navLinks = document.getElementById("nav-links");

  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      menuBtn.textContent = isOpen ? "✕" : "☰";
      menuBtn.setAttribute("aria-expanded", isOpen);
    });

    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuBtn.textContent = "☰";
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  // 2. DARK AND LIGHT THEME
  const themeBtn = document.getElementById("theme-toggle");
  if (themeBtn) {
    let savedTheme = null;
    try { savedTheme = localStorage.getItem("theme"); } catch (error) { }

    function applyTheme(theme) {
      document.body.classList.toggle("light", theme === "light");
      themeBtn.textContent = theme === "light" ? "🌙" : "☀️";
    }
    applyTheme(savedTheme === "light" ? "light" : "dark");

    themeBtn.addEventListener("click", () => {
      const nextTheme = document.body.classList.contains("light") ? "dark" : "light";
      applyTheme(nextTheme);
      try { localStorage.setItem("theme", nextTheme); } catch (error) { }
    });
  }

  // 3. SCROLL REVEAL
  const revealElements = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealElements.forEach(element => observer.observe(element));
  }

  // 4. CONTACT FORM
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");
  if (contactForm) {
    contactForm.addEventListener("submit", event => {
      event.preventDefault();
      const visitorName = document.getElementById("name").value.trim();
      formStatus.textContent = "Thank you, " + visitorName + "! Your message has been received.";
      contactForm.reset();
    });
  }

  // 5. SKILL POPUP
  const full = document.getElementById("skill-full");
  const content = document.getElementById("skill-full-content");
  const closeBtn = document.getElementById("skill-full-close");
  const skillCards = Array.from(document.querySelectorAll("#skills .skill-card"));
  let currentSkill = 0;

  if (full && content && skillCards.length > 0) {
    function openSkill(card) {
      currentSkill = skillCards.indexOf(card);
      const img = card.querySelector("img");
      const teamIcon = card.querySelector(".team-icon");
      const name = card.querySelector("h3");
      const subtitle = card.querySelector("span");
      const description = card.querySelector("p");

      content.innerHTML = "";
      const wrap = document.createElement("div");
      wrap.className = "skill-popup-content";

      if (img) {
        const bigImage = document.createElement("img");
        bigImage.src = img.src;
        wrap.appendChild(bigImage);
      } else if (teamIcon) {
        const icon = document.createElement("div");
        icon.className = "team-icon";
        icon.textContent = teamIcon.textContent;
        wrap.appendChild(icon);
      }

      const label = document.createElement("div");
      label.className = "skill-text";
      label.textContent = name ? name.textContent : "Skill";
      wrap.appendChild(label);

      if (subtitle) {
        const sub = document.createElement("div");
        sub.className = "skill-sub";
        sub.textContent = subtitle.textContent;
        wrap.appendChild(sub);
      }
      if (description) {
        const desc = document.createElement("p");
        desc.className = "skill-desc";
        desc.textContent = description.textContent;
        wrap.appendChild(desc);
      }

      content.appendChild(wrap);
      full.classList.add("open");
      document.body.style.overflow = "hidden";
    }

    function closeSkill() {
      full.classList.remove("open");
      document.body.style.overflow = "";
    }

    skillCards.forEach(card => {
      card.addEventListener("click", () => openSkill(card));
    });

    if (closeBtn) closeBtn.addEventListener("click", closeSkill);
    full.addEventListener("click", event => {
      if (event.target === full) closeSkill();
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && full.classList.contains("open")) closeSkill();
    });
  }

  // 6. TYPING EFFECT
  const typeLines = ["type-hi", "type-name", "type-role"]
    .map(id => document.getElementById(id))
    .filter(Boolean)
    .map(el => ({ el: el, text: el.textContent.trim() }));

  if (typeLines.length === 3 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const TYPE_SPEED = 80;
    const ERASE_SPEED = 35;
    const PAUSE_AFTER = 2000;
    const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

    async function typeLine(line) {
      for (let i = 1; i <= line.text.length; i++) {
        line.el.textContent = line.text.slice(0, i);
        await wait(TYPE_SPEED);
      }
    }
    async function eraseLine(line) {
      for (let i = line.text.length - 1; i >= 0; i--) {
        line.el.textContent = line.text.slice(0, i);
        await wait(ERASE_SPEED);
      }
    }
    async function typingLoop() {
      while (true) {
        for (const line of typeLines) await typeLine(line);
        await wait(PAUSE_AFTER);
        for (const line of [...typeLines].reverse()) await eraseLine(line);
        await wait(500);
      }
    }
    typeLines.forEach(line => (line.el.textContent = ""));
    typingLoop();
  }

  // 7. BACKGROUND MUSIC 
  const music = document.getElementById("bg-music");
  const musicBtn = document.getElementById("music-btn");
  const musicNext = document.getElementById("music-next");
  const musicTitle = document.getElementById("music-title");

  const tracks = [
    { title: "Song 1", file: "song1.mp3" },
    { title: "Song 2", file: "song2.mp3" },
    { title: "Song 3", file: "song3.mp3" }
  ];
  let trackIndex = 0;

  if (music && musicBtn && musicNext && musicTitle) {
    music.volume = 0.5;

    function updateMusicButton() {
      const track = tracks[trackIndex];
      musicTitle.textContent = track.title;
      if (music.error) {
        musicBtn.textContent = "🚫";
        return;
      }
      const playing = !music.paused;
      musicBtn.textContent = playing ? "⏸" : "🎵";
      musicBtn.classList.toggle("playing", playing);
    }

    function loadTrack(index, autoplay) {
      trackIndex = (index + tracks.length) % tracks.length;
      music.src = tracks[trackIndex].file;
      if (autoplay) music.play().catch(updateMusicButton);
      updateMusicButton();
    }

    musicBtn.addEventListener("click", () => {
      if (music.paused) {
        music.play().catch(updateMusicButton);
      } else {
        music.pause();
      }
    });

    musicNext.addEventListener("click", () => loadTrack(trackIndex + 1, true));
    music.addEventListener("ended", () => loadTrack(trackIndex + 1, true));
    music.addEventListener("play", updateMusicButton);
    music.addEventListener("pause", updateMusicButton);
    music.addEventListener("error", updateMusicButton);

    loadTrack(0, false);
  }

  // 8. WELCOME SCREEN
  const enterScreen = document.getElementById("enter-screen");
  const enterBtn = document.getElementById("enter-btn");
  const enterSkip = document.getElementById("enter-skip");

  if (enterScreen && enterBtn && enterSkip) {
    enterScreen.classList.add("show");
    document.body.style.overflow = "hidden";

    function closeWelcome() {
      enterScreen.classList.add("hide");
      document.body.style.overflow = "";
      setTimeout(() => enterScreen.remove(), 700);
    }

    enterBtn.addEventListener("click", () => {
      if (music) music.play().catch(() => { });
      closeWelcome();
    });
    enterSkip.addEventListener("click", closeWelcome);
  }

});

// 9. IMAGE LIGHTBOX LOGIC
function openImageLightbox(imageSrc) {
  const lightbox = document.getElementById("image-lightbox");
  const img = document.getElementById("lightbox-img");
  if (lightbox && img) {
    img.src = imageSrc;
    lightbox.classList.add("show");
    document.body.style.overflow = "hidden";
  }
}

function closeImageLightbox() {
  const lightbox = document.getElementById("image-lightbox");
  const img = document.getElementById("lightbox-img");
  if (lightbox && img) {
    lightbox.classList.remove("show");
    img.src = "";
    document.body.style.overflow = "";
  }
}

document.addEventListener("click", function (e) {
  const lightbox = document.getElementById("image-lightbox");
  if (lightbox && e.target === lightbox) {
    closeImageLightbox();
  }
});

document.addEventListener("keydown", function (e) {
  const lightbox = document.getElementById("image-lightbox");
  if (e.key === "Escape" && lightbox && lightbox.classList.contains("show")) {
    closeImageLightbox();
  }
});

/* =========================================================
   SKILL POPUP PREVIOUS / NEXT BUTTONS
   (paste at the very bottom of script.js, after the last  });  )
   Adds the arrow buttons by itself, so it works with the popup
   code you already have. It does not change anything else.
========================================================= */
function addSkillNavButtons() {
  const full = document.getElementById("skill-full");
  const cards = Array.from(document.querySelectorAll("#skills .skill-card"));
  if (!full || !cards.length) return;
  if (full.querySelector(".skill-nav-bar")) return;      // already there, do nothing

  let current = 0;

  const bar = document.createElement("div");
  bar.className = "skill-nav-bar";

  const prev = document.createElement("button");
  prev.className = "skill-nav";
  prev.type = "button";
  prev.textContent = "‹";
  prev.setAttribute("aria-label", "Previous skill");

  const next = document.createElement("button");
  next.className = "skill-nav";
  next.type = "button";
  next.textContent = "›";
  next.setAttribute("aria-label", "Next skill");

  const counter = document.createElement("span");
  counter.className = "skill-counter";

  bar.append(prev, counter, next);
  full.appendChild(bar);

  function show() { counter.textContent = (current + 1) + " / " + cards.length; }
  show();

  // remember which skill was opened
  cards.forEach((card, i) => {
    card.addEventListener("click", () => { current = i; show(); });
    card.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") { current = i; show(); }
    });
  });

  // go to another skill by "clicking" that card (your own popup code opens it)
  function go(step) {
    current = (current + step + cards.length) % cards.length;
    show();
    cards[current].click();
  }

  prev.addEventListener("click", () => go(-1));
  next.addEventListener("click", () => go(1));

  document.addEventListener("keydown", e => {
    if (!full.classList.contains("open")) return;
    if (e.key === "ArrowRight") go(1);
    if (e.key === "ArrowLeft") go(-1);
  });
}

// run after the rest of the page code has finished starting up
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", addSkillNavButtons);
} else {
  addSkillNavButtons();
}