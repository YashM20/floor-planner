'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { 
  Plus, 
  Armchair, 
  Table, 
  Sofa, 
  Bed, 
  Lamp, 
  DoorOpen, 
  CircleUser
} from 'lucide-react'

import { ModelStudio } from '@/components/browse/model-studio'
import { Scene, Model, sceneExample, chairExample } from '@/components/browse/model-schema'
import { convertToStandardFormat } from '@/components/browse/scene-converter'

// Sample chair JSON
const sampleChairJson = {
  "scene": {
    "name": "Simple Chair",
    "units": "meters",
    "objects": [
      {
        "id": "chair_001",
        "type": "furniture",
        "subtype": "chair",
        "name": "Modern Chair",
        "position": { "x": 1, "y": 0, "z": 1 },
        "rotation": { "x": 0, "y": 0, "z": 0 },
        "scale": { "x": 1, "y": 1, "z": 1 },
        "components": [
          {
            "id": "chair_seat",
            "primitive": "box",
            "dimensions": { "width": 0.5, "height": 0.05, "depth": 0.5 },
            "position": { "x": 0, "y": 0.4, "z": 0 },
            "material": {
              "type": "laminate",
              "color": "#a67c52",
              "texture": null,
              "metalness": 0.1,
              "roughness": 0.8
            }
          },
          {
            "id": "chair_backrest",
            "primitive": "box",
            "dimensions": { "width": 0.5, "height": 0.4, "depth": 0.05 },
            "position": { "x": 0, "y": 0.625, "z": -0.225 },
            "material": {
              "type": "laminate",
              "color": "#a67c52",
              "texture": null
            }
          },
          {
            "id": "chair_leg_front_left",
            "primitive": "cylinder",
            "dimensions": { "radiusTop": 0.025, "radiusBottom": 0.025, "height": 0.4 },
            "position": { "x": -0.225, "y": 0.2, "z": 0.225 },
            "rotation": { "x": 0, "y": 0, "z": 0 },
            "material": {
              "type": "metal",
              "color": "#555",
              "metalness": 0.9,
              "roughness": 0.2
            }
          },
          {
            "id": "chair_leg_front_right",
            "primitive": "cylinder",
            "dimensions": { "radiusTop": 0.025, "radiusBottom": 0.025, "height": 0.4 },
            "position": { "x": 0.225, "y": 0.2, "z": 0.225 },
            "material": {
              "type": "metal",
              "color": "#555",
              "metalness": 0.9,
              "roughness": 0.2
            }
          },
          {
            "id": "chair_leg_back_left",
            "primitive": "cylinder",
            "dimensions": { "radiusTop": 0.025, "radiusBottom": 0.025, "height": 0.4 },
            "position": { "x": -0.225, "y": 0.2, "z": -0.225 },
            "material": {
              "type": "metal",
              "color": "#555",
              "metalness": 0.9,
              "roughness": 0.2
            }
          },
          {
            "id": "chair_leg_back_right",
            "primitive": "cylinder",
            "dimensions": { "radiusTop": 0.025, "radiusBottom": 0.025, "height": 0.4 },
            "position": { "x": 0.225, "y": 0.2, "z": -0.225 },
            "material": {
              "type": "metal",
              "color": "#555",
              "metalness": 0.9,
              "roughness": 0.2
            }
          }
        ]
      }
    ]
  }
};

// Sample sofa JSON
const sampleSofaJson = {
  "scene": {
    "name": "Modern Sofa",
    "units": "meters",
    "objects": [
      {
        "id": "sofa_001",
        "type": "furniture",
        "subtype": "sofa",
        "name": "Modern Sofa",
        "components": [
          {
            "id": "sofa_base",
            "primitive": "box",
            "dimensions": { "width": 1.8, "height": 0.15, "depth": 0.8 },
            "position": { "x": 0, "y": 0.075, "z": 0 },
            "material": {
              "type": "fabric",
              "color": "#3a4a6d",
              "roughness": 0.9
            }
          },
          {
            "id": "sofa_seat",
            "primitive": "box",
            "dimensions": { "width": 1.8, "height": 0.15, "depth": 0.7 },
            "position": { "x": 0, "y": 0.225, "z": 0.05 },
            "material": {
              "type": "fabric",
              "color": "#3a4a6d",
              "roughness": 0.9
            }
          },
          {
            "id": "sofa_back",
            "primitive": "box",
            "dimensions": { "width": 1.8, "height": 0.5, "depth": 0.15 },
            "position": { "x": 0, "y": 0.5, "z": -0.325 },
            "material": {
              "type": "fabric",
              "color": "#3a4a6d",
              "roughness": 0.9
            }
          },
          {
            "id": "sofa_armrest_left",
            "primitive": "box",
            "dimensions": { "width": 0.15, "height": 0.3, "depth": 0.8 },
            "position": { "x": -0.825, "y": 0.35, "z": 0 },
            "material": {
              "type": "fabric",
              "color": "#3a4a6d",
              "roughness": 0.9
            }
          },
          {
            "id": "sofa_armrest_right",
            "primitive": "box",
            "dimensions": { "width": 0.15, "height": 0.3, "depth": 0.8 },
            "position": { "x": 0.825, "y": 0.35, "z": 0 },
            "material": {
              "type": "fabric",
              "color": "#3a4a6d",
              "roughness": 0.9
            }
          }
        ]
      }
    ]
  }
};

