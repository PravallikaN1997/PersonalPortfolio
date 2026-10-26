import type { Metadata } from "next";
import { Suspense } from "react";
import { hasAccess } from "@/lib/case-study-access";
import { PasswordGate } from "../ownership-and-progress/_components/password-gate";
import { CaseStudyContent } from "./_content/case-study-content";

const TITLE = "When should the AI speak?";
const PATH = "/work/when-should-the-ai-speak";

// Keep this case study out of search results, whether or not the visitor is signed in.
export const metadata: Metadata = {
  title: TITLE,
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function Page() {
  return (
    <Suspense fallback={<GateFallback />}>
      <AccessGate />
    </Suspense>
  );
}

// The cookie is read on the server, per request. Protected content is only rendered
// when the signed session is valid.
async function AccessGate() {
  return (await hasAccess()) ? <CaseStudyContent title={TITLE} /> : <PasswordGate title={TITLE} returnTo={PATH} />;
}

function GateFallback() {
  return (
    <section className="wrap gate" aria-busy="true">
      <div className="gate__inner">
        <p className="eyebrow mono" style={{ justifyContent: "center" }}>Case study</p>
        <p className="display gate__title">{TITLE}</p>
      </div>
    </section>
  );
}
