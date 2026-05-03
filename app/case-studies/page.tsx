export const dynamic = 'force-dynamic';

import { getCaseStudies } from "@/lib/data";
import { CaseStudiesClient } from "./CaseStudiesClient";

export default async function CaseStudiesPage() {
  const caseStudies = await getCaseStudies().catch(() => []);
  return <CaseStudiesClient initialCaseStudies={caseStudies} />;
}
