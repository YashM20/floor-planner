'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

import { ModelStudio } from '@/components/browse/model-studio'
import { Scene, sceneExample } from '@/components/browse/model-schema'
import { validateModel, validateScene } from '@/components/browse/model-schema-zod'
import { ModelDocumentation } from '@/components/browse/model-documentation'
import { useQueryState } from 'nuqs'
import { templateScenes } from '@/components/browse/model-data'

export function ModelBrowser() {
  const [selectedScene, setSelectedScene] = useState<Scene>(sceneExample)
  const [activeTab, setActiveTab] = useQueryState('tab', { defaultValue: 'studio' })
  
  const handleSelectTemplate = (scene: Scene) => {
    try {
      // Apply some cleanup to ensure we don't carry over problematic state
      // between templates
      setSelectedScene(scene)
      
      // Small delay to ensure clean switching
      setTimeout(() => {
        setActiveTab('studio')
      }, 50)
    } catch (error) {
      console.error("Error selecting template:", error)
      // Fallback to a minimal scene
      const fallbackScene: Scene = {
        name: "Fallback Scene",
        objects: []
      }
      setSelectedScene(fallbackScene)
      setActiveTab('studio')
    }
  }
  
  const createEmptyScene = () => {
    const emptyScene: Scene = {
      name: 'New Scene',
      objects: []
    }
    setSelectedScene(emptyScene)
    setActiveTab('studio')
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">3D Furniture Visualizer</h1>
        <p className="text-gray-500 mb-6">
          Browse, customize, and visualize 3D furniture models using JSON-based structures.
        </p>
      </div>
      
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="studio">Model Studio</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="templates">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Card className="flex flex-col h-52">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Plus className="mr-2" size={24} />
                  New Empty Scene
                </CardTitle>
                <CardDescription>Start with a blank scene</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex items-center justify-center text-muted-foreground">
                Create a new empty scene
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={createEmptyScene}
                >
                  Create
                </Button>
              </CardFooter>
            </Card>
            
            {templateScenes.map((template) => (
              <Card key={template.id} className="flex flex-col h-52">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    {template.icon}
                    <span className="ml-2">{template.name}</span>
                  </CardTitle>
                  <CardDescription>
                    {template.scene.objects.length} {template.scene.objects.length === 1 ? 'object' : 'objects'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex items-center justify-center text-muted-foreground">
                  {template.scene.name}
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => handleSelectTemplate(template.scene)}
                  >
                    Use Template
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="studio">
          <ModelStudio initialScene={selectedScene} />
        </TabsContent>
        
        <TabsContent value="documentation" className="space-y-6">
          <ModelDocumentation />
        </TabsContent>
      </Tabs>
    </div>
  )
} 