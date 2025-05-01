'use client'

import { useState } from 'react'
import { useFloorPlanStore } from '@/store/floor-plan-store'
import { processFloorPlanImage, generateMockFloorPlan } from '@/lib/floor-plan-processor'
import { WALL_HEIGHT_RANGE, FLOOR_STYLES, WALL_STYLES, VIEWS } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Toggle } from '@/components/ui/toggle'
import { 
  Boxes, 
  Cpu, 
  Eye, 
  Grid3X3, 
  Layers, 
  Palette, 
  Ruler
} from 'lucide-react'

export function FloorPlanControls() {
  const [processingPlan, setProcessingPlan] = useState(false)
  const [generating3D, setGenerating3D] = useState(false)
  
  const {
    floorPlanImage,
    wallHeight,
    floorStyle,
    wallStyle,
    wireframeMode,
    currentView,
    isProcessing,
    is3DGenerated,
    setWallHeight,
    setFloorStyle,
    setWallStyle,
    toggleWireframeMode,
    setCurrentView,
    setIsProcessing,
    setIs3DGenerated,
    setRoomsData
  } = useFloorPlanStore()

  const handleProcessPlan = async () => {
    if (!floorPlanImage || processingPlan) return
    
    setProcessingPlan(true)
    setIsProcessing(true)
    
    try {
      // In a real application, we'd send the image to a backend service
      // For the MVP, we'll use our simulated processing
      const roomsData = await processFloorPlanImage(floorPlanImage)
      setRoomsData(roomsData)
    } catch (error) {
      console.error('Error processing floor plan:', error)
    } finally {
      setProcessingPlan(false)
      setIsProcessing(false)
    }
  }

  const handleGenerate3D = async () => {
    if (generating3D) return
    
    setGenerating3D(true)
    
    try {
      // For demo purposes, we can just wait a bit to simulate generation
      await new Promise(resolve => setTimeout(resolve, 1500))
      setIs3DGenerated(true)
    } catch (error) {
      console.error('Error generating 3D model:', error)
    } finally {
      setGenerating3D(false)
    }
  }

  const handleDemoMode = async () => {
    if (processingPlan || generating3D) return
    
    setProcessingPlan(true)
    setIsProcessing(true)
    
    try {
      // Use our mock floor plan data
      const roomsData = await generateMockFloorPlan()
      setRoomsData(roomsData)
      setIsProcessing(false)
      
      // Generate 3D after a short delay
      setTimeout(async () => {
        setGenerating3D(true)
        await new Promise(resolve => setTimeout(resolve, 1500))
        setIs3DGenerated(true)
        setGenerating3D(false)
      }, 500)
    } catch (error) {
      console.error('Error loading demo:', error)
      setIsProcessing(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Floor Plan Controls</CardTitle>
        <CardDescription>
          Process your floor plan and customize the 3D model
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between flex-wrap gap-2">
            <Button
              variant="default"
              disabled={!floorPlanImage || processingPlan || is3DGenerated}
              onClick={handleProcessPlan}
            >
              {processingPlan ? (
                <>
                  <Cpu className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Cpu className="mr-2 h-4 w-4" />
                  Process Plan
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleDemoMode}
              disabled={processingPlan || generating3D}
            >
              <Boxes className="mr-2 h-4 w-4" />
              Demo Mode
            </Button>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="wall-height">Wall Height: {wallHeight}m</Label>
            <Slider
              id="wall-height"
              min={WALL_HEIGHT_RANGE.min}
              max={WALL_HEIGHT_RANGE.max}
              step={0.1}
              value={[wallHeight]}
              onValueChange={(value) => setWallHeight(value[0])}
              disabled={!is3DGenerated}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="floor-style">Floor Style</Label>
              <Select
                value={floorStyle}
                onValueChange={setFloorStyle}
                disabled={!is3DGenerated}
              >
                <SelectTrigger id="floor-style">
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  {FLOOR_STYLES.map(style => (
                    <SelectItem key={style.id} value={style.id}>
                      {style.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="wall-style">Wall Style</Label>
              <Select
                value={wallStyle}
                onValueChange={setWallStyle}
                disabled={!is3DGenerated}
              >
                <SelectTrigger id="wall-style">
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  {WALL_STYLES.map(style => (
                    <SelectItem key={style.id} value={style.id}>
                      {style.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <Button
            className="w-full"
            variant="default"
            disabled={!floorPlanImage || generating3D || is3DGenerated}
            onClick={handleGenerate3D}
          >
            {generating3D ? (
              <>
                <Layers className="mr-2 h-4 w-4 animate-spin" />
                Generating 3D...
              </>
            ) : (
              <>
                <Layers className="mr-2 h-4 w-4" />
                Generate 3D Model
              </>
            )}
          </Button>
        </div>
        
        {is3DGenerated && (
          <div className="border-t pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <Label>View Controls</Label>
              <Toggle
                pressed={wireframeMode}
                onPressedChange={toggleWireframeMode}
                aria-label="Toggle wireframe mode"
              >
                <Grid3X3 className="h-4 w-4 mr-2" />
                Wireframe
              </Toggle>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {VIEWS.map(view => (
                <Button
                  key={view.id}
                  variant={currentView === view.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentView(view.id as any)}
                  className="flex-1"
                >
                  {view.id === 'top' && <Eye className="h-4 w-4 mr-2" />}
                  {view.id === 'front' && <Ruler className="h-4 w-4 mr-2" />}
                  {view.id === 'side' && <Palette className="h-4 w-4 mr-2" />}
                  {view.id === 'perspective' && <Boxes className="h-4 w-4 mr-2" />}
                  {view.name}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 