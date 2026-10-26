import type { Metadata } from "next";
import { CaseStudyContent } from "./_content/case-study-content";

const TITLE = "Helping incident commanders see who needs rehab";

export const metadata: Metadata = { title: TITLE };

export default function Page() {
  return <CaseStudyContent title={TITLE} />;
}
