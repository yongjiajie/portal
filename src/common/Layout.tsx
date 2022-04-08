import React from "react";
import { FunctionComponent } from "react";
import NavigationBar from "../components/NavigationBar";

const Layout: FunctionComponent = ({ children }) => {
  return (
    <main className="h-full min-h-full">
      <NavigationBar />
      {children}
    </main>
  );
};

export default Layout;
