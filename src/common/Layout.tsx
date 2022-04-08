import React from "react";
import { FunctionComponent } from "react";
import NavigationBar from "../components/NavigationBar";
import useTheme from "../hooks/useDarkMode";

const Layout: FunctionComponent = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useTheme();

  return (
    <main className="h-full min-h-full">
      <NavigationBar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      {children}
    </main>
  );
};

export default Layout;
