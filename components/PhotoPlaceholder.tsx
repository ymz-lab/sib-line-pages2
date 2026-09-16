type PhotoPlaceholderProps = {
  label?: string;
  className?: string;
  tone?: "light" | "dark";
};

/**
 * A media container built to hold real photography later — not a "work in
 * progress" pattern. A soft tone fill, a thin corner bracket (the frame a
 * photo will sit in), and a small dev-only caption in the corner. Swap in
 * next/image as the child once real photos exist; the corner mark and
 * caption disappear with the `label` prop.
 */
export default function PhotoPlaceholder({ label, className, tone = "light" }: PhotoPlaceholderProps) {
  const isDark = tone === "dark";
  return (
    <div
      className={`relative overflow-hidden ${isDark ? "bg-primary" : "bg-bg-soft"} ${className ?? ""}`}
    >
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? "radial-gradient(120% 100% at 15% 10%, rgba(30,91,168,0.35), transparent 60%)"
            : "radial-gradient(120% 100% at 85% 100%, rgba(30,91,168,0.08), transparent 55%)",
        }}
      />

      {/* corner bracket — the frame a photo will occupy */}
      <span
        className={`absolute right-4 top-4 h-6 w-6 border-r ${isDark ? "border-white/30" : "border-primary/20"} border-t`}
        aria-hidden="true"
      />
      <span
        className={`absolute bottom-4 left-4 h-6 w-6 border-b ${isDark ? "border-white/30" : "border-primary/20"} border-l`}
        aria-hidden="true"
      />

      {label && (
        <span
          className={`absolute bottom-4 right-4 text-[10px] font-semibold uppercase tracking-wides ${
            isDark ? "text-white/40" : "text-primary/30"
          }`}
        >
          {label}
        </span>
      )}
    </div>
  );
}
