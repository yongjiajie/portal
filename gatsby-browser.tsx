import React from "react";
import type { GatsbyBrowser } from "gatsby";
import "./src/styles/global.scss";
import NavigationBar from "./src/components/NavigationBar";

export const wrapPageElement: GatsbyBrowser["wrapPageElement"] = ({
  element,
}) => {
  return (
    <main className="h-full min-h-full">
      <NavigationBar />
      {element}
    </main>
  );
};
