"use client";

import { useState } from "react";

/**
 * Shows an image from `src` (e.g. a custom uploaded logo in /public). If the
 * file is missing or fails to load, it silently falls back to `children`
 * (the built-in glyph / SVG icon). Lets the site use custom logos without
 * breaking when an image hasn't been added yet.
 */
export function IconImage({
  src,
  alt = "",
  className = "",
  children,
}: {
  src: string;
  alt?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) return <>{children}</>;
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={src}
      alt={alt}
      className={`select-none object-contain ${className}`}
      onError={() => setFailed(true)}
    />
  );
}
