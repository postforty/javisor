import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

// Kinetic Arc HUD 전용 폰트 구성
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "자비서 (javisor) | STARK HUD MK-85",
  description: "영화 '아이언맨'의 JARVIS HUD 비주얼 테마를 모티브로 한 미래지향적 인터페이스 기반 지능형 개인 비서 서비스",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark h-full">
      <head>
        {/* Google Material Symbols 가변 웹폰트 CDN 로드 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} min-h-screen bg-[#08090C] text-[#dfe2f1] antialiased selection:bg-[#dc2626]/40 selection:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
