import Link from "next/link";

export function ArcLogo({
  href = "/dashboard",
  size = 40,
  showWordmark = true,
}: {
  href?: string;
  size?: number;
  showWordmark?: boolean;
}) {
  return (
    <Link
      href={href}
      className={[
        "group inline-flex items-center gap-3 rounded-lg px-1 py-1",
        "transition-[transform,background-color,opacity] duration-150 ease-out",
        "hover:bg-[var(--surface-hover)] hover:-translate-y-[1px]",
        "active:translate-y-0",
        "outline-none focus-visible:bg-white/[0.06]",
      ].join(" ")}
      aria-label="Go to dashboard"
    >
      <ArcMark size={size} />

      {showWordmark ? (
        <span
          className={[
            "text-lg font-semibold tracking-[0.06em]",
            "text-[var(--heading)]",
            "group-hover:text-[var(--heading)]",
          ].join(" ")}
        >
          Arc
        </span>
      ) : null}
    </Link>
  );
}

function ArcMark({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      aria-hidden="true"
      className="shrink-0"
    >
      <defs>
        {/* ARC Raiders–inspired spectrum gradient */}
        <linearGradient id="arcSpectrum" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff3b3b" />
          <stop offset="25%" stopColor="#ffb000" />
          <stop offset="50%" stopColor="#ffe600" />
          <stop offset="75%" stopColor="#00e0ff" />
          <stop offset="100%" stopColor="#7a5cff" />
        </linearGradient>
      </defs>

      {/* Main arc with gradient */}
      <path
        d="M36 10a16 16 0 1 0 4 18"
        fill="none"
        stroke="url(#arcSpectrum)"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Inner arc (subtle tech layer) */}
      <path
        d="M30 14a10 10 0 1 0 2.6 11"
        fill="none"
        stroke="url(#arcSpectrum)"
        strokeWidth="2"
        opacity="0.6"
        strokeLinecap="round"
      />

      {/* Energy slash */}
      <path
        d="M10 34 L34 10"
        stroke="url(#arcSpectrum)"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Anchor node */}
      <circle cx="34" cy="10" r="2.4" fill="url(#arcSpectrum)" />
    </svg>
  );
}
