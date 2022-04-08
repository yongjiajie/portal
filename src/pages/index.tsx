import * as React from "react";
import usePageTitle from "../hooks/usePageTitle";

const IndexPage = () => {
  usePageTitle("Home");

  return (
    <div className="align-center flex justify-center">
      <h1 className="text-gradient font-display text-32 md:text-96 lg:text-128">
        COMING SOON
      </h1>
    </div>
  );
};

export default IndexPage;
