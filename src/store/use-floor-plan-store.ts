import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { FloorPlanAnalysis } from '@/types/floor-plan'
import { VIEWS } from '@/lib/constants'

// Derive valid view IDs from the constant
type ViewId = typeof VIEWS[number]['id']

type FloorPlanState = {
  uploadedImage: string | null // Base64 encoded image or URL
  isProcessing: boolean
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
  startProcessing: () => void
  setAnalysisResult: (result: FloorPlanAnalysis | null) => void
  setError: (error: string | null) => void
  resetProcessing: () => void
  setWallHeight: (height: number) => void
  setSelectedFloorStyle: (style: string) => void
  setSelectedWallStyle: (style: string) => void
  toggleWireframeMode: () => void
  setCurrentView: (view: ViewId) => void
}

const initialState: FloorPlanState = {
  uploadedImage: null,
  isProcessing: false,
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
        state.analysisResult = null // Reset analysis when new image is uploaded
        state.error = null
        state.isProcessing = false
      })
    },

    startProcessing: () => {
      set((state) => {
        state.isProcessing = true
        state.error = null
        state.analysisResult = null // Clear previous results before processing
      })
    },

    setAnalysisResult: (result) => {
      set((state) => {
        // Log the received structure for debugging
        console.log('[Store] Setting analysis result:', result)
        state.analysisResult = result 
        state.isProcessing = false // Processing done
        state.error = null
      })
    },

    setError: (error) => {
      set((state) => {
        state.error = error
        state.isProcessing = false // Stop processing on error
      })
    },

    resetProcessing: () => {
      set((state) => {
        state.isProcessing = false
        state.error = null
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