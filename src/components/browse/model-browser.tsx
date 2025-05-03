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
  CircleUser,
  Home
} from 'lucide-react'

import { ModelStudio } from '@/components/browse/model-studio'
import { Scene, Model, sceneExample, chairExample, MaterialType, ModelType, ModelSubtype } from '@/components/browse/model-schema'
import { convertToStandardFormat } from '@/components/browse/scene-converter'
import { z } from 'zod'
import { validateModel, validateScene } from '@/components/browse/model-schema-zod'
import { ModelDocumentation } from '@/components/browse/model-documentation'
import { useQueryState } from 'nuqs'

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

// Simple chair template with basic materials only
const simpleSafeChairJson = {
  "scene": {
    "name": "Simple Safe Chair",
    "units": "meters",
    "objects": [
      {
        "id": "chair_001",
        "type": "furniture",
        "subtype": "chair",
        "name": "Safe Chair",
        "components": [
          {
            "id": "chair_seat",
            "primitive": "box",
            "dimensions": { "width": 0.5, "height": 0.05, "depth": 0.5 },
            "position": { "x": 0, "y": 0.4, "z": 0 },
            "material": {
              "type": "basic",
              "color": "#a67c52"
            }
          },
          {
            "id": "chair_backrest",
            "primitive": "box",
            "dimensions": { "width": 0.5, "height": 0.4, "depth": 0.05 },
            "position": { "x": 0, "y": 0.625, "z": -0.225 },
            "material": {
              "type": "basic",
              "color": "#a67c52"
            }
          },
          {
            "id": "chair_leg_1",
            "primitive": "cylinder",
            "dimensions": { "radiusTop": 0.025, "radiusBottom": 0.025, "height": 0.4 },
            "position": { "x": -0.225, "y": 0.2, "z": 0.225 },
            "material": {
              "type": "basic",
              "color": "#555555"
            }
          },
          {
            "id": "chair_leg_2",
            "primitive": "cylinder",
            "dimensions": { "radiusTop": 0.025, "radiusBottom": 0.025, "height": 0.4 },
            "position": { "x": 0.225, "y": 0.2, "z": 0.225 },
            "material": {
              "type": "basic",
              "color": "#555555"
            }
          },
          {
            "id": "chair_leg_3",
            "primitive": "cylinder",
            "dimensions": { "radiusTop": 0.025, "radiusBottom": 0.025, "height": 0.4 },
            "position": { "x": -0.225, "y": 0.2, "z": -0.225 },
            "material": {
              "type": "basic",
              "color": "#555555"
            }
          },
          {
            "id": "chair_leg_4",
            "primitive": "cylinder",
            "dimensions": { "radiusTop": 0.025, "radiusBottom": 0.025, "height": 0.4 },
            "position": { "x": 0.225, "y": 0.2, "z": -0.225 },
            "material": {
              "type": "basic",
              "color": "#555555"
            }
          }
        ]
      }
    ],
    "settings": {
      "backgroundColor": "#f8f9fa",
      "shadows": true,
      "ambientLight": {
        "color": "#ffffff",
        "intensity": 0.5
      },
      "directionalLight": [
        {
          "color": "#ffffff",
          "intensity": 1,
          "position": { "x": 5, "y": 5, "z": 5 },
          "castShadow": true
        }
      ]
    }
  }
};

// For better compatibility with all devices, create a version of the chair with basic materials
const compatibleChairExample = {
  ...chairExample,
  components: chairExample.components.map(component => ({
    ...component,
    material: {
      ...component.material,
      type: 'basic' as MaterialType // Override to use basic material
    }
  })),
  groups: chairExample.groups?.map(group => ({
    ...group,
    components: group.components.map(component => ({
      ...component,
      material: {
        ...component.material,
        type: 'basic' as MaterialType // Override to use basic material
      }
    }))
  }))
};

// Create a compatible scene example using basic materials
const compatibleSceneExample = {
  ...sceneExample,
  objects: [compatibleChairExample]
};

