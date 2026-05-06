import type { Metadata } from "next";
import "./globals.css";

const socialImage = {
  url: "/sagitta-hero.png",
  width: 400,
  height: 300,
  alt: "Sagitta Systems constellation graphic",
};

export const metadata: Metadata = {
  title: "Sagitta Systems — Ecosystem for protocol defense, treasury support, and portfolio decisions",
  description:
    "One ecosystem of focused systems that power the defense, treasury support, portfolio decisions, and continuity of the Sagitta Protocol.",
  metadataBase: new URL("https://sagitta.systems"),
  alternates: {
    canonical: "https://sagitta.systems",
  },
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
    images: [socialImage],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sagitta Systems - Ecosystem for protocol defense, treasury support, and portfolio decisions",
    description:
      "One ecosystem of focused systems that power the defense, treasury support, portfolio decisions, and continuity of the Sagitta Protocol.",
    images: [socialImage.url],
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