// Sample table JSON
const sampleTableJson = {
  "scene": {
    "name": "Coffee Table",
    "units": "meters",
    "objects": [
      {
        "id": "table_001",
        "type": "furniture",
        "subtype": "table",
        "name": "Coffee Table",
        "components": [
          {
            "id": "table_top",
            "primitive": "box",
            "dimensions": { "width": 1.2, "height": 0.05, "depth": 0.6 },
            "position": { "x": 0, "y": 0.4, "z": 0 },
            "material": {
              "type": "wood",
              "color": "#5d4037",
              "roughness": 0.7
            }
          },
          {
            "id": "table_leg_front_left",
            "primitive": "cylinder",
            "dimensions": { "radiusTop": 0.02, "radiusBottom": 0.02, "height": 0.4 },
            "position": { "x": -0.55, "y": 0.2, "z": 0.25 },
            "material": {
              "type": "metal",
              "color": "#333333",
              "metalness": 0.8,
              "roughness": 0.2
            }
          },
          {
            "id": "table_leg_front_right",
            "primitive": "cylinder",
            "dimensions": { "radiusTop": 0.02, "radiusBottom": 0.02, "height": 0.4 },
            "position": { "x": 0.55, "y": 0.2, "z": 0.25 },
            "material": {
              "type": "metal",
              "color": "#333333",
              "metalness": 0.8,
              "roughness": 0.2
            }
          },
          {
            "id": "table_leg_back_left",
            "primitive": "cylinder",
            "dimensions": { "radiusTop": 0.02, "radiusBottom": 0.02, "height": 0.4 },
            "position": { "x": -0.55, "y": 0.2, "z": -0.25 },
            "material": {
              "type": "metal",
              "color": "#333333",
              "metalness": 0.8,
              "roughness": 0.2
            }
          },
          {
            "id": "table_leg_back_right",
            "primitive": "cylinder",
            "dimensions": { "radiusTop": 0.02, "radiusBottom": 0.02, "height": 0.4 },
            "position": { "x": 0.55, "y": 0.2, "z": -0.25 },
            "material": {
              "type": "metal",
              "color": "#333333",
              "metalness": 0.8,
              "roughness": 0.2
            }
          }
        ]
      }
    ]
  }
};

// Template models for quick starting
const templateScenes = [
  { id: 'scene-full', name: 'Complete Room', scene: sceneExample, icon: <CircleUser size={24} /> },
  { id: 'chair-simple', name: 'Simple Chair', scene: convertToStandardFormat(sampleChairJson), icon: <Armchair size={24} /> },
  { id: 'sofa-modern', name: 'Modern Sofa', scene: convertToStandardFormat(sampleSofaJson), icon: <Sofa size={24} /> },
  { id: 'table-coffee', name: 'Coffee Table', scene: convertToStandardFormat(sampleTableJson), icon: <Table size={24} /> }
];

export function ModelBrowser() {
  const [selectedScene, setSelectedScene] = useState<Scene>(sceneExample);
  const [activeTab, setActiveTab] = useState('studio');
  
  const handleSelectTemplate = (scene: Scene) => {
    setSelectedScene(scene);
    setActiveTab('studio');
  };
  
  const createEmptyScene = () => {
    const emptyScene: Scene = {
      name: 'New Scene',
      objects: []
    };
    setSelectedScene(emptyScene);
    setActiveTab('studio');
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
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
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">3D Model Schema</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Scene Structure</h3>
                  <p className="mb-3">
                    A complete 3D scene with furniture models and environment settings.
                  </p>
                  <pre className="bg-secondary/50 p-4 rounded-md overflow-auto text-sm">
{`{
  "scene": {
    "name": "Room Name",
    "units": "meters",
    "objects": [ ... ],
    "settings": {
      "backgroundColor": "#f1f5f9",
      "ambientLight": {
        "color": "#ffffff",
        "intensity": 0.5
      },
      "directionalLight": [
        {
          "color": "#ffffff",
          "intensity": 1.0,
          "position": { "x": 10, "y": 10, "z": 5 },
          "castShadow": true
        }
      ]
    }
  }
}`}
                  </pre>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2">Furniture Objects</h3>
                  <p className="mb-3">
                    Individual furniture pieces made of primitive shapes.
                  </p>
                  <pre className="bg-secondary/50 p-4 rounded-md overflow-auto text-sm">
{`{
  "id": "unique_id",
  "type": "furniture",
  "subtype": "chair|table|sofa|etc",
  "name": "Object Name",
  "position": { "x": 0, "y": 0, "z": 0 },
  "rotation": { "x": 0, "y": 0, "z": 0 },
  "components": [ ... ]
}`}
                  </pre>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2">Components</h3>
                  <p className="mb-3">
                    Basic building blocks using primitive shapes.
                  </p>
                  <pre className="bg-secondary/50 p-4 rounded-md overflow-auto text-sm">
{`{
  "id": "component_id",
  "primitive": "box|cylinder|sphere|plane",
  "dimensions": {
    // For box:
    "width": 1.0, "height": 1.0, "depth": 1.0,
    
    // For cylinder:
    "radiusTop": 0.5, "radiusBottom": 0.5, "height": 1.0,
    
    // For sphere:
    "radius": 0.5
  },
  "position": { "x": 0, "y": 0, "z": 0 },
  "rotation": { "x": 0, "y": 0, "z": 0 },
  "material": {
    "type": "standard|metal|wood|glass|laminate|fabric|etc",
    "color": "#hex",
    "metalness": 0.0 to 1.0,
    "roughness": 0.0 to 1.0
  }
}`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 