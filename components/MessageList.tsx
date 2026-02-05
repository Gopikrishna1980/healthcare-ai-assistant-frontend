import { Message } from '@/types'
import { useEffect, useRef } from 'react'
import ChatMessage from './ChatMessage'
import { Loader2 } from 'lucide-react'

interface MessageListProps {
  messages: Message[]
  isLoading: boolean
}

export default function MessageList({ messages, isLoading }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="h-full overflow-y-auto px-6 py-4 scrollbar-hide">
      {messages.length === 0 ? (
        <div className="h-full flex items-center justify-center">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome to Healthcare AI Assistant
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Ask me anything about common health conditions, symptoms, or general medical information.
            </p>
            <div className="grid gap-3">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-left">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  💡 "What are the symptoms of diabetes?"
                </p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-left">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  💡 "How can I prevent the flu?"
                </p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-left">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  💡 "What causes high blood pressure?"
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  )
}
