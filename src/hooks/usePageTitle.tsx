import { useEffect, useState } from "react";

/**
 * Hook used to set title of pages.
 *
 * @param pageTitle Title of page.
 */
const usePageTitle = (pageTitle?: string) => {
  const prefix = "yongjiajie";
  const [title, setTitle] = useState(pageTitle ?? "yongjiajie");

  useEffect(() => {
    document.title = `${prefix}: ${title}`;
  }, [title]);

  return [title, setTitle];
};

export default usePageTitle;
