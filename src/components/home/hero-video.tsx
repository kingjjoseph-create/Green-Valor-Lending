"use client";

import * as React from "react";
import { preload } from "react-dom";
import { Pause, Play } from "lucide-react";

import { homeHeroVideo } from "@/content/videos";

/**
 * Decorative, muted, looping hero video.
 * - Plays only when the visitor has not asked for reduced motion and is not on Data Saver;
 *   otherwise the poster frame stays still.
 * - Pauses while scrolled out of view.
 * - A visible Pause/Play button satisfies WCAG 2.2.2 (moving content longer than 5 seconds).
 */
export function HeroVideo() {
  // The poster is the hero's LCP element: fetch it early.
  preload(homeHeroVideo.poster, { as: "image", fetchPriority: "high" });
  const ref = React.useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = React.useState(false);
  const userPaused = React.useRef(false);

  React.useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reduce || saveData) {
      userPaused.current = true;
      return;
    }
    const tryPlay = () => {
      if (userPaused.current) return;
      video.play().then(
        () => setPlaying(true),
        () => setPlaying(false),
      );
    };
    if (typeof IntersectionObserver === "undefined") {
      tryPlay();
      return;
    }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) tryPlay();
      else video.pause();
    });
    io.observe(video);
    return () => io.disconnect();
  }, []);

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    if (playing) {
      userPaused.current = true;
      video.pause();
      setPlaying(false);
    } else {
      userPaused.current = false;
      video.play().then(
        () => setPlaying(true),
        () => setPlaying(false),
      );
    }
  };

  return (
    <>
      <video
        ref={ref}
        className="absolute inset-0 -z-20 size-full object-cover"
        poster={homeHeroVideo.poster}
        width={homeHeroVideo.width}
        height={homeHeroVideo.height}
        muted
        loop
        playsInline
        preload="metadata"
        disablePictureInPicture
        aria-hidden="true"
        tabIndex={-1}
        data-testid="home-hero-video"
      >
        <source src={homeHeroVideo.src} type="video/mp4" />
      </video>
      <button
        type="button"
        onClick={toggle}
        aria-pressed={!playing}
        data-testid="home-hero-video-toggle"
        className="absolute right-4 bottom-4 z-10 inline-flex size-11 items-center justify-center rounded-full border border-white/40 bg-gv-green/70 text-white backdrop-blur-sm transition-colors hover:bg-gv-green focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gv-gold-bright sm:right-6 sm:bottom-6"
      >
        {playing ? (
          <Pause className="size-4" aria-hidden="true" />
        ) : (
          <Play className="size-4" aria-hidden="true" />
        )}
        <span className="sr-only">{playing ? "Pause background video" : "Play background video"}</span>
      </button>
    </>
  );
}
