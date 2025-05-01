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
import { ImageIcon, Loader2, AlertCircle } from 'lucide-react'

export function FloorPlanRenderer() {
  const { 
    uploadedImage,
    processingStage,
    analysisResult,
    wireframeMode, 
    currentView,
    error
  } = useFloorPlanStore()

  // Debug render conditions
  useEffect(() => {
    console.log('[Renderer] Rendering state:', {
      hasUploadedImage: !!uploadedImage,
      processingStage,
      analysisResultAvailable: !!analysisResult,
      roomsCount: analysisResult?.rooms?.length || 0,
      wireframeMode,
      currentView,
      renderingMode: analysisResult && analysisResult.rooms.length > 0 ? '3D' : '2D'
    })
  }, [uploadedImage, processingStage, analysisResult, wireframeMode, currentView])

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

  // 1. Handle Processing Stages
  if (processingStage === 'sending' || processingStage === 'analyzing' || processingStage === 'validating') {
    return (
      <Card className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center text-muted-foreground p-4">
          <Loader2 className="h-16 w-16 mb-4 animate-spin" />
          <h3 className="text-lg font-medium mb-1">Processing Floor Plan</h3>
          <p className="text-sm text-center">
            {processingStage === 'sending' && 'Sending image data...'}
            {processingStage === 'analyzing' && 'AI is analyzing the image...'}
            {processingStage === 'validating' && 'Validating analysis results...'}
          </p>
        </div>
      </Card>
    )
  }

  // 2. Handle Error State
  if (processingStage === 'error') {
     return (
      <Card className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center text-destructive p-4">
          <AlertCircle className="h-16 w-16 mb-4" />
          <h3 className="text-lg font-medium mb-1">Processing Error</h3>
          <p className="text-sm text-center">
            {error || 'Failed to analyze the floor plan. Check controls for details.'}
          </p>
        </div>
      </Card>
    )
  }
  
  // 3. Handle Successful Analysis (Show 3D)
  // Check if analysis is done and result is structurally valid
  const isAnalysisValid = 
    processingStage === 'done' && 
    analysisResult && 
    analysisResult.rooms && 
    analysisResult.walls && 
    analysisResult.rooms.length > 0 && 
    analysisResult.walls.length > 0;

  if (isAnalysisValid) {
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

  // 4. Handle Case: Uploaded Image exists, but no valid analysis yet (Show 2D)
  if (uploadedImage) {
     return (
      <Card className="w-full h-full flex items-center justify-center overflow-hidden">
        <div className="relative w-full h-full">
          <img 
            src={uploadedImage} 
            alt="Floor Plan" 
            className="w-full h-full object-contain"
          />
          {/* Message if analysis is done but results are invalid/empty */}
          {(processingStage === 'done' && (!analysisResult || analysisResult.rooms.length === 0 || analysisResult.walls.length === 0)) && (
             <div className="absolute bottom-4 left-4 right-4 bg-background/80 backdrop-blur-sm rounded-lg p-3 text-center">
              <p className="text-sm text-warning">
                Analysis complete, but no valid rooms or walls were detected. Cannot generate 3D model.
              </p>
            </div>
          )}
           {/* Message if analysis hasn't run yet */}
           {processingStage === 'idle' && !analysisResult && (
             <div className="absolute bottom-4 left-4 right-4 bg-background/80 backdrop-blur-sm rounded-lg p-3 text-center">
              <p className="text-sm text-muted-foreground">
                Image uploaded. Click 'Process Plan' in the controls to analyze.
              </p>
            </div>
          )}
        </div>
      </Card>
    )
  }

  // 5. Handle Initial Empty State (No image, No analysis)
  return (
    <Card className=" flex-1 w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center text-muted-foreground p-4">
        <ImageIcon className="h-16 w-16 mb-4" />
        <h3 className="text-lg font-medium mb-1">No Floor Plan</h3>
        <p className="text-sm text-center">
          Upload an image or load JSON data to begin.
        </p>
      </div>
    </Card>
  )
} 