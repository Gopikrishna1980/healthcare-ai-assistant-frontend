import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

interface CodeBlockProps {
  inline?: boolean
  className?: string
  children?: React.ReactNode
}

export default function CodeBlock({ inline, className, children, ...props }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const match = /language-(\w+)/.exec(className || '')
  const lang = match ? match[1] : ''

  const handleCopy = async () => {
    const code = String(children).replace(/\n$/, '')
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (inline) {
    return (
      <code className={className} {...props}>
        {children}
      </code>
    )
  }

  return (
    <div className="relative group">
      <div className="flex items-center justify-between bg-gray-800 text-gray-200 px-4 py-2 rounded-t-lg">
        <span className="text-xs font-mono">{lang || 'code'}</span>
        <button
          onClick={handleCopy}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-700 rounded"
          title="Copy code"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-400" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>
      <pre className="!mt-0 !rounded-t-none bg-gray-900">
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
    </div>
  )
}
