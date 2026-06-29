"use client";

import { useEffect, useRef, useState } from "react";

/** Drop the audio file at this path (e.g. public/audio/bg.mp3). */
const SRC = "/audio/bg.mp3";

export function BackgroundMusic() {
  const ref = useRef<HTMLAudioElement>(null);
  const [available, setAvailable] = useState(false);
  const [playing, setPlaying] = useState(false);

  // only show the control if the audio file actually exists
  useEffect(() => {
    let alive = true;
    fetch(SRC, { method: "HEAD" })
      .then((r) => { if (alive) setAvailable(r.ok); })
      .catch(() => { if (alive) setAvailable(false); });
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    const a = ref.current;
    if (!a || !available) return;
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
          className="fixed bottom-5 left-5 z-40 grid h-12 w-12 place-items-center rounded-full bg-gold-gradient text-night shadow-gold-btn ring-1 ring-gold-300/50 transition-transform hover:-translate-y-0.5"
        >
          {playing ? (
            // playing — equalizer bars
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M6 14v-4M10 18V6M14 16V8M18 13v-2">
                <animate attributeName="opacity" values="1;0.4;1" dur="1.2s" repeatCount="indefinite" />
              </path>
            </svg>
          ) : (
            // muted — note with slash
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18V6l10-2v12" />
              <circle cx="6" cy="18" r="3" /><circle cx="16" cy="16" r="3" />
              <path d="M3 3l18 18" />
            </svg>
          )}
        </button>
      )}
    </>
  );
}
