import { create } from 'zustand'
import { Room } from '@/types/room'

type FloorPlanState = {
  floorPlanImage: string | null
  roomsData: Room[]
  wallHeight: number
  floorStyle: string
  wallStyle: string
  wireframeMode: boolean
  selectedRoom: string | null
  currentView: 'top' | 'front' | 'side' | 'perspective'
  isProcessing: boolean
  is3DGenerated: boolean
  
  // Actions
  setFloorPlanImage: (image: string | null) => void
  setRoomsData: (rooms: Room[]) => void
  setWallHeight: (height: number) => void
  setFloorStyle: (style: string) => void
  setWallStyle: (style: string) => void
  toggleWireframeMode: () => void
  setSelectedRoom: (roomId: string | null) => void
  setCurrentView: (view: 'top' | 'front' | 'side' | 'perspective') => void
  setIsProcessing: (isProcessing: boolean) => void
  setIs3DGenerated: (is3DGenerated: boolean) => void
  resetFloorPlan: () => void
}

export const useFloorPlanStore = create<FloorPlanState>((set) => ({
  floorPlanImage: null,
  roomsData: [],
  wallHeight: 3, // Default wall height in meters
  floorStyle: 'wooden',
  wallStyle: 'white',
  wireframeMode: false,
  selectedRoom: null,
  currentView: 'perspective',
  isProcessing: false,
  is3DGenerated: false,
  
  // Actions
  setFloorPlanImage: (image) => set({ floorPlanImage: image }),
  setRoomsData: (rooms) => set({ roomsData: rooms }),
  setWallHeight: (height) => set({ wallHeight: height }),
  setFloorStyle: (style) => set({ floorStyle: style }),
  setWallStyle: (style) => set({ wallStyle: style }),
  toggleWireframeMode: () => set((state) => ({ wireframeMode: !state.wireframeMode })),
  setSelectedRoom: (roomId) => set({ selectedRoom: roomId }),
  setCurrentView: (view) => set({ currentView: view }),
  setIsProcessing: (isProcessing) => set({ isProcessing }),
  setIs3DGenerated: (is3DGenerated) => set({ is3DGenerated }),
  resetFloorPlan: () => set({
    floorPlanImage: null,
    roomsData: [],
    selectedRoom: null,
    isProcessing: false,
    is3DGenerated: false,
  }),
})) 