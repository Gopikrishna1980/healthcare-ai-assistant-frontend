import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, File, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { uploadDocument } from '@/lib/api'

export default function DocumentUpload() {
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setUploading(true)
    setUploadStatus('idle')
    setMessage('')

    try {
      const result = await uploadDocument(file)
      setUploadStatus('success')
      setMessage(`Successfully uploaded: ${result.filename}`)
    } catch (error) {
      setUploadStatus('error')
      setMessage('Failed to upload document. Please try again.')
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    disabled: uploading,
  })

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
        } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center gap-3">
          {uploading ? (
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          ) : (
            <Upload className="w-12 h-12 text-gray-400" />
          )}
          
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {isDragActive
                ? 'Drop the file here...'
                : uploading
                ? 'Uploading...'
                : 'Drag & drop a document'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              or click to select file
            </p>
          </div>

          <div className="flex gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">PDF</span>
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">DOCX</span>
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">TXT</span>
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {uploadStatus === 'success' && (
        <div className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-green-900 dark:text-green-300">
              Upload successful!
            </p>
            <p className="text-xs text-green-700 dark:text-green-400 mt-1">
              {message}
            </p>
          </div>
        </div>
      )}

      {uploadStatus === 'error' && (
        <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-900 dark:text-red-300">
              Upload failed
            </p>
            <p className="text-xs text-red-700 dark:text-red-400 mt-1">
              {message}
            </p>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
        <div className="flex gap-2">
          <File className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <div className="text-xs text-blue-900 dark:text-blue-300">
            <p className="font-medium mb-1">Supported documents:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-700 dark:text-blue-400">
              <li>PDF files (.pdf)</li>
              <li>Word documents (.docx)</li>
              <li>Text files (.txt)</li>
            </ul>
            <p className="mt-2">
              Uploaded documents will be added to the knowledge base for RAG retrieval.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
