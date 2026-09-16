type BaseGraphicProps = {
  className?: string;
};

/**
 * BaseAI's abstract brand motif: two horizontal planes offset and
 * overlapping — people and companies meeting on shared ground — crossed by
 * a single connecting line. Deliberately not a node-and-line network
 * diagram. Flat fills, thin strokes only — no gradients or glow.
 */
export default function BaseGraphic({ className }: BaseGraphicProps) {
  return (
    <svg viewBox="0 0 200 120" className={className} role="presentation" aria-hidden="true">
      <rect x="0" y="16" width="130" height="46" fill="#F7F9FC" stroke="#0A1330" strokeOpacity="0.14" />
      <rect x="46" y="58" width="130" height="46" fill="#FFFFFF" stroke="#1E5BA8" strokeOpacity="0.4" />
      <line x1="0" y1="110" x2="200" y2="110" stroke="#0A1330" strokeOpacity="0.5" strokeWidth="1" />
      <line x1="88" y1="0" x2="88" y2="120" stroke="#1E5BA8" strokeOpacity="0.3" strokeWidth="1" />
    </svg>
  );
}
