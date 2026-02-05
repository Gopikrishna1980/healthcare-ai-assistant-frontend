import { Activity, Bot, Menu } from 'lucide-react'

interface ChatHeaderProps {
  onToggleSidebar: () => void
}

export default function ChatHeader({ onToggleSidebar }: ChatHeaderProps) {
  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <Bot className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Healthcare AI Assistant
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Advanced RAG with Multi-Agent System
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900 rounded-full">
          <Activity className="w-4 h-4 text-green-600 dark:text-green-400 animate-pulse" />
          <span className="text-sm font-medium text-green-700 dark:text-green-300">
            Online
          </span>
        </div>
      </div>
    </div>
  )
}
