import { HideFooter } from "@/components/hide-footer";
import { ContactLink } from "./contact-link";
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
      <div className="gate__body">
        <p className="eyebrow eyebrow--status mono">
          <span className="eyebrow__dot" aria-hidden="true" />
          <span>Confidential case study</span>
        </p>
        <h1 id="gate-title" className="display gate__title">
          <Title text={title} />
        </h1>
        <PasswordForm returnTo={returnTo} />
        <p className="gate__help">
          Don&rsquo;t have it? <ContactLink />
        </p>
      </div>
    </section>
  );
}
