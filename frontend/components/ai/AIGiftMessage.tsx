
'use client'

import { useState } from 'react'
import { Copy, RefreshCw, MessageSquare } from 'lucide-react'
import { AIAssistant } from '@/lib/ai'

interface AIGiftMessageProps {
  onMessageGenerated?: (message: string) => void
}

export function AIGiftMessage({ onMessageGenerated }: AIGiftMessageProps) {
  const [recipient, setRecipient] = useState('Brother')
  const [occasion, setOccasion] = useState('Raksha Bandhan')
  const [relationship, setRelationship] = useState('Sibling')
  const [tone, setTone] = useState<'traditional' | 'modern' | 'funny' | 'emotional'>('traditional')
  const [generatedMessage, setGeneratedMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const generateMessage = async () => {
    setLoading(true)
    try {
      const message = await AIAssistant.generateGiftMessage(recipient, occasion, relationship, tone)
      setGeneratedMessage(message)
      onMessageGenerated?.(message)
    } catch (error) {
      console.error('AI Message Generation Error:', error)
      setGeneratedMessage("Wishing you all the happiness and blessings on this special day. May our bond grow stronger with each passing year.")
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async () => {
    if (generatedMessage) {
      await navigator.clipboard.writeText(generatedMessage)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const regenerateMessage = () => {
    setGeneratedMessage('')
    generateMessage()
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <div className="flex items-center space-x-2">
          <MessageSquare className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">AI Gift Message Generator</h3>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Create heartfelt messages for your Rakhi gift
        </p>
      </div>
      <div className="p-4 space-y-4">
        {/* Form Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="recipient" className="block text-sm font-medium text-gray-700">
              Recipient
            </label>
            <select
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Brother">Brother</option>
              <option value="Sister">Sister</option>
              <option value="Cousin">Cousin</option>
              <option value="Friend">Friend</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="tone" className="block text-sm font-medium text-gray-700">
              Message Tone
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="traditional">Traditional</option>
              <option value="modern">Modern</option>
              <option value="funny">Funny</option>
              <option value="emotional">Emotional</option>
            </select>
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex space-x-2">
          <button
            onClick={generateMessage}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MessageSquare className="h-4 w-4" />
            <span>{loading ? 'Generating...' : 'Generate Message'}</span>
          </button>
          
          {generatedMessage && (
            <button
              onClick={regenerateMessage}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Regenerate</span>
            </button>
          )}
        </div>

        {/* Generated Message */}
        {generatedMessage && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Generated Message
            </label>
            <div className="relative">
              <textarea
                value={generatedMessage}
                onChange={(e) => setGeneratedMessage(e.target.value)}
                className="w-full min-h-[120px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-20"
                placeholder="Your personalized message will appear here..."
              />
              <button
                onClick={copyToClipboard}
                className="absolute right-2 top-2 px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                disabled={!generatedMessage}
              >
                {copied ? (
                  <span className="text-green-600">Copied!</span>
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
            
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>Tip: Edit the message to make it more personal</span>
              <span className="text-blue-600">AI-Powered</span>
            </div>
          </div>
        )}

        {/* Sample Messages */}
        {!generatedMessage && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Sample Messages:</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p>• "Dear Brother, on this sacred day of Raksha Bandhan, I tie this Rakhi with all my love and prayers. May God always keep you safe and happy."</p>
              <p>• "Happy Raksha Bandhan! Thank you for always being my protector. Wishing you success and joy in all your endeavors."</p>
              <p>• "To my amazing brother, you're not just a sibling but my best friend. May this Rakhi strengthen our bond forever."</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}