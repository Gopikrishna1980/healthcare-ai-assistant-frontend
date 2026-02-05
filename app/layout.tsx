import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Healthcare AI Assistant | Advanced RAG Chatbot',
  description: 'AI-powered healthcare assistant with multi-agent system, streaming responses, and advanced retrieval augmented generation (RAG)',
  keywords: ['AI', 'Healthcare', 'RAG', 'LangChain', 'OpenAI', 'ChatGPT', 'Medical Assistant'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
