import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { FloorPlanAnalysis } from '@/types/floor-plan'
import { VIEWS } from '@/lib/constants'

// Derive valid view IDs from the constant
type ViewId = typeof VIEWS[number]['id']

type ProcessingStage = 
  | 'idle' 
  | 'sending' 
  | 'analyzing' 
  | 'validating' 
  | 'error' 
  | 'done'

type FloorPlanState = {
  uploadedImage: string | null // Base64 encoded image or URL
  isProcessing: boolean // Kept for simplicity in some checks, but stage is more granular
  processingStage: ProcessingStage
  analysisResult: FloorPlanAnalysis | null
  error: string | null
  wallHeight: number // in meters
  selectedFloorStyle: string
  selectedWallStyle: string
  wireframeMode: boolean
  currentView: ViewId
}

type FloorPlanActions = {
  setUploadedImage: (image: string | null) => void
  setProcessingStage: (stage: ProcessingStage) => void
  setAnalysisResult: (result: FloorPlanAnalysis | null) => void
  setError: (error: string | null) => void
  setWallHeight: (height: number) => void
  setSelectedFloorStyle: (style: string) => void
  setSelectedWallStyle: (style: string) => void
  toggleWireframeMode: () => void
  setCurrentView: (view: ViewId) => void
}

const initialState: FloorPlanState = {
  uploadedImage: null,
  isProcessing: false,
  processingStage: 'idle',
  analysisResult: null,
  error: null,
  wallHeight: 2.5, // Default wall height
  selectedFloorStyle: 'wood_light', // Default floor style ID
  selectedWallStyle: 'paint_white', // Default wall style ID
  wireframeMode: false,
  currentView: 'perspective' // Default view
}

export const useFloorPlanStore = create<FloorPlanState & FloorPlanActions>()(
  immer((set) => ({
    ...initialState,

    setUploadedImage: (image) => {
      set((state) => {
        state.uploadedImage = image
        state.analysisResult = null
        state.error = null
        state.isProcessing = false
        state.processingStage = 'idle' // Reset stage on new image
      })
    },

    setProcessingStage: (stage) => {
      set((state) => {
        console.log(`[Store] Setting processing stage: ${stage}`)
        state.processingStage = stage
        state.isProcessing = stage === 'sending' || stage === 'analyzing' || stage === 'validating'
        if (stage !== 'error') {
          state.error = null // Clear error if stage is not error
        }
        if (stage === 'sending') {
           state.analysisResult = null // Clear previous results when starting
        }
      })
    },

    setAnalysisResult: (result) => {
      set((state) => {
        console.log('[Store] Setting analysis result:', result)
        state.analysisResult = result 
        state.processingStage = result ? 'done' : 'idle' // Move to done or idle if null
        state.isProcessing = false
        state.error = null
      })
    },

    setError: (error) => {
      set((state) => {
        state.error = error
        state.processingStage = 'error' // Set stage to error
        state.isProcessing = false
      })
    },

    setWallHeight: (height) => {
      set((state) => {
        state.wallHeight = height
      })
    },

    setSelectedFloorStyle: (style) => {
      set((state) => {
        state.selectedFloorStyle = style
      })
    },

    setSelectedWallStyle: (style) => {
      set((state) => {
        state.selectedWallStyle = style
      })
    },

    toggleWireframeMode: () => {
      set((state) => {
        state.wireframeMode = !state.wireframeMode
      })
    },

    setCurrentView: (view) => {
      set((state) => {
        state.currentView = view
      })
    }
  }))
) 