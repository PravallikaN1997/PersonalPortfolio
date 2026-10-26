"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = { label: string; href: string; match: (path: string) => boolean; external?: boolean };

export function SiteNav({ resumeHref }: { resumeHref: string }) {
  const pathname = usePathname();
  const items: Item[] = [
    { label: "About", href: "/about", match: (p) => p === "/about" },
    { label: "Work", href: "/#work", match: (p) => p === "/work" || p.startsWith("/work/") },
    { label: "Play", href: "/play", match: (p) => p === "/play" },
    { label: "Resume", href: resumeHref, match: () => false, external: true },
  ];

  return (
    <nav aria-label="Primary" className="nav">
      {items.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          aria-current={item.match(pathname) ? "page" : undefined}
          {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {item.label}
          {item.external && (
            <>
              {" "}
              <span className="arrow" aria-hidden="true">
                ↗
              </span>
            </>
          )}
        </Link>
      ))}
    </nav>
  );
}
