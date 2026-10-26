"use client";

import { useEffect } from "react";

/* Pauses every walkthrough video when the step tab changes, and when another one starts. */
export function OvPause() {
  useEffect(() => {
    const root = document.querySelector("main") ?? document.body;
    const pauseAll = (except?: EventTarget | null) =>
      root.querySelectorAll<HTMLVideoElement>(".cs-ov video, .cs-pn video").forEach((v) => { if (v !== except) v.pause(); });
    const onChange = () => pauseAll();
    const onPlay = (e: Event) => pauseAll(e.target);
    const roots = document.querySelectorAll(".cs-ov, .cs-pn");
    roots.forEach((r) => r.addEventListener("change", onChange));
    root.addEventListener("play", onPlay, true);
    return () => { roots.forEach((r) => r.removeEventListener("change", onChange)); root.removeEventListener("play", onPlay, true); };
  }, []);
  return null;
}
