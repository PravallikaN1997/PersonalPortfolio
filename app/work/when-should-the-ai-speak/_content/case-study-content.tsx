// PROTECTED CONTENT. Rendered only after the server has verified access.
// Keep this a Server Component: no "use client", and never import it from a Client Component.
import { existsSync } from "node:fs";
import path from "node:path";
import Link from "next/link";
import { projects } from "@/lib/projects";
import { EvidenceCanvas } from "../../ownership-and-progress/_components/evidence-canvas";
import { DecisionStories } from "../_components/decision-stories";
import { SectionNav } from "../../ownership-and-progress/_components/section-nav";
import { SafeVideo } from "../../ownership-and-progress/_components/safe-video";
import { clipsFor } from "../../ownership-and-progress/_content/case-study-content";

const NAV = [
  ["overview", "Overview"],
  ["problem", "The problem"],
  ["work", "The process"],
  ["map", "Where it works"],
  ["decisions", "Design decisions"],
  ["production", "The shipped product"],
  ["reflection", "Reflection"],
] as const;

const FAILS: readonly (readonly [string, string, string])[] = [
  ["01 / Too much", "Asking the same thing twice", "Repeated questions make the system look like it is not listening. The client stops trusting it."],
  ["02 / Too loose", "Rewording what the client meant", "A tidy summary that quietly changes the request sends the designer down the wrong path."],
  ["03 / Too strong", "Standing in the way", "If the agent can stop a brief or a revision, it becomes one more thing everyone waits for."],
] as const;

const SRC = "/work/when-should-the-ai-speak/media";
const FLOW_SRC = "/work/ownership-and-progress/media";

