'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, X, MessageSquare } from 'lucide-react'
import { AIAssistant, ChatMessage } from '@/lib/ai'

interface AIChatWidgetProps {
  className?: string
}

export function AIChatWidget({ className }: AIChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Namaste! I'm your Rakhi assistant. How can I help you find the perfect Rakhi gift today?"
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isTyping) return

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputValue.trim()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    try {
      const response = await AIAssistant.getChatResponse([...messages, userMessage], {
        currentPage: window.location.pathname,
        productViewed: localStorage.getItem('lastViewedProduct') || undefined
      })

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment!"
      }])
    } finally {
      setIsTyping(false)
    }
  }

  const getQuickQuestions = () => {
    const path = window.location.pathname
    if (path.includes('/products')) {
      return [
        "Which Rakhi would you recommend for a brother who loves modern designs?",
        "What's the fastest delivery option available?",
        "Do you have any gift combos under $50?"
      ]
    } else if (path.includes('/send-rakhi-to-usa')) {
      return [
        "How long does delivery take to New York?",
        "Can I send Rakhi to multiple brothers in different cities?",
        "What's your same-day delivery cutoff time?"
      ]
    } else {
      return [
        "What are the best Rakhi gift ideas for brothers in USA?",
        "How do I track my Rakhi order?",
        "Can I add a personalized message with my Rakhi?"
      ]
    }
  }

  const handleQuickQuestion = async (question: string) => {
    setInputValue(question)
    // Trigger the form submission after setting the input
    setTimeout(() => {
      const form = document.getElementById('chat-form') as HTMLFormElement
      form?.dispatchEvent(new Event('submit', { bubbles: true }))
    }, 100)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white"
        aria-label="Open chat"
      >
        <MessageSquare className="h-6 w-6" />
      </button>
    )
  }

  return (
    <div className={`fixed bottom-6 right-6 w-96 bg-white border border-gray-200 rounded-lg shadow-xl ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Bot className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Rakhi Assistant</h3>
            <p className="text-xs text-gray-500">AI-Powered Support</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="h-8 w-8 p-0 border-none bg-transparent hover:bg-gray-100 rounded"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="h-80 p-4 space-y-4 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-2 max-w-xs ${
              message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}>
              {message.role === 'user' ? (
                <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
              ) : (
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-blue-600" />
                </div>
              )}
              <div
                className={`px-3 py-2 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2 max-w-xs">
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4 text-blue-600" />
              </div>
              <div className="px-3 py-2 rounded-lg bg-gray-100">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions */}
      {messages.length === 1 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
          <div className="space-y-1">
            {getQuickQuestions().map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuickQuestion(question)}
                className="text-left text-xs text-blue-600 hover:text-blue-700 hover:underline block w-full text-left"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t">
        <form id="chat-form" onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isTyping}
          />
          <button 
            type="submit" 
            disabled={!inputValue.trim() || isTyping}
            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
        <p className="text-xs text-gray-400 text-center mt-2">Powered by AI</p>
      </div>
    </div>
  )
}