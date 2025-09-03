import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "DSS Библиотека Книг - Система управления личной коллекцией",
  description:
    "Современная система управления личной библиотекой книг с REST API. Отслеживайте прочитанные книги, ставьте рейтинги и ведите заметки.",
  keywords: "библиотека, книги, чтение, API, управление коллекцией, DSS",
  authors: [{ name: "Daniil Sergeevich Shishkin", url: "https://github.com/dss" }],
  creator: "Daniil Sergeevich Shishkin",
  publisher: "DSS",
  applicationName: "DSS Библиотека Книг",
  generator: "Next.js",
  category: "productivity",
  classification: "Система управления библиотекой",
  robots: "index, follow",
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#f97316",
  colorScheme: "light dark",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    title: "DSS Библиотека Книг",
    description: "Система управления личной коллекцией книг с REST API",
    siteName: "DSS Библиотека Книг",
    images: [
      {
        url: "/dss-logo.png",
        width: 1200,
        height: 630,
        alt: "DSS Библиотека Книг",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DSS Библиотека Книг",
    description: "Система управления личной коллекцией книг с REST API",
    images: ["/dss-logo.png"],
  },
  icons: {
    icon: [
      { url: "/dss-logo.png", sizes: "32x32", type: "image/png" },
      { url: "/dss-logo.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/dss-logo.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/dss-logo.png",
  },
  manifest: "/manifest.json",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <head>
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="DSS Библиотека" />
        <link rel="icon" href="/dss-logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/dss-logo.png" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
