/** Illustrated placeholder for reviews that don't have photos yet. */
export function TentPlaceholder() {
  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="tent-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2e3a2b" />
          <stop offset="1" stopColor="#4a5a45" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#tent-sky)" />
      <circle cx="72" cy="58" r="22" fill="#faf6ef" opacity="0.85" />
      <circle cx="64" cy="52" r="20" fill="#3d4a3a" opacity="0.35" />
      <g fill="#faf6ef" opacity="0.8">
        <circle cx="52" cy="44" r="1.6" />
        <circle cx="118" cy="76" r="1.2" />
        <circle cx="196" cy="38" r="1.4" />
        <circle cx="262" cy="92" r="1.1" />
        <circle cx="88" cy="118" r="1.2" />
        <circle cx="368" cy="128" r="1.3" />
        <circle cx="150" cy="140" r="1" />
      </g>
      <path
        d="M0 232 Q 90 178 190 224 T 400 214 L 400 300 L 0 300 Z"
        fill="#556449"
      />
      <path
        d="M0 262 Q 120 226 240 258 T 400 250 L 400 300 L 0 300 Z"
        fill="#8a9a5b"
        opacity="0.55"
      />
      <g>
        <path d="M200 128 L286 252 L114 252 Z" fill="#b06b43" />
        <path d="M200 128 L286 252 L232 252 Z" fill="#96552f" />
        <path d="M200 148 L236 252 L164 252 Z" fill="#f1e8d8" />
        <path d="M200 148 L224 252 L200 252 Z" fill="#e3d5bd" />
        <line
          x1="200"
          y1="128"
          x2="200"
          y2="112"
          stroke="#f1e8d8"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path d="M200 106 L218 112 L200 118 Z" fill="#b06b43" />
      </g>
    </svg>
  );
}
