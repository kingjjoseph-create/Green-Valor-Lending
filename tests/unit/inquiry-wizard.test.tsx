import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { InquiryWizard, SUCCESS_MESSAGE } from "@/components/get-started/inquiry-wizard";
import { GOALS } from "@/lib/inquiry/schema";

const fetchMock = vi.fn<typeof fetch>();
let now = 1_000_000;
beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
  now = 1_000_000;
  vi.spyOn(Date, "now").mockImplementation(() => now);
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const el = (name: string) => document.getElementById(`gs-${name}`) as HTMLInputElement;
const change = (name: string, value: string) => fireEvent.change(el(name), { target: { value } });
const next = () => fireEvent.click(screen.getByRole("button", { name: /^next/i }));
const back = () => fireEvent.click(screen.getByRole("button", { name: /back/i }));
const stepCount = () => screen.getByTestId("step-count").textContent;

function step1(goal = "purchase") {
  fireEvent.click(el(`goal-${goal}`));
  next();
}
function step2() {
  change("location", "Tampa");
  change("propertyType", "single-family");
  change("occupancy", "primary");
  change("estimatedValue", "425000");
  next();
}
function step3() {
  change("loanAmount", "340000");
  change("timeline", "1-3-months");
  next();
}
function step4() {
  change("fullName", "Morgan Lee");
  change("email", "morgan@example.com");
  change("phone", "(813) 555-0142");
  fireEvent.click(el("contactMethod-phone"));
  fireEvent.click(el("consent"));
  now += 30_000;
}
const submit = () => fireEvent.click(screen.getByRole("button", { name: /submit inquiry/i }));
function completeAll(goal = "purchase") {
  step1(goal);
  step2();
  step3();
  step4();
}

