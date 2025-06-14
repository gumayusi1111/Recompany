import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '亚豪膜结构 - 管理系统',
  description: '亚豪膜结构公司后台管理系统',
  robots: 'noindex, nofollow', // 防止搜索引擎索引管理系统
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
