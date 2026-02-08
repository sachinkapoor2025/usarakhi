'use client'

import { useState, useEffect } from 'react'
import { Star, Sparkles, Gift, Heart } from 'lucide-react'
import { AIAssistant, AIRecommendation } from '@/lib/ai'

interface AIRecommendationsProps {
  products: any[]
  onAddToCart?: (productId: string) => void
}

export function AIRecommendations({ products, onAddToCart }: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([])
  const [loading, setLoading] = useState(false)
  const [userPreferences, setUserPreferences] = useState({
    occasion: 'Raksha Bandhan',
    recipient: 'Brother',
    budget: 50,
    style: ['Traditional', 'Modern'],
    interests: ['Technology', 'Sports']
  })

  useEffect(() => {
    generateRecommendations()
  }, [products])

  const generateRecommendations = async () => {
    if (products.length === 0) return

    setLoading(true)
    try {
      const recs = await AIAssistant.getProductRecommendations(userPreferences, products)
      setRecommendations(recs)
    } catch (error) {
      console.error('AI Recommendations Error:', error)
      // Fallback to random recommendations
      const randomRecs = products.slice(0, 3).map((product, index) => ({
        productId: product.id,
        reason: "Popular choice for Raksha Bandhan",
        matchScore: 80 + index * 5
      }))
      setRecommendations(randomRecs)
    } finally {
      setLoading(false)
    }
  }

  const getRecommendedProducts = () => {
    return recommendations.map(rec => {
      return products.find(p => p.id === rec.productId)
    }).filter(Boolean)
  }

  const recommendedProducts = getRecommendedProducts()

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-4 border-b">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">AI Recommendations</h3>
          </div>
          <p className="text-sm text-gray-600 mt-1">Generating personalized suggestions...</p>
        </div>
        <div className="p-4">
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    )
  }

  if (recommendedProducts.length === 0) {
    return null
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">AI-Powered Recommendations</h3>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Personalized Rakhi suggestions based on your preferences
        </p>
      </div>
      <div className="p-4">
        <div className="space-y-6">
          {recommendedProducts.map((product, index) => {
            const rec = recommendations.find(r => r.productId === product.id)
            return (
              <div key={product.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Gift className="h-8 w-8 text-blue-600" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">{product.name}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        Match: {rec?.matchScore || 85}%
                      </span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm text-gray-600">4.8</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                  <p className="text-xs text-gray-500 mt-2">{rec?.reason}</p>
                </div>
                
                <div className="flex flex-col items-end space-y-2">
                  <span className="text-lg font-bold text-gray-900">${product.price}</span>
                  <button
                    onClick={() => onAddToCart?.(product.id)}
                    className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <Heart className="h-4 w-4 mr-2 inline" />
                    Add to Cart
                  </button>
                </div>
              </div>
            )
          })}
        </div>
        
        <div className="mt-6 flex justify-between items-center">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Sparkles className="h-4 w-4" />
            <span>Powered by AI</span>
          </div>
          <button
            onClick={generateRecommendations}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Refresh Recommendations
          </button>
        </div>
      </div>
    </div>
  )
}