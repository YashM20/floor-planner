// Material types
export type MaterialType = 'standard' | 'basic' | 'phong' | 'lambert' | 'metal' | 'wood' | 'glass' | 'laminate' | 'fabric' | 'plastic' | 'ceramic' | 'leather' | 'custom';

// Position, rotation and scale can be specified as arrays or objects
export type Vector3 = [number, number, number] | { x: number, y: number, z: number };

export interface Material {
  type: MaterialType;
  color: string;
  opacity?: number;
  metalness?: number;
  roughness?: number;
  wireframe?: boolean;
  textureMap?: string;
  normalMap?: string;
  bumpMap?: string;
  envMap?: string;
  reflectivity?: number;
  refractionRatio?: number;
  emissive?: string;
  emissiveIntensity?: number;
  clearcoat?: number;
  clearcoatRoughness?: number;
  aoMap?: string;
  aoMapIntensity?: number;
}

export interface Transformation {
  position: Vector3;
  rotation?: Vector3;
  scale?: Vector3;
}

export interface PrimitiveBox {
  type: 'box';
  dimensions: {
    width?: number;
    height?: number;
    depth?: number;
  };
}

export interface PrimitiveCylinder {
  type: 'cylinder';
  dimensions: {
    radiusTop?: number;
    radiusBottom?: number;
    radius?: number;
    height?: number;
    segments?: number;
  };
}

export interface PrimitiveSphere {
  type: 'sphere';
  dimensions: {
    radius?: number;
    segments?: number;
  };
}

export interface PrimitivePlane {
  type: 'plane';
  dimensions: {
    width?: number;
    height?: number;
  };
}

export type Primitive = PrimitiveBox | PrimitiveCylinder | PrimitiveSphere | PrimitivePlane;

export interface CustomGeometry {
  path: string;
  format: 'gltf' | 'glb' | 'obj' | 'fbx' | 'json';
}

// Component represents a single 3D object
export interface Component {
  id: string;
  name?: string;
  primitive?: string;
  geometry: Primitive | CustomGeometry;
  position?: Vector3;
  rotation?: Vector3;
  scale?: Vector3;
  transformation?: Transformation;
  material: Material;
  castShadow?: boolean;
  receiveShadow?: boolean;
  visible?: boolean;
}

// Group is a collection of components
export interface Group {
  id: string;
  name?: string;
  components: Component[];
  position?: Vector3;
  rotation?: Vector3;
  scale?: Vector3;
  transformation?: Transformation;
  visible?: boolean;
}

// Type definitions for model categories
export type ModelType = 'furniture' | 'structure' | 'decor' | 'fixture' | 'appliance' | 'custom';
export type ModelSubtype = 'chair' | 'table' | 'sofa' | 'bed' | 'cabinet' | 'bookshelf' | 'wall' | 'floor' | 'ceiling' | 'door' | 'window' | 'light' | 'plant' | 'art' | 'rug' | 'curtain' | 'kitchen' | 'bathroom' | 'custom';

// Model represents a complete 3D object (could be furniture, structure, etc.)
export interface Model {
  id: string;
  name: string;
  type: ModelType;
  subtype?: ModelSubtype;
  description?: string;
  position?: Vector3;
  rotation?: Vector3;
  scale?: Vector3;
  transformation?: Transformation;
  components: Component[];
  groups?: Group[];
  tags?: string[];
  metadata?: Record<string, any>;
}

// Scene represents a complete 3D scene with multiple models
export interface Scene {
  id?: string;
  name: string;
  version?: string;
  units?: 'meters' | 'centimeters' | 'inches' | 'feet';
  objects: Model[];
  settings?: {
    backgroundColor?: string;
    environmentMap?: string;
    shadows?: boolean;
    ambientLight?: {
      color?: string;
      intensity?: number;
    };
    directionalLight?: {
      color?: string;
      intensity?: number;
      position?: Vector3;
      castShadow?: boolean;
    }[];
    fog?: {
      type: 'linear' | 'exponential';
      color: string;
      near?: number;
      far?: number;
      density?: number;
    };
  };
}

// Utility function to convert between vector formats
export const normalizeVector3 = (vec: Vector3): [number, number, number] => {
  if (Array.isArray(vec)) {
    return vec as [number, number, number];
  }
  return [vec.x, vec.y, vec.z];
};

