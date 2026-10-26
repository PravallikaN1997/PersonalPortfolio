"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

const SRC = "/work/ascent/media";

type Shot = { name: string; w: number; h: number; alt: string; cap: string; tag?: string };

function Fig({ name, w, h, alt, cap, tag }: Shot) {
  return (
    <figure className="cs-fig cs-ds__fig">
      {tag ? <span className="cs-ds__tag mono">{tag}</span> : null}
      <a className="cs-ds__img" href={`${SRC}/${name}.jpg`} target="_blank" rel="noopener" aria-label={`Open larger: ${alt}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${SRC}/${name}.jpg`} width={w} height={h} alt={alt} loading="lazy" decoding="async" />
      </a>
      <figcaption>{cap}</figcaption>
    </figure>
  );
}

/** One decision: text on the left as a short chain (tension, decision, why), evidence on the right. */
function Decision({ label, title, tension, decision, why, children }: {
  label: string; title: string; tension: ReactNode; decision: ReactNode; why: ReactNode; children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const show = () => el.classList.add("is-in");
    if (typeof IntersectionObserver === "undefined") { show(); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { show(); io.disconnect(); } }, { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <article ref={ref} className="cs-ds">
      <div className="cs-ds__body">
        <header className="cs-ds__head">
          <span className="mono">{label}</span>
          <h3>{title}</h3>
        </header>
        <ol className="cs-lnk">
          <li><span className="mono">The tension</span><p>{tension}</p></li>
          <li className="is-key"><span className="mono">The decision</span><p>{decision}</p></li>
          <li><span className="mono">Why it matters</span><p>{why}</p></li>
        </ol>
      </div>
      <div className="cs-ds__vis">{children}</div>
    </article>
  );
}

export function DecisionStories() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => { root.current?.setAttribute("data-armed", ""); }, []);
  return (
    <div className="cs-ds-list" ref={root}>
      <Decision
        label="01 / Overview" title="Design the overview for triage"
        tension="Our first dashboard showed every metric we had found. Commanders said they would not have time to review them all and that the focus should be the core ones. A later round dropped electrolytes, shift changes and noise exposure."
        decision={<>The overview leads with <em>readiness, location and visible actions</em>. Telemetry sits one step deeper, and readiness shows as a percentage as well as a colour.</>}
        why="A commander can see who needs attention without analysing a dashboard first. The floor plan uses alpha, beta, charlie and delta, the words commanders already use."
      >
        <Fig tag="Before" name="before-overview" w={1470} h={924} alt="The existing readiness interface: a dense screen of biometrics, gauges and event history for a single firefighter." cap="Before: every signal competes on one screen." />
        <Fig tag="After" name="final-overview" w={2200} h={1445} alt="The final overview: a floor plan with sector labels beside a list of critical firefighters, each with an overall readiness percentage, View details and Send to rehab." cap="After: readiness, location and the next action. Detail is one step deeper." />
      </Decision>

      <Decision
        label="02 / Rehab" title="Make rehab a workflow, not a label"
        tension="In the first wireframes the list showed only critical firefighters and the rehab action sat behind a detail view. Commanders said hidden actions would not work under pressure, and they wanted to see who was already in rehab."
        decision={<>Rehab became its own <em>In Rehab</em> tab. Send to rehab sits on each card beside View details. In rehab, the bar turns green as someone recovers and the action becomes Send to site.</>}
        why="The commander moves from recognising risk to acting on it without leaving the flow, and can always see who is where."
      >
        <Fig tag="Whiteboard" name="rehab-flow" w={2048} h={1536} alt="Whiteboard sketch of the rehab call-to-action flow: send to rehab, then a second time, then kick out of rehab or send to site." cap="The rehab call-to-action flow, first worked out on a whiteboard." />
        <Fig tag="Details" name="final-details" w={2200} h={1445} alt="The details view for one firefighter: overall readiness, live location, oxygen tank and core metrics, with Send to rehab at the top." cap="The details view keeps the supporting telemetry, with the action still in reach." />
      </Decision>
    </div>
  );
}
