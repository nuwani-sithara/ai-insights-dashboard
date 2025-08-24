import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt } = body

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required and must be a string' },
        { status: 400 }
      )
    }

    // Try Cohere first (better quality)
    const cohereKey = process.env.COHERE_API_KEY
    if (cohereKey) {
      return await callCohereAPI(prompt, cohereKey)
    }

    // Fallback to Hugging Face (completely free)
    const huggingFaceKey = process.env.HUGGINGFACE_API_KEY
    if (huggingFaceKey) {
      return await callHuggingFaceAPI(prompt, huggingFaceKey)
    }

    // No API keys configured
    return NextResponse.json(
      { error: 'No AI service configured. Please add COHERE_API_KEY or HUGGINGFACE_API_KEY to your environment variables.' },
      { status: 500 }
    )

  } catch (error) {
    console.error('LLM API Error:', error)
    
    let errorMessage = 'An error occurred while processing your request'
    
    if (error instanceof Error) {
      if (error.message.includes('No AI service configured')) {
        errorMessage = 'AI service not configured. Please contact the administrator.'
      } else if (error.message.includes('API error')) {
        errorMessage = `AI service error: ${error.message}`
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Network error: Unable to connect to AI service.'
      } else {
        errorMessage = error.message
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

// Cohere API implementation
async function callCohereAPI(prompt: string, apiKey: string) {
  console.log('Calling Cohere API with prompt length:', prompt.length)

  const cohereResponse = await fetch('https://api.cohere.ai/v1/generate', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'command-light',
      prompt: `You are a helpful AI assistant that provides insightful analysis and helpful responses. Be concise but informative.

User: ${prompt}

Assistant:`,
      max_tokens: 1000,
      temperature: 0.7,
      k: 0,
      stop_sequences: [],
      return_likelihoods: 'NONE'
    }),
  })

  if (!cohereResponse.ok) {
    const errorData = await cohereResponse.json().catch(() => ({}))
    console.error('Cohere API error:', errorData)
    throw new Error(`Cohere API error: ${cohereResponse.status} - ${errorData.message || 'Unknown error'}`)
  }

  const cohereData = await cohereResponse.json()
  const aiResponse = cohereData.generations?.[0]?.text || 'No response from AI'

  console.log('Cohere response received:', { 
    model: cohereData.meta?.billed_units,
    responseLength: aiResponse.length 
  })

  return NextResponse.json({
    response: aiResponse.trim(),
    timestamp: new Date().toISOString(),
    model: 'cohere-command-light',
    provider: 'cohere',
    usage: {
      prompt_tokens: prompt.length,
      completion_tokens: aiResponse.length,
      total_tokens: prompt.length + aiResponse.length
    }
  })
}

// Hugging Face API implementation (completely free)
async function callHuggingFaceAPI(prompt: string, apiKey: string) {
  console.log('Calling Hugging Face API with prompt length:', prompt.length)

  const hfResponse = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: `You are a helpful AI assistant. User: ${prompt} Assistant:`,
      parameters: {
        max_length: 200,
        temperature: 0.7,
        do_sample: true
      }
    }),
  })

  if (!hfResponse.ok) {
    const errorData = await hfResponse.json().catch(() => ({}))
    console.error('Hugging Face API error:', errorData)
    throw new Error(`Hugging Face API error: ${hfResponse.status} - ${errorData.error || 'Unknown error'}`)
  }

  const hfData = await hfResponse.json()
  const aiResponse = Array.isArray(hfData) ? hfData[0]?.generated_text || 'No response from AI' : 'No response from AI'

  console.log('Hugging Face response received:', { 
    responseLength: aiResponse.length 
  })

  return NextResponse.json({
    response: aiResponse.trim(),
    timestamp: new Date().toISOString(),
    model: 'microsoft/DialoGPT-medium',
    provider: 'huggingface',
    usage: {
      prompt_tokens: prompt.length,
      completion_tokens: aiResponse.length,
      total_tokens: prompt.length + aiResponse.length
    }
  })
}

// Optional: Add GET method for testing
export async function GET() {
  const hasCohere = !!process.env.COHERE_API_KEY
  const hasHuggingFace = !!process.env.HUGGINGFACE_API_KEY
  
  let message = 'LLM API endpoint is ready'
  let status = 'unconfigured'
  
  if (hasCohere) {
    message += ' with Cohere integration'
    status = 'configured'
  } else if (hasHuggingFace) {
    message += ' with Hugging Face integration'
    status = 'configured'
  } else {
    message += ' but no AI service is configured'
  }
  
  return NextResponse.json({
    message,
    status,
    hasCohere,
    hasHuggingFace,
    recommendations: [
      'Add COHERE_API_KEY for better quality (free tier: 5 req/min)',
      'Add HUGGINGFACE_API_KEY for completely free service (30k req/month)'
    ]
  })
}
