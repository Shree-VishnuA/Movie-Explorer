// src/components/ThemeSelector.jsx
import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const ThemeSelector = () => {
  const { changeTheme } = useContext(ThemeContext);

  return (
    <select
      onChange={(e) => changeTheme(e.target.value)}
      className="p-2 rounded bg-gray-800 text-white"
    >
      <option value="cyberpunk">Cyberpunk Neon</option>
      <option value="midnightGold">Midnight Gold</option>
      <option value="retroVHS">Retro VHS</option>
      <option value="deepSpace">Deep Space</option>
      <option value="noirRed">Noir Red</option>
      <option value="emeraldNight">Emerald Night</option>
    </select>
  );
};

export default ThemeSelector;
