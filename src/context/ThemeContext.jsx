// src/context/ThemeContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

const themes = {
  cyberpunk: {
    "--bg": "#0D0D0D",
    "--primary": "#FF007F",
    "--secondary": "#00FFFF",
    "--highlight": "#FFD300",
    "--text": "#FFFFFF",
  },
  midnightGold: {
    "--bg": "#0A0A0A",
    "--primary": "#FFD700",
    "--secondary": "#DAA520",
    "--highlight": "#B8860B",
    "--text": "#FFFFFF",
  },
  retroVHS: {
    "--bg": "#1e1b4b",
    "--primary": "#ff66cc",
    "--secondary": "#33ccff",
    "--highlight": "#ffff66",
    "--text": "#FFFFFF",
  },
  deepSpace: {
    "--bg": "#020617",
    "--primary": "#38bdf8",
    "--secondary": "#818cf8",
    "--highlight": "#f472b6",
    "--text": "#FFFFFF",
  },
  noirRed: {
    "--bg": "#1a1a1a",
    "--primary": "#ff4d4d",
    "--secondary": "#ff6666",
    "--highlight": "#ff1a1a",
    "--text": "#FFFFFF",
  },
  emeraldNight: {
    "--bg": "#0d1f1a",
    "--primary": "#50fa7b",
    "--secondary": "#00b894",
    "--highlight": "#81ecec",
    "--text": "#FFFFFF",
  },
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("cyberpunk");

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
  };

  useEffect(() => {
    const themeVars = themes[theme];
    for (let key in themeVars) {
      document.documentElement.style.setProperty(key, themeVars[key]);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
