"use client";

import { useEffect, useRef, useState } from "react";

/** Drop the audio file at this path (e.g. public/audio/bg.mp3). */
const SRC = "/audio/bg.mp3";

export function BackgroundMusic() {
  const ref = useRef<HTMLAudioElement>(null);
  const [available] = useState(true); // always show the control (file ships in /public)
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const a = ref.current;
    if (!a) return;
    a.volume = 0.25;

    // browsers block autoplay-with-sound until a user gesture — start on the
    // first interaction unless the visitor muted it before.
    const start = () => {
      if (localStorage.getItem("bgMusic") === "off") return;
      a.play().then(() => setPlaying(true)).catch(() => {});
    };
    const onFirst = () => {
      start();
      window.removeEventListener("pointerdown", onFirst);
    };
    window.addEventListener("pointerdown", onFirst, { once: true });
    return () => window.removeEventListener("pointerdown", onFirst);
  }, [available]);

  const toggle = () => {
    const a = ref.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
      localStorage.setItem("bgMusic", "off");
    } else {
      a.play().then(() => setPlaying(true)).catch(() => {});
      localStorage.setItem("bgMusic", "on");
    }
  };

  return (
    <>
      <audio ref={ref} src={SRC} loop preload="none" />
      {available && (
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Mute background music" : "Play background music"}
          title={playing ? "Mute music" : "Play music"}
          className="fixed bottom-5 left-5 z-50 grid h-11 w-11 place-items-center rounded-full bg-gold-gradient text-night shadow-gold-btn ring-1 ring-gold-300/50 transition-transform hover:-translate-y-0.5"
        >
          <span className="relative grid place-items-center">
            {/* music note (beamed double note) — same icon in both states */}
            <svg viewBox="0 0 24 24" className={`h-5 w-5 ${playing ? "animate-pulse" : "opacity-80"}`} fill="currentColor" aria-hidden="true">
              <path d="M9 5.2 21 2.8V6.2L9 8.6V5.2Z" />
              <rect x="8.4" y="5" width="1.8" height="12.6" rx="0.9" />
              <rect x="19.2" y="2.9" width="1.8" height="12.6" rx="0.9" />
              <ellipse cx="6.2" cy="17.5" rx="3.1" ry="2.5" />
              <ellipse cx="17" cy="15.4" rx="3.1" ry="2.5" />
            </svg>
            {/* slash overlay when muted */}
            {!playing && (
              <svg viewBox="0 0 24 24" className="absolute h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M3 3l18 18" />
              </svg>
            )}
          </span>
        </button>
      )}
    </>
  );
}
