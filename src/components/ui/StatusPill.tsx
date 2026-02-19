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
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-200";
    case "review":
      return "border-amber-500/20 bg-amber-500/10 text-amber-200";
    case "paused":
      return "border-slate-400/20 bg-slate-400/10 text-slate-200";
    case "completed":
      return "border-sky-500/20 bg-sky-500/10 text-sky-200";
    default:
      return "border-white/10 bg-white/5 text-neutral-200";
  }
}

function invoiceStyles(status: string) {
  switch (status) {
    case "paid":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-200";
    case "sent":
      return "border-sky-500/20 bg-sky-500/10 text-sky-200";
    case "overdue":
      return "border-rose-500/20 bg-rose-500/10 text-rose-200";
    case "draft":
      return "border-slate-400/20 bg-slate-400/10 text-slate-200";
    default:
      return "border-white/10 bg-white/5 text-neutral-200";
  }
}