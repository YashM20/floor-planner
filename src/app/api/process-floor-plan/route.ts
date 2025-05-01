import { google } from '@ai-sdk/google'
import { CoreTool, generateText, tool } from 'ai'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import {
  FloorPlanAnalysisSchema // Import the updated schema
} from '@/types/floor-plan'

// Define the schema for the request body
const RequestBodySchema = z.object({
  // Expecting base64 encoded image data URL (e.g., data:image/png;base64,...)
  imageDataUrl: z.string().startsWith('data:image')
})

// Define the tool for the AI to use for structured output (using the updated schema)
const floorPlanAnalysisTool = tool({
  description: 'Extract detailed floor plan analysis from an image, including walls, doors, windows, and rooms.',
  parameters: z.object({
    analysis: FloorPlanAnalysisSchema
  }),
  execute: async ({ analysis }) => {
    console.log('[API] Tool execute called with detailed analysis data.')
    // The AI provides the structured data; return it.
    return analysis
  }
})

export async function POST (req: NextRequest) {
  console.log('[API] Received POST request for detailed analysis.')

  let imageDataUrl: string
  let imageBase64: string
  let mimeType: string

  try {
    const body = await req.json()
    console.log('[API] Parsing request body...')
    const parsedBody = RequestBodySchema.safeParse(body)
    if (!parsedBody.success) {
      console.error('[API] Invalid request body:', parsedBody.error.flatten())
      return NextResponse.json(
        { error: 'Invalid request body', details: parsedBody.error.flatten() },
        { status: 400 }
      )
    }
    imageDataUrl = parsedBody.data.imageDataUrl
    console.log('[API] Request body parsed successfully.')

    // Extract the base64 part and mime type
    console.log('[API] Extracting image data from data URL...')
    const match = imageDataUrl.match(/^data:(image\/\w+);base64,(.*)$/)
    if (!match || match.length < 3) {
      console.error('[API] Invalid image data URL format')
      return NextResponse.json({ error: 'Invalid image data URL format' }, { status: 400 })
    }
    mimeType = match[1]
    imageBase64 = match[2]
    console.log(`[API] Extracted mimeType: ${mimeType}, base64 length: ${imageBase64.length}`)

  } catch (error) {
    console.error('[API] Error parsing request body or extracting image data:', error)
    return NextResponse.json({ error: 'Failed to parse request or image data' }, { status: 400 })
  }

  try {
    console.log('[API] Sending request to Google AI for detailed analysis...')
    const result = await generateText({
      // Ensure your GOOGLE_GENERATIVE_AI_API_KEY is set in .env.local
      // Use a model that supports image input, e.g., gemini-1.5-flash-latest or gemini-1.5-pro-latest
      model: google('models/gemini-2.0-flash'),
      // Provide the tool the AI should use to structure its response
      tools: { floorPlanAnalysis: floorPlanAnalysisTool },
      // Force the AI to use the tool
      toolChoice: 'required',
      // System prompt to guide the AI
      system: `You are an expert architect specializing in analyzing 2D floor plan images.
        Analyze the provided floor plan image and extract detailed information.
        Your task is to identify:
        1.  **Overall Dimensions:** The width and height of the entire floor plan area in the image (in pixels).
        2.  **Scale:** Estimate the scale if possible (e.g., pixels per meter or pixels per foot). If not possible, omit the scale field.
        3.  **Rooms:** Identify each distinct room or area. For each room, provide:
            *   A unique ID (e.g., "room-1", "room-2").
            *   A name if identifiable (e.g., "Living Room", "Bedroom 1").
            *   The polygon defining the floor area (a list of {x, y} coordinates in pixels).
            *   The calculated area (in square pixels).
            *   The center point {x, y} (in pixels).
        4.  **Walls:** Identify all structural wall segments. For each wall segment, provide:
            *   A unique ID (e.g., "wall-1", "wall-2").
            *   The start point {x, y} (in pixels).
            *   The end point {x, y} (in pixels).
            *   Estimate thickness if possible.
        5.  **Doors:** Identify all doors. For each door, provide:
            *   A unique ID (e.g., "door-1").
            *   The ID of the wall segment it's on ("wallId").
            *   The position {x, y} on the wall line (e.g., center point) (in pixels).
            *   The width (in pixels).
            *   Swing direction if discernible.
        6.  **Windows:** Identify all windows. For each window, provide:
            *   A unique ID (e.g., "window-1").
            *   The ID of the wall segment it's on ("wallId").
            *   The position {x, y} on the wall line (e.g., center point) (in pixels).
            *   The width (in pixels).
            *   Optional: height and sillHeight if they can be inferred from standard conventions (e.g., relative to wall height), otherwise omit.
        7.  **Objects:** Identify any large furniture or fixed objects if clearly visible (optional). Provide label and bounding box.

        **IMPORTANT:** Ensure all coordinates are relative to the top-left corner (0,0) of the image. Provide the results strictly using the 'floorPlanAnalysis' tool. Assume standard architectural conventions for doors, windows, and wall thicknesses if not explicitly detailed in the image. Generate unique IDs for all elements. Focus on structural elements (rooms, walls, doors, windows).`,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Please analyze the floor plan in the image and provide detailed structural information using the floorPlanAnalysis tool.' },
            {
              type: 'image',
              image: Buffer.from(imageBase64, 'base64'),
              mimeType
            }
          ]
        }
      ]
    })

    console.log('[API] Received response from Google AI.') // Log AI response received
    // console.log('[API] Full AI response:', JSON.stringify(result, null, 2)); // Optional: Log full response for debugging

    // Find the tool result from the AI's response
    console.log('[API] Extracting tool result...')
    const toolResult = result.toolResults.find(r => r.toolName === 'floorPlanAnalysis')

    if (!toolResult || !toolResult.result) {
      console.error('[API] AI did not return the expected tool result. Full response:', result)
      throw new Error('AI analysis failed to produce structured data.')
    }

    console.log('[API] Tool result extracted successfully.')
    // The result from execute() is already the parsed analysis
    const analysisData = toolResult.result

    // Validate the final data again
    console.log('[API] Validating final analysis data...')
    const finalValidation = FloorPlanAnalysisSchema.safeParse(analysisData)
    if (!finalValidation.success) {
      console.error('[API] Final validation failed:', finalValidation.error.flatten())
      // console.error('[API] Invalid data received:', analysisData) // Log the invalid data
      throw new Error('AI returned data in unexpected format after tool execution.')
    }

    console.log('[API] Detailed analysis successful, returning data.')
    return NextResponse.json(finalValidation.data)

  } catch (error) {
    console.error('[API] Error during AI processing or validation:', error)
    // Consider logging the error details more thoroughly in a real application
    const errorMessage = error instanceof Error ? error.message : 'Unknown error during AI processing'
    return NextResponse.json({ error: 'Failed to process floor plan', details: errorMessage }, { status: 500 })
  }
} 