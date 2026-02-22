import "./globals.css";

export const metadata = {
  title: "Arc",
  description: "Clarity, control, and momentum in one streamlined workspace.",
};

const THEME_INIT_SCRIPT = `
(() => {
  try {
    const key = "arc.theme.v1";
    const saved = localStorage.getItem(key);
    const system = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
    const theme = saved === "light" || saved === "dark" ? saved : system;
    document.documentElement.dataset.theme = theme;
  } catch {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}