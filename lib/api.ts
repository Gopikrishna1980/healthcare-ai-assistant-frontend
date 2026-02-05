import { EventSourceMessage, fetchEventSource } from '@microsoft/fetch-event-source'

export interface StreamOptions {
  question: string
  useAgents?: boolean
  useAdvancedRag?: boolean
  useMemory?: boolean
  onToken?: (token: string) => void
  onComplete?: (fullResponse: string) => void
  onError?: (error: Error) => void
}

export async function streamChat(options: StreamOptions) {
  const {
    question,
    useAgents = false,
    useAdvancedRag = false,
    useMemory = true,
    onToken,
    onComplete,
    onError,
  } = options

  let fullResponse = ''
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  try {
    await fetchEventSource(`${apiUrl}/api/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question,
        use_agents: useAgents,
        use_advanced_rag: useAdvancedRag,
        use_memory: useMemory,
      }),
      onmessage(event: EventSourceMessage) {
        if (event.data === '[DONE]') {
          onComplete?.(fullResponse)
          return
        }

        try {
          const data = JSON.parse(event.data)
          if (data.token) {
            fullResponse += data.token
            onToken?.(data.token)
          }
        } catch (err) {
          console.error('Error parsing SSE data:', err)
        }
      },
      onerror(err) {
        console.error('SSE error:', err)
        onError?.(err as Error)
        throw err // Stop retrying
      },
    })
  } catch (error) {
    onError?.(error as Error)
  }
}

export async function uploadDocument(file: File): Promise<{ message: string; filename: string }> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${apiUrl}/api/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Upload failed')
  }

  return response.json()
}

export async function getMetrics(): Promise<{
  total_queries: number
  total_cost: number
  total_tokens: number
  average_cost_per_query: number
  average_tokens_per_query: number
}> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
  
  const response = await fetch(`${apiUrl}/api/metrics`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch metrics')
  }

  return response.json()
}

export async function clearConversation(): Promise<{ message: string }> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
  
  const response = await fetch(`${apiUrl}/api/clear-memory`, {
    method: 'POST',
  })

  if (!response.ok) {
    throw new Error('Failed to clear conversation')
  }

  return response.json()
}
