"use client";

import { useLayoutEffect } from "react";

/**
 * Hides the shared footer while this is on screen (the password screen). Next keeps visited pages mounted but
 * hidden, so this is tied to the effect lifecycle rather than to a ":has()" selector, which would stay on.
 */
export function HideFooter() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-no-footer", "");
    return () => root.removeAttribute("data-no-footer");
  }, []);
  // The server-rendered page runs this tiny script while the HTML is still being read, before the footer below
  // is painted, so a refresh never flashes the footer. (The effect above covers in-app navigation.)
  return <script dangerouslySetInnerHTML={{ __html: "document.documentElement.setAttribute('data-no-footer','')" }} />;
}
