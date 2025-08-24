'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { PaperAirplaneIcon, SparklesIcon } from '@heroicons/react/24/outline'

export default function AIToolsPage() {
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setLoading(true)
    setError(null)
    setResponse('')

    try {
      const res = await fetch('/api/llm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      })

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      const data = await res.json()
      setResponse(data.response)
    } catch (err) {
      console.error('Error calling AI API:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full mb-4">
            <SparklesIcon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">AI Tools</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Interact with AI models to get insights and answers to your questions
          </p>
        </div>

        {/* Input Form */}
        <div className="card mb-8 dark:bg-gray-800 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Enter your prompt
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask me anything! For example: 'Analyze the product data from our analytics dashboard' or 'What are the key insights from our sales data?'"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 resize-none"
                rows={4}
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <PaperAirplaneIcon className="w-5 h-5" />
                  <span>Send to AI</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Response Display */}
        {loading && (
          <div className="card text-center dark:bg-gray-800 dark:border-gray-700">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">AI is thinking...</p>
          </div>
        )}

        {error && (
          <div className="card bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">Error</h3>
              <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
              <button 
                onClick={() => setError(null)}
                className="btn-primary"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {response && !loading && (
          <div className="card dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-3">
                <SparklesIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Response</h3>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{response}</p>
            </div>
            <div className="mt-4 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
              <span>Response generated successfully</span>
              <button
                onClick={() => setResponse('')}
                className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Usage Tips */}
        <div className="card mt-8 dark:bg-gray-800 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">💡 Usage Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Good Prompts:</h4>
              <ul className="space-y-1">
                <li>• "Analyze our product performance"</li>
                <li>• "What insights can you find in our data?"</li>
                <li>• "Summarize the key trends"</li>
                <li>• "Suggest improvements based on our data"</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Features:</h4>
              <ul className="space-y-1">
                <li>• Powered by Cohere AI (free tier)</li>
                <li>• Fallback to Hugging Face models</li>
                <li>• Context-aware responses</li>
                <li>• Fast and reliable</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
