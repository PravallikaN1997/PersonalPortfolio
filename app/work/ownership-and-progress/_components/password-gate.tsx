import Link from "next/link";
import { site } from "@/lib/site";
import { HideFooter } from "@/components/hide-footer";
import { PasswordForm } from "./password-form";

// Keep the hyphenated compound together so it never splits across lines.
function Title({ text }: { text: string }) {
  const word = "multi-actor";
  const at = text.indexOf(word);
  if (at === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <span className="nobreak">{word}</span>
      {text.slice(at + word.length)}
    </>
  );
}

export function PasswordGate({ title, returnTo }: { title: string; returnTo?: string }) {
  return (
    <section className="wrap gate" aria-labelledby="gate-title">
      <HideFooter />
      <div className="gate__inner">
        <p className="eyebrow eyebrow--status mono" style={{ justifyContent: "center" }}>
          <span className="eyebrow__dot" aria-hidden="true" />
          <span>Confidential case study</span>
        </p>
        <h1 id="gate-title" className="display gate__title">
          <Title text={title} />
        </h1>
        <p className="gate__lede">
          This project is password-protected.
        </p>
        <div className="gate__card">
          <PasswordForm returnTo={returnTo} />
        </div>
        <p className="gate__help">
          Need access?{" "}
          <Link href={site.contactHref} className="gate__link">
            Get in touch <span className="arrow" aria-hidden="true">↗</span>
          </Link>
        </p>
      </div>
    </section>
  );
}
