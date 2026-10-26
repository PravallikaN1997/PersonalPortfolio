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

const SRC = "/work/clara/media";

function nextProject() {
  const at = projects.findIndex((p) => p.slug === "clara");
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

const DIRECTIONS: readonly (readonly [string, string, string])[] = [
  ["01 / Chosen", "AI-guided recovery with a therapist", "Daily recovery steps from the AI, therapist sessions at set times, and community and bundles as extras. Students can reach it on their own phone."],
  ["02 / Set aside", "VR role-play with support groups", "Immersive practice for situations that cause stress. But it needed headsets most students do not have, was harder to build, and made it harder to involve therapists."],
] as const;

const RESULTS: readonly (readonly [string, string, string])[] = [
  ["Hardest task", "3 of 4", "Experts could not find their latest session notes"],
  ["Easiest tasks", "4 of 4", "Experts finished the daily breathing task and reached emergency help"],
  ["SUS, four experts", "91.9", "Average usability score. A small sample, but all would use it often"],
] as const;

export function CaseStudyContent({ title }: { title: string }) {
  const next = nextProject();
  return (
    <article className="wrap cs unlock-fade">
      <header className="cs-hero">
        <p className="mono eyebrow cs-eyebrow-row"><span>05 · Interaction design practice</span><span className="cs-pill">Academic</span></p>
        <h1 className="display display--sm cs-title">{title}</h1>
        <p className="cs-lede">
          Clara is a burnout recovery app for university students. A voice-guided AI leads the daily recovery steps,
          and a therapist joins at set times. It was a course project for the ACM SIGCHI Student Design Competition
          brief, and was never launched.
        </p>
        <dl className="cs-meta">
          <div><dt className="mono">Team</dt><dd>Team Betelgeuse, five students</dd></div>
          <div><dt className="mono">My part</dt><dd>Research, interaction design, prototype and evaluation</dd></div>
          <div><dt className="mono">Status</dt><dd>Academic concept · prototype tested with 4 students and 4 experts, not launched</dd></div>
        </dl>
      </header>

      <div className="cs-layout">
        <SectionNav items={NAV} />

        <div className="cs-body">
          <section id="overview" className="cs-sec">
            <h2>Overview</h2>
            <p>
              Students burn out and wait too long to ask for help. Clara measures burnout with a short questionnaire,
              builds a recovery roadmap of small cognitive behavioural therapy tasks, and books therapist sessions
              whose frequency follows the score. The AI handles the everyday steps and a person handles the rest. We
              designed and prototyped it in Figma over one semester of Interaction Design Practice in 2022.
            </p>
            <figure className="cs-fig">
              <Art name="hero" w={1788} h={1600} alt="Clara mobile concept showing a warm illustrated scene of two people talking, with an invitation to share availability." />
              <figcaption>Clara, the app concept.</figcaption>
            </figure>
          </section>

          <section id="problem" className="cs-sec">
            <h2>The problem</h2>
            <p>
              We interviewed four students, three of whom were already getting professional help after burnout. Three
              things kept coming up: stigma stopped them asking for help, they did not want to burden friends and
              family, and deadlines pushed out sleep and meals, which made it worse. The apps we found covered general
              wellbeing, such as meditation, music and community, rather than burnout. And research warned that online
              therapy without a guide loses more people and can leave someone worse off after a wrong self-diagnosis.
            </p>
            <div className="cs-dq">
              <span className="mono">The design question</span>
              <p>How might an app help a burned-out student start recovering without waiting for a therapist, while keeping a person involved?</p>
            </div>
          </section>

          <section id="work" className="cs-sec">
            <h2>The process</h2>
            <p>
              We interviewed students, read the research and checked the idea with a clinical psychologist before
              sketching anything. Two things the psychologist said shaped the product.
            </p>
            <div className="cs-hw">
              <div className="cs-hw__row">
                <div className="cs-hw__head">
                  <span className="mono">01 / Synthesis</span>
                  <h3>From burnout signals to a concept</h3>
                  <p>The team mapped what students described against the research, then listed what a recovery app would need.</p>
                </div>
                <EvidenceCanvas
                  label="Research synthesis board"
                  title="Synthesis board"
                  curve
                  view={{ w: 1000, h: 470 }}
                  world={{ w: 1000, h: 470 }}
                  links={[
                    { a: "board", b: "n1", color: "#d9a420", from: [1, 0.2], to: [0, 0.5] },
                    { a: "board", b: "n2", color: "#d9578b", from: [1, 0.5], to: [0, 0.5] },
                    { a: "board", b: "n3", color: "#d9a420", from: [1, 0.8], to: [0, 0.5] },
                  ]}
                  items={[
                    { id: "board", x: 24, y: 24, w: 560, z: 1, tag: "Synthesis", label: "Research synthesis board", href: `${SRC}/brainstorming.jpg`, children: (
                      <Art name="brainstorming" w={2200} h={1768} alt="Whiteboard covered in notes mapping burnout symptoms, causes and ideas for recovery support." />
                    ) },
                    { id: "n1", x: 630, y: 40, w: 346, z: 2, tag: "Interviews", label: "Why students wait", className: "cs-sn cs-sn--yellow", children: <p>Stigma and not wanting to burden friends kept students from asking for help.</p> },
                    { id: "n2", x: 630, y: 170, w: 346, z: 2, tag: "Psychologist", label: "A guide", className: "cs-sn cs-sn--pink", children: <p>&ldquo;There needs to be someone who can guide you in your journey.&rdquo;</p> },
                    { id: "n3", x: 630, y: 300, w: 346, z: 2, tag: "Psychologist", label: "Open questionnaires", className: "cs-sn cs-sn--mint", children: <p>Burnout questionnaires are open-source, so a student can take one without a clinician.</p> },
                  ]}
                />
              </div>
            </div>
            <p>We weighed two directions before choosing one.</p>
            <ul className="cs-tens cs-tens--two">
              {DIRECTIONS.map(([label, q, note]) => (
                <li key={q}>
                  <span className="mono">{label}</span>
                  <h3>{q}</h3>
                  <p>{note}</p>
                </li>
              ))}
            </ul>
          </section>

          <section id="decisions" className="cs-sec">
            <h2>Design decisions</h2>
            <p>Three decisions shaped how Clara works.</p>
            <DecisionStories />
          </section>

          <section id="outcome" className="cs-sec">
            <h2>The outcome</h2>
            <p>
              This was a course concept, so there are no launch metrics. We tested the prototype with four students
              who had used similar apps or been in therapy for burnout, and with four experts: a clinical psychologist
              and three HCI master&rsquo;s students. Each person did four tasks.
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
            <p>
              Students and experts pointed at the same gaps. The only way to session notes was the therapy-day step in
              the roadmap, and the notes did not say who wrote them. Students could not see why a therapist was
              recommended or how often they would meet. The community had no way to post. And the SOS button only
              showed a hotline number, when people expected Clara to alert their therapist or ask a few questions
              first.
            </p>
            <div className="cs-pair">
              <figure className="cs-fig">
                <Art name="meeting-details" w={1242} h={2757} alt="Clara therapy day screen with the therapist profile, past session notes and a join call button." />
                <figcaption>Therapy day. Session notes sit here.</figcaption>
              </figure>
              <figure className="cs-fig">
                <Art name="task-details" w={1242} h={2757} alt="Clara screen confirming the meeting has ended, with meeting notes listed below." />
                <figcaption>After a session, with no hint of who wrote the notes.</figcaption>
              </figure>
            </div>
            <p>
              We wrote up fixes: show why a therapist was matched and how often they meet, add a second way into
              session notes, let students post and filter in the community, ask for feedback on each task, and make SOS
              reach a person. These remain recommendations. We have not retested them.
            </p>
            <div className="cs-dq">
              <span className="mono">What I would validate next</span>
              <p>
                How students choose a therapist and what makes one feel right. How therapists shape recovery tasks to
                keep people coming back. And what happens when a therapist finds something beyond burnout.
              </p>
            </div>
          </section>

          <section id="reflection" className="cs-sec">
            <h2>Reflection</h2>
            <p className="cs-big">The AI was easy to use. Finding the people was not.</p>
            <p>
              Every expert finished the daily task and reached emergency help, but three of four could not find their
              session notes, and students could not tell why a therapist was recommended. In a product that pairs
              software with a person, the route to the person needs as much design as the software.
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