describe("InquiryWizard", () => {
  it("shows a 4-step progress indicator and the five goals", () => {
    render(<InquiryWizard />);
    expect(stepCount()).toBe("Step 1 of 4");
    const items = screen.getByTestId("progress").querySelectorAll("li");
    expect(items).toHaveLength(4);
    expect(items[0]!.getAttribute("aria-current")).toBe("step");
    for (const g of GOALS) expect(screen.getByText(g.label)).toBeTruthy();
  });

  it.each(GOALS.map((g) => g.value))("moves through every step with goal %s and submits it", async (goal) => {
    fetchMock.mockResolvedValue(Response.json({ ok: true }));
    render(<InquiryWizard />);
    step1(goal);
    expect(stepCount()).toBe("Step 2 of 4");
    step2();
    expect(stepCount()).toBe("Step 3 of 4");
    step3();
    expect(stepCount()).toBe("Step 4 of 4");
    step4();
    submit();
    expect(await screen.findByTestId("inquiry-success")).toBeTruthy();
    expect(JSON.parse(fetchMock.mock.calls[0]![1]!.body as string).goal).toBe(goal);
  });

  it("blocks Next until required fields on the step are complete", () => {
    render(<InquiryWizard />);
    next();
    expect(stepCount()).toBe("Step 1 of 4");
    expect(screen.getByRole("alert").textContent).toMatch(/choose what you would like/i);
    step1();
    next();
    expect(stepCount()).toBe("Step 2 of 4");
    expect(screen.getByText("Enter a city, county, or area in Florida.")).toBeTruthy();
    expect(screen.getByText("Select a property type.")).toBeTruthy();
    // Optional price stays optional.
    expect(screen.queryByText(/estimated price or value as a dollar amount/i)).toBeNull();
  });

  it("keeps every entry when moving back and forward", () => {
    render(<InquiryWizard />);
    step1("refinance");
    step2();
    change("notes", "Self-employed since 2021.");
    change("timeline", "exploring");
    back();
    expect(stepCount()).toBe("Step 2 of 4");
    expect(el("location").value).toBe("Tampa");
    expect(el("estimatedValue").value).toBe("425000");
    back();
    expect((el("goal-refinance") as HTMLInputElement).checked).toBe(true);
    next();
    next();
    expect(el("notes").value).toBe("Self-employed since 2021.");
    expect(el("timeline").value).toBe("exploring");
  });

  it("defaults to Florida and explains the Florida-only restriction for other states", () => {
    render(<InquiryWizard />);
    step1();
    expect(el("propertyState").value).toBe("FL");
    change("propertyState", "GA");
    expect(screen.getByTestId("florida-only").textContent).toMatch(/serves properties in Florida only/);
    change("location", "Atlanta");
    change("propertyType", "condo");
    change("occupancy", "primary");
    next();
    expect(stepCount()).toBe("Step 2 of 4");
    change("propertyState", "FL");
    expect(screen.queryByTestId("florida-only")).toBeNull();
    next();
    expect(stepCount()).toBe("Step 3 of 4");
  });

  it("rejects invalid numbers and formats valid ones", () => {
    render(<InquiryWizard />);
    step1();
    change("location", "Tampa");
    change("propertyType", "condo");
    change("occupancy", "primary");
    change("estimatedValue", "abc");
    next();
    expect(screen.getByText(/as a dollar amount/)).toBeTruthy();
    change("estimatedValue", "425000");
    fireEvent.blur(el("estimatedValue"));
    expect(el("estimatedValue").value).toBe("425,000");
    next();
    change("loanAmount", "500000");
    change("timeline", "asap");
    next();
    expect(screen.getByText(/can't be more than the estimated price/)).toBeTruthy();
    expect(stepCount()).toBe("Step 3 of 4");
  });

  it("never renders sensitive application fields", () => {
    const { container } = render(<InquiryWizard />);
    completeAll();
    const steps = [container.innerHTML];
    const names = [...container.querySelectorAll("input,select,textarea")].map(
      (e) => e.getAttribute("name") ?? "",
    );
    expect(
      names.some((n) =>
        /ssn|social|birth|dob|account|routing|tax|paystub|license|credit|income|employer/i.test(n),
      ),
    ).toBe(false);
    expect(container.querySelector('input[type="file"]')).toBeNull();
    expect(steps.join()).not.toMatch(/name="(ssn|dob)"/);
  });

  it("does not reset the form on Enter, and Enter advances a step", () => {
    render(<InquiryWizard />);
    fireEvent.click(el("goal-purchase"));
    fireEvent.submit(el("goal-purchase").closest("form")!);
    expect(stepCount()).toBe("Step 2 of 4");
    expect(screen.queryByRole("button", { name: /reset|clear/i })).toBeNull();
  });

  it("sends only once on double click and shows a loading state", () => {
    fetchMock.mockReturnValue(new Promise(() => {}));
    render(<InquiryWizard />);
    completeAll();
    const button = screen.getByRole("button", { name: /submit inquiry/i });
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.submit(button.closest("form")!);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect((screen.getByRole("button", { name: /sending/i }) as HTMLButtonElement).disabled).toBe(true);
    expect(screen.getByText("Sending your inquiry…")).toBeTruthy();
  });

  it("handles a network timeout without claiming success", async () => {
    fetchMock.mockRejectedValue(new DOMException("The operation timed out.", "TimeoutError"));
    render(<InquiryWizard />);
    completeAll();
    submit();
    expect((await screen.findByTestId("inquiry-submit-error")).textContent).toMatch(/timed out/);
    expect(screen.queryByTestId("inquiry-success")).toBeNull();
    expect(el("fullName").value).toBe("Morgan Lee");
  });

  it.each([
    [500, { ok: false }, /problem on our end/],
    [502, { ok: false, error: "delivery_failed" }, /problem on our end/],
    [503, { ok: false, error: "not_configured" }, /aren't available right now/],
    [429, { ok: false, error: "rate_limited" }, /too many/i],
    [400, { ok: false, error: "spam_check" }, /couldn't verify/],
    [200, { received: "maybe" }, /problem on our end/],
  ])("shows an error, never success, on HTTP %i", async (status, body, msg) => {
    fetchMock.mockResolvedValue(Response.json(body, { status }));
    render(<InquiryWizard />);
    completeAll();
    submit();
    expect((await screen.findByTestId("inquiry-submit-error")).textContent).toMatch(msg);
    expect(screen.queryByTestId("inquiry-success")).toBeNull();
  });

  it("returns to the step with a server-side validation error", async () => {
    fetchMock.mockResolvedValue(
      Response.json(
        { ok: false, error: "validation", errors: { location: "Enter a city." } },
        { status: 400 },
      ),
    );
    render(<InquiryWizard />);
    completeAll();
    submit();
    expect(await screen.findByText("Enter a city.")).toBeTruthy();
    expect(stepCount()).toBe("Step 2 of 4");
  });

  it("shows the approved confirmation and the ARIVE link only when configured", async () => {
    fetchMock.mockImplementation(async () => Response.json({ ok: true }));
    const { unmount } = render(<InquiryWizard applicationUrl="https://example.arive.com/apply" />);
    completeAll();
    submit();
    const success = await screen.findByTestId("inquiry-success");
    expect(success.textContent).toContain(SUCCESS_MESSAGE);
    expect(SUCCESS_MESSAGE).toBe(
      "Thank you for contacting Green Valor Lending. Your inquiry has been received. Our team will review your request and follow up using the contact information provided.",
    );
    expect(screen.getByText("Ready to Continue? Start Your Secure Mortgage Application.")).toBeTruthy();
    const link = screen.getByRole("link", { name: /start your secure mortgage application/i });
    expect(link.getAttribute("href")).toBe("https://example.arive.com/apply");
    expect(link.getAttribute("rel")).toContain("noopener");
    unmount();

    render(<InquiryWizard applicationUrl={null} />);
    completeAll();
    submit();
    await screen.findByTestId("inquiry-success");
    expect(screen.queryByTestId("arive-cta")).toBeNull();
    expect(screen.queryByRole("link", { name: /application/i })).toBeNull();
  });

  it("never writes applicant data to the console or browser storage", async () => {
    const spies = (["log", "info", "warn", "error", "debug"] as const).map((m) =>
      vi.spyOn(console, m).mockImplementation(() => {}),
    );
    const setItem = vi.spyOn(Storage.prototype, "setItem");
    fetchMock
      .mockResolvedValueOnce(Response.json({ ok: false }, { status: 502 }))
      .mockResolvedValue(Response.json({ ok: true }));
    render(<InquiryWizard />);
    completeAll();
    submit();
    await screen.findByTestId("inquiry-submit-error");
    submit();
    await screen.findByTestId("inquiry-success");
    const logged = JSON.stringify(spies.map((s) => s.mock.calls));
    expect(logged).not.toMatch(/Morgan|morgan@|555-0142|Tampa/);
    expect(setItem).not.toHaveBeenCalled();
  });
});
