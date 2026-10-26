"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { SafeVideo } from "../../ownership-and-progress/_components/safe-video";

const SRC = "/work/clara/media";

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

function Clip({ name, label, cap }: { name: string; label: string; cap: string }) {
  return (
    <figure className="cs-fig cs-ds__fig">
      <span className="cs-ds__tag mono">Prototype</span>
      <SafeVideo src={`${SRC}/${name}.mp4`} label={label} />
      <figcaption>{cap}</figcaption>
    </figure>
  );
}

function Pair({ children }: { children: ReactNode }) {
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>{children}</div>;
}

export function DecisionStories() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => { root.current?.setAttribute("data-armed", ""); }, []);
  return (
    <div className="cs-ds-list" ref={root}>
      <Decision
        label="01 / Onboarding" title="Ask the first questions out loud"
        tension="The therapist needs to know a student’s routine before the first session, and a long form is hard work for someone already worn out."
        decision={<>Clara introduces itself and asks the questions <em>by voice</em>: school, workload, sleep, meals. The answers go to the therapist ahead of the first meeting.</>}
        why="The student starts without typing, and the therapist does not begin from zero. Evaluators asked why we offered both voice and touch, and some worried about speaking answers aloud, so that stayed open."
      >
        <Clip name="flow-1" label="Clara prototype: voice onboarding" cap="Clara introduces itself and asks the first questions by voice." />
        <Fig tag="Wireframes" name="wireframes" w={1800} h={614} alt="Early wireframes: voice onboarding questions about school, classes, social time, sleep and meals, then recovery tasks and the therapy day." cap="Early wireframes: the voice questions, then recovery tasks and the therapy day." />
      </Decision>

      <Decision
        label="02 / Measuring burnout" title="Let a questionnaire measure burnout, not the AI"
        tension="In our first version the AI picked keywords out of a student’s answers to work out their burnout level. That was hard to compute."
        decision={<>Students answer the <em>Copenhagen Burnout Inventory</em>, a free, validated questionnaire, on a scale from never to always. The result appears straight away as a low, medium or high level.</>}
        why="The score is dependable, students see where they stand before meeting anyone, and it sets how often a therapist joins. Our experts agreed the questionnaire could be taken online."
      >
        <Pair>
          <Fig tag="Result" name="burnout-level" w={600} h={1298} alt="Clara screen showing a medium burnout level on a gauge, with a Start recovery button." cap="The result appears at once." />
          <Fig tag="Next" name="availability" w={600} h={1298} alt="Clara screen asking the student to choose days and times to meet a therapist." cap="Then the student picks times that suit them." />
        </Pair>
      </Decision>

      <Decision
        label="03 / Human care" title="AI for the daily steps, a therapist at set times"
        tension="Online therapy without a guide loses people, and a wrong self-diagnosis can make things worse. But therapists cannot be on call for every student."
        decision={<>The AI guides the light daily steps, taken from cognitive behavioural therapy. A therapist joins on <em>scheduled days</em>, and the burnout score sets how often. We first planned the first session for day seven, tried day one, and settled on a few days in, because students told us they need time before opening up.</>}
        why="Everyday support stays light, and a person is always on the schedule."
      >
        <Pair>
          <Fig tag="Roadmap" name="roadmap" w={600} h={1298} alt="Clara home screen with a roadmap of daily tasks, including a therapy day, and an SOS button." cap="The roadmap mixes daily tasks with a therapy day." />
          <Fig tag="Therapist" name="therapist-match" w={600} h={1298} alt="Clara screen recommending a therapist based on the student's availability, with a confirm button." cap="Clara recommends a therapist from the times given." />
        </Pair>
      </Decision>
    </div>
  );
}
