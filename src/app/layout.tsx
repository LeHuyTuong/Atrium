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
    "Trải nghiệm bảo tàng 3D một trang — đi dạo trong bảo tàng ban đêm, từ hơi nước đến silicon. Bốn kỷ nguyên công nghiệp, 15 hiện vật, 5 mạch liên kết xuyên thời gian.",
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
    <html lang="vi" suppressHydrationWarning>
      <head>
        {/* Set initial theme before hydration to avoid flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('atrium-theme');var m=t?JSON.parse(t):{};var v=m&&m.state&&m.state.theme||'dark';if(v==='light'){document.documentElement.classList.remove('dark');}else{document.documentElement.classList.add('dark');}}catch(e){document.documentElement.classList.add('dark');}})();`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased bg-background text-foreground min-h-screen`}
      >
        <Providers>
          {children}
        </Providers>
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
