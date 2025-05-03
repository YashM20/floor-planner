'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { useQueryState } from 'nuqs'
import { Copy, Check } from 'lucide-react'

interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
}

function CodeBlock({ code, language = 'json', filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative my-4">
      {filename && (
        <div className="bg-secondary/80 text-xs px-3 py-1 rounded-t-md font-mono text-muted-foreground">
          {filename}
        </div>
      )}
      <div className="relative">
        <pre className={`bg-secondary/50 p-4 rounded-md overflow-auto text-sm ${filename ? 'rounded-t-none' : ''}`}>
          <code className={`language-${language}`}>{code}</code>
        </pre>
        <Button
          size="sm"
          variant="ghost"
          className="absolute top-2 right-2 h-8 w-8 p-0"
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="sr-only">Copy code</span>
        </Button>
      </div>
    </div>
  )
}

function DocSection({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      {children}
    </div>
  )
}

function DocSubsection({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="mt-6 mb-4">
      <h4 className="text-lg font-medium mb-2">{title}</h4>
      {children}
    </div>
  )
}

export function ModelDocumentation() {
  const [docTab, setDocTab] = useQueryState('docTab', { defaultValue: 'scene' })

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-2xl font-bold mb-6">3D Model Schema Documentation</h2>

          <Tabs value={docTab} onValueChange={setDocTab} className="w-full">
            <TabsList className="mb-6 grid grid-cols-5 w-full">
              <TabsTrigger value="scene">Scene</TabsTrigger>
              <TabsTrigger value="model">Model</TabsTrigger>
              <TabsTrigger value="component">Component</TabsTrigger>
              <TabsTrigger value="validation">Validation</TabsTrigger>
              <TabsTrigger value="guides">Guides</TabsTrigger>
            </TabsList>

            <TabsContent value="scene" className="space-y-6">
              <DocSection title="Scene Structure">
                <p className="mb-3">
                  A scene is the top-level container for all 3D objects and environment settings.
                </p>
                <CodeBlock
                  code={`{
  "scene": {                         // Optional wrapper object
    "id": "unique_scene_id",         // Optional string
    "name": "Room Name",             // Required string
    "version": "1.0",                // Optional string
    "units": "meters",               // Optional: "meters" | "centimeters" | "inches" | "feet"
    "objects": [ ... ],              // Required array of Model objects
    "settings": { ... }              // Optional scene settings
  }
}`}
                  filename="scene-structure.json"
                />

                <DocSubsection title="Scene Settings">
                  <p className="mb-2">Configure environment settings like lighting and background.</p>
                  <CodeBlock
                    code={`"settings": {
  "backgroundColor": "#f1f5f9",      // Optional hex color
  "environmentMap": "url/to/map",    // Optional URL to environment map
  "shadows": true,                   // Optional boolean
  
  "ambientLight": {
    "color": "#ffffff",              // Optional hex color
    "intensity": 0.5                 // Optional number 0-10
  },
  
  "directionalLight": [              // Optional array of directional lights
    {
      "color": "#ffffff",            // Optional hex color
      "intensity": 1.0,              // Optional number 0-10
      "position": {                  // Optional Vector3
        "x": 10, "y": 10, "z": 5
      },
      "castShadow": true             // Optional boolean
    }
  ],
  
  "fog": {                           // Optional fog settings
    "type": "linear",                // Required: "linear" | "exponential"
    "color": "#e0e0e0",              // Required hex color
    "near": 1,                       // Optional (for linear fog) - positive number
    "far": 100,                      // Optional (for linear fog) - positive number
    "density": 0.05                  // Optional (for exponential fog) - positive number
  }
}`}
                    filename="scene-settings.json"
                  />
                </DocSubsection>
              </DocSection>
            </TabsContent>

            <TabsContent value="model" className="space-y-6">
              <DocSection title="Model Structure">
                <p className="mb-3">
                  Models represent individual furniture or structural items in the scene.
                </p>
                <CodeBlock
                  code={`{
  "id": "unique_model_id",           // Required string
  "name": "Model Name",              // Required string
  "type": "furniture",               // Required: "furniture" | "structure" | "decor" | "fixture" | "appliance" | "custom"
  "subtype": "chair",                // Optional: "chair" | "table" | "sofa" | "bed" | "cabinet" | "bookshelf" | "wall" |
                                     // "floor" | "ceiling" | "door" | "window" | "light" | "plant" | "art" |
                                     // "rug" | "curtain" | "kitchen" | "bathroom" | "custom"
  "description": "Description",      // Optional string
  
  // Position, rotation, and scale can be defined directly or within transformation
  "position": { "x": 0, "y": 0, "z": 0 },              // Optional Vector3
  "rotation": { "x": 0, "y": 0, "z": 0 },              // Optional Vector3 (in radians)
  "scale": { "x": 1, "y": 1, "z": 1 },                 // Optional Vector3
  
  // Alternative format with transformation object
  "transformation": {
    "position": { "x": 0, "y": 0, "z": 0 },            // Required Vector3
    "rotation": { "x": 0, "y": 0, "z": 0 },            // Optional Vector3 (in radians)
    "scale": { "x": 1, "y": 1, "z": 1 }                // Optional Vector3
  },
  
  "components": [ ... ],             // Required array of Component objects
  "groups": [ ... ],                 // Optional array of Group objects
  "tags": [ "tag1", "tag2" ],        // Optional array of strings
  "metadata": {                      // Optional key-value pairs
    "key1": "value1",
    "key2": "value2"
  }
}`}
                  filename="model-structure.json"
                />
              </DocSection>

              <DocSection title="Groups">
                <p className="mb-3">
                  Groups allow you to organize multiple components together for easier manipulation.
                </p>
                <CodeBlock
                  code={`{
  "id": "group_id",                  // Required string
  "name": "Group Name",              // Optional string
  "components": [ ... ],             // Required array of Component objects
  
  // Position, rotation, and scale can be defined directly or within transformation
  "position": { "x": 0, "y": 0, "z": 0 },              // Optional Vector3
  "rotation": { "x": 0, "y": 0, "z": 0 },              // Optional Vector3 (in radians)
  "scale": { "x": 1, "y": 1, "z": 1 },                 // Optional Vector3
  
  // Alternative format with transformation object
  "transformation": {
    "position": { "x": 0, "y": 0, "z": 0 },            // Required Vector3
    "rotation": { "x": 0, "y": 0, "z": 0 },            // Optional Vector3 (in radians)
    "scale": { "x": 1, "y": 1, "z": 1 }                // Optional Vector3
  },
  
  "visible": true                    // Optional boolean (default: true)
}`}
                  filename="group-structure.json"
                />
              </DocSection>
            </TabsContent>

            <TabsContent value="component" className="space-y-6">
              <DocSection title="Components">
                <p className="mb-3">
                  Components are the basic building blocks that make up a model, using primitive shapes or custom geometry.
                </p>
                <CodeBlock
                  code={`{
  "id": "component_id",              // Required string
  "name": "Component Name",          // Optional string
  "primitive": "box",                // Optional string (deprecated, use geometry instead)
  
  // Position, rotation, and scale can be defined directly or within transformation
  "position": { "x": 0, "y": 0, "z": 0 },              // Optional Vector3
  "rotation": { "x": 0, "y": 0, "z": 0 },              // Optional Vector3 (in radians)
  "scale": { "x": 1, "y": 1, "z": 1 },                 // Optional Vector3
  
  // Alternative format with transformation object
  "transformation": {
    "position": { "x": 0, "y": 0, "z": 0 },            // Required Vector3
    "rotation": { "x": 0, "y": 0, "z": 0 },            // Optional Vector3 (in radians)
    "scale": { "x": 1, "y": 1, "z": 1 }                // Optional Vector3
  },
  
  "material": {                      // Required material definition
    "type": "standard",              // Required: "standard" | "basic" | "phong" | "lambert" | 
                                     // "metal" | "wood" | "glass" | "laminate" | "fabric" | 
                                     // "plastic" | "ceramic" | "leather" | "custom"
    "color": "#ff0000",              // Required hex color
    "opacity": 1.0,                  // Optional number (0-1)
    "metalness": 0.0,                // Optional number (0-1)
    "roughness": 0.5,                // Optional number (0-1)
    "wireframe": false,              // Optional boolean
    "textureMap": "url/to/texture",  // Optional URL
    "normalMap": "url/to/map",       // Optional URL
    "bumpMap": "url/to/map",         // Optional URL
    "envMap": "url/to/map",          // Optional URL
    "reflectivity": 0.5,             // Optional number (0-1)
    "refractionRatio": 0.5,          // Optional number (0-1)
    "emissive": "#000000",           // Optional hex color
    "emissiveIntensity": 1.0,        // Optional number (≥0)
    "clearcoat": 0.0,                // Optional number (0-1)
    "clearcoatRoughness": 0.0,       // Optional number (0-1)
    "aoMap": "url/to/map",           // Optional URL
    "aoMapIntensity": 1.0            // Optional number (≥0)
  },
  
  "castShadow": true,                // Optional boolean (default: true)
  "receiveShadow": true,             // Optional boolean (default: true)
  "visible": true                    // Optional boolean (default: true)
}`}
                  filename="component-structure.json"
                />
              </DocSection>

              <DocSection title="Geometry Types">
                <DocSubsection title="Box Geometry">
                  <CodeBlock
                    code={`"geometry": {
  "type": "box",
  "dimensions": {
    "width": 1.0,                  // Optional positive number (default: 1)
    "height": 1.0,                 // Optional positive number (default: 1)
    "depth": 1.0                   // Optional positive number (default: 1)
  }
}`}
                    filename="box-geometry.json"
                  />
                </DocSubsection>

                <DocSubsection title="Cylinder Geometry">
                  <CodeBlock
                    code={`"geometry": {
  "type": "cylinder",
  "dimensions": {
    "radiusTop": 0.5,              // Optional positive number (default: 0.5)
    "radiusBottom": 0.5,           // Optional positive number (default: 0.5)
    "radius": 0.5,                 // Optional positive number, shorthand for both radii
    "height": 1.0,                 // Optional positive number (default: 1)
    "segments": 32                 // Optional positive integer (default: 32)
  }
}`}
                    filename="cylinder-geometry.json"
                  />
                </DocSubsection>

                <DocSubsection title="Sphere Geometry">
                  <CodeBlock
                    code={`"geometry": {
  "type": "sphere",
  "dimensions": {
    "radius": 0.5,                 // Optional positive number (default: 0.5)
    "segments": 32                 // Optional positive integer (default: 32)
  }
}`}
                    filename="sphere-geometry.json"
                  />
                </DocSubsection>

                <DocSubsection title="Plane Geometry">
                  <CodeBlock
                    code={`"geometry": {
  "type": "plane",
  "dimensions": {
    "width": 1.0,                  // Optional positive number (default: 1)
    "height": 1.0                  // Optional positive number (default: 1)
  }
}`}
                    filename="plane-geometry.json"
                  />
                </DocSubsection>

                <DocSubsection title="Custom Geometry">
                  <CodeBlock
                    code={`"geometry": {
  "path": "url/to/model",          // Required URL string
  "format": "gltf"                 // Required: "gltf" | "glb" | "obj" | "fbx" | "json"
}`}
                    filename="custom-geometry.json"
                  />
                </DocSubsection>
              </DocSection>

              <DocSection title="Vector3 Formats">
                <p className="mb-3">
                  Vector3 values (position, rotation, scale) can be specified in two formats:
                </p>
                <CodeBlock
                  code={`// Object format
{ "x": 0, "y": 1, "z": 2 }

// Array format
[0, 1, 2]  // x, y, z`}
                  filename="vector3-formats.json"
                />
              </DocSection>
            </TabsContent>

            <TabsContent value="validation" className="space-y-6">
              <DocSection title="Validation Rules">
                <p className="mb-3">All data is validated using Zod schemas that enforce these constraints:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>IDs</strong>: Must be non-empty strings</li>
                  <li><strong>Names</strong>: Required strings for models and scenes</li>
                  <li><strong>Colors</strong>: Must be valid hex codes (e.g., #FF0000 or #F00)</li>
                  <li><strong>Material properties</strong>: Numeric values like opacity, metalness, and roughness must be between 0 and 1</li>
                  <li><strong>Dimensions</strong>: All dimensions must be positive numbers</li>
                  <li><strong>URLs</strong>: Must be valid URL strings</li>
                  <li><strong>Enums</strong>: Values like material type, model type, and subtype must match predefined options</li>
                  <li><strong>Arrays</strong>: Components array is required and cannot be empty for models</li>
                  <li><strong>Types</strong>: Each field enforces specific types (string, number, boolean, object, array)</li>
                </ul>
              </DocSection>

              <DocSection title="Schema Definitions">
                <p className="mb-3">Examples of the Zod schemas used for validation:</p>
                <CodeBlock
                  code={`// Material validation
const MaterialSchema = z.object({
  type: z.enum([
    'standard', 'basic', 'phong', 'lambert', 'metal', 
    'wood', 'glass', 'laminate', 'fabric', 'plastic', 
    'ceramic', 'leather', 'custom'
  ]),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/),
  opacity: z.number().min(0).max(1).optional(),
  metalness: z.number().min(0).max(1).optional(),
  roughness: z.number().min(0).max(1).optional(),
  // ...other properties
});

// Vector3 schema supports both array [x,y,z] and object {x,y,z} formats
const Vector3Schema = z.union([
  z.tuple([z.number(), z.number(), z.number()]),
  z.object({ x: z.number(), y: z.number(), z: z.number() })
]);

// Component schema
const ComponentSchema = z.object({
  id: z.string().min(1),
  name: z.string().optional(),
  // ...other fields
});

// Models must have at least one component
const ModelSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  type: ModelTypeSchema,
  // ...other fields
  components: z.array(ComponentSchema).min(1),
  // ...more fields
});`}
                  language="typescript"
                  filename="model-schema-zod.ts"
                />
              </DocSection>

              <DocSection title="Helper Functions">
                <p className="text-blue-700 mb-2">The application provides validation helper functions:</p>
                <CodeBlock
                  code={`// Validate a scene object
function validateScene(data: unknown): ZodScene {
  try {
    // Try parsing as a wrapped scene first
    const parsed = WrappedSceneSchema.safeParse(data);
    if (parsed.success) {
      return parsed.data.scene;
    }
    
    // Try parsing as a direct scene
    const directScene = SceneSchema.parse(data);
    return directScene;
  } catch (error) {
    // If both fail, throw the validation error
    throw SceneSchema.parse(data);
  }
}

// Validate a model object
function validateModel(data: unknown): ZodModel {
  return ModelSchema.parse(data);
}`}
                  language="typescript"
                  filename="model-schema-zod.ts"
                />
              </DocSection>
            </TabsContent>

            <TabsContent value="guides" className="space-y-6">
              <DocSection title="Best Practices">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Use the <strong>basic</strong> material type for maximum compatibility across devices</li>
                  <li>Prefer object notation for Vector3 values for better readability</li>
                  <li>Group related components together using the groups feature</li>
                  <li>Keep dimensions reasonable (preferably under 10 units in any dimension)</li>
                  <li>Use descriptive IDs and names</li>
                  <li>Implement proper nesting: scenes contain models, models contain components/groups</li>
                  <li>Add metadata for any custom properties needed by your application</li>
                </ul>
              </DocSection>

              <DocSection title="Common Issues and Solutions">
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Materials not rendering correctly:</strong> Use basic material type for compatibility</li>
                  <li><strong>Objects not visible:</strong> Check position coordinates and camera position</li>
                  <li><strong>Validation errors:</strong> Ensure all required fields are present and match expected formats</li>
                  <li><strong>Performance issues:</strong> Reduce the number of components or use simpler geometries</li>
                  <li><strong>Shadows not appearing:</strong> Verify castShadow/receiveShadow properties and scene lighting settings</li>
                </ul>
              </DocSection>

              <DocSection title="Example: Complete Chair">
                <p className="mb-3">Here's a complete example of a chair model:</p>
                <CodeBlock
                  code={`{
  "id": "chair_001",
  "type": "furniture",
  "subtype": "chair",
  "name": "Modern Chair",
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
}`}
                  filename="example-chair.json"
                />
              </DocSection>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
} 