// Convert all sample JSON to use basic materials for better compatibility
const convertAndMakeSafe = (jsonData: any): Scene => {
  try {
    // First convert to standard format
    const scene = convertToStandardFormat(jsonData);
    
    // Then make all materials basic for maximum compatibility
    if (scene.objects) {
      scene.objects = scene.objects.map(obj => {
        // Update direct components
        if (obj.components) {
          obj.components = obj.components.map(comp => ({
            ...comp,
            material: {
              ...comp.material,
              type: 'basic' as MaterialType
            }
          }));
        }
        
        // Update components in groups
        if (obj.groups) {
          obj.groups = obj.groups.map(group => ({
            ...group,
            components: group.components.map(comp => ({
              ...comp,
              material: {
                ...comp.material,
                type: 'basic' as MaterialType
              }
            }))
          }));
        }
        
        return obj;
      });
    }
    
    return scene;
  } catch (error) {
    console.error("Error converting scene:", error);
    // Return a minimal valid scene if conversion fails
    return {
      name: "Fallback Safe Scene",
      objects: []
    };
  }
};

// Living room template
const livingRoomJson: Scene = {
  name: "Cozy Living Room",
  units: "meters",
  settings: {
    backgroundColor: "#e0e0e0",
    shadows: true,
    ambientLight: {
      color: "#ffffff",
      intensity: 0.6
    },
    directionalLight: [
      {
        color: "#ffffff",
        intensity: 0.8,
        position: {
          x: -5,
          y: 8,
          z: 6
        },
        castShadow: true
      }
    ]
  },
  objects: [
    {
      id: "floor_plane_001",
      name: "Room Floor",
      type: "structure" as ModelType,
      subtype: "floor" as ModelSubtype,
      position: {
        x: 0,
        y: -0.025,
        z: 0
      },
      rotation: {
        x: 0,
        y: 0,
        z: 0
      },
      components: [
        {
          id: "floor_surface",
          geometry: {
            type: "box" as const,
            dimensions: {
              width: 8.0,
              height: 0.05,
              depth: 8.0
            }
          },
          position: {
            x: 0,
            y: 0,
            z: 0
          },
          material: {
            type: "basic" as MaterialType,
            color: "#b0a08a",
            roughness: 0.8
          },
          castShadow: false,
          receiveShadow: true
        }
      ]
    },
    {
      id: "rug_001",
      name: "Area Rug",
      type: "decor" as ModelType,
      subtype: "rug" as ModelSubtype,
      position: {
        x: 0,
        y: 0.01,
        z: 1.0
      },
      rotation: {
        x: 0,
        y: 0,
        z: 0
      },
      components: [
        {
          id: "rug_surface",
          geometry: {
            type: "box" as const,
            dimensions: {
              width: 2.5,
              height: 0.01,
              depth: 1.8
            }
          },
          position: {
            x: 0,
            y: 0,
            z: 0
          },
          material: {
            type: "basic" as MaterialType,
            color: "#6d5e50",
            roughness: 0.9
          },
          castShadow: false,
          receiveShadow: true
        }
      ]
    },
    {
      id: "sofa_instance_001",
      name: "Modern Sofa",
      type: "furniture" as ModelType,
      subtype: "sofa" as ModelSubtype,
      position: {
        x: 0,
        y: 0,
        z: -1.5
      },
      rotation: {
        x: 0,
        y: 0,
        z: 0
      },
      components: [
        {
          id: "sofa_base_inst1",
          geometry: {
            type: "box" as const,
            dimensions: {
              width: 1.8,
              height: 0.15,
              depth: 0.8
            }
          },
          position: {
            x: 0,
            y: 0.075,
            z: 0
          },
          material: {
            type: "basic" as MaterialType,
            color: "#3a4a6d",
            roughness: 0.9
          },
          castShadow: true,
          receiveShadow: true
        },
        {
          id: "sofa_seat_inst1",
          geometry: {
            type: "box" as const,
            dimensions: {
              width: 1.8,
              height: 0.15,
              depth: 0.7
            }
          },
          position: {
            x: 0,
            y: 0.225,
            z: 0.05
          },
          material: {
            type: "basic" as MaterialType,
            color: "#3a4a6d",
            roughness: 0.9
          },
          castShadow: true,
          receiveShadow: true
        },
        {
          id: "sofa_back_inst1",
          geometry: {
            type: "box" as const,
            dimensions: {
              width: 1.8,
              height: 0.5,
              depth: 0.15
            }
          },
          position: {
            x: 0,
            y: 0.5,
            z: -0.325
          },
          material: {
            type: "basic" as MaterialType,
            color: "#3a4a6d",
            roughness: 0.9
          },
          castShadow: true,
          receiveShadow: true
        },
        {
          id: "sofa_armrest_left_inst1",
          geometry: {
            type: "box" as const,
            dimensions: {
              width: 0.15,
              height: 0.3,
              depth: 0.8
            }
          },
          position: {
            x: -0.825,
            y: 0.35,
            z: 0
          },
          material: {
            type: "basic" as MaterialType,
            color: "#3a4a6d",
            roughness: 0.9
          },
          castShadow: true,
          receiveShadow: true
        },
        {
          id: "sofa_armrest_right_inst1",
          geometry: {
            type: "box" as const,
            dimensions: {
              width: 0.15,
              height: 0.3,
              depth: 0.8
            }
          },
          position: {
            x: 0.825,
            y: 0.35,
            z: 0
          },
          material: {
            type: "basic" as MaterialType,
            color: "#3a4a6d",
            roughness: 0.9
          },
          castShadow: true,
          receiveShadow: true
        }
      ]
    },
    {
      id: "coffeetable_instance_001",
      name: "Coffee Table",
      type: "furniture" as ModelType,
      subtype: "table" as ModelSubtype,
      position: {
        x: 0,
        y: 0,
        z: 0.8
      },
      rotation: {
        x: 0,
        y: 0,
        z: 0
      },
      components: [
        {
          id: "table_top_inst1",
          geometry: {
            type: "box" as const,
            dimensions: {
              width: 1.2,
              height: 0.05,
              depth: 0.6
            }
          },
          position: {
            x: 0,
            y: 0.4,
            z: 0
          },
          material: {
            type: "basic" as MaterialType,
            color: "#5d4037",
            roughness: 0.7
          },
          castShadow: true,
          receiveShadow: true
        }
      ],
      groups: [
        {
          id: "legs_group_inst1",
          name: "Legs",
          components: [
            {
              id: "table_leg_fl_inst1",
              geometry: {
                type: "cylinder" as const,
                dimensions: {
                  radiusTop: 0.02,
                  radiusBottom: 0.02,
                  height: 0.4
                }
              },
              position: {
                x: -0.55,
                y: 0.2,
                z: 0.25
              },
              material: {
                type: "basic" as MaterialType,
                color: "#333333",
                metalness: 0.8,
                roughness: 0.2
              },
              castShadow: true,
              receiveShadow: true
            },
            {
              id: "table_leg_fr_inst1",
              geometry: {
                type: "cylinder" as const,
                dimensions: {
                  radiusTop: 0.02,
                  radiusBottom: 0.02,
                  height: 0.4
                }
              },
              position: {
                x: 0.55,
                y: 0.2,
                z: 0.25
              },
              material: {
                type: "basic" as MaterialType,
                color: "#333333",
                metalness: 0.8,
                roughness: 0.2
              },
              castShadow: true,
              receiveShadow: true
            },
            {
              id: "table_leg_bl_inst1",
              geometry: {
                type: "cylinder" as const,
                dimensions: {
                  radiusTop: 0.02,
                  radiusBottom: 0.02,
                  height: 0.4
                }
              },
              position: {
                x: -0.55,
                y: 0.2,
                z: -0.25
              },
              material: {
                type: "basic" as MaterialType,
                color: "#333333",
                metalness: 0.8,
                roughness: 0.2
              },
              castShadow: true,
              receiveShadow: true
            },
            {
              id: "table_leg_br_inst1",
              geometry: {
                type: "cylinder" as const,
                dimensions: {
                  radiusTop: 0.02,
                  radiusBottom: 0.02,
                  height: 0.4
                }
              },
              position: {
                x: 0.55,
                y: 0.2,
                z: -0.25
              },
              material: {
                type: "basic" as MaterialType,
                color: "#333333",
                metalness: 0.8,
                roughness: 0.2
              },
              castShadow: true,
              receiveShadow: true
            }
          ]
        }
      ]
    },
    {
      id: "chair_instance_001",
      name: "Safe Chair",
      type: "furniture" as ModelType,
      subtype: "chair" as ModelSubtype,
      position: {
        x: -1.5,
        y: 0,
        z: 0.8
      },
      rotation: {
        x: 0,
        y: 30,
        z: 0
      },
      components: [
        {
          id: "chair_seat_inst1",
          geometry: {
            type: "box" as const,
            dimensions: {
              width: 0.5,
              height: 0.05,
              depth: 0.5
            }
          },
          position: {
            x: 0,
            y: 0.4,
            z: 0
          },
          material: {
            type: "basic" as MaterialType,
            color: "#a67c52"
          },
          castShadow: true,
          receiveShadow: true
        },
        {
          id: "chair_backrest_inst1",
          geometry: {
            type: "box" as const,
            dimensions: {
              width: 0.5,
              height: 0.4,
              depth: 0.05
            }
          },
          position: {
            x: 0,
            y: 0.625,
            z: -0.225
          },
          material: {
            type: "basic" as MaterialType,
            color: "#a67c52"
          },
          castShadow: true,
          receiveShadow: true
        }
      ],
      groups: [
        {
          id: "legs_group_ch_inst1",
          name: "Legs",
          components: [
            {
              id: "chair_leg_1_inst1",
              geometry: {
                type: "cylinder" as const,
                dimensions: {
                  radiusTop: 0.025,
                  radiusBottom: 0.025,
                  height: 0.4
                }
              },
              position: {
                x: -0.225,
                y: 0.2,
                z: 0.225
              },
              material: {
                type: "basic" as MaterialType,
                color: "#555555"
              },
              castShadow: true,
              receiveShadow: true
            },
            {
              id: "chair_leg_2_inst1",
              geometry: {
                type: "cylinder" as const,
                dimensions: {
                  radiusTop: 0.025,
                  radiusBottom: 0.025,
                  height: 0.4
                }
              },
              position: {
                x: 0.225,
                y: 0.2,
                z: 0.225
              },
              material: {
                type: "basic" as MaterialType,
                color: "#555555"
              },
              castShadow: true,
              receiveShadow: true
            },
            {
              id: "chair_leg_3_inst1",
              geometry: {
                type: "cylinder" as const,
                dimensions: {
                  radiusTop: 0.025,
                  radiusBottom: 0.025,
                  height: 0.4
                }
              },
              position: {
                x: -0.225,
                y: 0.2,
                z: -0.225
              },
              material: {
                type: "basic" as MaterialType,
                color: "#555555"
              },
              castShadow: true,
              receiveShadow: true
            },
            {
              id: "chair_leg_4_inst1",
              geometry: {
                type: "cylinder" as const,
                dimensions: {
                  radiusTop: 0.025,
                  radiusBottom: 0.025,
                  height: 0.4
                }
              },
              position: {
                x: 0.225,
                y: 0.2,
                z: -0.225
              },
              material: {
                type: "basic" as MaterialType,
                color: "#555555"
              },
              castShadow: true,
              receiveShadow: true
            }
          ]
        }
      ]
    }
  ]
};

