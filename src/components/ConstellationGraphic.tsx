// Sagitta star constellation — inline SVG, no external dependencies.
// Stars placed to reflect the real Sagitta constellation (arrow pointing east).
// γ Sge = tail (left), ζ Sge = tip (right).

const STARS = [
  { id: "gamma", x: 72,  y: 218, r: 4.2, bright: true,  label: "γ" },
  { id: "delta", x: 172, y: 178, r: 3.5, bright: false, label: "δ" },
  { id: "alpha", x: 240, y: 200, r: 3.0, bright: false, label: "α" },
  { id: "beta",  x: 298, y: 150, r: 3.5, bright: false, label: "β" },
  { id: "zeta",  x: 414, y: 104, r: 4.0, bright: true,  label: "ζ" },
  { id: "eta",   x: 186, y: 232, r: 2.2, bright: false, label: "" },
];

const LINES: [string, string][] = [
  ["gamma", "delta"],
  ["delta", "beta"],
  ["beta",  "zeta"],
  ["delta", "alpha"],
  ["delta", "eta"],
];

const BG_STARS = [
  { cx: 38,  cy: 48,  r: 0.9, o: 0.35 },
  { cx: 110, cy: 30,  r: 0.7, o: 0.25 },
  { cx: 200, cy: 55,  r: 1.1, o: 0.40 },
  { cx: 320, cy: 38,  r: 0.8, o: 0.30 },
  { cx: 440, cy: 62,  r: 0.9, o: 0.28 },
  { cx: 460, cy: 180, r: 0.7, o: 0.22 },
  { cx: 455, cy: 255, r: 1.0, o: 0.32 },
  { cx: 390, cy: 285, r: 0.8, o: 0.25 },
  { cx: 290, cy: 295, r: 0.9, o: 0.28 },
  { cx: 175, cy: 278, r: 1.1, o: 0.35 },
  { cx: 65,  cy: 290, r: 0.7, o: 0.22 },
  { cx: 28,  cy: 185, r: 1.0, o: 0.30 },
  { cx: 22,  cy: 110, r: 0.8, o: 0.28 },
  { cx: 130, cy: 90,  r: 0.6, o: 0.20 },
  { cx: 360, cy: 78,  r: 0.7, o: 0.25 },
  { cx: 418, cy: 230, r: 0.9, o: 0.30 },
  { cx: 340, cy: 255, r: 0.6, o: 0.20 },
  { cx: 92,  cy: 148, r: 0.8, o: 0.22 },
];

function getStarById(id: string) {
  return STARS.find((s) => s.id === id)!;
}

export default function ConstellationGraphic() {
  return (
    <div className="w-full max-w-lg mx-auto select-none" aria-hidden="true">
      <svg
        viewBox="0 0 480 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        style={{ maxHeight: 340 }}
      >
        <defs>
          {/* Deep-blue background gradient */}
          <radialGradient id="bg-grad" cx="35%" cy="40%" r="65%">
            <stop offset="0%"   stopColor="#0b1628" />
            <stop offset="60%"  stopColor="#070e1c" />
            <stop offset="100%" stopColor="#040a12" />
          </radialGradient>

          {/* Bright-star glow filter */}
          <filter id="glow-bright" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Dim-star glow filter */}
          <filter id="glow-dim" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Soft edge fade for the whole graphic */}
          <radialGradient id="edge-mask" cx="50%" cy="50%" r="50%">
            <stop offset="72%"  stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="fade-mask">
            <rect x="0" y="0" width="480" height="320" fill="url(#edge-mask)" />
          </mask>
        </defs>

        {/* Background */}
        <rect x="0" y="0" width="480" height="320" rx="16" fill="url(#bg-grad)" />

        {/* Guide rings — very faint */}
        <g opacity="0.055" stroke="#93c5fd" strokeWidth="0.6" fill="none">
          <circle cx="240" cy="165" r="140" />
          <circle cx="240" cy="165" r="100" />
          <circle cx="240" cy="165" r="60" />
        </g>

        {/* Main content, faded at edges */}
        <g mask="url(#fade-mask)">
          {/* Background star field */}
          {BG_STARS.map((s, i) => (
            <circle
              key={i}
              cx={s.cx}
              cy={s.cy}
              r={s.r}
              fill="#bfdbfe"
              opacity={s.o}
            />
          ))}

          {/* Constellation lines */}
          {LINES.map(([a, b]) => {
            const sa = getStarById(a);
            const sb = getStarById(b);
            return (
              <line
                key={`${a}-${b}`}
                x1={sa.x} y1={sa.y}
                x2={sb.x} y2={sb.y}
                stroke="#93c5fd"
                strokeWidth="0.85"
                opacity="0.38"
                strokeLinecap="round"
              />
            );
          })}

          {/* Stars */}
          {STARS.map((star) => (
            <g key={star.id} filter={star.bright ? "url(#glow-bright)" : "url(#glow-dim)"}>
              {/* Outer soft halo */}
              <circle
                cx={star.x}
                cy={star.y}
                r={star.r * 2.8}
                fill="#bfdbfe"
                opacity={star.bright ? 0.08 : 0.05}
              />
              {/* Core */}
              <circle
                cx={star.x}
                cy={star.y}
                r={star.r}
                fill="#e0f2fe"
                opacity={star.bright ? 0.95 : 0.82}
              />
            </g>
          ))}

          {/* Star labels — very subtle */}
          {STARS.filter((s) => s.label).map((star) => (
            <text
              key={`label-${star.id}`}
              x={star.x + star.r + 4}
              y={star.y - star.r - 3}
              fontSize="8"
              fill="#93c5fd"
              opacity="0.35"
              fontFamily="system-ui, sans-serif"
            >
              {star.label}
            </text>
          ))}
        </g>

        {/* Subtle vignette overlay */}
        <rect
          x="0" y="0" width="480" height="320" rx="16"
          fill="transparent"
          stroke="#1e3a5f"
          strokeWidth="1"
          opacity="0.5"
        />
      </svg>
    </div>
  );
}
