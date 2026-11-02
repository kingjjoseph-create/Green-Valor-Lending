/**
 * Legal page content model. Text may contain links written as
 * [label](/internal-path) or [label](https://external.example), rendered by
 * src/components/legal/rich-text.tsx. A nested string array is a bullet list.
 */
export type LegalBlock = string | string[];

export type LegalSection = {
  id: string;
  heading: string;
  body: LegalBlock[];
};

export type LegalPageContent = {
  eyebrow: string;
  title: string;
  description: string;
  /** Short note shown in the draft banner while counsel has not approved the page. */
  draftNote: string;
  sections: LegalSection[];
};
