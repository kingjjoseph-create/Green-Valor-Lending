import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { RecruitmentForm } from "@/components/careers/recruitment-form";
import { validInquiry } from "./fixtures/recruitment";

const fetchMock = vi.fn<typeof fetch>();
beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});
afterEach(() => vi.unstubAllGlobals());

const field = (label: RegExp) => screen.getByLabelText(label) as HTMLInputElement;
const byId = (name: string) => document.getElementById(`rf-${name}`) as HTMLInputElement;
const submit = () => fireEvent.click(screen.getByRole("button", { name: /submit inquiry/i }));

function fillValid() {
  fireEvent.change(field(/full name/i), { target: { value: validInquiry.fullName } });
  fireEvent.change(byId("email"), {
    target: { value: validInquiry.email },
  });
  fireEvent.change(byId("phone"), { target: { value: validInquiry.phone } });
  fireEvent.change(field(/florida location/i), { target: { value: validInquiry.location } });
  fireEvent.change(field(/current profession/i), { target: { value: validInquiry.profession } });
  fireEvent.change(field(/mortgage industry experience/i), { target: { value: validInquiry.experience } });
  fireEvent.change(field(/licensing status/i), { target: { value: validInquiry.licensingStatus } });
  fireEvent.change(field(/career pathway/i), { target: { value: validInquiry.pathway } });
  fireEvent.change(field(/why green valor/i), { target: { value: validInquiry.why } });
  fireEvent.click(screen.getByRole("radio", { name: "Email" }));
  fireEvent.click(screen.getByRole("checkbox"));
}

describe("RecruitmentForm", () => {
  it("has the requested fields and no mortgage application fields", () => {
    const { container } = render(<RecruitmentForm />);
    for (const label of [
      /full name/i,
      /florida location or intended work location/i,
      /current profession/i,
      /mortgage industry experience/i,
      /current mlo licensing status/i,
      /nmls id/i,
      /career pathway/i,
      /why green valor lending/i,
    ])
      expect(field(label)).toBeTruthy();
    expect(screen.getByRole("radiogroup", { name: /preferred contact method/i })).toBeTruthy();
    expect(container.querySelector('input[type="file"]')).toBeNull();
    const names = [...container.querySelectorAll("input,select,textarea")].map((e) => e.getAttribute("name"));
    for (const banned of [
      /loan/i,
      /property/i,
      /income/i,
      /ssn|social/i,
      /credit/i,
      /down/i,
      /asset/i,
      /dob|birth/i,
    ])
      expect(names.some((n) => n && banned.test(n))).toBe(false);
  });

  it("marks NMLS ID optional and uses mobile-friendly input types", () => {
    render(<RecruitmentForm />);
    expect(screen.getByText("(optional)")).toBeTruthy();
    expect(field(/nmls id/i).getAttribute("aria-required")).toBeNull();
    expect(byId("email").type).toBe("email");
    expect(byId("phone").type).toBe("tel");
    expect(field(/full name/i).getAttribute("autocomplete")).toBe("name");
  });

  it("rejects an empty submission without calling the server", () => {
    render(<RecruitmentForm />);
    submit();
    expect(fetchMock).not.toHaveBeenCalled();
    const summary = screen.getByTestId("recruitment-error-summary");
    expect(summary.textContent).toMatch(/Please correct 11 fields/);
    expect(field(/full name/i).getAttribute("aria-invalid")).toBe("true");
    expect(field(/full name/i).getAttribute("aria-describedby")).toContain("rf-fullName-error");
  });

  it("rejects an invalid email", () => {
    render(<RecruitmentForm />);
    fillValid();
    fireEvent.change(byId("email"), {
      target: { value: "jordan@example" },
    });
    submit();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.getAllByText(/enter a valid email address/i).length).toBeGreaterThan(0);
  });

  it("preselects the pathway requested by a CTA", () => {
    const { rerender } = render(<RecruitmentForm requestedPathway="licensed" />);
    expect(field(/career pathway/i).value).toBe("licensed");
    rerender(<RecruitmentForm requestedPathway="aspiring" />);
    expect(field(/career pathway/i).value).toBe("aspiring");
    rerender(<RecruitmentForm requestedPathway="not-a-pathway" />);
    expect(field(/career pathway/i).value).toBe("aspiring");
  });

  it("shows success only after the server confirms delivery", async () => {
    let resolve!: (r: Response) => void;
    fetchMock.mockReturnValue(new Promise((r) => (resolve = r)));
    render(<RecruitmentForm />);
    fillValid();
    submit();
    expect(screen.getByRole("button", { name: /sending/i })).toBeTruthy();
    expect(screen.queryByTestId("recruitment-success")).toBeNull();
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe("/api/recruitment");
    expect(JSON.parse(init!.body as string)).toMatchObject({ pathway: "aspiring", consent: true });
    await act(async () => resolve(Response.json({ ok: true })));
    expect(await screen.findByTestId("recruitment-success")).toBeTruthy();
    expect(screen.getByText(/does not guarantee an interview or employment/i)).toBeTruthy();
  });

  it.each([
    [503, /aren.t available right now/i],
    [502, /couldn.t send your inquiry/i],
    [500, /couldn.t send your inquiry/i],
    [429, /too many submissions/i],
  ])("never shows false success on HTTP %i", async (status, message) => {
    fetchMock.mockResolvedValue(Response.json({ ok: false }, { status }));
    render(<RecruitmentForm />);
    fillValid();
    submit();
    expect((await screen.findByTestId("recruitment-submit-error")).textContent).toMatch(message);
    expect(screen.queryByTestId("recruitment-success")).toBeNull();
    // The applicant's entries are kept for a retry.
    expect(field(/full name/i).value).toBe(validInquiry.fullName);
  });

  it("does not trust a 200 without an ok body", async () => {
    fetchMock.mockResolvedValue(new Response("<html>proxy page</html>", { status: 200 }));
    render(<RecruitmentForm />);
    fillValid();
    submit();
    await screen.findByTestId("recruitment-submit-error");
    expect(screen.queryByTestId("recruitment-success")).toBeNull();
  });

  it("handles network failure", async () => {
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));
    render(<RecruitmentForm />);
    fillValid();
    submit();
    await waitFor(() => expect(screen.getByTestId("recruitment-submit-error")).toBeTruthy());
    expect(screen.queryByTestId("recruitment-success")).toBeNull();
  });

  it("shows server-side field errors", async () => {
    fetchMock.mockResolvedValue(
      Response.json(
        {
          ok: false,
          error: "validation",
          errors: { email: "Enter a valid email address, like name@example.com." },
        },
        { status: 400 },
      ),
    );
    render(<RecruitmentForm />);
    fillValid();
    submit();
    expect(await screen.findByTestId("recruitment-error-summary")).toBeTruthy();
    expect(screen.queryByTestId("recruitment-success")).toBeNull();
  });

  it("states it is not a mortgage application and links the privacy policy", () => {
    render(<RecruitmentForm />);
    expect(screen.getAllByText(/not a mortgage application/i).length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: /privacy policy/i }).getAttribute("href")).toBe("/privacy");
  });
});
