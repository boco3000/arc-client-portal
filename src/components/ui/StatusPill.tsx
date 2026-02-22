export function StatusPill({
  variant,
  status,
}: {
  variant: "project" | "invoice";
  status: string;
}) {
  const s = status.toLowerCase();

  // Semantic (subtle) colors: use low-alpha backgrounds + muted borders.
  // Keep text readable on dark UI.
  const styles =
    variant === "invoice"
      ? invoiceStyles(s)
      : projectStyles(s);

  return (
    <span
      className={[
        "inline-flex items-center rounded-md border px-2 py-1 text-xs",
        "font-medium",
        styles,
      ].join(" ")}
    >
      {status}
    </span>
  );
}

function projectStyles(status: string) {
  switch (status) {
    case "active":
      return "border-emerald-500/20 bg-emerald-500/10 text-[var(--heading)]";
    case "review":
      return "border-amber-500/20 bg-amber-500/10 text-[var(--heading)]";
    case "paused":
      return "border-slate-400/20 bg-slate-400/10 text-[var(--heading)]";
    case "completed":
      return "border-sky-500/20 bg-sky-500/10 text-[var(--heading)]";
    default:
      return "border-[var(--border-soft)] bg-[var(--surface-2)] text-[var(--text)]";
  }
}

function invoiceStyles(status: string) {
  switch (status) {
    case "paid":
      return "border-emerald-500/20 bg-emerald-500/10 text-[var(--heading)]";
    case "sent":
      return "border-sky-500/20 bg-sky-500/10 text-[var(--heading)]";
    case "overdue":
      return "border-rose-500/20 bg-rose-500/10 text-[var(--heading)]";
    case "draft":
      return "border-slate-400/20 bg-slate-400/10 text-[var(--heading)]";
    default:
      return "border-[var(--border-soft)] bg-[var(--surface-2)] text-[var(--text)]";
  }
}
