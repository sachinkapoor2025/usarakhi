const AWS = require('aws-sdk')
const OpenAI = require('openai')

const dynamoDb = new AWS.DynamoDB.DocumentClient()
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const TABLE_NAME = process.env.DYNAMODB_TABLE

/**
 * Generate AI-powered product descriptions
 */
exports.generateProductDescription = async (event) => {
  try {
    const body = JSON.parse(event.body)
    const { productName, category, features, targetAudience } = body

    if (!productName || !category) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': process.env.FRONTEND_URL,
          'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          'Access-Control-Allow-Methods': 'POST,OPTIONS'
        },
        body: JSON.stringify({ error: 'Product name and category are required' })
      }
    }

    const prompt = `
      Create an engaging product description for: ${productName}
      
      Category: ${category}
      Features: ${features?.join(', ') || 'Standard features'}
      Target Audience: ${targetAudience || 'Rakhi shoppers'}
      
      The description should:
      - Be 3-4 sentences long
      - Highlight the unique selling points
      - Appeal to the target audience
      - Include emotional appeal
      - Be SEO-friendly with relevant keywords
      - Mention that it's perfect for Raksha Bandhan
      
      Return only the description text.
    `

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert copywriter specializing in e-commerce product descriptions for Indian festivals.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 200,
      temperature: 0.7
    })

    const description = response.choices[0].message.content?.trim() || ''

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': process.env.FRONTEND_URL,
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'POST,OPTIONS'
      },
      body: JSON.stringify({
        description,
        wordCount: description.split(' ').length,
        generatedAt: new Date().toISOString()
      })
    }

  } catch (error) {
    console.error('AI Description Generation Error:', error)
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': process.env.FRONTEND_URL,
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'POST,OPTIONS'
      },
      body: JSON.stringify({ error: 'Failed to generate description', details: error.message })
    }
  }
}

/**
 * Generate AI-powered blog content
 */
exports.generateBlogContent = async (event) => {
  try {
    const body = JSON.parse(event.body)
    const { topic, keywords, wordCount = 500 } = body

    if (!topic || !keywords || keywords.length === 0) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': process.env.FRONTEND_URL,
          'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          'Access-Control-Allow-Methods': 'POST,OPTIONS'
        },
        body: JSON.stringify({ error: 'Topic and keywords are required' })
      }
    }

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
      - Written for an audience in the USA
      
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
          content: 'You are an expert content writer specializing in SEO-optimized blog posts about Indian festivals and traditions for NRI audiences.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.7
    })

    const blogContent = response.choices[0].message.content
    const parsedContent = JSON.parse(blogContent || '{}')

    // Save to DynamoDB
    const blogItem = {
      PK: `BLOG#${Date.now()}`,
      SK: `BLOG#${Date.now()}`,
      GSI1PK: 'BLOG#PUBLISHED',
      GSI1SK: `DATE#${Date.now()}`,
      type: 'blog',
      title: parsedContent.title,
      content: parsedContent.content,
      metaDescription: parsedContent.metaDescription,
      tags: parsedContent.tags,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: 'AI Assistant',
      readTime: Math.ceil((parsedContent.content?.split(' ')?.length || 0) / 200)
    }

    await dynamoDb.put({
      TableName: TABLE_NAME,
      Item: blogItem
    }).promise()

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': process.env.FRONTEND_URL,
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'POST,OPTIONS'
      },
      body: JSON.stringify({
        ...parsedContent,
        blogId: blogItem.PK,
        message: 'Blog post generated and saved successfully'
      })
    }

  } catch (error) {
    console.error('AI Blog Generation Error:', error)
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': process.env.FRONTEND_URL,
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'POST,OPTIONS'
      },
      body: JSON.stringify({ error: 'Failed to generate blog content', details: error.message })
    }
  }
}

/**
 * Analyze customer sentiment from reviews
 */
exports.analyzeSentiment = async (event) => {
  try {
    const body = JSON.parse(event.body)
    const { text } = body

    if (!text) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': process.env.FRONTEND_URL,
          'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          'Access-Control-Allow-Methods': 'POST,OPTIONS'
        },
        body: JSON.stringify({ error: 'Text is required for sentiment analysis' })
      }
    }

    const prompt = `
      Analyze the sentiment of this customer message/review:
      
      Text: "${text}"
      
      Please provide:
      1. Overall sentiment (positive/negative/neutral)
      2. Confidence score (0-100%)
      3. Key phrases that indicate the sentiment
      4. Suggested response for customer service
      
      Return in JSON format:
      {
        "sentiment": "positive|negative|neutral",
        "confidence": 85,
        "keyPhrases": ["phrase1", "phrase2"],
        "suggestedResponse": "Suggested response text"
      }
    `

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert at sentiment analysis for customer feedback in e-commerce.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 300,
      temperature: 0.3
    })

    const content = response.choices[0].message.content
    const analysis = JSON.parse(content || '{}')

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': process.env.FRONTEND_URL,
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'POST,OPTIONS'
      },
      body: JSON.stringify(analysis)
    }

  } catch (error) {
    console.error('AI Sentiment Analysis Error:', error)
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': process.env.FRONTEND_URL,
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'POST,OPTIONS'
      },
      body: JSON.stringify({ error: 'Failed to analyze sentiment', details: error.message })
    }
  }
}

/**
 * Generate SEO meta tags for pages
 */
exports.generateMetaTags = async (event) => {
  try {
    const body = JSON.parse(event.body)
    const { pageType, content, primaryKeyword, secondaryKeywords } = body

    if (!pageType || !content || !primaryKeyword) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': process.env.FRONTEND_URL,
          'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          'Access-Control-Allow-Methods': 'POST,OPTIONS'
        },
        body: JSON.stringify({ error: 'Page type, content, and primary keyword are required' })
      }
    }

    const prompt = `
      Generate SEO-optimized meta tags for a ${pageType} page.
      
      Content: ${content.substring(0, 500)}...
      Primary Keyword: ${primaryKeyword}
      Secondary Keywords: ${secondaryKeywords?.join(', ') || 'None'}
      
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
          content: 'You are an SEO expert specializing in meta tag optimization for e-commerce websites.'
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
    const metaTags = JSON.parse(content || '{}')

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': process.env.FRONTEND_URL,
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'POST,OPTIONS'
      },
      body: JSON.stringify(metaTags)
    }

  } catch (error) {
    console.error('AI Meta Tag Generation Error:', error)
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': process.env.FRONTEND_URL,
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'POST,OPTIONS'
      },
      body: JSON.stringify({ error: 'Failed to generate meta tags', details: error.message })
    }
  }
}

/**
 * Generate personalized product recommendations
 */
exports.generateRecommendations = async (event) => {
  try {
    const body = JSON.parse(event.body)
    const { userPreferences, availableProducts } = body

    if (!userPreferences || !availableProducts || availableProducts.length === 0) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': process.env.FRONTEND_URL,
          'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          'Access-Control-Allow-Methods': 'POST,OPTIONS'
        },
        body: JSON.stringify({ error: 'User preferences and available products are required' })
      }
    }

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
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': process.env.FRONTEND_URL,
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'POST,OPTIONS'
      },
      body: JSON.stringify({
        recommendations: parsed.recommendations || [],
        generatedAt: new Date().toISOString()
      })
    }

  } catch (error) {
    console.error('AI Recommendation Error:', error)
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': process.env.FRONTEND_URL,
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'POST,OPTIONS'
      },
      body: JSON.stringify({ error: 'Failed to generate recommendations', details: error.message })
    }
  }
}