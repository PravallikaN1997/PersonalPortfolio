"use client";

import { useEffect } from "react";

/**
 * Marks <html> once the app has hydrated. Before that, CSS may hide the footer on the password screen with ":has()"
 * (there are no stale, hidden pages in the DOM yet); after it, HideFooter takes over, because Next keeps visited
 * pages mounted but hidden and a ":has()" rule would stay on for them.
 */
export function Hydrated() {
  useEffect(() => {
    document.documentElement.setAttribute("data-hydrated", "");
  }, []);
  return null;
}
