import { Link } from "gatsby";
import React, { Dispatch, FunctionComponent, SetStateAction } from "react";

type NavigationBarProps = {
  isDarkMode: boolean;
  setIsDarkMode: Dispatch<SetStateAction<boolean>>;
};

const NavigationBar: FunctionComponent<NavigationBarProps> = ({
  isDarkMode,
  setIsDarkMode,
}) => {
  return (
    <nav className="flex h-64 flex-row justify-between py-16 px-32">
      <Link className="font-display" to="/">
        YJJ
      </Link>
      <div className="flex flex-row items-center gap-x-8">
        <label
          htmlFor="toggle"
          className="cursor-pointer select-none font-display text-20 hover:text-slate-500 dark:hover:text-amber-300"
        >
          Make it {isDarkMode ? "light" : "dark"}
        </label>
        <input
          type="checkbox"
          name="toggle"
          id="toggle"
          className="hidden cursor-pointer"
          checked={isDarkMode}
          onChange={(event) => setIsDarkMode(event.target.checked)}
        />
      </div>
    </nav>
  );
};

export default NavigationBar;
