/**
 * Team profiles for the About page.
 *
 * Publish a profile ONLY after the company provides and approves it. Do not
 * add placeholder or sample people. A profile is shown on the site only when
 * `approved` is true. Portraits must be licensed, local files under
 * /public/images/team/ and recorded in docs/IMAGE_LICENSES.md.
 */
import type { ImageAsset } from "./images";

export type TeamMember = {
  /** Stable slug, e.g. "jane-doe". */
  id: string;
  name: string;
  /** Professional title exactly as approved by the company. */
  title: string;
  /** Individual NMLS ID; include only when provided and verifiable in NMLS Consumer Access. */
  nmlsId?: string;
  /** Short approved biography (optional). */
  bio?: string;
  portrait?: ImageAsset;
  /** Must be true, set by a person with approval authority, before the profile appears. */
  approved: boolean;
};

export const teamMembers: TeamMember[] = [];

/** Profiles that may be shown publicly. */
export function publishedTeam(members: TeamMember[] = teamMembers): TeamMember[] {
  return members.filter((m) => m.approved && m.name.trim() !== "" && m.title.trim() !== "");
}
