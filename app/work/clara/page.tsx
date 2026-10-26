import type { Metadata } from "next";
import { CaseStudyContent } from "./_content/case-study-content";

const TITLE = "Designing burnout recovery that keeps a therapist in the loop";

export const metadata: Metadata = { title: TITLE };

export default function Page() {
  return <CaseStudyContent title={TITLE} />;
}
