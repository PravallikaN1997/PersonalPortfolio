// PROTECTED CONTENT. Rendered only after the server has verified access.
// Keep this a Server Component: no "use client", and never import it from a Client Component.
import { existsSync } from "node:fs";
import path from "node:path";
import Link from "next/link";
import { projects } from "@/lib/projects";
import { EvidenceCanvas } from "../../ownership-and-progress/_components/evidence-canvas";
import { SectionNav } from "../../ownership-and-progress/_components/section-nav";
import { DecisionStories } from "../_components/decision-stories";

const NAV = [
  ["overview", "Overview"],
  ["problem", "The problem"],
  ["work", "The process"],
  ["decisions", "Design decisions"],
  ["outcome", "The outcome"],
  ["reflection", "Reflection"],
] as const;

const SRC = "/work/ascent/media";

function nextProject() {
  const at = projects.findIndex((p) => p.slug === "ascent");
  return projects
    .slice(at + 1)
    .find((p) => existsSync(path.join(process.cwd(), "app", "work", p.slug, "page.tsx")));
}

function Art({ name, w, h, alt }: { name: string; w: number; h: number; alt: string }) {
  return (
    <a className="cs-cv__art" href={`${SRC}/${name}.jpg`} target="_blank" rel="noopener" aria-label={`Open larger: ${alt}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${SRC}/${name}.jpg`} width={w} height={h} alt={alt} draggable={false} loading="lazy" decoding="async" />
    </a>
  );
}

const RESULTS: readonly (readonly [string, string, string])[] = [
  ["Pre-launch", "4.2 / 5", "Prototype satisfaction"],
  ["Pre-launch", "82", "System Usability Scale (SUS) score"],
  ["Scope check", "85%", "Of the original research themes mapped to a launch-scope fix"],
] as const;

