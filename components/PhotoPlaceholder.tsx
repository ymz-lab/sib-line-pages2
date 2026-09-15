type PhotoPlaceholderProps = {
  label?: string;
  className?: string;
  clip?: boolean;
};

/**
 * Explicit "photo goes here" placeholder — a diagonal hatch pattern, not a
 * faked photo. Swap the parent's background-image / <Image> in for `label`
 * once real photography (events, meetings, community, team) is available.
 */
export default function PhotoPlaceholder({ label, className, clip = false }: PhotoPlaceholderProps) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-bg-soft ${className ?? ""}`}
      style={{
        clipPath: clip ? "polygon(0 4%, 100% 0, 100% 96%, 0 100%)" : undefined,
        backgroundImage:
          "repeating-linear-gradient(135deg, #E5E8EC 0, #E5E8EC 1px, transparent 1px, transparent 14px)",
      }}
    >
      {label && (
        <span className="eyebrow rounded-none border border-primary/15 bg-white/80 px-3 py-1.5">{label}</span>
      )}
    </div>
  );
}
