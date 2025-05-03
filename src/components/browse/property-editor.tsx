'use client'

import { useState, useCallback, useEffect } from 'react'
import { Component, Material, Model, Primitive, Transformation } from './model-schema'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type PropertyEditorProps = {
  model: Model
  selectedComponentId: string | null
  onModelChange: (updatedModel: Model) => void
}

export function PropertyEditor({ model, selectedComponentId, onModelChange }: PropertyEditorProps) {
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null)

  // Find the selected component in the model when the selection changes
  useEffect(() => {
    if (!selectedComponentId) {
      setSelectedComponent(null)
      return
    }

    // Check in top-level components
    let component = model.components.find(c => c.id === selectedComponentId)
    
    // If not found, check in groups
    if (!component && model.groups) {
      for (const group of model.groups) {
        component = group.components.find(c => c.id === selectedComponentId)
        if (component) break
      }
    }
    
    setSelectedComponent(component || null)
  }, [model, selectedComponentId])

  const updateComponent = useCallback((updatedComponent: Component) => {
    // Create a deep copy of the model
    const updatedModel = structuredClone(model)
    
    // Update in top-level components
    let index = updatedModel.components.findIndex(c => c.id === updatedComponent.id)
    if (index !== -1) {
      updatedModel.components[index] = updatedComponent
    } else if (updatedModel.groups) {
      // Update in groups if not found in top-level
      for (let i = 0; i < updatedModel.groups.length; i++) {
        index = updatedModel.groups[i].components.findIndex(c => c.id === updatedComponent.id)
        if (index !== -1) {
          updatedModel.groups[i].components[index] = updatedComponent
          break
        }
      }
    }
    
    onModelChange(updatedModel)
  }, [model, onModelChange])
  
  // Update geometry dimensions
  const updateGeometry = useCallback((key: string, value: number) => {
    if (!selectedComponent || !('type' in selectedComponent.geometry)) return

    const updatedComponent = structuredClone(selectedComponent)
    const geometry = updatedComponent.geometry as Primitive
    
    geometry.dimensions = {
      ...geometry.dimensions,
      [key]: value
    }
    
    updateComponent(updatedComponent)
  }, [selectedComponent, updateComponent])
  
  // Update transform
  const updateTransform = useCallback((key: keyof Transformation, index: number, value: number) => {
    if (!selectedComponent) return
    
    const updatedComponent = structuredClone(selectedComponent)
    const transforms = [...(updatedComponent.transformation[key] || [0, 0, 0])]
    transforms[index] = value
    
    updatedComponent.transformation = {
      ...updatedComponent.transformation,
      [key]: transforms as [number, number, number]
    }
    
    updateComponent(updatedComponent)
  }, [selectedComponent, updateComponent])
  
  // Update material properties
  const updateMaterial = useCallback((key: keyof Material, value: any) => {
    if (!selectedComponent) return
    
    const updatedComponent = structuredClone(selectedComponent)
    updatedComponent.material = {
      ...updatedComponent.material,
      [key]: value
    }
    
    updateComponent(updatedComponent)
  }, [selectedComponent, updateComponent])

  // If no component is selected, show a placeholder
  if (!selectedComponent) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Property Editor</CardTitle>
          <CardDescription>Select a component to edit its properties</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  // Determine which geometry fields to show based on the type
  const showGeometryFields = () => {
    if (!selectedComponent || !('type' in selectedComponent.geometry)) {
      return <p className="text-sm italic">Custom geometry</p>
    }

    const geometry = selectedComponent.geometry as Primitive
    
    switch (geometry.type) {
      case 'box':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="width">Width</Label>
                <Input 
                  id="width" 
                  type="number" 
                  value={geometry.dimensions.width || 1} 
                  step={0.1}
                  onChange={(e) => updateGeometry('width', parseFloat(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height</Label>
                <Input 
                  id="height" 
                  type="number" 
                  value={geometry.dimensions.height || 1} 
                  step={0.1}
                  onChange={(e) => updateGeometry('height', parseFloat(e.target.value))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="depth">Depth</Label>
              <Input 
                id="depth" 
                type="number" 
                value={geometry.dimensions.depth || 1} 
                step={0.1}
                onChange={(e) => updateGeometry('depth', parseFloat(e.target.value))}
              />
            </div>
          </>
        )
      case 'cylinder':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="radiusTop">Top Radius</Label>
              <Input 
                id="radiusTop" 
                type="number" 
                value={geometry.dimensions.radiusTop || geometry.dimensions.radius || 0.5} 
                step={0.1}
                onChange={(e) => updateGeometry('radiusTop', parseFloat(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="radiusBottom">Bottom Radius</Label>
              <Input 
                id="radiusBottom" 
                type="number" 
                value={geometry.dimensions.radiusBottom || geometry.dimensions.radius || 0.5} 
                step={0.1}
                onChange={(e) => updateGeometry('radiusBottom', parseFloat(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height</Label>
              <Input 
                id="height" 
                type="number" 
                value={geometry.dimensions.height || 1} 
                step={0.1}
                onChange={(e) => updateGeometry('height', parseFloat(e.target.value))}
              />
            </div>
          </>
        )
      case 'sphere':
        return (
          <div className="space-y-2">
            <Label htmlFor="radius">Radius</Label>
            <Input 
              id="radius" 
              type="number" 
              value={geometry.dimensions.radius || 0.5} 
              step={0.1}
              onChange={(e) => updateGeometry('radius', parseFloat(e.target.value))}
            />
          </div>
        )
      case 'plane':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="width">Width</Label>
              <Input 
                id="width" 
                type="number" 
                value={geometry.dimensions.width || 1} 
                step={0.1}
                onChange={(e) => updateGeometry('width', parseFloat(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height</Label>
              <Input 
                id="height" 
                type="number" 
                value={geometry.dimensions.height || 1} 
                step={0.1}
                onChange={(e) => updateGeometry('height', parseFloat(e.target.value))}
              />
            </div>
          </>
        )
      default:
        return null
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Property Editor</CardTitle>
        <CardDescription>Edit properties for: {selectedComponent.name}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="transform">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="transform">Transform</TabsTrigger>
            <TabsTrigger value="geometry">Geometry</TabsTrigger>
            <TabsTrigger value="material">Material</TabsTrigger>
          </TabsList>
          
          <TabsContent value="transform" className="space-y-4">
            <h3 className="text-sm font-medium">Position</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="posX">X</Label>
                <Input 
                  id="posX" 
                  type="number" 
                  value={selectedComponent.transformation.position[0]} 
                  step={0.1}
                  onChange={(e) => updateTransform('position', 0, parseFloat(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="posY">Y</Label>
                <Input 
                  id="posY" 
                  type="number" 
                  value={selectedComponent.transformation.position[1]} 
                  step={0.1}
                  onChange={(e) => updateTransform('position', 1, parseFloat(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="posZ">Z</Label>
                <Input 
                  id="posZ" 
                  type="number" 
                  value={selectedComponent.transformation.position[2]} 
                  step={0.1}
                  onChange={(e) => updateTransform('position', 2, parseFloat(e.target.value))}
                />
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <h3 className="text-sm font-medium">Rotation</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rotX">X</Label>
                <Input 
                  id="rotX" 
                  type="number" 
                  value={selectedComponent.transformation.rotation?.[0] || 0} 
                  step={0.1}
                  onChange={(e) => updateTransform('rotation', 0, parseFloat(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rotY">Y</Label>
                <Input 
                  id="rotY" 
                  type="number" 
                  value={selectedComponent.transformation.rotation?.[1] || 0} 
                  step={0.1}
                  onChange={(e) => updateTransform('rotation', 1, parseFloat(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rotZ">Z</Label>
                <Input 
                  id="rotZ" 
                  type="number" 
                  value={selectedComponent.transformation.rotation?.[2] || 0} 
                  step={0.1}
                  onChange={(e) => updateTransform('rotation', 2, parseFloat(e.target.value))}
                />
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <h3 className="text-sm font-medium">Scale</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scaleX">X</Label>
                <Input 
                  id="scaleX" 
                  type="number" 
                  value={selectedComponent.transformation.scale?.[0] || 1} 
                  step={0.1}
                  onChange={(e) => updateTransform('scale', 0, parseFloat(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="scaleY">Y</Label>
                <Input 
                  id="scaleY" 
                  type="number" 
                  value={selectedComponent.transformation.scale?.[1] || 1} 
                  step={0.1}
                  onChange={(e) => updateTransform('scale', 1, parseFloat(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="scaleZ">Z</Label>
                <Input 
                  id="scaleZ" 
                  type="number" 
                  value={selectedComponent.transformation.scale?.[2] || 1} 
                  step={0.1}
                  onChange={(e) => updateTransform('scale', 2, parseFloat(e.target.value))}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="geometry" className="space-y-4">
            {showGeometryFields()}
          </TabsContent>
          
          <TabsContent value="material" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="material-type">Material Type</Label>
                <Select 
                  value={selectedComponent.material.type} 
                  onValueChange={(value) => updateMaterial('type', value as Material['type'])}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select material type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="phong">Phong</SelectItem>
                    <SelectItem value="lambert">Lambert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <div className="flex gap-3">
                  <Input 
                    id="color" 
                    type="color" 
                    value={selectedComponent.material.color} 
                    className="w-12 h-10 p-1"
                    onChange={(e) => updateMaterial('color', e.target.value)}
                  />
                  <Input 
                    type="text" 
                    value={selectedComponent.material.color}
                    onChange={(e) => updateMaterial('color', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="opacity">Opacity</Label>
                  <span className="text-sm text-gray-500">
                    {(selectedComponent.material.opacity ?? 1).toFixed(2)}
                  </span>
                </div>
                <Slider 
                  id="opacity" 
                  min={0} 
                  max={1} 
                  step={0.01} 
                  value={[selectedComponent.material.opacity ?? 1]}
                  onValueChange={(values) => updateMaterial('opacity', values[0])}
                />
              </div>
              
              {selectedComponent.material.type === 'standard' && (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="roughness">Roughness</Label>
                      <span className="text-sm text-gray-500">
                        {(selectedComponent.material.roughness ?? 0.5).toFixed(2)}
                      </span>
                    </div>
                    <Slider 
                      id="roughness" 
                      min={0} 
                      max={1} 
                      step={0.01} 
                      value={[selectedComponent.material.roughness ?? 0.5]}
                      onValueChange={(values) => updateMaterial('roughness', values[0])}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="metalness">Metalness</Label>
                      <span className="text-sm text-gray-500">
                        {(selectedComponent.material.metalness ?? 0).toFixed(2)}
                      </span>
                    </div>
                    <Slider 
                      id="metalness" 
                      min={0} 
                      max={1} 
                      step={0.01} 
                      value={[selectedComponent.material.metalness ?? 0]}
                      onValueChange={(values) => updateMaterial('metalness', values[0])}
                    />
                  </div>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
} 