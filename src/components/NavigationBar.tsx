import { Link } from "gatsby";
import React from "react";

const NavigationBar = () => {
  return (
    <nav className="flex h-64 flex-row p-16">
      <Link className="font-display" to="/">
        YJJ
      </Link>
    </nav>
  );
};

export default NavigationBar;
