"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * The About page is one full-window section with no page scroll. Up/down wheel or trackpad movement (and the
 * arrow, page, space, home and end keys) glide the canvas sideways, so a sideways swipe is never needed and
 * never sends the browser back a page. Below 900px wide, or when the window is under 680px tall (the canvas would shrink too far to read), the canvas is a normal stacked column and this does nothing.
 */
export function ScrollTrack({ width, height, xMin, xMax, path = "/about", children }: {
  width: number; height: number; xMin: number; xMax: number; path?: string; children: ReactNode;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const hint = useRef<HTMLParagraphElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const here = pathname === path;

  // Next keeps previously visited pages mounted but hidden, so the full-window lock can't key off ":has(.sq)":
  // it would stay on after leaving this page. Effects are cleaned up when the page is hidden, so tie it to that.
  useLayoutEffect(() => {
    const root = document.documentElement;
    if (here) root.setAttribute("data-sq", ""); else root.removeAttribute("data-sq");
    return () => root.removeAttribute("data-sq");
  }, [here]);

  useEffect(() => {
    const st = stage.current;
    const t = track.current;
    if (!st || !t || !here) return;
    const mq = window.matchMedia("(min-width: 900px) and (min-height: 680px)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let travel = 0;
    let scale = 1;
    let pos = 0; // how far the canvas has moved, in screen pixels
    let current = 0;
    let raf = 0;

    const paint = () => {
      raf = 0;
      current = calm ? pos : current + (pos - current) * 0.16;
      if (Math.abs(pos - current) < 0.4) current = pos;
      t.style.transform = `translate3d(${-current}px, 0, 0) scale(${scale})`;
      if (current !== pos) raf = requestAnimationFrame(paint);
    };
    const move = (to: number) => {
      pos = Math.min(travel, Math.max(0, to));
      if (hint.current) hint.current.style.opacity = pos > 8 ? "0" : "1";
      if (!raf) raf = requestAnimationFrame(paint);
    };

    // The content boundary is the site's own: the header's inner box, so the canvas lines up with the wordmark and nav.
    const bounds = () => {
      const hdr = document.querySelector<HTMLElement>(".site-header__inner");
      const vw = st.clientWidth;
      if (!hdr) return { left: 48, right: vw - 48 };
      const r = hdr.getBoundingClientRect();
      const cs = getComputedStyle(hdr);
      return { left: r.left + parseFloat(cs.paddingLeft), right: r.right - parseFloat(cs.paddingRight) };
    };

    const layout = () => {
      if (!mq.matches) { pin.current?.style.removeProperty("--sq-top"); t.style.transform = ""; t.style.top = ""; t.style.left = ""; return; }
      // The pinned scrapbook starts right under the site header, whatever its height is.
      const header = document.querySelector<HTMLElement>(".site-header");
      if (header) pin.current?.style.setProperty("--sq-top", `${Math.round(header.getBoundingClientRect().bottom)}px`);
      const h = st.clientHeight;
      const { left, right } = bounds();
      scale = Math.min(1, (h - 56) / height); // short windows shrink the whole canvas instead of clipping it
      // The first panel starts on the container's left edge; at the end of the trip the last panel ends on its right edge.
      travel = Math.max(0, (xMax - xMin) * scale - (right - left));
      t.style.left = `${left - xMin * scale}px`;
      t.style.top = `${Math.max(36, (h - height * scale) / 2)}px`;
      if (hint.current) hint.current.style.left = `${left}px`;
      pos = Math.min(pos, travel);
      current = pos;
      paint();
    };

    // A hidden, kept-alive copy of this page must never touch scrolling elsewhere.
    const live = () => window.location.pathname === path && st.getClientRects().length > 0;
    const onWheel = (e: WheelEvent) => {
      if (!live() || !mq.matches || e.ctrlKey) return; // leave pinch-zoom alone
      e.preventDefault();
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? st.clientHeight : 1;
      const d = (Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX) * unit;
      move(pos + d);
    };

    const onKey = (e: KeyboardEvent) => {
      if (!live() || !mq.matches || e.metaKey || e.ctrlKey || e.altKey) return;
      const el = e.target as HTMLElement | null;
      if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT|BUTTON|CANVAS)$/.test(el.tagName) || el.closest("[data-sq-keys]"))) return;
      const page = st.clientWidth * 0.8;
      const step: Record<string, number> = {
        ArrowDown: 90, ArrowRight: 90, ArrowUp: -90, ArrowLeft: -90, PageDown: page, PageUp: -page,
      };
      let to: number | null = null;
      if (e.key in step) to = pos + step[e.key];
      else if (e.key === " ") to = pos + (e.shiftKey ? -page : page);
      else if (e.key === "Home") to = 0;
      else if (e.key === "End") to = travel;
      if (to === null) return;
      e.preventDefault();
      move(to);
    };

    const ro = new ResizeObserver(layout);
    ro.observe(st);
    mq.addEventListener("change", layout);
    window.addEventListener("resize", layout);
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    layout();
    return () => {
      ro.disconnect();
      mq.removeEventListener("change", layout);
      window.removeEventListener("resize", layout);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [width, height, xMin, xMax, here, path]);

  // While another page is showing, keep no fixed layer or listeners from this one in the document at all.
  if (!here) return null;

  return (
    <div ref={pin} className="sq-pin">
      <div ref={stage} className="sq-stage">
        <p ref={hint} className="sq-hint">scroll to explore <span aria-hidden="true">&rarr;</span></p>
        <div ref={track} className="sq-track" style={{ width, height }}>
          {children}
        </div>
      </div>
    </div>
  );
}
