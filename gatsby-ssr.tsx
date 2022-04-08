import React from "react";
import type { GatsbyBrowser } from "gatsby";
import "./src/styles/global.scss";
import Layout from "./src/common/Layout";

export const wrapPageElement: GatsbyBrowser["wrapPageElement"] = ({
  element,
}) => {
  return <Layout>{element}</Layout>;
};
