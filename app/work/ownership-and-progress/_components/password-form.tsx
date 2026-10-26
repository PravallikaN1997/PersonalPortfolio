"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { unlockCaseStudy } from "../actions";

export function PasswordForm({ returnTo }: { returnTo?: string }) {
  const [state, action, pending] = useActionState(unlockCaseStudy, undefined);
  const [edited, setEdited] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  // A new server response means a new error; editing the field clears it.
  const error = state?.error && !edited ? state.error : undefined;

  useEffect(() => {
    setEdited(false);
    if (state?.error) input.current?.focus();
  }, [state]);

  return (
    <form action={action} className="gate__form" aria-busy={pending}>
      {returnTo ? <input type="hidden" name="to" value={returnTo} /> : null}
      <input
        ref={input}
        id="cs-password"
        aria-label="Password"
        placeholder="Enter password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        aria-required="true"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? "cs-error" : undefined}
        readOnly={pending}
        onChange={() => setEdited(true)}
        className="gate__input"
      />
      <p id="cs-error" role="alert" className="gate__error">
        {error ?? ""}
      </p>
      <button type="submit" className="gate__submit" disabled={pending} aria-busy={pending}>
        {pending && <span className="gate__spinner" aria-hidden="true" />}
        <span>{pending ? "Unlocking…" : "Unlock case study"}</span>
      </button>
      <span role="status" className="gate__sr">
        {pending ? "Checking password" : ""}
      </span>
    </form>
  );
}