function nextProject() {
  const at = projects.findIndex((p) => p.slug === "when-should-the-ai-speak");
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

type Cell = { name: string; acts: boolean; note?: string };
const STAGES: readonly { stage: string; client: Cell; designer: Cell }[] = [
  { stage: "Brief", client: { name: "File a brief", acts: true, note: "Flags real blockers" }, designer: { name: "Pick up", acts: true, note: "A digest and draft questions" } },
  { stage: "Create", client: { name: "The wait", acts: false }, designer: { name: "Create and iterate", acts: false } },
  { stage: "Clarify", client: { name: "Clarify", acts: true, note: "One package of questions" }, designer: { name: "Clarify", acts: true, note: "Drafts one package" } },
  { stage: "Review", client: { name: "First look", acts: false }, designer: { name: "Submit", acts: false } },
  { stage: "Feedback", client: { name: "Feedback", acts: true, note: "Only if vague or in conflict" }, designer: { name: "Waiting", acts: false } },
  { stage: "Revise", client: { name: "Revision", acts: false }, designer: { name: "Revise", acts: true, note: "Shows the signed-off list" } },
  { stage: "Close", client: { name: "Approve", acts: true, note: "Closes the record" }, designer: { name: "Close", acts: true, note: "Notes what is reusable" } },
];

function Blueprint() {
  return (
    <div className="cs-bp" role="group" aria-label="Where the PM agent acts and where it stays out, stage by stage">
      <span className="mono cs-bp__row" style={{ gridRow: 2 }}>Client</span>
      <span className="mono cs-bp__row" style={{ gridRow: 3 }}>Designer</span>
      <span className="mono cs-bp__row cs-bp__row--agent" style={{ gridRow: 4 }}>PM agent</span>
      {STAGES.map(({ stage, client, designer }, i) => {
        const notes = ([["Client", client], ["Designer", designer]] as const)
          .filter(([, c]) => c.acts && c.note)
          .map(([who, c]) => ({ who, text: c.note as string }));
        return (
          <div className="cs-bp__col" key={stage} style={{ "--c": i + 2 } as React.CSSProperties}>
            <span className="mono cs-bp__stage">{stage}</span>
            <p className={client.acts ? "cs-bp__cell is-acts" : "cs-bp__cell"} data-lab="Client"><b>{client.name}</b></p>
            <p className={designer.acts ? "cs-bp__cell is-acts" : "cs-bp__cell"} data-lab="Designer"><b>{designer.name}</b></p>
            <div className={notes.length ? "cs-bp__agent is-acts" : "cs-bp__agent"} data-lab="PM agent">
              {notes.length ? notes.map((n) => <p key={n.who}>{notes.length > 1 ? <i>{n.who}</i> : null}{n.text}</p>) : <span className="sr-only">Stays out</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function CaseStudyContent({ title }: { title: string }) {
  const next = nextProject();
  return (
    <article className="wrap cs unlock-fade">
      <header className="cs-hero">
        <p className="mono eyebrow cs-eyebrow-row"><span>02 · Ownpath · Vintage · 2026</span><span className="cs-pill">B2B</span></p>
        <h1 className="display display--sm cs-title">{title}</h1>
        <p className="cs-lede">
          Vintage is a creative production platform for marketing and sales teams. I designed the behaviour of its PM
          agent, which is now live. It works in the background, so the hard part was deciding when it should say
          something and when it should stay out of the way.
        </p>
        <dl className="cs-meta">
          <div><dt className="mono">Team</dt><dd>Me, my product lead and one developer</dd></div>
          <div><dt className="mono">My part</dt><dd>Behaviour design for the PM agent</dd></div>
          <div><dt className="mono">Status</dt><dd>Shipped to production · <a href="https://govintage.ai/" target="_blank" rel="noopener noreferrer">govintage.ai ↗</a></dd></div>
        </dl>
      </header>

      <div className="cs-layout">
        <SectionNav items={NAV} />

        <div className="cs-body">
          <section id="overview" className="cs-sec">
            <h2>Overview</h2>
            <p>
              Vintage is built by Ownpath. A client sends a brief, and Ownpath&rsquo;s designers turn it into finished
              work. Several people can touch the same brief, including an approver on the client side who signs off.
              Along the way, files, questions and feedback pass between them many times, and any of those handoffs can
              lose something.
            </p>
          </section>

          <section id="problem" className="cs-sec">
            <h2>The problem</h2>
            <p className="cs-big">An agent that speaks at the wrong moment is worse than no agent.</p>
            <p>
              A file is never attached, a comment means two things, a request changes on the way. An agent can catch
              these. It can also make them worse.
            </p>
            <span className="mono cs-eyebrow">Three ways it could go wrong</span>
            <ul className="cs-tens">
              {FAILS.map(([label, q, note]) => (
                <li key={label}>
                  <span className="mono">{label}</span>
                  <h3>{q}</h3>
                  <p>{note}</p>
                </li>
              ))}
            </ul>
            <div className="cs-dq">
              <span className="mono">The design question</span>
              <p>How might an agent help three people hand work to each other without becoming another voice they have to manage?</p>
            </div>
          </section>

          <section id="work" className="cs-sec">
            <h2>The process</h2>
            <p>
              Because the two journeys differ, I defined the agent&rsquo;s behaviour one moment at a time, for each
              person in the workflow.
            </p>
            <div className="cs-hw">
              <div className="cs-hw__row">
                <div className="cs-hw__head">
                  <span className="mono">01 / Write each behaviour</span>
                  <h3>One row per moment, for both journeys</h3>
                  <p>
                    For every moment I wrote what the agent reads, what it does, what it produces, who owns the next
                    move, and what the product does if the agent fails. I did this for the client&rsquo;s journey and
                    again for the designer&rsquo;s.
                  </p>
                </div>
                <EvidenceCanvas
                  label="PM-agent workbook: client-side and designer-side behaviour"
                  title="PM-agent workbook"
                  curve
                  view={{ w: 1000, h: 510 }}
                  world={{ w: 1000, h: 510 }}
                  links={[
                    { a: "client", b: "feedback", color: "var(--chart-pink)", from: [1, 0.5], to: [0, 0.5] },
                    { a: "designer", b: "fail", color: "var(--chart-amber)", from: [1, 0.4], to: [0, 0.5] },
                  ]}
                  items={[
                    { id: "client", x: 24, y: 24, w: 540, z: 1, tag: "Client · Filing a brief", label: "Workbook: File a brief", href: `${SRC}/pm-client-brief.jpg`, children: (
                      <Art name="pm-client-brief" w={2741} h={818} alt="PM-agent workbook, client-side sheet: File a brief. What the agent reads, does and produces, who owns the next move, and what the product does if the agent fails." />
                    ) },
                    { id: "feedback", x: 588, y: 24, w: 388, z: 1, tag: "Client · Giving feedback", label: "Workbook: Feedback", href: `${SRC}/pm-feedback.jpg`, children: (
                      <Art name="pm-feedback" w={2741} h={1044} alt="PM-agent workbook, client-side sheet: Feedback, from triage to one client-confirmed change specification." />
                    ) },
                    { id: "designer", x: 24, y: 292, w: 540, z: 2, tag: "Designer · Picking up a brief", label: "Workbook: Pick up a brief", href: `${SRC}/pm-designer-pickup.jpg`, children: (
                      <Art name="pm-designer-pickup" w={2426} h={823} alt="PM-agent workbook, designer-side sheet: Pick up a brief. A digest of the brief, open gaps and suggested questions." />
                    ) },
                    { id: "fail", x: 588, y: 236, w: 388, z: 3, tag: "In every row", label: "What happens if the agent fails", className: "cs-sn cs-sn--yellow", children: (
                      <>
                        <p>If the agent cannot help, keep what the person wrote and let them carry on.</p>
                        <small>Every row ends with what the product does when the agent fails.</small>
                      </>
                    ) },
                  ]}
                />
              </div>

            </div>
            <div className="cs-hw">
              <div className="cs-hw__row">
                <div className="cs-hw__head">
                  <span className="mono">02 / Settle it with the people building it</span>
                  <h3>From the workbook to the build</h3>
                  <p>
                    I drafted the rules and went through them with my product lead and the developer. One early
                    engineering draft would have blocked the client when the agent was unavailable. That was settled
                    before it was built, and the rule became the one below: if the agent cannot help in time, the
                    client&rsquo;s input goes through unchanged.
                  </p>
                  <p>
                    I took the agent from product requirements to production by working directly with AI during
                    implementation, which made every rule here something that had to be written precisely enough to
                    build.
                  </p>
                </div>
                <EvidenceCanvas
                  label="Shared PM-agent rules"
                  title="Shared rules"
                  curve
                  view={{ w: 1000, h: 440 }}
                  world={{ w: 1000, h: 440 }}
                  links={[
                    { a: "rules", b: "block", color: "var(--chart-amber)", from: [1, 0.25], to: [0, 0.5] },
                    { a: "rules", b: "source", color: "var(--chart-amber)", from: [1, 0.7], to: [0, 0.5] },
                  ]}
                  items={[
                    { id: "rules", x: 24, y: 24, w: 340, z: 1, tag: "Shared rules", label: "Workbook: shared PM-agent rules", href: `${SRC}/pm-shared-rules.jpg`, children: (
                      <Art name="pm-shared-rules" w={1277} h={1525} alt="PM-agent workbook, shared rules: one turn owner, escalate human decisions, remain transparently an agent, keep brand conflicts internal, never block, preserve source and interpretation, never repeat questions, separate coordination from creative judgement, preserve locked records." />
                    ) },
                    { id: "block", x: 420, y: 60, w: 400, z: 2, tag: "Rule", label: "Never become a workflow blocker", className: "cs-sn cs-sn--yellow", children: (
                      <>
                        <p>Never become a workflow blocker.</p>
                        <small>If the agent cannot answer in time, the client&rsquo;s input goes through unchanged.</small>
                      </>
                    ) },
                    { id: "source", x: 420, y: 230, w: 400, z: 2, tag: "Rule", label: "Preserve source and interpretation", className: "cs-sn cs-sn--mint", children: (
                      <>
                        <p>Keep the original beside the agent&rsquo;s version.</p>
                        <small>Added to stop client intent being rewritten without anyone noticing.</small>
                      </>
                    ) },
                  ]}
                />
              </div>
            </div>
          </section>

          <section id="map" className="cs-sec">
            <h2>Where it works, and where it stays out</h2>
            <p>
              Most moments have no agent in them, and that was on purpose. It says nothing at the first look at a
              creative or during a healthy wait, never sends progress messages, and never treats silence as approval.
              Where it does act, it only prepares something a person confirms.
            </p>
            <Blueprint />
          </section>

          <section id="decisions" className="cs-sec">
            <h2>Design decisions</h2>
            <p>Each of these three comes from a moment where the client and the designer need different things from the same brief.</p>
            <DecisionStories />
          </section>

          <section id="production" className="cs-sec">
            <h2>The shipped product</h2>
            <p>
              The agent has no screen of its own. It runs behind the brief flow: the client starts a brief and answers
              one question at a time, and the agent works from what they give it.
            </p>
            <div className="cs-ov">
              <input type="radio" name="cs-ov" id="cs-ov1" defaultChecked />
              <div className="cs-ov__panels">
                {(() => {
                  const clips = clipsFor(1);
                  return (
                    <div className="cs-ov__panel cs-ov__panel--1">
                      <div className="cs-frame">
                        <div className="cs-stage" tabIndex={0} role="group" aria-label="The client starts a brief: walkthrough video">
                          {clips.map((c) => (
                            <figure key={c.name}>
                              <SafeVideo src={`${FLOW_SRC}/${c.name}?v=${c.v}`} poster={c.poster ? `${FLOW_SRC}/${c.poster}?v=${c.v}` : undefined} label="The client starts a brief: product walkthrough" />
                            </figure>
                          ))}
                        </div>
                      </div>
                      {clips.length > 1 ? <p className="mono cs-stage__hint">Scroll sideways · {clips.length} videos</p> : null}
                    </div>
                  );
                })()}
              </div>
            </div>
          </section>

          <section id="reflection" className="cs-sec">
            <h2>Reflection</h2>
            <p>
              I went into this thinking the hard part would be defining what the agent should do. The harder part was
              figuring out what should happen around it.
            </p>
            <p>
              Working directly with AI helped me explore possibilities quickly, but it also made it easy to move forward
              before the underlying behaviour was fully resolved. A rule that seemed clear in isolation could create
              ambiguity elsewhere: when feedback conflicted, when a client changed their mind after sign-off, or when the
              agent couldn&rsquo;t confidently interpret a request.
            </p>
            <p>
              That pushed me to think beyond individual interactions. The agent wasn&rsquo;t serving one user in one
              moment. It sat between clients, designers and approvers, each with different responsibilities and
              different ideas of what a successful outcome looked like.
            </p>
            <p>
              I learned that designing AI behaviour isn&rsquo;t just about deciding what the system can do. It&rsquo;s
              also about defining what it shouldn&rsquo;t decide, what happens when it gets something wrong, and where a
              person needs to step back in.
            </p>
            <p>
              The shipped workflow reflects those decisions. But without usability testing or outcome data, I
              can&rsquo;t yet say how effectively it works in practice. That&rsquo;s the next thing I&rsquo;d want to
              validate.
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
