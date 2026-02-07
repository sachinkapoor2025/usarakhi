import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only for frontend usage
})

export interface AIRecommendation {
  productId: string
  reason: string
  matchScore: number
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export class AIAssistant {
  /**
   * Generate personalized product recommendations based on user preferences
   */
  static async getProductRecommendations(
    userPreferences: {
      occasion?: string
      recipient?: string
      budget?: number
      style?: string[]
      interests?: string[]
    },
    availableProducts: any[]
  ): Promise<AIRecommendation[]> {
    try {
      const prompt = `
        You are an expert Rakhi consultant helping customers find the perfect Rakhi gift.
        Based on the user's preferences, recommend the best products from our catalog.
        
        User Preferences:
        - Occasion: ${userPreferences.occasion || 'Raksha Bandhan'}
        - Recipient: ${userPreferences.recipient || 'Brother'}
        - Budget: $${userPreferences.budget || 'Any'}
        - Style preferences: ${userPreferences.style?.join(', ') || 'Any'}
        - Interests: ${userPreferences.interests?.join(', ') || 'Any'}
        
        Available Products:
        ${availableProducts.map(p => `
          ID: ${p.id}
          Name: ${p.name}
          Price: $${p.price}
          Category: ${p.category}
          Description: ${p.description}
          Tags: ${p.tags?.join(', ') || 'General'}
        `).join('\n')}
        
        Please provide 3-5 product recommendations with reasons for each choice.
        Return the recommendations in this JSON format:
        {
          "recommendations": [
            {
              "productId": "product_id",
              "reason": "Why this product is perfect for the user",
              "matchScore": 85
            }
          ]
        }
      `

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful Rakhi expert providing personalized recommendations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })

      const content = response.choices[0].message.content
      const parsed = JSON.parse(content || '{}')
      
      return parsed.recommendations || []
    } catch (error) {
      console.error('AI Recommendation Error:', error)
      return []
    }
  }

  /**
   * Generate personalized gift messages for Rakhi
   */
  static async generateGiftMessage(
    recipient: string,
    occasion: string,
    relationship: string,
    tone: 'traditional' | 'modern' | 'funny' | 'emotional' = 'traditional'
  ): Promise<string> {
    try {
      const prompt = `
        Create a beautiful, heartfelt message for a ${recipient} on ${occasion}.
        
        Relationship: ${relationship}
        Tone: ${tone}
        
        The message should be:
        - 2-3 sentences long
        - Appropriate for the occasion
        - Reflect the bond between siblings
        - Include a blessing or well-wish
        
        Return only the message text, no additional explanation.
      `

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert at writing heartfelt, culturally appropriate messages for Indian festivals.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 150,
        temperature: 0.8
      })

      return response.choices[0].message.content?.trim() || ''
    } catch (error) {
      console.error('AI Message Generation Error:', error)
      return ''
    }
  }

  /**
   * Generate product descriptions using AI
   */
  static async generateProductDescription(
    productName: string,
    category: string,
    features: string[],
    targetAudience: string
  ): Promise<string> {
    try {
      const prompt = `
        Create an engaging product description for: ${productName}
        
        Category: ${category}
        Features: ${features.join(', ')}
        Target Audience: ${targetAudience}
        
        The description should:
        - Be 3-4 sentences long
        - Highlight the unique selling points
        - Appeal to the target audience
        - Include emotional appeal
        - Be SEO-friendly with relevant keywords
        
        Return only the description text.
      `

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert copywriter specializing in e-commerce product descriptions.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 200,
        temperature: 0.7
      })

      return response.choices[0].message.content?.trim() || ''
    } catch (error) {
      console.error('AI Description Generation Error:', error)
      return ''
    }
  }

  /**
   * AI-powered customer support chat
   */
  static async getChatResponse(
    messages: ChatMessage[],
    context?: {
      orderHistory?: any[]
      productViewed?: string
      currentPage?: string
    }
  ): Promise<string> {
    try {
      const contextPrompt = context ? `
        User Context:
        - Order History: ${context.orderHistory?.length || 0} orders
        - Recently Viewed: ${context.productViewed || 'None'}
        - Current Page: ${context.currentPage || 'Unknown'}
      ` : ''

      const systemPrompt = `
        You are a friendly and knowledgeable customer support agent for Usa Rakhi, 
        an online store specializing in Rakhi and Rakhi gift delivery to the USA.
        
        Your goals:
        1. Provide helpful, accurate information about products and services
        2. Assist with order tracking and issues
        3. Suggest appropriate products based on customer needs
        4. Maintain a warm, professional tone
        5. Escalate complex issues to human agents when needed
        
        ${contextPrompt}
        
        Company Information:
        - We deliver Rakhis and gifts to the USA from India
        - We offer same-day, express, and standard delivery
        - We have various Rakhi categories: Traditional, Modern, Designer, etc.
        - We offer gift combos with chocolates, dry fruits, and flowers
        - Delivery available across all US states
        
        Always be concise, helpful, and solution-oriented.
      `

      const chatMessages: ChatMessage[] = [
        {
          role: 'system',
          content: systemPrompt
        },
        ...messages
      ]

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: chatMessages as any,
        max_tokens: 300,
        temperature: 0.5
      })

      return response.choices[0].message.content?.trim() || ''
    } catch (error) {
      console.error('AI Chat Error:', error)
      return "I'm sorry, I'm having trouble accessing the information right now. Please try again in a moment or contact our customer support team directly."
    }
  }

  /**
   * Generate blog post content using AI
   */
  static async generateBlogContent(
    topic: string,
    keywords: string[],
    wordCount: number = 500
  ): Promise<{
    title: string
    content: string
    metaDescription: string
    tags: string[]
  }> {
    try {
      const prompt = `
        Write a comprehensive blog post about: ${topic}
        
        Target Keywords: ${keywords.join(', ')}
        Target Word Count: ${wordCount} words
        
        Requirements:
        1. Create an engaging, SEO-friendly title
        2. Write informative, well-structured content
        3. Naturally incorporate the target keywords
        4. Include introduction, body, and conclusion
        5. Add relevant subheadings (H2, H3)
        6. Create a compelling meta description (150-160 characters)
        7. Suggest relevant tags
        
        The content should be:
        - Informative and helpful
        - Optimized for search engines
        - Engaging for readers
        - Relevant to Rakhi/Raksha Bandhan
        
        Return the content in this JSON format:
        {
          "title": "Blog post title",
          "content": "Full blog content with HTML formatting",
          "metaDescription": "Meta description text",
          "tags": ["tag1", "tag2", "tag3"]
        }
      `

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert content writer specializing in SEO-optimized blog posts about Indian festivals and traditions.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })

      const content = response.choices[0].message.content
      return JSON.parse(content || '{}')
    } catch (error) {
      console.error('AI Blog Generation Error:', error)
      return {
        title: '',
        content: '',
        metaDescription: '',
        tags: []
      }
    }
  }

  /**
   * Analyze customer sentiment from reviews or messages
   */
  static async analyzeSentiment(text: string): Promise<{
    sentiment: 'positive' | 'negative' | 'neutral'
    confidence: number
    keyPhrases: string[]
  }> {
    try {
      const prompt = `
        Analyze the sentiment of this customer message/review:
        
        Text: "${text}"
        
        Please provide:
        1. Overall sentiment (positive/negative/neutral)
        2. Confidence score (0-100%)
        3. Key phrases that indicate the sentiment
        
        Return in JSON format:
        {
          "sentiment": "positive|negative|neutral",
          "confidence": 85,
          "keyPhrases": ["phrase1", "phrase2"]
        }
      `

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert at sentiment analysis for customer feedback.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 200,
        temperature: 0.3
      })

      const content = response.choices[0].message.content
      return JSON.parse(content || '{}')
    } catch (error) {
      console.error('AI Sentiment Analysis Error:', error)
      return {
        sentiment: 'neutral',
        confidence: 0,
        keyPhrases: []
      }
    }
  }

  /**
   * Generate SEO meta tags for pages
   */
  static async generateMetaTags(
    pageType: 'product' | 'category' | 'blog' | 'homepage',
    content: string,
    primaryKeyword: string,
    secondaryKeywords: string[]
  ): Promise<{
    title: string
    description: string
    keywords: string[]
  }> {
    try {
      const prompt = `
        Generate SEO-optimized meta tags for a ${pageType} page.
        
        Content: ${content.substring(0, 500)}...
        Primary Keyword: ${primaryKeyword}
        Secondary Keywords: ${secondaryKeywords.join(', ')}
        
        Requirements:
        1. Title: 50-60 characters, include primary keyword
        2. Description: 140-160 characters, compelling and keyword-rich
        3. Keywords: 5-8 relevant keywords including primary and secondary
        
        Return in JSON format:
        {
          "title": "SEO title",
          "description": "Meta description",
          "keywords": ["keyword1", "keyword2"]
        }
      `

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an SEO expert specializing in meta tag optimization.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.5
      })

      const content = response.choices[0].message.content
      return JSON.parse(content || '{}')
    } catch (error) {
      console.error('AI Meta Tag Generation Error:', error)
      return {
        title: '',
        description: '',
        keywords: []
      }
    }
  }
}

export default AIAssistant