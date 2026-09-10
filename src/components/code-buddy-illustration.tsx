import { cn } from "@/lib/utils";

type CodeBuddyIllustrationProps = {
  className?: string;
  mood?: "wave" | "focus" | "celebrate";
  title?: string;
};

const armPaths = {
  wave: {
    left: "M86 172 C58 154 50 126 63 107",
    right: "M224 169 C251 153 264 124 253 98",
  },
  focus: {
    left: "M88 171 C66 183 61 209 75 225",
    right: "M223 171 C245 184 249 209 236 225",
  },
  celebrate: {
    left: "M88 170 C61 151 52 121 64 92",
    right: "M222 170 C250 151 260 121 250 91",
  },
} as const;

export function CodeBuddyIllustration({
  className,
  mood = "wave",
  title = "Gülümseyen Code Buddy robotu",
}: CodeBuddyIllustrationProps) {
  const arms = armPaths[mood];

  return (
    <svg
      className={cn("code-buddy-illustration", className)}
      role="img"
      aria-label={title}
      viewBox="0 0 320 320"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="buddy-body" x1="80" y1="60" x2="250" y2="270" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="0.48" stopColor="#F2EFFF" />
          <stop offset="1" stopColor="#CFC8FF" />
        </linearGradient>
        <linearGradient id="buddy-screen" x1="112" y1="118" x2="211" y2="196" gradientUnits="userSpaceOnUse">
          <stop stopColor="#242346" />
          <stop offset="1" stopColor="#11142B" />
        </linearGradient>
        <linearGradient id="buddy-purple" x1="111" y1="210" x2="209" y2="277" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9388FF" />
          <stop offset="1" stopColor="#6A5DE7" />
        </linearGradient>
        <radialGradient id="buddy-glow" cx="0" cy="0" r="1" gradientTransform="translate(159 163) rotate(90) scale(144)">
          <stop stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <filter id="buddy-shadow" x="25" y="35" width="270" height="280" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feDropShadow dx="0" dy="20" stdDeviation="16" floodColor="#282450" floodOpacity="0.18" />
        </filter>
        <filter id="buddy-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>

      <ellipse cx="160" cy="281" rx="93" ry="18" fill="#6961B8" fillOpacity="0.18" filter="url(#buddy-soft)" />
      <circle cx="160" cy="152" r="136" fill="url(#buddy-glow)" opacity="0.58" />
      <path d="M43 92 C76 43 130 20 191 30 C245 39 286 82 287 133" fill="none" stroke="#FFFFFF" strokeOpacity="0.52" strokeWidth="4" strokeLinecap="round" strokeDasharray="2 13" />
      <circle cx="63" cy="87" r="8" fill="#FFB885" />
      <circle cx="270" cy="137" r="6" fill="#71D7FF" />
      <path d="M257 65 L263 77 L276 80 L266 89 L268 102 L257 96 L246 102 L248 89 L238 80 L251 77 Z" fill="#FFD25E" />

      <g filter="url(#buddy-shadow)">
        <path d={arms.left} fill="none" stroke="#8B80F4" strokeWidth="24" strokeLinecap="round" />
        <path d={arms.right} fill="none" stroke="#8B80F4" strokeWidth="24" strokeLinecap="round" />
        <circle cx={mood === "focus" ? 72 : 61} cy={mood === "focus" ? 226 : mood === "wave" ? 102 : 88} r="16" fill="#FFF8F2" stroke="#CBC5F9" strokeWidth="5" />
        <circle cx={mood === "focus" ? 239 : 255} cy={mood === "focus" ? 226 : mood === "wave" ? 95 : 87} r="16" fill="#FFF8F2" stroke="#CBC5F9" strokeWidth="5" />

        <rect x="91" y="80" width="138" height="137" rx="52" fill="url(#buddy-body)" stroke="#FFFFFF" strokeWidth="5" />
        <path d="M115 107 C130 90 188 86 208 108" fill="none" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" opacity="0.88" />
        <rect x="108" y="111" width="105" height="84" rx="32" fill="url(#buddy-screen)" />
        <ellipse cx="140" cy="148" rx="9" ry="13" fill="#82E8FF" />
        <ellipse cx="181" cy="148" rx="9" ry="13" fill="#82E8FF" />
        <circle cx="143" cy="144" r="3" fill="#FFFFFF" />
        <circle cx="184" cy="144" r="3" fill="#FFFFFF" />
        <path d={mood === "focus" ? "M147 174 H175" : "M145 169 C153 179 169 179 178 169"} fill="none" stroke="#FFB885" strokeWidth="5" strokeLinecap="round" />
        <rect x="148" y="59" width="24" height="28" rx="10" fill="#8B80F4" />
        <path d="M160 60 V44" stroke="#6A5DE7" strokeWidth="7" strokeLinecap="round" />
        <circle cx="160" cy="37" r="9" fill="#FFB885" stroke="#FFFFFF" strokeWidth="4" />

        <rect x="99" y="202" width="123" height="75" rx="34" fill="url(#buddy-purple)" stroke="#FFFFFF" strokeWidth="5" />
        <rect x="126" y="220" width="68" height="37" rx="15" fill="#F8F6FF" />
        <path d="M146 231 L137 238 L146 245" fill="none" stroke="#6A5DE7" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M174 231 L183 238 L174 245" fill="none" stroke="#6A5DE7" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M165 228 L155 248" stroke="#FF9F72" strokeWidth="4" strokeLinecap="round" />
        <rect x="112" y="268" width="42" height="24" rx="12" fill="#4B467D" />
        <rect x="166" y="268" width="42" height="24" rx="12" fill="#4B467D" />
      </g>
    </svg>
  );
}
