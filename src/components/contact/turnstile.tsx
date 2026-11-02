"use client";

import * as React from "react";
import Script from "next/script";

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id?: string) => void;
  remove: (id: string) => void;
};
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export type TurnstileHandle = { reset: () => void };

/**
 * Cloudflare Turnstile challenge. Renders only when a site key is configured
 * (NEXT_PUBLIC_TURNSTILE_SITE_KEY); the server verifies the token with
 * TURNSTILE_SECRET_KEY.
 */
export const Turnstile = React.forwardRef<
  TurnstileHandle,
  { siteKey: string; onToken: (token: string) => void }
>(function Turnstile({ siteKey, onToken }, ref) {
  const box = React.useRef<HTMLDivElement>(null);
  const widget = React.useRef<string | null>(null);
  const [ready, setReady] = React.useState(false);
  const onTokenRef = React.useRef(onToken);
  React.useEffect(() => {
    onTokenRef.current = onToken;
  }, [onToken]);

  React.useImperativeHandle(ref, () => ({
    reset: () => {
      onTokenRef.current("");
      if (widget.current) window.turnstile?.reset(widget.current);
    },
  }));

  React.useEffect(() => {
    if (!ready || !box.current || !window.turnstile || widget.current) return;
    widget.current = window.turnstile.render(box.current, {
      sitekey: siteKey,
      theme: "light",
      callback: (t: string) => onTokenRef.current(t),
      "expired-callback": () => onTokenRef.current(""),
      "error-callback": () => onTokenRef.current(""),
    });
    return () => {
      if (widget.current) window.turnstile?.remove(widget.current);
      widget.current = null;
    };
  }, [ready, siteKey]);

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => setReady(true)}
      />
      <div ref={box} className="min-h-[65px]" />
    </>
  );
});
