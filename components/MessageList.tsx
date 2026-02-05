import { Message } from '@/types'
import { useEffect, useRef } from 'react'
import ChatMessage from './ChatMessage'
import { Loader2, Bot } from 'lucide-react'

interface MessageListProps {
  messages: Message[]
  isLoading: boolean
  streamingMessage?: string
}

export default function MessageList({ messages, isLoading, streamingMessage }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingMessage])

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
          
          {/* Streaming message */}
          {streamingMessage && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Bot className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="max-w-[70%] rounded-2xl px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  {streamingMessage}
                  <span className="inline-block w-2 h-4 ml-1 bg-blue-600 animate-pulse" />
                </div>
              </div>
            </div>
          )}

          {isLoading && !streamingMessage && (
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
