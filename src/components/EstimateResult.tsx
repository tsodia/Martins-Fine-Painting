export interface CustomerEstimate {
  low: number;
  high: number;
  summary: string;
}

interface EstimateResultProps {
  estimate: CustomerEstimate;
  variant: "light" | "dark";
}

export default function EstimateResult({ estimate, variant }: EstimateResultProps) {
  const isLight = variant === "light";
  return (
    <div
      className={`mt-6 rounded-lg border-l-4 border-gold p-5 text-left ${
        isLight ? "bg-cream" : "bg-white/5 border border-white/10 border-l-gold"
      }`}
    >
      <p
        className={`text-xs font-semibold uppercase tracking-wide mb-1 ${
          isLight ? "text-gray-500" : "text-white/50"
        }`}
      >
        Preliminary Ballpark
      </p>
      <p className={`font-serif text-2xl ${isLight ? "text-navy" : "text-white"}`}>
        ${estimate.low.toLocaleString()} &ndash; ${estimate.high.toLocaleString()}
      </p>
      <p className={`mt-2 text-sm ${isLight ? "text-gray-600" : "text-white/70"}`}>
        {estimate.summary}
      </p>
      <p className={`mt-3 text-xs ${isLight ? "text-gray-500" : "text-white/50"}`}>
        This is a planning range based on what you shared, not a quote. Martin
        confirms exact pricing at your free consultation.
      </p>
    </div>
  );
}
