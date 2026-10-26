import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { site } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="wrap site-header__inner">
        <Link href="/" className="wordmark" aria-label={`${site.name}, home`}>
          {site.wordmark}
          <span className="wordmark__dot" aria-hidden="true">
            .
          </span>
        </Link>
        <SiteNav resumeHref={site.resume} />
      </div>
    </header>
  );
}
