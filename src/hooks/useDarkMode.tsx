import { Dispatch, SetStateAction, useLayoutEffect, useState } from "react";

/**
 * Hook used to toggle between light and dark mode.
 *
 * Reference: https://tailwindcss.com/docs/dark-mode
 */
const useDarkMode = (): [boolean, Dispatch<SetStateAction<boolean>>] => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  /**
   * Updates `localStorage` and `document` class list to reflect display mode.
   *
   * @param theme "light" or "dark".
   */
  const updateTheme = (theme: "light" | "dark") => {
    if (theme === "dark") {
      localStorage.setItem("theme", "dark");
      document.documentElement.classList.add("dark");
    } else {
      localStorage.removeItem("theme");
      document.documentElement.classList.remove("dark");
    }
  };

  // Determine initial theme
  useLayoutEffect(() => {
    const theme = localStorage.getItem("theme");
    const isPrefersColorSchemeDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (theme === "dark" || (theme !== "dark" && isPrefersColorSchemeDark)) {
      setIsDarkMode(true);
    }
  }, []);

  useLayoutEffect(() => {
    if (isDarkMode) {
      updateTheme("dark");
    } else {
      updateTheme("light");
    }
  }, [isDarkMode]);

  return [isDarkMode, setIsDarkMode];
};

export default useDarkMode;
