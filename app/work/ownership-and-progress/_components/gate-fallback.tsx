import { HideFooter } from "@/components/hide-footer";
import { ContactLink } from "./contact-link";

// Shown while the server checks access. It looks exactly like the gate (same eyebrow, title, field, button and
// help line) but the field and button are inert, so nothing appears later: the gate only becomes usable.
// Contains nothing confidential.
export function GateFallback({ title }: { title: string }) {
  return (
    <section className="wrap gate" aria-busy="true">
      <HideFooter />
      <div className="gate__body">
        <p className="eyebrow eyebrow--status mono">
          <span className="eyebrow__dot" aria-hidden="true" />
          <span>Confidential case study</span>
        </p>
        <p className="display gate__title">{title}</p>
        <div className="gate__form" inert aria-hidden="true">
          <div className="gate__row">
            <input className="gate__input" placeholder="Enter password" type="password" tabIndex={-1} readOnly />
            <button type="button" className="gate__submit" tabIndex={-1}>
              <span>Unlock</span>
              <span className="arrow" aria-hidden="true">→</span>
            </button>
          </div>
          <p className="gate__error" />
        </div>
        <p className="gate__help">
          Don&rsquo;t have it? <ContactLink />
        </p>
      </div>
    </section>
  );
}
