import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { keepTogether } from "@/lib/keep-together";

describe("keepTogether", () => {
  it("wraps hyphenated terms in a no-wrap span without changing the text", () => {
    const { container } = render(<h2>{keepTogether("Understanding Non-QM Financing.")}</h2>);
    expect(container.textContent).toBe("Understanding Non-QM Financing.");
    const span = container.querySelector("span.whitespace-nowrap");
    expect(span?.textContent).toBe("Non-QM");
  });

  it("returns plain strings unchanged", () => {
    expect(keepTogether("Residential Loans")).toBe("Residential Loans");
  });
});
