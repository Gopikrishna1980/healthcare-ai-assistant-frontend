import { useQuery } from '@tanstack/react-query'
import { DollarSign, MessageSquare, Zap, TrendingUp, RefreshCw, AlertCircle } from 'lucide-react'
import { getMetrics } from '@/lib/api'

interface Metrics {
  total_queries: number
  total_cost: number
  total_tokens: number
  average_cost_per_query: number
  average_tokens_per_query: number
}

export default function MetricsDashboard() {
  const { data: metrics, isLoading, error, refetch } = useQuery<Metrics>({
    queryKey: ['metrics'],
    queryFn: getMetrics,
    refetchInterval: false,
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-start gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium text-red-900 dark:text-red-300">
            Failed to load metrics
          </p>
          <p className="text-xs text-red-700 dark:text-red-400 mt-1">
            {error instanceof Error ? error.message : 'Unknown error'}
          </p>
          <button
            onClick={() => refetch()}
            className="mt-2 text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  if (!metrics) {
    return null
  }

  return (
    <div className="space-y-4">
      {/* Refresh Button */}
      <button
        onClick={() => refetch()}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <RefreshCw className="w-4 h-4" />
        Refresh
      </button>

      {/* Metrics Cards */}
      <div className="space-y-3">
        {/* Total Queries */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-800/30 rounded-lg">
              <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-blue-600 dark:text-blue-400">Total Queries</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">
                {metrics.total_queries.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Total Cost */}
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-800/30 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-green-600 dark:text-green-400">Total Cost</p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-300">
                ${metrics.total_cost.toFixed(4)}
              </p>
            </div>
          </div>
        </div>

        {/* Total Tokens */}
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-800/30 rounded-lg">
              <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-purple-600 dark:text-purple-400">Total Tokens</p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-300">
                {metrics.total_tokens.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Average Cost */}
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-800/30 rounded-lg">
              <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-orange-600 dark:text-orange-400">Avg Cost/Query</p>
              <p className="text-2xl font-bold text-orange-900 dark:text-orange-300">
                ${metrics.average_cost_per_query.toFixed(4)}
              </p>
            </div>
          </div>
        </div>

        {/* Average Tokens */}
        <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-100 dark:bg-teal-800/30 rounded-lg">
              <Zap className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-teal-600 dark:text-teal-400">Avg Tokens/Query</p>
              <p className="text-2xl font-bold text-teal-900 dark:text-teal-300">
                {metrics.average_tokens_per_query.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Note */}
      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          <span className="font-medium">Note:</span> Metrics are calculated based on conversation
          history. Clear conversation to reset metrics.
        </p>
      </div>
    </div>
  )
}
