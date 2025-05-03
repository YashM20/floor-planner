'use client'

import { useState, useCallback, useEffect } from 'react'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { 
  Download, 
  Upload, 
  Rotate3d, 
  Grid as GridIcon, 
  BarChart2, 
  Sliders,
  Sun,
  Boxes,
  Box,
  Ruler
} from 'lucide-react'

import { Scene, Model, chairExample, sceneExample } from './model-schema'
import { ModelViewer } from './model-viewer'
import { JsonEditor } from './json-editor'
import { PropertyEditor } from './property-editor'
import { convertToSimplifiedFormat, convertToStandardFormat } from './scene-converter'

type ModelStudioProps = {
  initialScene?: Scene
  initialModel?: Model
}

export function ModelStudio({ initialScene = sceneExample, initialModel }: ModelStudioProps) {
  // If initialModel is provided, create a simple scene with just that model
  const startingScene = initialModel ? 
    { name: initialModel.name, objects: [initialModel] } as Scene : 
    initialScene;
  
  const [scene, setScene] = useState<Scene>(startingScene)
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null)
  const [selectedModelId, setSelectedModelId] = useState<string | null>(scene.objects?.[0]?.id || null)
  const [showGrid, setShowGrid] = useState(true)
  const [showAxes, setShowAxes] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [showHelpers, setShowHelpers] = useState(false)
  const [autoRotate, setAutoRotate] = useState(false)
  
  // Get the currently selected model from the scene
  const selectedModel = scene.objects?.find(model => model.id === selectedModelId) || scene.objects?.[0]
  
  const handleSceneChange = useCallback((updatedScene: Scene) => {
    setScene(updatedScene)
  }, [])
  
  const handleModelChange = useCallback((updatedModel: Model) => {
    // Update the model within the scene
    const updatedScene = { ...scene }
    const modelIndex = updatedScene.objects?.findIndex(m => m.id === updatedModel.id) || -1
    
    if (modelIndex !== -1 && updatedScene.objects) {
      updatedScene.objects[modelIndex] = updatedModel
      setScene(updatedScene)
    }
  }, [scene])
  
  const handleComponentSelect = useCallback((id: string) => {
    setSelectedComponentId(id)
  }, [])
  
  const handleImportJSON = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const jsonData = JSON.parse(event.target?.result as string)
          const convertedScene = convertToStandardFormat(jsonData)
          setScene(convertedScene)
          // Reset selection state when importing new data
          setSelectedComponentId(null)
          setSelectedModelId(convertedScene.objects?.[0]?.id || null)
        } catch (err) {
          console.error('Error importing JSON:', err)
          alert('Invalid JSON file')
        }
      }
      reader.readAsText(file)
    }
    
    input.click()
  }, [])
  
  const handleExportJSON = useCallback(() => {
    const simplifiedScene = convertToSimplifiedFormat(scene)
    const dataStr = JSON.stringify(simplifiedScene, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `${scene.name.toLowerCase().replace(/\s+/g, '-')}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }, [scene])

  return (
    <div className="h-[calc(100vh-6rem)] w-full border rounded-md overflow-hidden">
      <ResizablePanelGroup direction="horizontal">
        {/* Main 3D Viewer */}
        <ResizablePanel defaultSize={65} minSize={40}>
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between gap-2 p-2 border-b bg-muted/20">
              <div className="text-lg font-medium">{scene.name}</div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  title="Toggle Grid"
                  onClick={() => setShowGrid(!showGrid)}
                >
                  <GridIcon className={showGrid ? 'text-primary' : 'text-muted-foreground'} size={16} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  title="Toggle Axes"
                  onClick={() => setShowAxes(!showAxes)}
                >
                  <Ruler className={showAxes ? 'text-primary' : 'text-muted-foreground'} size={16} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  title="Toggle Stats"
                  onClick={() => setShowStats(!showStats)}
                >
                  <BarChart2 className={showStats ? 'text-primary' : 'text-muted-foreground'} size={16} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  title="Toggle Helpers"
                  onClick={() => setShowHelpers(!showHelpers)}
                >
                  <Sun className={showHelpers ? 'text-primary' : 'text-muted-foreground'} size={16} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  title="Auto Rotate"
                  onClick={() => setAutoRotate(!autoRotate)}
                >
                  <Rotate3d className={autoRotate ? 'text-primary' : 'text-muted-foreground'} size={16} />
                </Button>
              </div>
            </div>
            
            <div className="flex-1 relative">
              <ModelViewer 
                scene={scene}
                showGrid={showGrid}
                showAxes={showAxes}
                showStats={showStats}
                showHelpers={showHelpers}
                height="100%"
                onSelectComponent={handleComponentSelect}
                autoRotate={autoRotate}
              />
            </div>
          </div>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        {/* Editors/UI Controls Panel */}
        <ResizablePanel defaultSize={35} minSize={25}>
          <Tabs defaultValue="properties" className="h-full flex flex-col">
            <div className="flex justify-between items-center px-4 py-2 border-b">
              <TabsList>
                <TabsTrigger value="properties">Properties</TabsTrigger>
                <TabsTrigger value="json">JSON</TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  title="Import JSON"
                  onClick={handleImportJSON}
                >
                  <Upload size={16} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  title="Export JSON"
                  onClick={handleExportJSON}
                >
                  <Download size={16} />
                </Button>
              </div>
            </div>
            
            <TabsContent value="properties" className="flex-1 p-4 overflow-auto">
              {selectedModel && (
                <PropertyEditor
                  model={selectedModel}
                  selectedComponentId={selectedComponentId}
                  onModelChange={handleModelChange}
                />
              )}
            </TabsContent>
            
            <TabsContent value="json" className="flex-1 p-4 overflow-auto">
              <JsonEditor
                initialJson={scene}
                onChange={handleSceneChange}
              />
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
} 