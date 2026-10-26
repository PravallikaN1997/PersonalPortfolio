import Link from "next/link";
import type { Project } from "@/lib/projects";
import { CardVideo } from "@/components/card-video";
import { CoverArt } from "@/components/cover-art";

export function ProjectCard({ project }: { project: Project }) {
  const { number, slug, title, description, meta, featured, video, pill, image, cover, href, cta } = project;
  return (
    <Link
      href={href ?? `/work/${slug}`}
      {...(href ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`card${featured ? " card--featured" : ""}`}
    >
      <div
        className={`card__media${video ? " card__media--video" : ""}${image || cover ? " card__media--img" : ""}`}
        aria-hidden="true"
        // The poster also sits behind the video, so the card never shows grey if a browser leaves the video blank.
        style={video ? { backgroundImage: `url(${video.poster})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
      >
        {video ? (
          <CardVideo {...video} />
        ) : cover ? (
          <CoverArt variant={cover} />
        ) : image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" className="card__video" loading="lazy" />
        ) : (
          <span className="mono card__placeholder">Image to come</span>
        )}
      </div>
      <div className="card__body">
        <p className="mono card__meta">
          <span>{number}</span>
          {meta.map((m) => (
            <span key={m}>{m}</span>
          ))}
          {pill ? <span className="cs-pill card__pill">{pill}</span> : null}
        </p>
        <h3 className="card__title">
          {title.split(/(\S+-\S+)/).map((part, i) =>
            i % 2 ? (
              <span key={i} className="nobreak">
                {part}
              </span>
            ) : (
              part
            ),
          )}
        </h3>
        <p className="card__desc">{description}</p>
        <p className="card__cta">
          {cta ?? "View case study"} <span className="arrow" aria-hidden="true">↗</span>
        </p>
      </div>
    </Link>
  );
}