// Function to convert from the simplified JSON format to our internal model format
export const convertJsonToModel = (jsonData: any): Scene => {
  // Check if the input is already in our internal format
  if (jsonData.objects && Array.isArray(jsonData.objects)) {
    return jsonData as Scene;
  }

  // Handle case where the input is the scene structure with nested objects
  if (jsonData.scene) {
    const scene = jsonData.scene;
    const sceneObjects: Model[] = [];

    // Process each object in the scene
    if (scene.objects && Array.isArray(scene.objects)) {
      scene.objects.forEach((obj: any) => {
        const components: Component[] = [];

        // Process components for each object
        if (obj.components && Array.isArray(obj.components)) {
          obj.components.forEach((comp: any) => {
            // Create a primitive based on the type
            let geometry: Primitive | CustomGeometry;
            
            if (comp.primitive === 'box') {
              geometry = {
                type: 'box',
                dimensions: comp.dimensions || { width: 1, height: 1, depth: 1 }
              };
            } else if (comp.primitive === 'cylinder') {
              geometry = {
                type: 'cylinder',
                dimensions: comp.dimensions || { radiusTop: 0.5, radiusBottom: 0.5, height: 1 }
              };
            } else if (comp.primitive === 'sphere') {
              geometry = {
                type: 'sphere',
                dimensions: comp.dimensions || { radius: 0.5 }
              };
            } else if (comp.primitive === 'plane') {
              geometry = {
                type: 'plane',
                dimensions: comp.dimensions || { width: 1, height: 1 }
              };
            } else if (comp.path) { // Custom geometry with a path
              geometry = {
                path: comp.path,
                format: comp.format || 'gltf'
              };
            } else {
              // Default to box if primitive type is not recognized
              geometry = {
                type: 'box',
                dimensions: { width: 1, height: 1, depth: 1 }
              };
            }

            // Create the component with all properties
            components.push({
              id: comp.id,
              name: comp.name,
              geometry: geometry,
              position: comp.position,
              rotation: comp.rotation,
              scale: comp.scale,
              material: {
                type: (comp.material?.type || 'standard') as MaterialType,
                color: comp.material?.color || '#cccccc',
                metalness: comp.material?.metalness,
                roughness: comp.material?.roughness,
                textureMap: comp.material?.texture
              },
              castShadow: comp.castShadow !== undefined ? comp.castShadow : true,
              receiveShadow: comp.receiveShadow !== undefined ? comp.receiveShadow : true
            });
          });
        }

        // Add the processed object to the scene
        sceneObjects.push({
          id: obj.id,
          name: obj.name || 'Unnamed Object',
          type: (obj.type || 'furniture') as ModelType,
          subtype: obj.subtype,
          position: obj.position,
          rotation: obj.rotation,
          scale: obj.scale,
          components: components
        });
      });
    }

    // Return the processed scene
    return {
      name: scene.name || 'Unnamed Scene',
      units: scene.units || 'meters',
      objects: sceneObjects,
      settings: scene.settings
    };
  }

  // If the format doesn't match expectations, return a minimal valid scene
  return {
    name: 'Converted Scene',
    objects: []
  };
};

// Sample chair model for testing
export const chairExample: Model = {
  id: 'chair-001',
  name: 'Basic Office Chair',
  type: 'furniture',
  subtype: 'chair',
  components: [
    {
      id: 'seat',
      name: 'Chair Seat',
      geometry: {
        type: 'box',
        dimensions: { width: 0.4, height: 0.05, depth: 0.4 }
      },
      transformation: {
        position: [0, 0.4, 0]
      },
      material: {
        type: 'standard',
        color: '#8B4513',
        roughness: 0.7
      },
      castShadow: true
    },
    {
      id: 'backrest',
      name: 'Chair Backrest',
      geometry: {
        type: 'box',
        dimensions: { width: 0.4, height: 0.3, depth: 0.05 }
      },
      transformation: {
        position: [0, 0.55, -0.2],
      },
      material: {
        type: 'standard',
        color: '#8B4513',
        roughness: 0.7
      },
      castShadow: true
    }
  ],
  groups: [
    {
      id: 'legs',
      name: 'Chair Legs',
      components: [
        {
          id: 'leg-1',
          name: 'Front Left Leg',
          geometry: {
            type: 'cylinder',
            dimensions: { radiusTop: 0.02, radiusBottom: 0.02, height: 0.4 }
          },
          transformation: {
            position: [-0.15, 0.2, 0.15],
          },
          material: {
            type: 'metal',
            color: '#A0522D',
            metalness: 0.8,
            roughness: 0.2
          },
          castShadow: true
        },
        {
          id: 'leg-2',
          name: 'Front Right Leg',
          geometry: {
            type: 'cylinder',
            dimensions: { radiusTop: 0.02, radiusBottom: 0.02, height: 0.4 }
          },
          transformation: {
            position: [0.15, 0.2, 0.15],
          },
          material: {
            type: 'metal',
            color: '#A0522D',
            metalness: 0.8,
            roughness: 0.2
          },
          castShadow: true
        },
        {
          id: 'leg-3',
          name: 'Back Left Leg',
          geometry: {
            type: 'cylinder',
            dimensions: { radiusTop: 0.02, radiusBottom: 0.02, height: 0.4 }
          },
          transformation: {
            position: [-0.15, 0.2, -0.15],
          },
          material: {
            type: 'metal',
            color: '#A0522D',
            metalness: 0.8,
            roughness: 0.2
          },
          castShadow: true
        },
        {
          id: 'leg-4',
          name: 'Back Right Leg',
          geometry: {
            type: 'cylinder',
            dimensions: { radiusTop: 0.02, radiusBottom: 0.02, height: 0.4 }
          },
          transformation: {
            position: [0.15, 0.2, -0.15],
          },
          material: {
            type: 'metal',
            color: '#A0522D',
            metalness: 0.8,
            roughness: 0.2
          },
          castShadow: true
        }
      ]
    }
  ]
};

// Create a basic scene with the chair example
export const sceneExample: Scene = {
  name: 'Example Room',
  units: 'meters',
  objects: [chairExample],
  settings: {
    backgroundColor: '#f8f9fa',
    shadows: true,
    ambientLight: {
      color: '#ffffff',
      intensity: 0.5
    },
    directionalLight: [
      {
        color: '#ffffff',
        intensity: 1,
        position: [10, 10, 10],
        castShadow: true
      }
    ]
  }
}; 