"use server";

import { redirect } from "next/navigation";
import {
  safeReturn,
  checkPassword,
  clearFailures,
  clientKey,
  grantAccess,
  isConfigured,
  isLockedOut,
  recordFailure,
} from "@/lib/case-study-access";

export type UnlockState = { error: string } | undefined;

export async function unlockCaseStudy(
  _prev: UnlockState,
  formData: FormData,
): Promise<UnlockState> {
  if (!isConfigured()) {
    console.error("CASE_STUDY_PASSWORD / CASE_STUDY_SESSION_SECRET are not set.");
    return { error: "This case study isn't available right now. Please try again later." };
  }

  const key = await clientKey();
  if (isLockedOut(key)) {
    return { error: "Too many attempts. Please wait a few minutes and try again." };
  }

  const input = formData.get("password");
  if (typeof input !== "string" || input.length === 0) {
    return { error: "Enter the password to continue." };
  }

  if (input.length > 256 || !checkPassword(input)) {
    recordFailure(key);
    await new Promise((resolve) => setTimeout(resolve, 600));
    return { error: "That password doesn’t match. Try again." };
  }

  clearFailures(key);
  await grantAccess();
  redirect(safeReturn(formData.get("to")));
}
