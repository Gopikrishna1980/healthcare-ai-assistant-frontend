export type ChatMode = 'standard' | 'agent' | 'advanced'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  sources?: string[]
  metadata?: {
    agent_used?: string
    techniques_used?: string[]
    [key: string]: any
  }
  costInfo?: {
    total_tokens: number
    total_cost: number
  }
  isError?: boolean
  reaction?: 'like' | 'dislike' | null
}

export interface ChatSettings {
  temperature: number
  maxTokens: number
  model: string
}
