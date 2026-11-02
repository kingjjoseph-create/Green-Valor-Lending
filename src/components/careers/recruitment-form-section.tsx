"use client";

import { useSearchParams } from "next/navigation";

import { RecruitmentForm } from "./recruitment-form";

/**
 * Reads ?pathway= so the pathway CTAs can preselect the applicant category.
 * Must render inside <Suspense>; the fallback is the same form without a
 * preselection, so the form is usable before hydration.
 */
export function RecruitmentFormWithParams() {
  const params = useSearchParams();
  return <RecruitmentForm requestedPathway={params.get("pathway")} />;
}
