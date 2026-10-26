"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

const SRC = "/work/when-should-the-ai-speak/media";

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
        label="01 / Clarify" title="Ask once, and ask everything"
        tension="When a designer needs something, the quickest path is a message. A few of those and the client is answering scattered questions."
        decision={<>The designer raises what is missing. The agent checks what is already known, removes repeats, and prepares <em>one package</em> that says whether the client needs to answer, decide or attach something.</>}
        why="The client does one thing, once, and every answer stays attached to the flag it came from instead of getting lost in a thread."
      >
        <Fig tag="Workbook · Designer side" name="pm-d1-clarify" w={1054} h={866} alt="PM-agent workbook, designer-side sheet: Clarify. The agent prepares one package of questions and records each response against its original flag." cap="The agent prepares the package. Each answer is recorded against its flag." />
      </Decision>

      <Decision
        label="02 / Feedback" title="Help vague feedback, never pick a side"
        tension="Comments are often vague, or two reviewers disagree. A designer cannot revise from a thread."
        decision={<>Clear comments pass straight through. A vague one gets <em>one open question</em>, then two to four readings taken from the brief. When two comments conflict, both go to the approver, and the agent never chooses.</>}
        why="The designer gets one agreed list of changes, and the agent never invents creative direction."
      >
        <Fig tag="Workbook · Client side" name="pm-d2-feedback" w={1500} h={1843} alt="PM-agent workbook, client-side sheet: Feedback. Triage, an open question, grounded interpretations, the conflict route and one client-confirmed change specification." cap="Triage, one open question, grounded options, the approver route, then one confirmed list." />
      </Decision>

      <Decision
        label="03 / Revision" title="Once it is signed off, it does not move"
        tension="Comments keep arriving while the designer is revising. If they quietly join the list, the work order changes under the designer."
        decision={<>The confirmed list is <em>passed through unchanged</em>. Anything new waits in its own place and is routed: a question goes back to Clarify, another change to later feedback, a possible new scope to a person.</>}
        why="The designer works from a stable list, and the client can see what was agreed."
      >
        <Fig tag="Workbook · Client side" name="pm-d3-revision" w={1500} h={634} alt="PM-agent workbook, client-side sheet: Revision. The confirmed change list is kept fixed, and new input is routed to Clarify, later Feedback, or a person." cap="The agent keeps the signed-off list fixed and routes anything new." />
      </Decision>
    </div>
  );
}
