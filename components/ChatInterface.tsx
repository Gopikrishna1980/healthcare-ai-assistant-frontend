'use client'

import { useState } from 'react'
import ChatHeader from './ChatHeader'
import MessageList from './MessageList'
import ChatInput from './ChatInput'
import ModeSelector from './ModeSelector'
import Sidebar from './Sidebar'
import { Message, ChatMode } from '@/types'
import { streamChat, clearConversation } from '@/lib/api'

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [mode, setMode] = useState<ChatMode>('standard')
  const [isLoading, setIsLoading] = useState(false)
  const [streamingMessage, setStreamingMessage] = useState<string>('')
  const [showSidebar, setShowSidebar] = useState(false)

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)
    setStreamingMessage('')

    // Create placeholder for assistant message
    const assistantMessageId = (Date.now() + 1).toString()
    
    try {
      await streamChat({
        question: content,
        useAgents: mode === 'agent',
        useAdvancedRag: mode === 'advanced',
        useMemory: true,
        onToken: (token) => {
          setStreamingMessage(prev => prev + token)
        },
        onComplete: (fullResponse) => {
          const assistantMessage: Message = {
            id: assistantMessageId,
            role: 'assistant',
            content: fullResponse,
            timestamp: new Date(),
          }
          setMessages(prev => [...prev, assistantMessage])
          setStreamingMessage('')
          setIsLoading(false)
        },
        onError: (error) => {
          console.error('Streaming error:', error)
          const errorMessage: Message = {
            id: assistantMessageId,
            role: 'assistant',
            content: 'Sorry, I encountered an error. Please make sure the backend server is running.',
            timestamp: new Date(),
            isError: true,
          }
          setMessages(prev => [...prev, errorMessage])
          setStreamingMessage('')
          setIsLoading(false)
        },
      })
    } catch (error) {
      console.error('Error sending message:', error)
      setIsLoading(false)
      setStreamingMessage('')
    }
  }

  const handleClearConversation = async () => {
    try {
      await clearConversation()
      setMessages([])
      setStreamingMessage('')
    } catch (error) {
      console.error('Error clearing conversation:', error)
    }
  }

  return (
    <div className="flex h-screen max-w-full mx-auto">
      {/* Sidebar */}
      <Sidebar 
        isOpen={showSidebar}
        onClose={() => setShowSidebar(false)}
        onClearConversation={handleClearConversation}
        messageCount={messages.length}
      />

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 min-w-0">
        <ChatHeader onToggleSidebar={() => setShowSidebar(!showSidebar)} />
        <ModeSelector mode={mode} onModeChange={setMode} />
        <div className="flex-1 overflow-hidden">
          <MessageList 
            messages={messages} 
            isLoading={isLoading}
            streamingMessage={streamingMessage}
          />
        </div>
        <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
      </div>
    </div>
  )
}
