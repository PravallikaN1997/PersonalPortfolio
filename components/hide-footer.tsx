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
  return null;
}
