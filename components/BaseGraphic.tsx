type BaseGraphicProps = {
  className?: string;
};

/**
 * BaseAI's abstract brand motif: overlapping horizontal planes converging on
 * a shared base line — "people and companies meeting on common ground."
 * Deliberately not a node-and-line network diagram (that reads as "AI").
 * Flat fills, thin strokes only — no gradients or glow.
 */
export default function BaseGraphic({ className }: BaseGraphicProps) {
  return (
    <svg viewBox="0 0 480 360" className={className} role="presentation" aria-hidden="true">
      <rect x="40" y="40" width="230" height="120" fill="#F7F9FC" />
      <rect x="40" y="40" width="230" height="120" stroke="#0A1330" strokeOpacity="0.12" />

      <rect x="140" y="120" width="300" height="140" fill="#FFFFFF" stroke="#0A1330" strokeOpacity="0.16" />

      <rect x="90" y="200" width="180" height="90" fill="#1E5BA8" fillOpacity="0.08" />
      <rect x="90" y="200" width="180" height="90" stroke="#1E5BA8" strokeOpacity="0.35" />

      <line x1="20" y1="320" x2="460" y2="320" stroke="#0A1330" strokeOpacity="0.5" strokeWidth="1.5" />
      <line x1="20" y1="320" x2="20" y2="330" stroke="#0A1330" strokeOpacity="0.5" strokeWidth="1.5" />
      <line x1="460" y1="320" x2="460" y2="330" stroke="#0A1330" strokeOpacity="0.5" strokeWidth="1.5" />
    </svg>
  );
}
