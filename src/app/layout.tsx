import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Atrium · Bảo tàng Lịch sử Kỹ thuật số",
  description:
    "Trải nghiệm bảo tàng 3D một trang — đi dạo trong bảo tàng ban đêm, từ hơi nước đến silicon. Bốn kỷ nguyên công nghiệp, 32 hiện vật, 9 mạch liên kết xuyên thời gian.",
  keywords: [
    "Atrium",
    "Bảo tàng",
    "Lịch sử công nghiệp",
    "Hơi nước",
    "Silicon",
    "3D",
    "Bảo tàng kỹ thuật số",
  ],
  authors: [{ name: "Atrium Curatorial" }],
  openGraph: {
    title: "Atrium · Bảo tàng Lịch sử Kỹ thuật số",
    description:
      "Đi từ hơi nước đến silicon — bốn kỷ nguyên công nghiệp trong một trải nghiệm bảo tàng 3D.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased bg-background text-foreground min-h-screen`}
      >
        <Providers>
          {children}
        </Providers>
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: "oklch(0.205 0.014 60)",
              color: "oklch(0.96 0.008 70)",
              border: "1px solid oklch(0.32 0.014 60 / 60%)",
            },
          }}
        />
      </body>
    </html>
  );
}