export function CaseStudyContent({ title }: { title: string }) {
  const next = nextProject();
  return (
    <article className="wrap cs unlock-fade">
      <header className="cs-hero">
        <p className="mono eyebrow cs-eyebrow-row"><span>04 · Ascent Integrated Tech · Product design</span></p>
        <h1 className="display display--sm cs-title">{title}</h1>
        <p className="cs-lede">
          Ascent Integrated Tech makes a system that pairs sensors on firefighters&rsquo; helmets with wearables and
          feeds them into one dashboard, so incident commanders can track crews&rsquo; location, surroundings and
          health.
        </p>
        <dl className="cs-meta">
          <div><dt className="mono">Team</dt><dd>Six students, with Ascent as sponsor</dd></div>
          <div><dt className="mono">My part</dt><dd>Research synthesis, metric selection, wireframes, hi-fi screens, validation with incident commanders</dd></div>
          <div><dt className="mono">Status</dt><dd>Client project for Ascent, 2023 · readiness feature shipped after our handoff</dd></div>
        </dl>
      </header>

      <div className="cs-layout">
        <SectionNav items={NAV} />

        <div className="cs-body">
          <section id="overview" className="cs-sec">
            <h2>Overview</h2>
            <p>
              In 2023 six of us worked with Ascent as a university project on two questions: which health signals tell a commander a firefighter is ready to stay
              in, and how those signals should appear on screen. Our final deliverable was a set of high-fidelity
              screens. Ascent went on to ship a readiness feature.
            </p>
          </section>

          <section id="problem" className="cs-sec">
            <h2>The problem</h2>
            <p>
              Commanders judged readiness from air tank levels, energy, previous shifts and word of mouth. A firefighter
              was checked after two 30-minute air tanks, at rehab, with a blood pressure cuff and a thermometer. Nothing
              told a commander during the incident that someone was getting worse, and a late call to send someone to
              rehab raises the risk for that firefighter.
            </p>
            <figure className="cs-fig">
              <Art name="field-context" w={1494} h={1114} alt="A fire training tower with an engine and firefighters." />
              <figcaption>A training exercise.</figcaption>
            </figure>
            <p>
              Ascent&rsquo;s own wireframes already tried to show this, but their survey found commanders went to the
              floor plan first and the screens were hard to read at a glance. A commander is also tracking crews, radio
              and hazards, so there is no time to read a screen of numbers. The problem became helping someone make a
              fast call, not showing more data.
            </p>
            <div className="cs-dq">
              <span className="mono">The design question</span>
              <p>How might the system show a commander who needs rehab, and why, without asking them to read a dashboard?</p>
            </div>
          </section>

          <section id="work" className="cs-sec">
            <h2>The process</h2>
            <p>
              Two things shaped the plan. Approval to interview firefighters came late, so we started with subject
              matter experts, day-in-the-life videos and a literature review. And on their advice we narrowed the scope
              to structural fires, the most common kind firefighters attend.
            </p>
            <div className="cs-hw">
              <div className="cs-hw__row">
                <div className="cs-hw__head">
                  <span className="mono">01 / Research</span>
                  <h3>Choosing the metrics</h3>
                  <p>The literature review gave eleven candidate signals. Interviews with incident commanders cut them to seven: heart rate, oxygen level, core body temperature, carbon monoxide, hydration, blood pressure and air tank level.</p>
                </div>
                <EvidenceCanvas
                  label="Research plan and assumptions"
                  title="Research and assumptions"
                  curve
                  view={{ w: 1000, h: 450 }}
                  world={{ w: 1000, h: 450 }}
                  links={[
                    { a: "plan", b: "rules", color: "var(--chart-pink)", from: [1, 0.5], to: [0, 0.5] },
                    { a: "assume", b: "rules", color: "var(--chart-amber)", from: [1, 0.5], to: [0, 0.5] },
                  ]}
                  items={[
                    { id: "plan", x: 24, y: 24, w: 300, z: 1, tag: "Whiteboard", label: "Research plan", href: `${SRC}/research-plan.jpg`, children: (
                      <Art name="research-plan" w={768} h={1024} alt="Whiteboard with the research plan: methods, surveys and interviews." />
                    ) },
                    { id: "assume", x: 348, y: 24, w: 300, z: 1, tag: "Whiteboard", label: "Assumptions", href: `${SRC}/assumptions.jpg`, children: (
                      <Art name="assumptions" w={768} h={1024} alt="Whiteboard listing assumptions about what the incident commander sees and decides." />
                    ) },
                    { id: "rules", x: 690, y: 90, w: 286, z: 2, tag: "What commanders said", label: "From the interviews", className: "cs-sn cs-sn--yellow", children: (
                      <>
                        <p>Readiness is only reported after two air tanks.</p>
                        <p>They want an alert when someone gets worse.</p>
                        <p>Planning still runs on pen, paper and the command board.</p>
                      </>
                    ) },
                  ]}
                />
              </div>
            </div>
            <div className="cs-hw">
              <div className="cs-hw__row">
                <div className="cs-hw__head">
                  <span className="mono">02 / Testing</span>
                  <h3>What commanders said about the first wireframes</h3>
                  <p>Two incident commanders reviewed our wireframes in two rounds. I annotated the first with their comments. These are what the two decisions below respond to.</p>
                </div>
                <EvidenceCanvas
                  label="Annotated wireframe from prototype testing"
                  title="Testing feedback"
                  curve
                  view={{ w: 1000, h: 440 }}
                  world={{ w: 1000, h: 440 }}
                  links={[
                    { a: "wire", b: "n1", color: "var(--chart-amber)", from: [1, 0.3], to: [0, 0.5] },
                    { a: "wire", b: "n2", color: "var(--chart-pink)", from: [1, 0.5], to: [0, 0.5] },
                    { a: "wire", b: "n3", color: "var(--chart-amber)", from: [1, 0.7], to: [0, 0.5] },
                  ]}
                  items={[
                    { id: "wire", x: 24, y: 60, w: 580, z: 1, tag: "Commander review", label: "Annotated wireframe", href: `${SRC}/testing-feedback.jpg`, children: (
                      <Art name="testing-feedback" w={2200} h={1165} alt="Annotated tablet wireframe of the critical firefighters list, with commanders' comments in red callouts." />
                    ) },
                    { id: "n1", x: 650, y: 40, w: 326, z: 2, tag: "Commander", label: "No time for metrics", className: "cs-sn cs-sn--yellow", children: <p>They would not have time to review every metric and decide from them.</p> },
                    { id: "n2", x: 650, y: 170, w: 326, z: 2, tag: "Commander", label: "Who is in rehab", className: "cs-sn cs-sn--pink", children: <p>They needed to see who is already in rehab.</p> },
                    { id: "n3", x: 650, y: 300, w: 326, z: 2, tag: "Commander", label: "A quick signal", className: "cs-sn cs-sn--mint", children: <p>A short colour or icon cue would show readiness quickly.</p> },
                  ]}
                />
              </div>
            </div>
          </section>

          <section id="decisions" className="cs-sec">
            <h2>Design decisions</h2>
            <p>Two decisions came out of that. Both protect a commander’s attention.</p>
            <DecisionStories />
          </section>

          <section id="outcome" className="cs-sec">
            <h2>The outcome</h2>
            <p>
              Ascent went on to ship readiness as a decision flow rather than another dashboard: recognise risk, review
              the context, act. These are the signals I have from before launch.
            </p>
            <ul className="cs-tens cs-tens--bottom">
              {RESULTS.map(([label, v, note]) => (
                <li key={note}>
                  <span className="mono">{label}</span>
                  <h3>{v}</h3>
                  <p>{note}</p>
                </li>
              ))}
            </ul>
          </section>

          <section id="reflection" className="cs-sec">
            <h2>Reflection</h2>
            <p className="cs-big">In high-pressure systems, clarity is a form of care.</p>
            <p>
              The work was less about showing every signal and more about helping a team notice the right evidence,
              understand the context, and act without losing time to interpretation.
            </p>
          </section>

          <nav className="cs-end" aria-label="Case study navigation">
            <Link href="/#work" className="cs-end__link">
              <span aria-hidden="true">&larr;</span> All projects
            </Link>
            {next ? (
              <Link href={`/work/${next.slug}`} className="cs-end__link cs-end__link--next" aria-label={`Next project: ${next.title}`}>
                Next project <span aria-hidden="true">&rarr;</span>
              </Link>
            ) : null}
          </nav>
        </div>
      </div>
    </article>
  );
}
