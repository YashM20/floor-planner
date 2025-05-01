'use client'

import { useState, useRef } from 'react'
import { useFloorPlanStore } from '@/store/use-floor-plan-store'
import { WALL_HEIGHT_RANGE, FLOOR_STYLES, WALL_STYLES, VIEWS } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Toggle } from '@/components/ui/toggle'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  AlertCircle,
  CheckCircle,
  Boxes,
  Cpu,
  Eye,
  Grid3X3,
  Layers,
  Palette,
  Ruler,
  UploadCloud,
  Download,
  ClipboardCopy
} from 'lucide-react'
import { toast } from 'sonner'
import type { FloorPlanAnalysis } from '@/types/floor-plan'
import { FloorPlanAnalysisSchema } from '@/types/floor-plan'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export function FloorPlanControls () {
  const [jsonDataInput, setJsonDataInput] = useState('');
  const [isLoadDialogOpen, setIsLoadDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const viewTextareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    uploadedImage,
    wallHeight,
    processingStage,
    analysisResult,
    error,
    setWallHeight,
    setSelectedFloorStyle,
    setSelectedWallStyle,
    setProcessingStage,
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
    const isBusy = processingStage === 'sending' || processingStage === 'analyzing' || processingStage === 'validating'
    if (!uploadedImage || isBusy) {
      console.log('[Controls] Processing skipped: No image or already processing.')
      return
    }

    console.log('[Controls] Starting processing.')
    setProcessingStage('sending')

    try {
      toast.info('Sending floor plan to AI...')
      console.log('[Controls] Calling /api/process-floor-plan...')

      setProcessingStage('analyzing')
      const response = await fetch('/api/process-floor-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ imageDataUrl: uploadedImage })
      })
      
      console.log(`[Controls] API response status: ${response.status}`)

      if (!response.ok) {
        let errorMessage = `API Error (${response.status})`
        let errorDetails = null
        try {
          errorDetails = await response.json()
          console.error('[Controls] API Error Response Body:', errorDetails)
          const detailMsg = typeof errorDetails?.details === 'string' ? errorDetails.details :
                            typeof errorDetails?.error === 'string' ? errorDetails.error :
                            (errorDetails?.details?.formErrors?.length > 0 ? errorDetails.details.formErrors.join(', ') : null)
          errorMessage = detailMsg ? `${errorMessage}: ${detailMsg}` : errorMessage
          toast.warning(`Error response received: ${errorMessage}`)
        } catch (jsonError) {
          console.error('[Controls] Failed to parse error JSON', jsonError)
          errorMessage = `${errorMessage}: Could not parse error response.`
          toast.warning('Received non-JSON error response from server.')
        }
        setError(errorMessage)
        toast.error(`Processing failed: ${errorMessage}`)
        console.log('[Controls] Set error state:', errorMessage)
        return
      }

      setProcessingStage('validating')
      const resultData: FloorPlanAnalysis = await response.json()
      console.log('[Controls] API Success. Received data:', resultData)

      if (!resultData || !Array.isArray(resultData.rooms) || !Array.isArray(resultData.walls)) {
        console.error('[Controls] Invalid data structure received from API:', resultData)
        const structuralError = 'AI response lacks essential structure (rooms or walls).'
        setError(structuralError)
        toast.error(`Processing failed: ${structuralError}`)
        return
      }

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
        processingStage: 'done',
        error: null
      })

      toast.success('Floor plan loaded successfully!')
    } catch (error) {
      console.error('[Controls] Error loading saved analysis:', error)
      toast.error('Failed to load saved analysis data')
    }
  }

  // Function to load analysis result from pasted JSON
  const handleLoadJsonData = () => {
    if (!jsonDataInput) {
      toast.warning('Please paste JSON data into the text area.');
      return;
    }
    let parsedData;
    try {
      parsedData = JSON.parse(jsonDataInput);
      // Log the parsed data structure
      console.log('[Controls] Parsed JSON data:', typeof parsedData, parsedData);
    } catch (error) {
      console.error('[Controls] Error parsing JSON string:', error);
      toast.error('Failed to parse JSON data.', {
        description: 'Please ensure the text is valid JSON format (e.g., check quotes, commas).',
      });
      // Keep dialog open and input intact for correction
      return; 
    }

    try {
      const validationResult = FloorPlanAnalysisSchema.safeParse(parsedData);

      if (!validationResult.success) {
        // Log the raw validation result object AND its properties
        console.error('[Controls] Zod validation failed.');
        console.error('[Controls] Raw validationResult object:', validationResult);
        console.error('[Controls] validationResult.success:', validationResult.success); // Should be false
        console.error('[Controls] validationResult.error:', validationResult.error); // Should be a ZodError object

        // Attempt to flatten, guarding against missing error property
        const flatErrors = validationResult.error ? validationResult.error.flatten() : { formErrors: ["Unknown validation error"], fieldErrors: {} };
        console.error('[Controls] Flattened Zod errors:', flatErrors);
        
        // Format Zod errors for better display
        const fieldErrors = flatErrors.fieldErrors;
        let errorDescription = 'Validation failed: \n';
        for (const key in fieldErrors) {
          errorDescription += `- ${key.replace(/_/g, '[').replace(/\.(\d+)\./g, '[$1].')} : ${fieldErrors[key as keyof typeof fieldErrors]?.join(', ')}\n`;
        }
        const formErrors = flatErrors.formErrors;
        if (formErrors.length > 0) {
           errorDescription += `General errors: ${formErrors.join(', ')}`;
        }
        if (!errorDescription.includes('-') && formErrors.length === 0) { // Check if any errors were added
            errorDescription = "Validation failed: The provided JSON structure doesn't match the expected format.";
        }

        toast.error('Invalid data structure. Please fix errors:', {
           description: () => (
            <pre className="mt-2 whitespace-pre-wrap text-xs font-mono bg-destructive/10 p-2 rounded">
              {errorDescription}
            </pre>
          ),
          duration: 10000, 
        });
        return;
      }

      // Step 3: If valid, set it in the store
      useFloorPlanStore.setState({
        analysisResult: validationResult.data,
        uploadedImage: null, // Clear uploaded image as we are loading data directly
        processingStage: 'done', // Mark as done
        error: null,
      });

      toast.success('JSON data loaded successfully!');
      setJsonDataInput(''); // Clear input field ONLY on success
      setIsLoadDialogOpen(false); // Close dialog ONLY on success
    } catch (error) {
      // Catch unexpected errors during validation or state update
      console.error('[Controls] Unexpected error loading validated JSON data:', error);
      toast.error('An unexpected error occurred while loading the data.');
    }
  };

  // Function to copy analysis JSON to clipboard
  const handleCopyJson = () => {
    if (!analysisResult || !viewTextareaRef.current) return;
    try {
      const jsonString = JSON.stringify(analysisResult, null, 2);
      navigator.clipboard.writeText(jsonString);
      toast.success('Analysis JSON copied to clipboard!');
    } catch (error) {
      console.error('[Controls] Failed to copy JSON:', error);
      toast.error('Failed to copy JSON data.');
    }
  };

  const isBusy = processingStage === 'sending' || processingStage === 'analyzing' || processingStage === 'validating'
  const canProcess = !!uploadedImage && !analysisResult && !isBusy
  const canSave = !!analysisResult && !isBusy
  const canLoad = !isBusy
  const canViewJson = !!analysisResult && !isBusy // Condition to enable View JSON button

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
              disabled={!canProcess}
              onClick={handleProcessPlan}
              className="flex-1 min-w-[150px]"
            >
              {processingStage === 'sending' || processingStage === 'analyzing' || processingStage === 'validating' ? (
                <>
                  <Cpu className="mr-2 h-4 w-4 animate-spin" />
                  {processingStage === 'sending' && 'Sending...'}
                  {processingStage === 'analyzing' && 'Analyzing...'}
                  {processingStage === 'validating' && 'Validating...'}
                </>
              ) : processingStage === 'done' ? (
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
          
          <div className="flex justify-between gap-2 mt-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSaveAnalysis}
              disabled={!canSave}
              className="flex-1"
            >
              <Layers className="mr-2 h-4 w-4" />
              Save Analysis (LocalStorage)
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleLoadAnalysis}
              disabled={!canLoad}
              className="flex-1"
            >
              <Boxes className="mr-2 h-4 w-4" />
              Load Analysis (LocalStorage)
            </Button>
          </div>
          
          <div className="flex justify-between gap-2 mt-2">
            <Dialog open={isLoadDialogOpen} onOpenChange={setIsLoadDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" disabled={!canLoad} className="flex-1">
                  <UploadCloud className="mr-2 h-4 w-4" /> Load JSON Data
                </Button>
              </DialogTrigger>
              <DialogContent className="flex flex-col justify-between overflow-hidden sm:max-w-[600px] max-h-[90%]">
                <DialogHeader>
                  <DialogTitle>Load Floor Plan JSON</DialogTitle>
                  <DialogDescription>
                    Paste your previously generated FloorPlanAnalysis JSON data below.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col flex-1 overflow-y-auto py-4 max-h-full">
                  <Textarea 
                    placeholder='{ "overallDimensions": { ... }, "rooms": [ ... ], ... }'
                    rows={15}
                    spellCheck={false}
                    value={jsonDataInput}
                    onChange={(e) => setJsonDataInput(e.target.value)}
                    className="font-mono text-xs"
                  />
                </div>
                <DialogFooter className="flex flex-row ">
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancel</Button>
                  </DialogClose>
                  <Button type="button" onClick={handleLoadJsonData}>Load Data</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" disabled={!canViewJson} className="flex-1">
                  <Download className="mr-2 h-4 w-4" /> View Analysis JSON
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>View Floor Plan Analysis JSON</DialogTitle>
                  <DialogDescription>
                    Below is the structured data generated from the analysis.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <ScrollArea className="h-[400px] w-full rounded-md border p-4 bg-muted/30">
                    <pre className="text-xs font-mono whitespace-pre-wrap break-words">
                      <code>
                        {analysisResult ? JSON.stringify(analysisResult, null, 2) : 'No analysis data available.'}
                      </code>
                    </pre>
                  </ScrollArea>
                </div>
                <DialogFooter className="sm:justify-between">
                   <Button type="button" onClick={handleCopyJson} variant="secondary" disabled={!analysisResult}>
                     <ClipboardCopy className="mr-2 h-4 w-4"/> Copy JSON
                  </Button>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Close</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="mt-4 space-y-2">
            {(processingStage === 'sending' || processingStage === 'analyzing' || processingStage === 'validating') && (
              <Alert variant="default" className="bg-blue-50 border-blue-200">
                <Cpu className="h-4 w-4 animate-spin text-blue-600" />
                <AlertTitle className="text-blue-800">Processing Floor Plan</AlertTitle>
                <AlertDescription className="text-blue-700">
                  {processingStage === 'sending' && 'Sending image data to the analysis service...'}
                  {processingStage === 'analyzing' && 'The AI is analyzing the floor plan structure. This may take a moment...'}
                  {processingStage === 'validating' && 'Validating the received analysis data...'}
                </AlertDescription>
              </Alert>
            )}
            {processingStage === 'error' && error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Processing Error</AlertTitle>
                <AlertDescription>
                  {error}
                </AlertDescription>
              </Alert>
            )}
            {processingStage === 'done' && analysisResult && (
              <Alert variant="default" className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Success!</AlertTitle>
                <AlertDescription className="text-green-700">
                  Floor plan analyzed. Ready for 3D generation and customization.
                </AlertDescription>
              </Alert>
            )}
          </div>
          
          <div className={`space-y-4 pt-4 border-t ${!analysisResult || isBusy ? 'opacity-50 pointer-events-none' : ''}`}>
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
                disabled={!analysisResult || isBusy}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="floor-style">Floor Style</Label>
                <Select
                  value={selectedFloorStyle}
                  onValueChange={setSelectedFloorStyle}
                  disabled={!analysisResult || isBusy}
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
                  disabled={!analysisResult || isBusy}
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
        
        {analysisResult && !isBusy && (
          <div className={`border-t pt-4 space-y-4`}>
            <h3 className="text-sm font-medium text-muted-foreground">View Controls</h3>
            <div className="flex items-center justify-between">
              <Label>View Controls</Label>
              <Toggle
                pressed={wireframeMode}
                onPressedChange={toggleWireframeMode}
                aria-label="Toggle wireframe mode"
                disabled={isBusy}
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
                  disabled={isBusy}
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