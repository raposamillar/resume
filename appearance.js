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
