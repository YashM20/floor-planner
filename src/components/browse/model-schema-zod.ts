import { z } from 'zod';

// Material types
export const MaterialTypeSchema = z.enum([
  'standard', 'basic', 'phong', 'lambert', 'metal', 'wood', 'glass', 
  'laminate', 'fabric', 'plastic', 'ceramic', 'leather', 'custom'
]);

// Vector3 can be array [x,y,z] or object {x,y,z}
export const Vector3ArraySchema = z.tuple([z.number(), z.number(), z.number()]);
export const Vector3ObjectSchema = z.object({
  x: z.number(),
  y: z.number(),
  z: z.number()
});
export const Vector3Schema = z.union([Vector3ArraySchema, Vector3ObjectSchema]);

// Material with validation
export const MaterialSchema = z.object({
  type: MaterialTypeSchema,
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: "Color must be a valid hex color code (e.g., #FF0000)"
  }),
  opacity: z.number().min(0).max(1).optional(),
  metalness: z.number().min(0).max(1).optional(),
  roughness: z.number().min(0).max(1).optional(),
  wireframe: z.boolean().optional(),
  textureMap: z.string().url().optional(),
  normalMap: z.string().url().optional(),
  bumpMap: z.string().url().optional(),
  envMap: z.string().url().optional(),
  reflectivity: z.number().min(0).max(1).optional(),
  refractionRatio: z.number().min(0).max(1).optional(),
  emissive: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).optional(),
  emissiveIntensity: z.number().min(0).optional(),
  clearcoat: z.number().min(0).max(1).optional(),
  clearcoatRoughness: z.number().min(0).max(1).optional(),
  aoMap: z.string().url().optional(),
  aoMapIntensity: z.number().min(0).optional()
});

// Transformation schema
export const TransformationSchema = z.object({
  position: Vector3Schema,
  rotation: Vector3Schema.optional(),
  scale: Vector3Schema.optional()
});

// Primitive shapes
export const PrimitiveBoxSchema = z.object({
  type: z.literal('box'),
  dimensions: z.object({
    width: z.number().positive().default(1).optional(),
    height: z.number().positive().default(1).optional(),
    depth: z.number().positive().default(1).optional()
  })
});

export const PrimitiveCylinderSchema = z.object({
  type: z.literal('cylinder'),
  dimensions: z.object({
    radiusTop: z.number().positive().default(0.5).optional(),
    radiusBottom: z.number().positive().default(0.5).optional(),
    radius: z.number().positive().default(0.5).optional(),
    height: z.number().positive().default(1).optional(),
    segments: z.number().int().positive().default(32).optional()
  })
});

export const PrimitiveSphereSchema = z.object({
  type: z.literal('sphere'),
  dimensions: z.object({
    radius: z.number().positive().default(0.5).optional(),
    segments: z.number().int().positive().default(32).optional()
  })
});

export const PrimitivePlaneSchema = z.object({
  type: z.literal('plane'),
  dimensions: z.object({
    width: z.number().positive().default(1).optional(),
    height: z.number().positive().default(1).optional()
  })
});

export const PrimitiveSchema = z.discriminatedUnion('type', [
  PrimitiveBoxSchema,
  PrimitiveCylinderSchema,
  PrimitiveSphereSchema,
  PrimitivePlaneSchema
]);

// Custom geometry
export const CustomGeometrySchema = z.object({
  path: z.string().url(),
  format: z.enum(['gltf', 'glb', 'obj', 'fbx', 'json'])
});

// Component schema
export const ComponentSchema = z.object({
  id: z.string().min(1),
  name: z.string().optional(),
  primitive: z.string().optional(),
  geometry: z.union([PrimitiveSchema, CustomGeometrySchema]),
  position: Vector3Schema.optional(),
  rotation: Vector3Schema.optional(),
  scale: Vector3Schema.optional(),
  transformation: TransformationSchema.optional(),
  material: MaterialSchema,
  castShadow: z.boolean().default(true).optional(),
  receiveShadow: z.boolean().default(true).optional(),
  visible: z.boolean().default(true).optional()
});

// Group schema
export const GroupSchema = z.object({
  id: z.string().min(1),
  name: z.string().optional(),
  components: z.array(ComponentSchema),
  position: Vector3Schema.optional(),
  rotation: Vector3Schema.optional(),
  scale: Vector3Schema.optional(),
  transformation: TransformationSchema.optional(),
  visible: z.boolean().default(true).optional()
});

// Model types and subtypes
export const ModelTypeSchema = z.enum([
  'furniture', 'structure', 'decor', 'fixture', 'appliance', 'custom'
]);

export const ModelSubtypeSchema = z.enum([
  'chair', 'table', 'sofa', 'bed', 'cabinet', 'bookshelf', 'wall', 'floor', 
  'ceiling', 'door', 'window', 'light', 'plant', 'art', 'rug', 'curtain', 
  'kitchen', 'bathroom', 'custom'
]);

// Model schema
export const ModelSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  type: ModelTypeSchema,
  subtype: ModelSubtypeSchema.optional(),
  description: z.string().optional(),
  position: Vector3Schema.optional(),
  rotation: Vector3Schema.optional(),
  scale: Vector3Schema.optional(),
  transformation: TransformationSchema.optional(),
  components: z.array(ComponentSchema),
  groups: z.array(GroupSchema).optional(),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.string(), z.any()).optional()
});

// Lighting schemas
export const AmbientLightSchema = z.object({
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).optional(),
  intensity: z.number().min(0).max(10).optional()
});

export const DirectionalLightSchema = z.object({
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).optional(),
  intensity: z.number().min(0).max(10).optional(),
  position: Vector3Schema.optional(),
  castShadow: z.boolean().optional()
});

export const FogSchema = z.object({
  type: z.enum(['linear', 'exponential']),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/),
  near: z.number().positive().optional(),
  far: z.number().positive().optional(),
  density: z.number().positive().optional()
});

// Scene settings schema
export const SceneSettingsSchema = z.object({
  backgroundColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).optional(),
  environmentMap: z.string().url().optional(),
  shadows: z.boolean().optional(),
  ambientLight: AmbientLightSchema.optional(),
  directionalLight: z.array(DirectionalLightSchema).optional(),
  fog: FogSchema.optional()
});

// Scene schema
export const SceneSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  version: z.string().optional(),
  units: z.enum(['meters', 'centimeters', 'inches', 'feet']).optional(),
  objects: z.array(ModelSchema),
  settings: SceneSettingsSchema.optional()
});

// Simplified scene schema (for the wrapped structure with a 'scene' property)
export const WrappedSceneSchema = z.object({
  scene: SceneSchema
});

// Combined schema that accepts either format
export const ValidateScene = z.union([SceneSchema, WrappedSceneSchema]);

// Type inference helpers
export type ZodMaterial = z.infer<typeof MaterialSchema>;
export type ZodComponent = z.infer<typeof ComponentSchema>;
export type ZodGroup = z.infer<typeof GroupSchema>;
export type ZodModel = z.infer<typeof ModelSchema>;
export type ZodScene = z.infer<typeof SceneSchema>;

/**
 * Validates a complete scene object or a wrapped scene object
 * @param data The scene data to validate
 * @returns The validated scene data or throws a validation error
 */
export function validateScene(data: unknown): ZodScene {
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

/**
 * Validates a model object
 * @param data The model data to validate
 * @returns The validated model data or throws a validation error
 */
export function validateModel(data: unknown): ZodModel {
  return ModelSchema.parse(data);
} 