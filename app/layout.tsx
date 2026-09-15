import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { MotionConfig } from "framer-motion";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-noto-sans-jp",
  display: "swap",
});

const siteUrl = "https://www.base-ai.co.jp";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "株式会社BaseAI | 人と企業をつなぎ、新しい挑戦を生み出す",
    template: "%s | 株式会社BaseAI",
  },
  description:
    "株式会社BaseAIは、神奈川県藤沢市を拠点に、経営者コミュニティ、学生コミュニティSIB、企業向け実行支援を通じて、人・企業・地域の挑戦を支援しています。",
  openGraph: {
    title: "株式会社BaseAI | 人と企業をつなぎ、新しい挑戦を生み出す",
    description:
      "株式会社BaseAIは、神奈川県藤沢市を拠点に、経営者コミュニティ、学生コミュニティSIB、企業向け実行支援を通じて、人・企業・地域の挑戦を支援しています。",
    url: siteUrl,
    siteName: "株式会社BaseAI",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "株式会社BaseAI | 人と企業をつなぎ、新しい挑戦を生み出す",
    description:
      "株式会社BaseAIは、神奈川県藤沢市を拠点に、経営者コミュニティ、学生コミュニティSIB、企業向け実行支援を通じて、人・企業・地域の挑戦を支援しています。",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={notoSansJP.variable} data-scroll-behavior="smooth">
      <body className="font-sans antialiased text-primary bg-white">
        <MotionConfig reducedMotion="user">
          <Header />
          <main>{children}</main>
          <Footer />
        </MotionConfig>
      </body>
    </html>
  );
}
