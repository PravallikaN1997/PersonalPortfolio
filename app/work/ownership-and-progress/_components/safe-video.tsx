"use client";

import { useEffect, useRef, useState } from "react";

type Props = { src: string; poster?: string; label: string };

// Native video controls, with a quiet fallback if the file cannot load (poster plus a short line).
export function SafeVideo({ src, poster, label }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    // The error can fire before hydration attaches onError, so check once on mount.
    if (ref.current?.error) setFailed(true);
  }, []);

  if (failed) {
    return (
      <div className="cs-vfail" role="group" aria-label={`${label} (video unavailable)`}>
        {poster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={poster} alt="" />
        ) : null}
        <p className="mono">Video unavailable</p>
      </div>
    );
  }
  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      controls
      muted
      playsInline
      preload="metadata"
      aria-label={label}
      onError={() => setFailed(true)}
    />
  );
}
