/**
 * AI Insights Component (Placeholder)
 * Scaffold for future LLM integration
 * 
 * IMPLEMENTATION NOTES:
 * - This is a placeholder component for AI-powered insights
 * - To implement LLM integration:
 *   1. Create an API endpoint (e.g., /api/ai-insights)
 *   2. Send filtered molecule data and user query to the endpoint
 *   3. Route to your LLM provider (OpenAI, Anthropic, etc.)
 *   4. Stream responses back to the UI
 *   5. Update this component to handle streaming and display
 */

'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Send, Loader } from 'lucide-react'
import type { FilterState, ChatMessage } from '@/lib/types'

interface AIInsightsProps {
  filters: FilterState
  totalRecords: number
}

export function AIInsights({ filters, totalRecords }: AIInsightsProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim()) return

    // Add user message
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setError(null)

    try {
      // TODO: Send request to your AI endpoint
      // This is a placeholder that shows how the integration should work
      
      // Example implementation:
      /*
      const response = await fetch('/api/ai-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: input,
          filters: filters,
          totalRecords: totalRecords,
        }),
      })

      if (!response.ok) throw new Error('Failed to get AI response')

      const data = await response.json()
      
      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      */

      // For now, show a placeholder response
      setTimeout(() => {
        const placeholderMessage: ChatMessage = {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: `AI insights feature coming soon! You've queried ${totalRecords} molecules with the current filters. Once implemented, you'll be able to ask natural language questions about your data like "What's the average molecular weight?" or "Which compounds pass all drug rules?"`,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, placeholderMessage])
      }, 500)
    } catch (err) {
      setError('Failed to get response. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow flex flex-col h-96">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <p className="text-gray-500 mb-2">No messages yet</p>
              <p className="text-sm text-gray-400">
                Ask questions about your filtered data and get AI-powered insights
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-900 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg rounded-bl-none">
                  <Loader className="h-5 w-5 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4">
        {error && (
          <div className="mb-2 p-2 bg-red-50 text-red-700 text-xs rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your data..."
            disabled={isLoading}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  )
}