// Template models for quick starting
const templateScenes = [
  { id: 'scene-full', name: 'Complete Room', scene: compatibleSceneExample, icon: <CircleUser size={24} /> },
  { id: 'living-room', name: 'Cozy Living Room', scene: livingRoomJson, icon: <Home size={24} /> },
  { id: 'chair-simple', name: 'Simple Chair', scene: convertAndMakeSafe(simpleSafeChairJson), icon: <Armchair size={24} /> },
  { id: 'sofa-modern', name: 'Modern Sofa', scene: convertAndMakeSafe(sampleSofaJson), icon: <Sofa size={24} /> },
  { id: 'table-coffee', name: 'Coffee Table', scene: convertAndMakeSafe(sampleTableJson), icon: <Table size={24} /> }
];

export function ModelBrowser() {
  const [selectedScene, setSelectedScene] = useState<Scene>(sceneExample);
  const [activeTab, setActiveTab] = useQueryState('tab', { defaultValue: 'studio' });
  
  const handleSelectTemplate = (scene: Scene) => {
    try {
      // Apply some cleanup to ensure we don't carry over problematic state
      // between templates
      setSelectedScene(scene);
      
      // Small delay to ensure clean switching
      setTimeout(() => {
        setActiveTab('studio');
      }, 50);
    } catch (error) {
      console.error("Error selecting template:", error);
      // Fallback to a minimal scene
      const fallbackScene: Scene = {
        name: "Fallback Scene",
        objects: []
      };
      setSelectedScene(fallbackScene);
      setActiveTab('studio');
    }
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
          <ModelDocumentation />
        </TabsContent>
      </Tabs>
    </div>
  )
} 