"use client";
// Side progress list for the case study. Holds no protected content: only section ids and labels.
import { useEffect, useState } from "react";

export function SectionNav({ items }: { items: readonly (readonly [string, string])[] }) {
  const [active, setActive] = useState(items[0][0]);

  useEffect(() => {
    const update = () => {
      const line = window.innerHeight * 0.3;
      let current = items[0][0];
      for (const [id] of items) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
      const a = document.querySelector<HTMLElement>(`.cs-side a[href="#${current}"]`);
      const ol = a?.closest("ol");
      if (a && ol && ol.scrollWidth > ol.clientWidth) ol.scrollTo({ left: a.offsetLeft - 24, behavior: "smooth" });
    };
    const first = requestAnimationFrame(update);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(first);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [items]);

  return (
    <nav className="cs-side" aria-label="Case study sections">
      <ol>
        {items.map(([id, label]) => (
          <li key={id}>
            <a href={`#${id}`} aria-current={active === id ? "location" : undefined}>{label}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
