import { Message } from '@/types'
import { User, Bot, AlertCircle, FileText, DollarSign, Copy, RefreshCw, ThumbsUp, ThumbsDown, Check } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import clsx from 'clsx'
import { useState } from 'react'
import CodeBlock from './CodeBlock'

interface ChatMessageProps {
  message: Message
  isLastAssistant?: boolean
  onRegenerate?: () => void
  onReaction?: (messageId: string, reaction: 'like' | 'dislike') => void
}

export default function ChatMessage({ message, isLastAssistant, onRegenerate, onReaction }: ChatMessageProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  const isUser = message.role === 'user'
  const isError = message.isError

  return (
    <div
      className={clsx(
        'flex gap-3',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {!isUser && (
        <div className={clsx(
          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
          isError ? 'bg-red-100 dark:bg-red-900' : 'bg-blue-100 dark:bg-blue-900'
        )}>
          {isError ? (
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
          ) : (
            <Bot className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          )}
        </div>
      )}

      <div
        className={clsx(
          'max-w-[70%] rounded-2xl px-4 py-3',
          isUser
            ? 'bg-blue-600 text-white'
            : isError
            ? 'bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-300'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
        )}
      >
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <ReactMarkdown
            components={{
              code: CodeBlock as any,
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        {/* Sources */}
        {message.sources && message.sources.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-300 dark:border-gray-600">
            <div className="flex items-center gap-1 text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <FileText className="w-3 h-3" />
              Sources
            </div>
            <div className="space-y-1">
              {message.sources.map((source, idx) => (
                <div key={idx} className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                  {source}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Metadata */}
        {message.metadata && (
          <div className="mt-2 flex flex-wrap gap-2">
            {message.metadata.agent_used && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                Agent: {message.metadata.agent_used}
              </span>
            )}
            {message.metadata.techniques_used && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                {message.metadata.techniques_used.join(', ')}
              </span>
            )}
          </div>
        )}

        {/* Cost Info */}
        {message.costInfo && (
          <div className="mt-2 flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
            <DollarSign className="w-3 h-3" />
            ${message.costInfo.total_cost.toFixed(4)} | {message.costInfo.total_tokens} tokens
          </div>
        )}

        <div className="mt-2 flex items-center justify-between">
          <div className="text-xs text-gray-500 dark:text-gray-500">
            {message.timestamp.toLocaleTimeString()}
          </div>
          
          {/* Action Buttons */}
          {!isUser && !isError && (
            <div className="flex items-center gap-1">
              <button
                onClick={handleCopy}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                title="Copy message"
              >
                {copied ? (
                  <Check className="w-3 h-3 text-green-600" />
                ) : (
                  <Copy className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                )}
              </button>
              
              {isLastAssistant && onRegenerate && (
                <button
                  onClick={onRegenerate}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                  title="Regenerate response"
                >
                  <RefreshCw className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                </button>
              )}
              
              <button
                onClick={() => onReaction?.(message.id, 'like')}
                className={clsx(
                  'p-1 rounded transition-colors',
                  message.reaction === 'like'
                    ? 'bg-green-100 dark:bg-green-900'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                )}
                title="Like"
              >
                <ThumbsUp className={clsx(
                  'w-3 h-3',
                  message.reaction === 'like'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-gray-600 dark:text-gray-400'
                )} />
              </button>
              
              <button
                onClick={() => onReaction?.(message.id, 'dislike')}
                className={clsx(
                  'p-1 rounded transition-colors',
                  message.reaction === 'dislike'
                    ? 'bg-red-100 dark:bg-red-900'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                )}
                title="Dislike"
              >
                <ThumbsDown className={clsx(
                  'w-3 h-3',
                  message.reaction === 'dislike'
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-gray-600 dark:text-gray-400'
                )} />
              </button>
            </div>
          )}
        </div>
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  )
}
