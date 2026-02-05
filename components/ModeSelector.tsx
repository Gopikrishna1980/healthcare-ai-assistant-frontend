import { ChatMode } from '@/types'
import clsx from 'clsx'
import { Zap, Users, Sparkles } from 'lucide-react'

interface ModeSelectorProps {
  mode: ChatMode
  onModeChange: (mode: ChatMode) => void
}

export default function ModeSelector({ mode, onModeChange }: ModeSelectorProps) {
  const modes = [
    {
      id: 'standard' as ChatMode,
      name: 'Standard RAG',
      description: 'Basic retrieval with memory',
      icon: Zap,
      color: 'blue',
    },
    {
      id: 'agent' as ChatMode,
      name: 'Multi-Agent',
      description: '4 specialized medical agents',
      icon: Users,
      color: 'purple',
    },
    {
      id: 'advanced' as ChatMode,
      name: 'Advanced RAG',
      description: 'Decomposition + Reranking',
      icon: Sparkles,
      color: 'green',
    },
  ]

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3">
      <div className="flex gap-2">
        {modes.map((modeOption) => {
          const Icon = modeOption.icon
          const isActive = mode === modeOption.id

          return (
            <button
              key={modeOption.id}
              onClick={() => onModeChange(modeOption.id)}
              className={clsx(
                'flex items-center gap-2 px-4 py-2 rounded-lg transition-all',
                isActive
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-2 border-blue-500'
                  : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-transparent hover:bg-gray-100 dark:hover:bg-gray-600'
              )}
            >
              <Icon className="w-4 h-4" />
              <div className="text-left">
                <div className="text-sm font-semibold">{modeOption.name}</div>
                <div className="text-xs opacity-75">{modeOption.description}</div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
