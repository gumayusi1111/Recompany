import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header, Footer } from "@/components";
import { ThemeProvider } from "@/components/ThemeProvider";
import { globalConfig } from "@/config/global";
import "./globals.css";
import "./theme.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${globalConfig.env.company.name} - ${globalConfig.env.company.slogan}`,
  description: globalConfig.env.company.description,
  keywords: "膜结构,张拉膜,膜结构工程,膜结构设计,膜结构施工,亚豪膜结构",
  authors: [{ name: globalConfig.env.company.name }],
  creator: globalConfig.env.company.name,
  publisher: globalConfig.env.company.name,
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: globalConfig.env.siteUrl,
    siteName: globalConfig.env.company.name,
    title: `${globalConfig.env.company.name} - ${globalConfig.env.company.slogan}`,
    description: globalConfig.env.company.description,
    images: [
      {
        url: `${globalConfig.env.siteUrl}/images/og-default.jpg`,
        width: 1200,
        height: 630,
        alt: globalConfig.env.company.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${globalConfig.env.company.name} - ${globalConfig.env.company.slogan}`,
    description: globalConfig.env.company.description,
    images: [`${globalConfig.env.siteUrl}/images/og-default.jpg`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        {/* Logo预加载 - 提高稳定性 */}
        <link
          rel="preload"
          as="image"
          href="/images/logo.png"
          type="image/png"
        />
        <link
          rel="preload"
          as="image"
          href="/images/logo.svg"
          type="image/svg+xml"
        />
        {/* 防止FOUC (Flash of Unstyled Content) */}
        <style dangerouslySetInnerHTML={{
          __html: `
            .logo-container {
              width: 50px;
              height: 50px;
              display: inline-block;
              background: transparent;
            }
          `
        }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <div className="min-h-screen flex flex-col page-theme">
            <Header />
            <main className="flex-1 pt-20">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
