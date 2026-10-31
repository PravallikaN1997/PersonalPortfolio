import { HideFooter } from "@/components/hide-footer";

// Shown while the server checks access. Same block as the gate, with the field's space reserved,
// so the title never moves when the real gate streams in. Contains nothing confidential.
export function GateFallback({ title }: { title: string }) {
  return (
    <section className="wrap gate" aria-busy="true">
      <HideFooter />
      <div className="gate__body">
        <p className="eyebrow eyebrow--status mono">
          <span className="eyebrow__dot" aria-hidden="true" />
          <span>Case study</span>
        </p>
        <p className="display gate__title">{title}</p>
        <div className="gate__ph" aria-hidden="true" />
      </div>
    </section>
  );
}
