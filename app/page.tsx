import { ProjectCard } from "@/components/project-card";
import { projects } from "@/lib/projects";
import { site } from "@/lib/site";

export default function Home() {
  return (
    <>
      <section className="hero wrap" aria-labelledby="hero-title">
        <p className="eyebrow eyebrow--status mono">
          <span className="eyebrow__dot" aria-hidden="true" />
          <span>
            {site.role} · {site.location}
          </span>
        </p>
        <h1 id="hero-title" className="display">
          I design how people and complex systems work together.
        </h1>
        <div className="hero__copy">
          <p>
            I work across product workflows and AI interactions, exploring how systems behave, how people navigate them, and what makes them easier to understand and trust.
          </p>
        </div>
      </section>

      <section id="work" className="work wrap" aria-labelledby="work-title">
        <div className="section-head">
          <h2 id="work-title">Selected Work</h2>
        </div>
        <div className="work__grid">
          {projects.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </section>
    </>
  );
}
