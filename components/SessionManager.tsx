import { Session } from '@/types'
import { Save, Trash2, Clock, MessageSquare } from 'lucide-react'
import { useState } from 'react'

interface SessionManagerProps {
  sessions: Session[]
  currentSessionId: string | null
  onLoadSession: (session: Session) => void
  onSaveSession: (name: string) => void
  onDeleteSession: (sessionId: string) => void
}

export default function SessionManager({
  sessions,
  currentSessionId,
  onLoadSession,
  onSaveSession,
  onDeleteSession,
}: SessionManagerProps) {
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [sessionName, setSessionName] = useState('')

  const handleSave = () => {
    if (sessionName.trim()) {
      onSaveSession(sessionName.trim())
      setSessionName('')
      setShowSaveDialog(false)
    }
  }

  const handleDelete = (sessionId: string, sessionName: string) => {
    if (confirm(`Delete session "${sessionName}"?`)) {
      onDeleteSession(sessionId)
    }
  }

  return (
    <div className="space-y-4">
      {/* Save Current Session */}
      {!showSaveDialog ? (
        <button
          onClick={() => setShowSaveDialog(true)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
        >
          <Save className="w-5 h-5" />
          <span className="font-medium">Save Current Session</span>
        </button>
      ) : (
        <div className="space-y-2">
          <input
            type="text"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
            placeholder="Session name..."
            autoFocus
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && handleSave()}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={!sessionName.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => {
                setShowSaveDialog(false)
                setSessionName('')
              }}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Saved Sessions List */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Saved Sessions ({sessions.length})
        </h3>
        
        {sessions.length === 0 ? (
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              No saved sessions yet
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {sessions
              .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
              .map((session) => (
                <div
                  key={session.id}
                  className={`p-3 rounded-lg border transition-colors ${
                    session.id === currentSessionId
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700'
                      : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <button
                      onClick={() => onLoadSession(session)}
                      className="flex-1 text-left"
                    >
                      <div className="font-medium text-gray-900 dark:text-white mb-1">
                        {session.name}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          {session.messages.length}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(session.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </button>
                    <button
                      onClick={() => handleDelete(session.id, session.name)}
                      className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
                      title="Delete session"
                    >
                      <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}
