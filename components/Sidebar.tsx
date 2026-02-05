import { X, Upload, BarChart3, Trash2, Download, MessageSquare } from 'lucide-react'
import { useState } from 'react'
import DocumentUpload from './DocumentUpload'
import MetricsDashboard from './MetricsDashboard'
import clsx from 'clsx'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  onClearConversation: () => void
  messageCount: number
}

type SidebarView = 'menu' | 'upload' | 'metrics'

export default function Sidebar({ isOpen, onClose, onClearConversation, messageCount }: SidebarProps) {
  const [currentView, setCurrentView] = useState<SidebarView>('menu')

  const handleClear = () => {
    if (confirm('Are you sure you want to clear the conversation?')) {
      onClearConversation()
    }
  }

  const exportConversation = () => {
    // Simple export - in real app would include full message data
    const dataStr = JSON.stringify({ messageCount, timestamp: new Date() }, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `conversation-${Date.now()}.json`
    link.click()
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={clsx(
          'fixed lg:relative inset-y-0 left-0 z-50 w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {currentView === 'menu' && 'Menu'}
              {currentView === 'upload' && 'Upload Documents'}
              {currentView === 'metrics' && 'Metrics'}
            </h2>
            <button
              onClick={() => currentView === 'menu' ? onClose() : setCurrentView('menu')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {currentView === 'menu' && (
              <div className="space-y-2">
                <button
                  onClick={() => setCurrentView('upload')}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <Upload className="w-5 h-5" />
                  <span className="font-medium">Upload Documents</span>
                </button>

                <button
                  onClick={() => setCurrentView('metrics')}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <BarChart3 className="w-5 h-5" />
                  <span className="font-medium">View Metrics</span>
                </button>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                    <MessageSquare className="w-4 h-4" />
                    <span>{messageCount} messages</span>
                  </div>
                </div>

                <button
                  onClick={exportConversation}
                  disabled={messageCount === 0}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-5 h-5" />
                  <span className="font-medium">Export Chat</span>
                </button>

                <button
                  onClick={handleClear}
                  disabled={messageCount === 0}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-5 h-5" />
                  <span className="font-medium">Clear Conversation</span>
                </button>
              </div>
            )}

            {currentView === 'upload' && <DocumentUpload />}
            {currentView === 'metrics' && <MetricsDashboard />}
          </div>
        </div>
      </div>
    </>
  )
}
