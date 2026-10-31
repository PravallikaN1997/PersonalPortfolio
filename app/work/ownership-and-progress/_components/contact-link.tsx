import Link from "next/link";
import { site } from "@/lib/site";

export function ContactLink() {
  return (
    <Link href={`${site.contactHref}?subject=${encodeURIComponent("Access to a case study")}`} className="gate__link">
      Get in touch <span className="arrow" aria-hidden="true">↗</span>
    </Link>
  );
}
