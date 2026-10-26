// DRAFT card copy, derived only from the locked-direction brief.
// Review every description before publishing. No metrics, no outcomes.
export type Project = {
  number: string;
  slug: string;
  title: string;
  description: string;
  meta: string[];
  /** Optional small tag shown after the eyebrow text, e.g. "B2B". */
  pill?: string;
  /** Optional external link. When set, the card opens it in a new tab instead of /work/<slug>. */
  href?: string;
  /** Text for the card link. Defaults to "View case study". */
  cta?: string;
  featured?: boolean;
  independent?: boolean;
  /** Optional still cover image. File lives in /public/media. */
  image?: string;
  /** Optional code-drawn cover. */
  cover?: "question" | "blueprint" | "dots" | "spark" | "ascent" | "clara";
  /** Optional silent preview shown in the card. Files live in /public/media. */
  video?: { mp4: string; webm?: string; poster: string };
};

export const projects: Project[] = [
  {
    number: "01",
    slug: "ownership-and-progress",
    title: "Ownership and progress in a multi-actor creative workflow",
    description:
      "Vintage is an AI-assisted creative platform with expert designers in the loop. I designed how clients, an AI PM agent and designers share ownership of each brief, from first request to approval.",
    meta: ["Ownpath", "Shipped product work"],
    pill: "B2B",
    featured: true,
    video: {
      mp4: "/media/ownership-and-progress.mp4",
      webm: "/media/ownership-and-progress.webm",
      poster: "/media/ownership-and-progress-poster.jpg",
    },
  },
  {
    number: "02",
    slug: "when-should-the-ai-speak",
    title: "Deciding when an AI agent should speak, and when to stay quiet",
    description:
      "Vintage's PM agent works in the background between clients, designers and approvers. I designed the moments it acts, the moments it stays out of, and the rules it follows when it cannot help.",
    meta: ["Ownpath", "Shipped product work"],
    pill: "B2B",
    cover: "dots",
  },
  {
    number: "03",
    slug: "knowledge-health",
    title: "When documentation stops being trusted",
    description:
      "At CCA I could find information, but I could not tell whether to trust it. I looked at why documentation goes stale and designed a maintenance layer that shows when knowledge needs attention.",
    meta: ["CCA", "Product design"],
    href: "https://www.figma.com/deck/S842ht9e8fDbBvGrUMZ9DG",
    cta: "View deck",
    image: "/media/cca-logo-cover.jpg",
  },
  {
    number: "04",
    slug: "ascent",
    title: "Helping incident commanders see who needs rehab",
    description:
      "Ascent’s incident command product helps a commander keep track of firefighters during an incident. With a team of six, I helped choose the health signals that matter and designed the readiness-and-rehab screens, so a commander can see who needs attention and act on it.",
    meta: ["Ascent Integrated Tech", "Product design"],
    cover: "ascent",
  },
  {
    number: "05",
    slug: "clara",
    title: "Designing burnout recovery that keeps a therapist in the loop",
    description:
      "Clara is an academic concept for student burnout recovery: a voice-guided AI leads the daily steps and a therapist joins at set times. Our team designed the onboarding, the roadmap and the therapist flow, then tested the prototype with students and experts.",
    meta: ["Academic project", "Mental health"],
    cover: "clara",
  },
];
