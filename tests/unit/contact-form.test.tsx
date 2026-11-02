import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ContactForm } from "@/components/contact/contact-form";
import { validContact } from "./fixtures/contact";

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

const byId = (name: string) => document.getElementById(`cf-${name}`) as HTMLInputElement;
const submit = () => fireEvent.click(screen.getByRole("button", { name: /send message/i }));

function fill(overrides: Partial<Record<string, string>> = {}) {
  const v = { ...validContact, ...overrides };
  fireEvent.change(byId("fullName"), { target: { value: v.fullName } });
  fireEvent.change(byId("email"), { target: { value: v.email } });
  fireEvent.change(byId("phone"), { target: { value: v.phone } });
  fireEvent.change(byId("reason"), { target: { value: v.reason } });
  fireEvent.change(byId("message"), { target: { value: v.message } });
  fireEvent.click(byId("consent"));
  now += 8000; // the visitor took a few seconds
}

describe("ContactForm", () => {
  it("renders the requested fields with mobile-friendly inputs and no application fields", () => {
    const { container } = render(<ContactForm />);
    expect(byId("email").type).toBe("email");
    expect(byId("email").getAttribute("inputmode")).toBe("email");
    expect(byId("phone").type).toBe("tel");
    expect(byId("phone").getAttribute("autocomplete")).toBe("tel");
    expect(byId("fullName").getAttribute("autocomplete")).toBe("name");
    const reasons = [...byId("reason").querySelectorAll("option")].map((o) => o.textContent);
    expect(reasons).toEqual([
      "Select one",
      "Residential Mortgage Inquiry",
      "Non-QM Mortgage Inquiry",
      "General Question",
      "Career Opportunity",
      "Other",
    ]);
    const names = [...container.querySelectorAll("input,select,textarea")].map((e) => e.getAttribute("name"));
    expect(names.some((n) => n && /income|ssn|social|credit|loan|property|dob/i.test(n))).toBe(false);
    expect(container.querySelector('input[type="file"]')).toBeNull();
  });

  it("rejects a blank form without contacting the server", () => {
    render(<ContactForm />);
    submit();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.getByTestId("contact-error-summary").textContent).toMatch(/Please correct 6 fields/);
    expect(byId("email").getAttribute("aria-invalid")).toBe("true");
  });

  it("rejects an invalid email and an invalid phone", () => {
    render(<ContactForm />);
    fill({ email: "pat@example", phone: "555-0100" });
    submit();
    expect(fetchMock).not.toHaveBeenCalled();
    const summary = screen.getByTestId("contact-error-summary").textContent;
    expect(summary).toMatch(/valid email/i);
    expect(summary).toMatch(/valid phone/i);
  });

  it("caps message length and shows a counter", () => {
    render(<ContactForm />);
    expect(byId("message").getAttribute("maxlength")).toBe("2000");
    fireEvent.change(byId("message"), { target: { value: "x".repeat(25) } });
    expect(screen.getByText("25 / 2,000 characters")).toBeTruthy();
  });

  it("routes Career Opportunity to the Careers form instead of submitting", () => {
    render(<ContactForm />);
    fireEvent.change(byId("reason"), { target: { value: "career" } });
    const notice = screen.getByTestId("contact-career-notice");
    expect(notice.textContent).toMatch(/recruitment form/i);
    expect(screen.getByRole("link", { name: /go to the careers form/i }).getAttribute("href")).toBe(
      "/careers#apply",
    );
    expect(screen.queryByRole("button", { name: /send message/i })).toBeNull();
    expect(byId("message")).toBeNull();
  });

  it("shows confirmation only after the backend accepts, and sends fill time", async () => {
    let resolve!: (r: Response) => void;
    fetchMock.mockReturnValue(new Promise((r) => (resolve = r)));
    render(<ContactForm />);
    fill();
    submit();
    expect(screen.getByRole("button", { name: /sending/i })).toBeTruthy();
    expect(screen.queryByTestId("contact-success")).toBeNull();
    const body = JSON.parse(fetchMock.mock.calls[0]![1]!.body as string);
    expect(body).toMatchObject({ reason: "residential", consent: true, website: "" });
    expect(body.elapsedMs).toBeGreaterThanOrEqual(3000);
    await act(async () => resolve(Response.json({ ok: true })));
    const success = await screen.findByTestId("contact-success");
    expect(success.getAttribute("role")).toBe("status");
    expect(document.activeElement?.textContent).toMatch(/your message was sent/i);
  });

  it("prevents duplicate submissions while a request is in flight", async () => {
    fetchMock.mockReturnValue(new Promise(() => {}));
    render(<ContactForm />);
    fill();
    const form = byId("fullName").closest("form")!;
    fireEvent.submit(form);
    fireEvent.submit(form);
    fireEvent.submit(form);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect((screen.getByRole("button", { name: /sending/i }) as HTMLButtonElement).disabled).toBe(true);
  });

  it.each([
    [400, { ok: false, error: "spam_check" }, /couldn.t verify this submission/i],
    [503, { ok: false, error: "not_configured" }, /aren.t available right now/i],
    [502, { ok: false, error: "delivery_failed" }, /couldn.t send your message/i],
    [429, { ok: false, error: "rate_limited" }, /too many messages/i],
    [200, { nope: true }, /couldn.t send your message/i],
  ])("never shows false success (HTTP %i)", async (status, body, message) => {
    fetchMock.mockResolvedValue(Response.json(body, { status }));
    render(<ContactForm />);
    fill();
    submit();
    expect((await screen.findByTestId("contact-submit-error")).textContent).toMatch(message);
    expect(screen.queryByTestId("contact-success")).toBeNull();
    expect(byId("message").value).toBe(validContact.message);
  });

  it("handles a network failure and lets the visitor retry", async () => {
    fetchMock
      .mockRejectedValueOnce(new TypeError("Failed to fetch"))
      .mockResolvedValueOnce(Response.json({ ok: true }));
    render(<ContactForm />);
    fill();
    submit();
    expect((await screen.findByTestId("contact-submit-error")).textContent).toMatch(/try again/i);
    expect(screen.queryByTestId("contact-success")).toBeNull();
    submit();
    expect(await screen.findByTestId("contact-success")).toBeTruthy();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
