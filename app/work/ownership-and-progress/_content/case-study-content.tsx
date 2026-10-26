// PROTECTED CONTENT. Rendered only after the server has verified access.
// Keep this a Server Component: no "use client", and never import it from a Client Component.
// Images are served by the gated /media route; do not put confidential files in /public.
import { existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import Link from "next/link";
import { projects } from "@/lib/projects";
import { DecisionStories } from "../_components/decision-stories";
import { EvidenceCanvas } from "../_components/evidence-canvas";
import { OvPause } from "../_components/ov-pause";
import { SafeVideo } from "../_components/safe-video";
import { SectionNav } from "../_components/section-nav";

const NAV = [
  ["overview", "Overview"],
  ["problem", "The problem"],
  ["work", "The process"],
  ["decisions", "Design decisions"],
  ["production", "The shipped product"],
  ["reflection", "Reflection"],
] as const;

export const STEPS: readonly { tab: string; note: string }[] = [
  { tab: "The client starts a brief", note: "Creative or Deck comes first (decision 01). The brief then builds up one question at a time, and the client reviews it before sending it to Ownpath." },
  { tab: "Ownpath assigns the work", note: "Every brief sits in one queue, grouped by stage. Ownpath assigns a designer from here (decision 03), so each brief has one owner." },
  { tab: "The designer creates", note: "The designer sees only the briefs assigned to them, grouped as Assigned, In production and Done (decision 03)." },
  { tab: "The client reviews", note: "The client sees a creative that is ready for review, with two choices: Request changes or Approve this version (decision 04)." },
];


const CLEAR: readonly (readonly [string, string, string])[] = [
  ["01 / Context", "What does the next person need to know?", "A thin brief can reach a designer with gaps nobody noticed."],
  ["02 / Ownership", "Who has the next move?", "It is hard to see where the work stands or who owns it."],
  ["03 / Versions", "Which version is current, and which feedback counts?", "After a few rounds of iterations and comments, it is hard to say which creative is the latest and what has actually been asked for."],
] as const;

const SRC = "/work/ownership-and-progress/media";

const MEDIA_DIR = path.join(process.cwd(), "app", "work", "ownership-and-progress", "_media");

// Walkthrough clips for the Overview steps: drop overview-1.mp4, overview-1-b.mp4, overview-2.mp4 ...
// into _media and they appear. An optional matching .jpg (overview-1.jpg) is used as the poster.
export function clipsFor(step: number): { name: string; poster: string | null; v: number }[] {
  try {
    return readdirSync(MEDIA_DIR)
      .filter((f) => f.startsWith(`overview-${step}`) && f.endsWith(".mp4") && /^[a-z0-9-]+\.mp4$/.test(f))
      .sort()
      .map((f) => {
        const base = f.replace(/\.mp4$/, "");
        return {
          name: f,
          poster: existsSync(path.join(MEDIA_DIR, `${base}.jpg`)) ? `${base}.jpg` : null,
          v: Math.floor(statSync(path.join(MEDIA_DIR, f)).mtimeMs), // cache-bust when a clip is replaced
        };
      });
  } catch {
    return [];
  }
}

type Msg = { who: string; initial: string; tone: "p" | "d" | "g"; text: string };

function Thread({ messages }: { messages: Msg[] }) {
  const [first, ...rest] = messages;
  const row = (m: Msg, reply?: boolean) => (
    <div className={`cs-th__msg${reply ? " is-reply" : ""}`} key={m.text}>
      <span className={`cs-th__av cs-th__av--${m.tone}`} aria-hidden="true">{m.initial}</span>
      <div>
        <b>{m.who}</b>
        <p>{m.text}</p>
      </div>
    </div>
  );
  return (
    <div className="cs-th__body">
      {row(first)}
      {rest.length ? <div className="cs-th__count mono">{rest.length} {rest.length === 1 ? "reply" : "replies"}</div> : null}
      {rest.map((m) => row(m, true))}
    </div>
  );
}

function Art({ name, w, h, alt, hl }: { name: string; w: number; h: number; alt: string; hl?: { top: string; height: string; tone: "pink" | "lav" } }) {
  return (
    <a className="cs-cv__art" href={`${SRC}/${name}.jpg`} target="_blank" rel="noopener" aria-label={`Open larger: ${alt}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${SRC}/${name}.jpg`} width={w} height={h} alt={alt} draggable={false} loading="lazy" decoding="async" />
      {hl ? <span className={`cs-hl cs-hl--${hl.tone}`} style={{ top: hl.top, height: hl.height }} aria-hidden="true" /> : null}
    </a>
  );
}

// The next project in the portfolio that actually has a page; none means the link is left out.
function nextProject() {
  const at = projects.findIndex((p) => p.slug === "ownership-and-progress");
  return projects
    .slice(at + 1)
    .find((p) => existsSync(path.join(process.cwd(), "app", "work", p.slug, "page.tsx")));
}

export function CaseStudyContent({ title }: { title: string }) {
  const next = nextProject();
  return (
    <article className="wrap cs unlock-fade">
      <header className="cs-hero">
        <p className="mono eyebrow cs-eyebrow-row"><span>01 · Ownpath · Vintage · 2026</span><span className="cs-pill">B2B</span></p>
        <h1 className="display display--sm cs-title">{title}</h1>
        <p className="cs-lede">
          Vintage is a B2B, AI-assisted creative production platform from Ownpath, built for marketing and sales
          teams. It captures a brand&rsquo;s colours, type and logos from its website, turns plain-language briefs
          into on-brand creatives and decks, and keeps a human in the loop: Ownpath&rsquo;s expert designers can make
          or review the work.
        </p>
        <dl className="cs-meta">
          <div><dt className="mono">Team</dt><dd>Me, my product lead and one developer</dd></div>
          <div><dt className="mono">My part</dt><dd>Designed the workflow from scratch: journeys, scenarios, PM-agent rules and product decisions</dd></div>
          <div><dt className="mono">Status</dt><dd>Shipped to production · <a href="https://govintage.ai/" target="_blank" rel="noopener noreferrer">govintage.ai ↗</a></dd></div>
        </dl>
      </header>

      <div className="cs-layout">
        <SectionNav items={NAV} />

        <div className="cs-body">
          <section id="overview" className="cs-sec">
            <h2>Overview</h2>
            <p>
              In Vintage, an AI agent called the PM agent runs the work from the first brief to the last round of
              changes. While a client writes a brief, it points out what is missing. When the client sends changes, it
              checks the feedback. It never stops the client from moving on.
            </p>
            <p>
              A client can get a creative made in two ways: generate it with AI, or hand the brief to Ownpath&rsquo;s
              designers. This case study is about the second way. Ownpath assigns a designer, the designer makes the
              asset, and the client reviews it and approves it.
            </p>
            <p>Below is how a client starts a brief, in the first version and in the current version.</p>
            <div className="cs-pn">
              <input type="radio" name="cs-pn" id="cs-pn1" defaultChecked />
              <input type="radio" name="cs-pn" id="cs-pn2" />
              <div className="cs-pn__bar" role="presentation">
                <label htmlFor="cs-pn1">First version</label>
                <label htmlFor="cs-pn2">Current version</label>
              </div>
              <div className="cs-pn__panels">
                <div className="cs-pn__panel cs-pn__panel--1">
                  <p className="cs-pn__cap">Describe the request in one box, then answer follow-up questions in the thread.</p>
                  <div className="cs-frame">
                    <SafeVideo src={`${SRC}/phase1-start.mp4`} poster={`${SRC}/phase1-start.jpg`} label="First version: starting a brief" />
                  </div>
                </div>
                <div className="cs-pn__panel cs-pn__panel--2">
                  <p className="cs-pn__cap">Choose Creative or Deck, answer one question at a time, then review the brief and send it to Ownpath.</p>
                  <div className="cs-frame">
                    <SafeVideo src={`${SRC}/overview-1.mp4`} poster={`${SRC}/overview-1.jpg`} label="Current version: starting a brief" />
                  </div>
                </div>
              </div>
            </div>
            <OvPause />
          </section>

          <section id="problem" className="cs-sec">
            <h2>The problem</h2>
            <p className="cs-big">AI is fast, but it lacks design expertise.</p>
            <p>
              AI tools can now make a design in seconds. Canva, for example, can generate designs from a team&rsquo;s
              brand kit. But AI lacks design expertise. It cannot judge what fits the brand or what is worth showing
              to an audience. Design services like Superside solve that with a dedicated team of designers.
            </p>
            <p>
              Vintage combines the two. AI does the fast work, and Ownpath&rsquo;s designers bring the expertise. But
              now many people touch one request: the client, the PM agent, operations and a designer. That makes three
              things easy to lose track of: whether the brief has what the designer needs, who owns the work right
              now, and which version is the latest.
            </p>
            <span className="mono cs-eyebrow">Three things that got unclear</span>
            <ul className="cs-tens">
              {CLEAR.map(([label, q, note]) => (
                <li key={label}>
                  <span className="mono">{label}</span>
                  <h3>{q}</h3>
                  <p>{note}</p>
                </li>
              ))}
            </ul>
            <div className="cs-dq">
              <span className="mono">The design question</span>
              <p>How might we make the next step clear to everyone, without exposing the complexity behind the scenes?</p>
            </div>
          </section>

          <section id="work" className="cs-sec">
            <h2>The process</h2>
            <p>
              I could not answer those three questions by guessing. So I mapped what clients and designers go through, wrote out what
              could go wrong, and talked the open questions through with my product lead and a developer. The result
              was a set of rules for how the workflow behaves. Those rules became the four decisions below.
            </p>
            <div className="cs-hw">
              <div className="cs-hw__row">
                <div className="cs-hw__head">
                  <span className="mono">01 / Explore</span>
                  <h3>Find where people lose confidence</h3>
                  <p>
                    I began by interviewing nine people: heads of marketing, marketers, designers and someone from
                    operations. I asked how creative work like decks actually gets made. From those conversations, I
                    mapped the client journey, looking for moments where a client, a designer or someone in operations
                    might stop trusting what they see after a handoff.
                  </p>
                  <p className="cs-hw__next"><span className="mono">Led to</span>The three questions above: context, ownership and versions.</p>
                </div>
                <EvidenceCanvas
                  label="Workflow exploration canvas: the anxiety map, FigJam artefacts, the workbook insight and the design question"
                  title="Workflow exploration canvas"
                  curve
                  view={{ w: 1000, h: 690 }}
                  world={{ w: 1000, h: 690 }}
                  links={[
                    { a: "map", b: "insight", color: "#d9a420", from: [0.3, 1], to: [0.3, 0] },
                    { a: "insight", b: "question", color: "#d9578b", from: [1, 0.5], to: [0, 0.5] },
                    { a: "roles", b: "question", color: "#d9578b", from: [0, 0.5], to: [1, 0.5] },
                  ]}
                  items={[
                    { id: "map", x: 24, y: 44, w: 440, z: 1, tag: "Anxiety map · FigJam", label: "FigJam anxiety map across five stages", href: `${SRC}/anxiety-map.jpg`, children: (
                      <Art name="anxiety-map" w={2200} h={1611} alt="FigJam board of anxieties across five stages: intake and pickup, direction, execution, review and feedback, recovery and revision." />
                    ) },
                    { id: "timeline", x: 500, y: 44, w: 476, z: 1, tag: "FigJam · Shared timeline", label: "FigJam table: the shared timeline", href: `${SRC}/jam-timeline.jpg`, children: (
                      <Art name="jam-timeline" w={1400} h={900} alt="FigJam table, the shared timeline: what the client card and the Ownpath card show at each moment, and whose turn it is." />
                    ) },
                    { id: "roles", x: 716, y: 410, w: 260, z: 1, tag: "FigJam · Roles", label: "FigJam table: roles and permissions", href: `${SRC}/jam-roles.jpg`, children: (
                      <Art name="jam-roles" w={1400} h={933} alt="FigJam table, roles and permissions: what client, designer or workspace admin, and Ownpath superadmin can each do." />
                    ) },
                    { id: "insight", x: 24, y: 436, w: 300, z: 2, tag: "Client workbook", label: "Insight from the client workbook", className: "cs-sn cs-sn--yellow", children: (
                      <dl className="cs-row">
                        <div><dt className="mono">Intake</dt><dd>Clients need confidence that they&rsquo;ve communicated enough without making intake heavy.</dd></div>
                        <div><dt className="mono">Handoff</dt><dd>Client needs to understand exactly what has been handed over.</dd></div>
                      </dl>
                    ) },
                    { id: "question", x: 358, y: 436, w: 326, z: 2, tag: "Design question", label: "The design question", className: "cs-sn cs-sn--pink cs-sn--q", children: (
                      <>
                        <p>How might we make the brief handoff feel clear and trustworthy before the client commits to submitting it?</p>
                        <small>Also: How might we help clients give Ownpath enough useful context without making filing a brief feel like work?</small>
                      </>
                    ) },
                  ]}
                />
              </div>

              <div className="cs-hw__row">
                <div className="cs-hw__head">
                  <span className="mono">02 / Pressure-test</span>
                  <h3>Test the journeys against what could go wrong</h3>
                  <p>
                    I split the client journey into seven moments, from filing a brief to using the approved result.
                    I split the designer journey into six, from picking up a brief to closing it. For each moment I
                    wrote down what could go wrong, how that person would feel, and what the product should do.
                  </p>
                  <p className="cs-hw__next"><span className="mono">Led to</span>An expected response for each scenario, and a list of open questions for my product lead and a developer.</p>
                </div>
                <EvidenceCanvas
                  label="Scenario exploration canvas: client and designer workbook scenarios with the uncertainties they raised"
                  title="Scenario exploration canvas"
                  curve
                  view={{ w: 1000, h: 690 }}
                  world={{ w: 1000, h: 690 }}
                  links={[
                    { a: "sc", b: "c-unc", color: "#e0709a", from: [1, 0.55], to: [0, 0.35] },
                    { a: "sc", b: "des", color: "#2fb386", from: [0.55, 1], to: [0, 0.12] },
                    { a: "d-unc", b: "des", color: "#7a6be0", from: [1, 0.5], to: [0, 0.5] },
                    { a: "des", b: "expected", color: "#7a6be0", from: [1, 0.14], to: [0, 0.35] },
                  ]}
                  items={[
                    { id: "sc", x: 26, y: 56, w: 420, z: 1, tag: "Client workbook", label: "Client workbook scenarios", href: `${SRC}/x-sc.jpg`, children: (
                      <Art name="x-sc" w={1012} h={412} hl={{ top: "38.3%", height: "34%", tone: "pink" }} alt="Client workbook, scenarios sheet: File a brief, with normal, error and waiting cases and the expected response to each." />
                    ) },
                    { id: "c-unc", x: 514, y: 78, w: 170, z: 2, tag: "Client uncertainty", label: "Client uncertainty", className: "cs-sn cs-sn--pink", children: (
                      <>
                        <p>What happens if the client&rsquo;s brief is missing key context?</p>
                        <small>Can they fix it, or do we let them continue?</small>
                      </>
                    ) },
                    { id: "related", x: 724, y: 72, w: 190, z: 2, tag: "Related questions", label: "Related questions", className: "cs-sn cs-sn--yellow", children: (
                      <>
                        <p>What counts as &lsquo;enough&rsquo; context?</p>
                        <p style={{ marginTop: "0.6rem" }}>How do we give helpful guidance without making intake feel heavy?</p>
                      </>
                    ) },
                    { id: "handoff", x: 136, y: 300, w: 160, z: 2, tag: "Handoff connection", label: "Handoff connection", className: "cs-sn cs-sn--mint", children: (
                      <p>An incomplete or conflicting brief can lead to confusion after the handoff.</p>
                    ) },
                    { id: "des", x: 386, y: 302, w: 386, z: 2, tag: "Designer workbook", label: "Designer workbook sub-scenarios", href: `${SRC}/x-des.jpg`, children: (
                      <Art name="x-des" w={1011} h={690} hl={{ top: "7.5%", height: "17.4%", tone: "lav" }} alt="Designer workbook, sub-scenarios sheet: Pick up brief, with error, wait and status cases and the expected response to each." />
                    ) },
                    { id: "d-unc", x: 112, y: 490, w: 180, z: 3, tag: "Designer uncertainty", label: "Designer uncertainty", className: "cs-sn cs-sn--lav", children: (
                      <>
                        <p>The brief is assigned, but the designer cannot open it.</p>
                        <small>Do they know why, and what to do next?</small>
                      </>
                    ) },
                    { id: "expected", x: 810, y: 344, w: 170, z: 2, tag: "Expected response", label: "Expected response", className: "cs-sn cs-sn--yellow", children: (
                      <p>Keep the brief visible and show a clear error with retry or resolution guidance.</p>
                    ) },
                  ]}
                />
              </div>

              <div className="cs-hw__row">
                <div className="cs-hw__head">
                  <span className="mono">03 / Refine</span>
                  <h3>Settle the unclear cases</h3>
                  <p>
                    I took the unclear cases to my product lead and a developer. Their answers became explicit rules for
                    ownership, feedback and revisions.
                  </p>
                  <p className="cs-hw__next"><span className="mono">Led to</span>Rules such as: comments stay discussion until a change request is submitted, and the PM agent flags gaps without ever blocking the client. I settled these with my product lead.</p>
                </div>
                <div className="cs-exs">
                  <div className="cs-ex">
                    <div className="cs-ex__head">
                      <span className="mono">A</span>
                      <h4>Is a comment a change request?</h4>
                    </div>
                    <EvidenceCanvas
                      label="Example A: feedback versus a submitted change request"
                      view={{ w: 880, h: 530 }}
                      world={{ w: 920, h: 570 }}
                      links={[["a-thread", "a-row"], ["a-thread", "a-decision"], ["a-prd", "a-decision"]]}
                      items={[
                        { id: "a-thread", x: 24, y: 24, w: 340, z: 4, tag: "Review comment", label: "Review thread: is a comment a change request or a discussion", className: "cs-th", children: (
                          <Thread
                            messages={[
                              { who: "Me", initial: "M", tone: "d", text: "If the client adds a comment, do we treat it as a change request or just a discussion? We should make this distinction clear in the product." },
                              { who: "Product Lead", initial: "P", tone: "p", text: "Let\u2019s keep comments as discussion and add a separate action to submit a change request." },
                            ]}
                          />
                        ) },
                        { id: "a-row", x: 404, y: 24, w: 452, z: 3, tag: "Client workbook", label: "Client workbook scenario for feedback that is gathered but not submitted", className: "cs-cv__card", children: (
                          <dl className="cs-row">
                            <div><dt className="mono">Scenario</dt><dd>Feedback has been gathered but hasn&rsquo;t been submitted to Ownpath</dd></div>
                            <div><dt className="mono">Acceptance criteria</dt><dd>Client knows Ownpath hasn&rsquo;t received the final change request until it is submitted</dd></div>
                          </dl>
                        ) },
                        { id: "a-prd", x: 404, y: 200, w: 452, z: 2, tag: "Product requirements", label: "Product requirements on comments and reviewer completion", className: "cs-cv__card cs-cv__doc", children: (
                          <>
                            <p><mark>Pins are saved as comments are drafted, but the revision workflow does not begin until feedback is confirmed and submitted.</mark></p>
                            <p><mark>Adding a comment does not mark a reviewer complete.</mark></p>
                          </>
                        ) },
                        { id: "a-decision", x: 24, y: 367, w: 580, z: 5, tag: "Product decision", label: "Decision: comments stay discussion until feedback is submitted", className: "cs-cv__card cs-cv__decision", children: (
                          <>
                            <p>Comments stay discussion. A separate, explicit action submits a change request.</p>
                            <small>The revision workflow does not begin just because a comment exists.</small>
                          </>
                        ) },
                      ]}
                    />
                  </div>

                  <div className="cs-ex">
                    <div className="cs-ex__head">
                      <span className="mono">B</span>
                      <h4>What if the PM agent is unavailable?</h4>
                    </div>
                    <EvidenceCanvas
                      label="Example B: what happens when the PM agent is unavailable"
                      view={{ w: 880, h: 570 }}
                      world={{ w: 920, h: 610 }}
                      links={[["c-eng", "c-rule"], ["c-rule", "c-decision"], ["c-prd", "c-decision"]]}
                      items={[
                        { id: "c-eng", x: 24, y: 24, w: 360, z: 4, tag: "Review comment", label: "Developer's question and the Product Lead's answer on PM-agent failure", className: "cs-th", children: (
                          <Thread
                            messages={[
                              { who: "Developer", initial: "D", tone: "g", text: "If the PM agent is unavailable, should \u201cSend changes\u201d be blocked?" },
                              { who: "Product Lead", initial: "P", tone: "p", text: "No. The PM agent is never a workflow blocker. If it can\u2019t respond, the client\u2019s input passes through unchanged." },
                            ]}
                          />
                        ) },
                        { id: "c-rule", x: 424, y: 24, w: 432, z: 2, tag: "PM agent rules", label: "PM agent workbook: never become a workflow blocker", className: "cs-cv__card", children: (
                          <dl className="cs-row">
                            <div><dt className="mono">Shared rule</dt><dd>Never become a workflow blocker. Degrade to passthrough.</dd></div>
                            <div><dt className="mono">Client side</dt><dd>If the PM agent is unavailable or cannot complete the check, preserve the client&rsquo;s original input and allow submission. Show that the check was skipped.</dd></div>
                          </dl>
                        ) },
                        { id: "c-prd", x: 24, y: 267, w: 360, z: 2, tag: "Product requirements", label: "Product requirements: manual confirmation remains possible", className: "cs-cv__card cs-cv__doc", children: (
                          <>
                            <p>Test: PM unavailable.</p>
                            <p><mark>Manual feedback confirmation remains possible.</mark></p>
                          </>
                        ) },
                        { id: "c-decision", x: 24, y: 413, w: 560, z: 5, tag: "Product decision", label: "Decision: the PM agent never blocks the workflow", className: "cs-cv__card cs-cv__decision", children: (
                          <>
                            <p>The PM agent never blocks the workflow. When it is unavailable, the original input is kept, the check is shown as skipped, and the client can still continue.</p>
                          </>
                        ) },
                      ]}
                    />
                  </div>
</div>
              </div>
            </div>
          </section>

          <section id="decisions" className="cs-sec">
            <h2>Design decisions</h2>
            <p>
              Clients should not need to know how a creative is produced. Designers and operations still need enough
              context to do the work without guessing. These four decisions balance the two.
            </p>
            <DecisionStories />
          </section>

          <section id="production" className="cs-sec">
            <h2>The shipped product</h2>
            <p>Here is the same flow in the live product. Each step points back to a decision above.</p>
            <div className="cs-ov">
              {STEPS.map((_, i) => <input key={i} type="radio" name="cs-ov" id={`cs-ov${i + 1}`} defaultChecked={i === 0} />)}
              <div className="cs-ov__bar" role="presentation">
                {STEPS.map((st, i) => (
                  <label key={st.tab} htmlFor={`cs-ov${i + 1}`}><span className="mono">{i + 1}</span>{st.tab}</label>
                ))}
              </div>
              <div className="cs-ov__panels">
                {STEPS.map((st, i) => {
                  const clips = clipsFor(i + 1);
                  return (
                    <div className={`cs-ov__panel cs-ov__panel--${i + 1}`} key={st.tab}>
                      <p className="cs-ov__note">{st.note}</p>
                      <div className="cs-frame">
                      <div className="cs-stage" tabIndex={0} role="group" aria-label={`${st.tab}: walkthrough video`}>
                        {clips.map((c) => (
                          <figure key={c.name}>
                            <SafeVideo src={`${SRC}/${c.name}?v=${c.v}`} poster={c.poster ? `${SRC}/${c.poster}?v=${c.v}` : undefined} label={`${st.tab}: product walkthrough`} />
                          </figure>
                        ))}
                        {!clips.length ? (
                          <figure className="cs-stage__ph">
                            <div className="mono">Walkthrough video to come</div>
                          </figure>
                        ) : null}
                      </div>
                      </div>
                      {clips.length > 1 ? <p className="mono cs-stage__hint">Scroll sideways · {clips.length} videos</p> : null}
                    </div>
                  );
                })}
              </div>
            </div>

          </section>

          <section id="reflection" className="cs-sec">
            <h2>Reflection</h2>
            <h3>Getting from a requirement to something real</h3>
            <p>
              A PRD can describe the intended flow, but implementation raises questions it cannot resolve on its own.
              What happens when a brief is incomplete? What should the client see while work is waiting on someone
              else? Where does a revision fit without losing the previous version? Working with the product lead and
              developer taught me that a design decision is only useful when it can be understood, implemented and
              carried through the actual workflow.
            </p>
            <h3>Moving fast with AI isn&rsquo;t the same as thinking things through</h3>
            <p>
              AI let me explore and execute ideas faster, but it could also get me ahead of the problem. A screen
              might look right in isolation while missing the states and handoffs that make it work in a larger
              product. I learnt to slow down, question the output and make the underlying decision myself. The value
              was in knowing what needed to be solved in the first place.
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
