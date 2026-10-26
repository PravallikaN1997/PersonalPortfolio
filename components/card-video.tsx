"use client";

import { useEffect, useRef } from "react";

type Props = { mp4: string; webm?: string; poster: string };

/**
 * Silent looping preview inside a project card.
 * - Pointer devices: plays while the card is hovered or keyboard-focused, then returns to the poster.
 * - Touch devices (no hover): plays while the card is mostly on screen.
 * - prefers-reduced-motion: never plays; the poster stays.
 * The video is decorative (the card's text carries the meaning), so it is hidden from assistive tech.
 */
export function CardVideo({ mp4, webm, poster }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    const card = video?.closest<HTMLElement>(".card");
    if (!video || !card) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Still wanted? True while the pointer is over the card or it has keyboard focus.
    const wanted = () => card.matches(":hover") || card.matches(":focus-visible");
    const play = () => {
      if (!wanted()) return;
      // play() also starts buffering. If a browser rejects it right after a refresh, try once more when data arrives.
      video.play().catch(() => {
        video.addEventListener("canplay", () => wanted() && void video.play().catch(() => {}), { once: true });
      });
    };
    const stop = () => {
      video.pause();
      video.load(); // back to the poster
    };
    // A refresh with the pointer already resting on the card sends no "enter" event,
    // so also start on the first movement over it, and once on mount.
    const onMove = () => {
      if (video.paused) play();
    };

    const canHover = window.matchMedia("(hover: hover)").matches;
    if (canHover) {
      const onFocusIn = () => {
        if (card.matches(":focus-visible")) play();
      };
      card.addEventListener("pointerenter", play);
      card.addEventListener("pointermove", onMove);
      card.addEventListener("pointerleave", stop);
      card.addEventListener("focusin", onFocusIn);
      card.addEventListener("focusout", stop);
      if (card.matches(":hover")) play();
      return () => {
        card.removeEventListener("pointermove", onMove);
        card.removeEventListener("pointerenter", play);
        card.removeEventListener("pointerleave", stop);
        card.removeEventListener("focusin", onFocusIn);
        card.removeEventListener("focusout", stop);
      };
    }

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? play() : video.pause()),
      { threshold: 0.6 },
    );
    io.observe(card);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className="card__video"
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
      aria-hidden="true"
      tabIndex={-1}
      onEnded={(e) => {
        // Safari sometimes ignores `loop`; restart by hand if the clip ends while it should be playing.
        const v = e.currentTarget;
        v.currentTime = 0;
        void v.play().catch(() => {});
      }}
    >
      <source src={mp4} type="video/mp4" />
      {webm && <source src={webm} type="video/webm" />}
    </video>
  );
}
