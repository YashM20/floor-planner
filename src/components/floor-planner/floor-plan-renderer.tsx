'use client'

import { Suspense, useEffect } from 'react'
import { useFloorPlanStore } from '@/store/use-floor-plan-store'
import { Canvas } from '@react-three/fiber'
import { 
  OrbitControls, 
  Stage, 
  Grid, 
  PerspectiveCamera, 
  Text, 
  Center,
  Environment
} from '@react-three/drei'
import { FloorPlan3D } from '@/components/floor-planner/floor-plan-3d'
import { Card } from '@/components/ui/card'
import { ImageIcon, Loader2 } from 'lucide-react'

export function FloorPlanRenderer() {
  const { 
    uploadedImage,
    isProcessing,
    analysisResult,
    wireframeMode, 
    currentView,
  } = useFloorPlanStore()

  // Debug render conditions
  useEffect(() => {
    console.log('[Renderer] Rendering state:', {
      hasUploadedImage: !!uploadedImage,
      isProcessing,
      analysisResultAvailable: !!analysisResult,
      roomsCount: analysisResult?.rooms?.length || 0,
      wireframeMode,
      currentView,
      renderingMode: analysisResult && analysisResult.rooms.length > 0 ? '3D' : '2D'
    })
  }, [uploadedImage, isProcessing, analysisResult, wireframeMode, currentView])

  // Set up camera positions for different views
  const getCameraProps = () => {
    switch (currentView) {
      case 'top':
        return { position: [0, 20, 0] as [number, number, number], fov: 50 }
      case 'front':
        return { position: [0, 1.6, 15] as [number, number, number], fov: 50 }
      case 'side':
        return { position: [15, 1.6, 0] as [number, number, number], fov: 50 }
      case 'perspective':
      default:
        return { position: [10, 10, 10] as [number, number, number], fov: 50 }
    }
  }

  // Display empty state if no image has been uploaded
  if (!uploadedImage) {
    return (
      <Card className=" flex-1 w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center text-muted-foreground p-4">
          <ImageIcon className="h-16 w-16 mb-4" />
          <h3 className="text-lg font-medium mb-1">No Floor Plan</h3>
          <p className="text-sm text-center">
            Upload a floor plan image to begin the conversion process
          </p>
        </div>
      </Card>
    )
  }

  // Display processing state
  if (isProcessing) {
    return (
      <Card className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center text-muted-foreground p-4">
          <Loader2 className="h-16 w-16 mb-4 animate-spin" />
          <h3 className="text-lg font-medium mb-1">Processing Floor Plan</h3>
          <p className="text-sm text-center">
            Analyzing the image and detecting rooms...
          </p>
        </div>
      </Card>
    )
  }

  // Display 2D image while waiting for 3D generation
  if (!analysisResult || analysisResult.rooms.length === 0) {
    return (
      <Card className="w-full h-full flex items-center justify-center overflow-hidden">
        <div className="relative w-full h-full">
          <img 
            src={uploadedImage} 
            alt="Floor Plan" 
            className="w-full h-full object-contain"
          />
          {analysisResult && analysisResult.rooms.length > 0 && (
            <div className="absolute bottom-4 left-4 right-4 bg-background/80 backdrop-blur-sm rounded-lg p-3">
              <p className="text-sm">
                {analysisResult.rooms.length} rooms detected. Click "Generate 3D Model" to continue.
              </p>
            </div>
          )}
        </div>
      </Card>
    )
  }

  // Render the 3D floor plan when analysis result is available
  return (
    <Card className="flex flex-1 w-full h-full overflow-hidden">
      <div className="flex flex-1 w-full h-full">
        <Canvas shadows>
          <Suspense fallback={null}>
            <Stage 
              environment="city" 
              intensity={0.5} 
              shadows={false}
            >
              <FloorPlan3D wireframe={wireframeMode} />
            </Stage>
            
            <Grid
              args={[50, 50]}
              cellSize={1}
              cellThickness={0.5}
              cellColor="#6e6e6e"
              sectionSize={5}
              sectionThickness={1}
              sectionColor="#9d4b4b"
              fadeDistance={50}
              fadeStrength={1}
              followCamera={false}
              infiniteGrid
              position={[0, -0.01, 0]}
            />
            
            <PerspectiveCamera 
              makeDefault 
              {...getCameraProps()}
            />
            
            <OrbitControls 
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minPolarAngle={0}
              maxPolarAngle={Math.PI / 2}
            />
            
            <Environment preset="city" />
          </Suspense>
        </Canvas>
      </div>
    </Card>
  )
} 