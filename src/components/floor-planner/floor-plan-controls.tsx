'use client'

import { useState } from 'react'
import { useFloorPlanStore } from '@/store/use-floor-plan-store'
import { WALL_HEIGHT_RANGE, FLOOR_STYLES, WALL_STYLES, VIEWS } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Toggle } from '@/components/ui/toggle'
import {
  AlertCircle,
  CheckCircle,
  Boxes,
  Cpu,
  Eye,
  Grid3X3,
  Layers,
  Palette,
  Ruler
} from 'lucide-react'
import { toast } from 'sonner'
import type { FloorPlanAnalysis } from '@/types/floor-plan'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export function FloorPlanControls () {
  const [generating3D, setGenerating3D] = useState(false)

  const {
    uploadedImage,
    wallHeight,
    isProcessing,
    analysisResult,
    error,
    setWallHeight,
    setSelectedFloorStyle,
    setSelectedWallStyle,
    startProcessing,
    setAnalysisResult,
    setError,
    selectedFloorStyle,
    selectedWallStyle,
    wireframeMode,
    currentView,
    toggleWireframeMode,
    setCurrentView
  } = useFloorPlanStore()

  const handleProcessPlan = async () => {
    console.log('[Controls] handleProcessPlan triggered.')
    if (!uploadedImage || isProcessing) {
      console.log('[Controls] Processing skipped: No image or already processing.')
      return
    }

    console.log('[Controls] Starting processing state.')
    startProcessing()
    setError(null)

    try {
      toast.info('Sending floor plan to AI...')
      console.log('[Controls] Calling /api/process-floor-plan...')
      const response = await fetch('/api/process-floor-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ imageDataUrl: uploadedImage })
      })
      
      console.log(`[Controls] API response status: ${response.status}`)

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`
        let errorDetails = null;
        try {
          errorDetails = await response.json()
          console.error('[Controls] API Error Response Body:', errorDetails)
          errorMessage = errorDetails?.details || errorDetails?.error || errorMessage
          toast.warning(`Received error response: ${errorMessage}`)
        } catch (jsonError) {
          console.error('[Controls] Failed to parse error JSON', jsonError)
          toast.warning('Received non-JSON error response.')
        }
        setError(errorMessage)
        toast.error(`Processing failed. Please check the error message.`)
        console.log('[Controls] Set error state:', errorMessage)
        return
      }

      const resultData: FloorPlanAnalysis = await response.json()
      console.log('[Controls] API Success. Received data:', resultData)
      setAnalysisResult(resultData)
      toast.success('Floor plan processed successfully!')
      console.log('[Controls] Set analysis result state.')
    } catch (error) {
      console.error('[Controls] Network/fetch error calling API:', error)
      const message = error instanceof Error ? error.message : 'An unknown network error occurred'
      setError(message)
      toast.error(`Processing failed: ${message}`)
      console.log('[Controls] Set error state from catch block:', message)
    }
  }

  const handleGenerate3D = async () => {
    if (!analysisResult || generating3D || isProcessing) {
      console.log('[Controls] Generate 3D skipped: No analysis or busy.')
      return
    }
    console.log('[Controls] handleGenerate3D triggered.')
    setGenerating3D(true)
    toast.info('Generating 3D model...')
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      console.log('[Controls] 3D Generation complete (simulation). Triggering update based on:', analysisResult)
      toast.success('3D Model Generated/Updated!')
    } catch (error) {
      console.error('[Controls] Error during simulated 3D generation:', error)
      toast.error('Failed to generate 3D model.')
    } finally {
      setGenerating3D(false)
    }
  }

  // Function to save analysis result to localStorage
  const handleSaveAnalysis = () => {
    if (!analysisResult) {
      toast.error('No analysis data to save')
      return
    }

    try {
      // Save image and analysis data
      const savedData = {
        timestamp: new Date().toISOString(),
        image: uploadedImage,
        analysis: analysisResult
      }
      localStorage.setItem('savedFloorPlan', JSON.stringify(savedData))
      toast.success('Floor plan analysis saved successfully!')
    } catch (error) {
      console.error('[Controls] Error saving analysis:', error)
      toast.error('Failed to save analysis data')
    }
  }

  // Function to load analysis result from localStorage
  const handleLoadAnalysis = () => {
    try {
      const savedDataString = localStorage.getItem('savedFloorPlan')
      if (!savedDataString) {
        toast.error('No saved floor plan found')
        return
      }

      const savedData = JSON.parse(savedDataString)
      
      // Validate saved data
      if (!savedData.image || !savedData.analysis) {
        toast.error('Invalid saved data format')
        return
      }

      // Set the image and analysis data in the store
      useFloorPlanStore.setState({
        uploadedImage: savedData.image,
        analysisResult: savedData.analysis,
        isProcessing: false,
        error: null
      })

      toast.success('Floor plan loaded successfully!')
    } catch (error) {
      console.error('[Controls] Error loading saved analysis:', error)
      toast.error('Failed to load saved analysis data')
    }
  }

  const canProcess = !!uploadedImage && !analysisResult
  const canGenerate = !!analysisResult && !isProcessing && !generating3D
  const canSave = !!analysisResult && !isProcessing
  const canLoad = !isProcessing

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
              disabled={!canProcess || isProcessing}
              onClick={handleProcessPlan}
              className="flex-1 min-w-[150px]"
            >
              {isProcessing ? (
                <>
                  <Cpu className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : analysisResult ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  Processed!
                </>
              ) : (
                <>
                  <Cpu className="mr-2 h-4 w-4" />
                  Process Plan
                </>
              )}
            </Button>
          </div>
          
          {/* Add Save/Load buttons */}
          <div className="flex justify-between gap-2 mt-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSaveAnalysis}
              disabled={!canSave}
              className="flex-1"
            >
              <Layers className="mr-2 h-4 w-4" />
              Save Analysis
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleLoadAnalysis}
              disabled={!canLoad}
              className="flex-1"
            >
              <Boxes className="mr-2 h-4 w-4" />
              Load Analysis
            </Button>
          </div>
          
          {/* Generate 3D Button */}
          <div className="mt-4">
            <Button
              variant="default"
              size="lg"
              disabled={!canGenerate}
              onClick={handleGenerate3D}
              className="w-full"
            >
              {generating3D ? (
                <>
                  <Boxes className="mr-2 h-5 w-5 animate-spin" />
                  Generating 3D Model...
                </>
              ) : (
                <>
                  <Boxes className="mr-2 h-5 w-5" />
                  Generate 3D Model
                </>
              )}
            </Button>
          </div>
          
          <div className="mt-4 space-y-2">
            {isProcessing && (
              <Alert variant="default" className="bg-blue-50 border-blue-200">
                <Cpu className="h-4 w-4 animate-spin" />
                <AlertTitle>Processing...</AlertTitle>
                <AlertDescription>
                  The AI is analyzing your floor plan. This may take a moment.
                </AlertDescription>
              </Alert>
            )}
            {error && !isProcessing && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Processing Error</AlertTitle>
                <AlertDescription>
                  {error}
                </AlertDescription>
              </Alert>
            )}
            {analysisResult && !isProcessing && !error && (
              <Alert variant="default" className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Success!</AlertTitle>
                <AlertDescription className="text-green-700">
                  Floor plan analyzed. Ready for 3D generation and customization.
                </AlertDescription>
              </Alert>
            )}
          </div>
          
          <div className={`space-y-4 pt-4 border-t ${!analysisResult || isProcessing ? 'opacity-50 pointer-events-none' : ''}`}>
            <h3 className="text-sm font-medium text-muted-foreground">Customize 3D Model</h3>
            <div className="space-y-2">
              <Label htmlFor="wall-height">Wall Height: {wallHeight}m</Label>
              <Slider
                id="wall-height"
                min={WALL_HEIGHT_RANGE.min}
                max={WALL_HEIGHT_RANGE.max}
                step={0.1}
                value={[wallHeight]}
                onValueChange={(value) => setWallHeight(value[0])}
                disabled={!analysisResult || isProcessing || generating3D}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="floor-style">Floor Style</Label>
                <Select
                  value={selectedFloorStyle}
                  onValueChange={setSelectedFloorStyle}
                  disabled={!analysisResult || isProcessing || generating3D}
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
                  value={selectedWallStyle}
                  onValueChange={setSelectedWallStyle}
                  disabled={!analysisResult || isProcessing || generating3D}
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
        </div>
        
        {analysisResult && (
          <div className="border-t pt-4">
            <Button
              className="w-full"
              variant="default"
              disabled={!canGenerate}
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
                  Generate / Update 3D Model
                </>
              )}
            </Button>
          </div>
        )}

        {analysisResult && !isProcessing && (
          <div className={`border-t pt-4 space-y-4 ${!analysisResult || isProcessing ? 'opacity-50 pointer-events-none' : ''}`}>
            <h3 className="text-sm font-medium text-muted-foreground">View Controls</h3>
            <div className="flex items-center justify-between">
              <Label>View Controls</Label>
              <Toggle
                pressed={wireframeMode}
                onPressedChange={toggleWireframeMode}
                aria-label="Toggle wireframe mode"
                disabled={isProcessing || generating3D}
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
                  disabled={isProcessing || generating3D}
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