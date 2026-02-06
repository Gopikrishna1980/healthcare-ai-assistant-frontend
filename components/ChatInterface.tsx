'use client'

import { useState, useEffect } from 'react'
import ChatHeader from './ChatHeader'
import MessageList from './MessageList'
import ChatInput from './ChatInput'
import ModeSelector from './ModeSelector'
import Sidebar from './Sidebar'
import { Message, ChatMode, Session } from '@/types'
import { streamChat, clearConversation } from '@/lib/api'

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([])
  const [mode, setMode] = useState<ChatMode>('standard')
  const [isLoading, setIsLoading] = useState(false)
  const [streamingMessage, setStreamingMessage] = useState<string>('')
  const [showSidebar, setShowSidebar] = useState(false)
  const [lastUserMessage, setLastUserMessage] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [sessions, setSessions] = useState<Session[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)

  // Load sessions from localStorage on mount
  useEffect(() => {
    const savedSessions = localStorage.getItem('chatSessions')
    if (savedSessions) {
      try {
        const parsed = JSON.parse(savedSessions)
        // Convert date strings back to Date objects
        const sessionsWithDates = parsed.map((s: any) => ({
          ...s,
          createdAt: new Date(s.createdAt),
          updatedAt: new Date(s.updatedAt),
          messages: s.messages.map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp),
          })),
        }))
        setSessions(sessionsWithDates)
      } catch (error) {
        console.error('Error loading sessions:', error)
      }
    }
  }, [])

  // Auto-save current session
  useEffect(() => {
    if (currentSessionId && messages.length > 0) {
      const updatedSessions = sessions.map(s =>
        s.id === currentSessionId
          ? { ...s, messages, mode, updatedAt: new Date() }
          : s
      )
      setSessions(updatedSessions)
      localStorage.setItem('chatSessions', JSON.stringify(updatedSessions))
    }
  }, [messages, mode])

  const handleSendMessage = async (content: string) => {
    setLastUserMessage(content)
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

  const handleRegenerate = () => {
    if (lastUserMessage) {
      // Remove last assistant message
      setMessages(prev => prev.slice(0, -1))
      // Resend last user message
      handleSendMessage(lastUserMessage)
    }
  }

  const handleReaction = (messageId: string, reaction: 'like' | 'dislike') => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, reaction: msg.reaction === reaction ? null : reaction }
        : msg
    ))
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query === '') {
      setFilteredMessages([])
    } else {
      setFilteredMessages(
        messages.filter(msg =>
          msg.content.toLowerCase().includes(query.toLowerCase())
        )
      )
    }
  }

  const handleExportPDF = async () => {
    try {
      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF()
      
      doc.setFontSize(20)
      doc.text('Healthcare AI Chat', 20, 20)
      doc.setFontSize(10)
      doc.text(`Exported: ${new Date().toLocaleString()}`, 20, 30)
      doc.text(`Total Messages: ${messages.length}`, 20, 36)
      
      let yPosition = 50
      messages.forEach((msg, index) => {
        if (yPosition > 270) {
          doc.addPage()
          yPosition = 20
        }
        
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.text(`${msg.role === 'user' ? 'You' : 'AI'}:`, 20, yPosition)
        
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(10)
        const lines = doc.splitTextToSize(msg.content, 170)
        doc.text(lines, 20, yPosition + 6)
        yPosition += (lines.length * 5) + 12
      })
      
      doc.save(`healthcare-chat-${Date.now()}.pdf`)
    } catch (error) {
      console.error('Error exporting PDF:', error)
      alert('Failed to export PDF')
    }
  }

  const handleSaveSession = (name: string) => {
    const newSession: Session = {
      id: Date.now().toString(),
      name,
      messages: [...messages],
      mode,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    const updatedSessions = [...sessions, newSession]
    setSessions(updatedSessions)
    setCurrentSessionId(newSession.id)
    localStorage.setItem('chatSessions', JSON.stringify(updatedSessions))
  }

  const handleLoadSession = (session: Session) => {
    setMessages(session.messages)
    setMode(session.mode)
    setCurrentSessionId(session.id)
    setShowSidebar(false)
  }

  const handleDeleteSession = (sessionId: string) => {
    const updatedSessions = sessions.filter(s => s.id !== sessionId)
    setSessions(updatedSessions)
    localStorage.setItem('chatSessions', JSON.stringify(updatedSessions))
    if (currentSessionId === sessionId) {
      setCurrentSessionId(null)
      setMessages([])
      setMode('standard')
    }
  }

  const handleNewSession = () => {
    setMessages([])
    setMode('standard')
    setCurrentSessionId(null)
    setShowSidebar(false)
  }

  return (
    <div className="flex h-screen max-w-full mx-auto">
      {/* Sidebar */}
      <Sidebar 
        isOpen={showSidebar}
        onClose={() => setShowSidebar(false)}
        onClearConversation={handleClearConversation}
        messageCount={messages.length}
        messages={messages}
        onSearch={handleSearch}
        onExportPDF={handleExportPDF}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSaveSession={handleSaveSession}
        onLoadSession={handleLoadSession}
        onDeleteSession={handleDeleteSession}
        onNewSession={handleNewSession}
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
            onRegenerate={handleRegenerate}
            onReaction={handleReaction}
          />
        </div>
        <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
      </div>
    </div>
  )
}
