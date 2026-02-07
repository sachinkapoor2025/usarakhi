'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageSquare className="h-5 w-5 text-primary-600" />
          <span>AI Gift Message Generator</span>
        </CardTitle>
        <CardDescription>
          Create heartfelt messages for your Rakhi gift
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Form Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient</Label>
            <Select value={recipient} onValueChange={setRecipient}>
              <SelectTrigger>
                <SelectValue placeholder="Select recipient" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Brother">Brother</SelectItem>
                <SelectItem value="Sister">Sister</SelectItem>
                <SelectItem value="Cousin">Cousin</SelectItem>
                <SelectItem value="Friend">Friend</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tone">Message Tone</Label>
            <Select value={tone} onValueChange={(value) => setTone(value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="traditional">Traditional</SelectItem>
                <SelectItem value="modern">Modern</SelectItem>
                <SelectItem value="funny">Funny</SelectItem>
                <SelectItem value="emotional">Emotional</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex space-x-2">
          <Button
            onClick={generateMessage}
            disabled={loading}
            className="flex items-center space-x-2"
          >
            <MessageSquare className="h-4 w-4" />
            <span>{loading ? 'Generating...' : 'Generate Message'}</span>
          </Button>
          
          {generatedMessage && (
            <Button
              variant="outline"
              onClick={regenerateMessage}
              className="flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Regenerate</span>
            </Button>
          )}
        </div>

        {/* Generated Message */}
        {generatedMessage && (
          <div className="space-y-2">
            <Label>Generated Message</Label>
            <div className="relative">
              <Textarea
                value={generatedMessage}
                onChange={(e) => setGeneratedMessage(e.target.value)}
                className="min-h-[120px] pr-20"
                placeholder="Your personalized message will appear here..."
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                className="absolute right-2 top-2"
                disabled={!generatedMessage}
              >
                {copied ? (
                  <span className="text-green-600">Copied!</span>
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>Tip: Edit the message to make it more personal</span>
              <span className="text-primary-600">AI-Powered</span>
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
      </CardContent>
    </Card>
  )
}