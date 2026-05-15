const THEME_SCRIPT = `
(function () {
  try {
    var storageKey = "yarukoto-theme";
    var storedTheme = window.localStorage.getItem(storageKey);
    var systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var theme = storedTheme === "light" || storedTheme === "dark"
      ? storedTheme
      : systemPrefersDark
        ? "dark"
        : "light";
    var root = document.documentElement;
    root.dataset.theme = theme;
    root.classList.toggle("dark", theme === "dark");
  } catch (_) {
  }
})();
`;

export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }}
      suppressHydrationWarning
    />
  );
}
