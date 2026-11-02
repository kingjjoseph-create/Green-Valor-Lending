/**
 * Locally hosted videos. Like photos, each must be licensed for commercial
 * use and recorded in docs/IMAGE_LICENSES.md. Decorative background video is
 * muted, has no audio track, and is hidden from assistive technology.
 */
export const homeHeroVideo = {
  /** H.264 MP4, 960x540, 24 fps, about 20 seconds, no audio (re-encoded from the file Green Valor supplied). */
  src: "/videos/home-hero.mp4",
  poster: "/videos/home-hero-poster.webp",
  width: 960,
  height: 540,
} as const;
