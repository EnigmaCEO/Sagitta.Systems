import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sagitta Systems — Ecosystem for protocol defense, treasury support, and portfolio decisions",
  description:
    "One ecosystem of focused systems that power the defense, treasury support, portfolio decisions, and continuity of the Sagitta Protocol.",
  metadataBase: new URL("https://sagitta.systems"),
  icons: {
    icon: "/sagitta.png",
    apple: "/sagitta.png",
  },
  openGraph: {
    title: "Sagitta Systems - Ecosystem for protocol defense, treasury support, and portfolio decisions",
    description:
      "One ecosystem of focused systems that power the defense, treasury support, portfolio decisions, and continuity of the Sagitta Protocol.",
    url: "https://sagitta.systems",
    siteName: "Sagitta Systems",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
