import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";
import Cursor from "@/components/Cursor";
import Navbar from "@/components/Navbar";
import NavDots from "@/components/NavDots";
import { PortfolioProvider } from "@/context/PortfolioContext";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const dmMono = DM_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-dm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pasindusri.dev"),
  title: "Pasindu Sri Induwara | Full-Stack Software Engineer & IT Undergraduate",
  description:
    "Portfolio of Pasindu Sri Induwara, IT undergraduate at University of Moratuwa specializing in full-stack web development (Next.js, Spring Boot), XRPL blockchain integrations, and IoT systems.",
  keywords: [
    "Pasindu Sri",
    "Pasindu Sri Induwara",
    "University of Moratuwa",
    "Full-Stack Developer",
    "Next.js Developer",
    "Spring Boot",
    "XRPL",
    "Web3",
    "IoT",
    "Sri Lanka Software Engineer",
  ],
  authors: [{ name: "Pasindu Sri Induwara" }],
  creator: "Pasindu Sri Induwara",
  openGraph: {
    title: "Pasindu Sri Induwara | Full-Stack Software Engineer",
    description:
      "IT undergrad at University of Moratuwa building full-stack web apps, blockchain integrations, and IoT systems.",
    url: "https://pasindusri.dev",
    siteName: "Pasindu Sri Portfolio",
    images: [
      {
        url: "/images/profile.jpg",
        width: 800,
        height: 800,
        alt: "Pasindu Sri Induwara",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${dmSans.variable} ${dmMono.variable} scroll-smooth`}
    >
      <body className="bg-[#050508] text-[#f0f0f5] antialiased relative min-h-screen selection:bg-indigo-500/30 selection:text-indigo-200">
        <PortfolioProvider>
          {/* Interactive Custom Cursor */}
          <Cursor />

          {/* Global Floating Navbar */}
          <Navbar />

          {/* Section Jumping Side Dots */}
          <NavDots />

          {/* Ambient Gradient Blobs Background */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <div className="absolute -top-[20%] -left-[10%] w-[650px] h-[650px] rounded-full bg-radial from-indigo-500/12 to-transparent blur-3xl animate-blob-1" />
            <div className="absolute -bottom-[15%] -right-[5%] w-[550px] h-[550px] rounded-full bg-radial from-emerald-500/9 to-transparent blur-3xl animate-blob-2" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] opacity-70" />
          </div>

          {/* Main Content */}
          <main className="relative z-10">{children}</main>
        </PortfolioProvider>
      </body>
    </html>
  );
}
