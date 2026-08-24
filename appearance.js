const STORAGE_KEY = "resume-appearance";
const root = document.documentElement;

const isAppearance = (value) =>
  value === "light" || value === "dark" || value === "auto";

const readSavedAppearance = () => {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

const applyAppearance = (theme) => {
  if (theme === "light" || theme === "dark") {
    root.dataset.theme = theme;
  } else {
    delete root.dataset.theme;
    theme = "auto";
  }

  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Private mode or blocked storage should not break the page.
  }
};

const savedAppearance = readSavedAppearance();

if (isAppearance(savedAppearance)) {
  applyAppearance(savedAppearance);
}

for (const input of document.querySelectorAll('input[name="appearance"]')) {
  if (savedAppearance) {
    input.checked = input.value === savedAppearance;
  }

  input.addEventListener("change", () => {
    if (input.checked) {
      applyAppearance(input.value);
    }
  });
}

const BACK_TO_TOP_THRESHOLD = 240;
const backToTop = document.querySelector(".back-to-top");

if (backToTop) {
  const syncBackToTop = () => {
    const visible = window.scrollY >= BACK_TO_TOP_THRESHOLD;
    backToTop.classList.toggle("is-visible", visible);
    backToTop.inert = !visible;
    backToTop.toggleAttribute("aria-hidden", !visible);

    if (!visible && document.activeElement === backToTop) {
      const top = document.getElementById("top");
      if (top) {
        top.focus({ preventScroll: true });
      } else {
        backToTop.blur();
      }
    }
  };

  syncBackToTop();
  window.addEventListener("scroll", syncBackToTop, { passive: true });
}

const sectionNav = document.querySelector(".section-nav");
const navToggle = document.querySelector(".nav-toggle");
const navList = document.getElementById("section-nav-list");
const navToggleText = navToggle
  ? navToggle.querySelector(".nav-toggle-text")
  : null;
const desktopNavQuery = window.matchMedia("(min-width: 700px)");

const setSectionNavOpen = (open) => {
  if (!sectionNav || !navToggle) {
    return;
  }

  if (desktopNavQuery.matches) {
    open = false;
  }

  sectionNav.classList.toggle("is-open", open);
  navToggle.setAttribute("aria-expanded", open ? "true" : "false");

  if (navToggleText) {
    navToggleText.textContent = open ? "Close menu" : "Menu";
  }
};

if (sectionNav && navToggle && navList) {
  navToggle.addEventListener("click", () => {
    const open = navToggle.getAttribute("aria-expanded") !== "true";
    setSectionNavOpen(open);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || navToggle.getAttribute("aria-expanded") !== "true") {
      return;
    }

    setSectionNavOpen(false);
    navToggle.focus();
  });

  navList.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      setSectionNavOpen(false);
    }
  });

  document.addEventListener("click", (event) => {
    if (!sectionNav.contains(event.target)) {
      setSectionNavOpen(false);
    }
  });

  desktopNavQuery.addEventListener("change", () => {
    setSectionNavOpen(false);
  });
}
