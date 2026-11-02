import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { HeroVideo } from "@/components/home/hero-video";
import { HomeHero } from "@/components/home/home-hero";

let reduce = false;
beforeEach(() => {
  reduce = false;
  vi.stubGlobal("matchMedia", (q: string) => ({ matches: q.includes("reduce") && reduce, media: q }));
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(private cb: (e: { isIntersecting: boolean }[]) => void) {}
      observe() {
        this.cb([{ isIntersecting: true }]);
      }
      disconnect() {}
    },
  );
  vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("home hero video", () => {
  it("is muted, looping, inline, decorative, and uses the local optimized file and poster", async () => {
    await act(async () => render(<HeroVideo />));
    const v = screen.getByTestId("home-hero-video") as HTMLVideoElement;
    expect(v.muted).toBe(true);
    expect(v.loop).toBe(true);
    expect(v.hasAttribute("playsinline")).toBe(true);
    expect(v.getAttribute("aria-hidden")).toBe("true");
    expect(v.getAttribute("poster")).toBe("/videos/home-hero-poster.webp");
    expect(v.querySelector("source")?.getAttribute("src")).toBe("/videos/home-hero.mp4");
    expect(v.hasAttribute("autoplay")).toBe(false);
  });

  it("plays when motion is allowed, and the button pauses and resumes it", async () => {
    await act(async () => render(<HeroVideo />));
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1);
    const pause = screen.getByRole("button", { name: "Pause background video" });
    await act(async () => fireEvent.click(pause));
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
    await act(async () => fireEvent.click(screen.getByRole("button", { name: "Play background video" })));
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(2);
    expect(screen.getByRole("button", { name: "Pause background video" })).toBeTruthy();
  });

  it("never starts under prefers-reduced-motion, but offers a play button", async () => {
    reduce = true;
    await act(async () => render(<HeroVideo />));
    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Play background video" })).toBeTruthy();
  });

  it("keeps the approved hero copy and one h1 over the video", async () => {
    await act(async () => render(<HomeHero />));
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Built on Service. Driven by Valor.");
    expect(screen.getByRole("link", { name: /Get Started/ }).getAttribute("href")).toBe("/get-started");
  });
});
