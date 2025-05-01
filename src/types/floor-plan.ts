import { z } from 'zod'

// Schema for a point
export const PointSchema = z.object({ x: z.number(), y: z.number() })
export type Point = z.infer<typeof PointSchema>

// Schema for Wall Segment
export const WallSegmentSchema = z.object({
  id: z.string(),
  start: PointSchema,
  end: PointSchema,
  thickness: z.number().optional(), // Optional: AI might estimate thickness
})
export type WallSegment = z.infer<typeof WallSegmentSchema>

// Schema for Doors
export const DoorSchema = z.object({
  id: z.string(),
  wallId: z.string(), // ID of the wall segment it belongs to
  position: PointSchema, // Center point or one edge point on the wall line
  width: z.number(),
  swingDirection: z.enum(['inward', 'outward', 'sliding', 'none']).optional(),
})
export type Door = z.infer<typeof DoorSchema>

// Schema for Windows
export const WindowSchema = z.object({
  id: z.string(),
  wallId: z.string(), // ID of the wall segment it belongs to
  position: PointSchema, // Center point on the wall line
  width: z.number(),
  height: z.number().optional(), // Optional: Height from floor
  sillHeight: z.number().optional(), // Optional: Height from floor to bottom of window
})
export type Window = z.infer<typeof WindowSchema>

// Schema for a single detected object (e.g., furniture - kept simple for now)
export const FloorPlanObjectSchema = z.object({
  id: z.string(),
  label: z.string(), // e.g., "Sofa", "Table"
  boundingBox: z.object({
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number()
  }),
})
export type FloorPlanObject = z.infer<typeof FloorPlanObjectSchema>

// Schema for a single room
export const RoomSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  polygon: z.array(PointSchema), // Coordinates defining the room *floor* shape
  area: z.number().optional(),
  center: PointSchema.optional(),
  // Walls, doors, windows are now top-level or associated via IDs
  // objects: z.array(FloorPlanObjectSchema).optional(), 
  color: z.string().optional()
})
export type Room = z.infer<typeof RoomSchema>

// Schema for the overall floor plan analysis
export const FloorPlanAnalysisSchema = z.object({
  overallDimensions: z.object({
    width: z.number(),
    height: z.number()
  }),
  scale: z.number().optional(), // Pixels per meter/foot
  rooms: z.array(RoomSchema),
  walls: z.array(WallSegmentSchema),
  doors: z.array(DoorSchema),
  windows: z.array(WindowSchema),
  objects: z.array(FloorPlanObjectSchema).optional(), // General objects not in rooms
})
export type FloorPlanAnalysis = z.infer<typeof FloorPlanAnalysisSchema> 