'use client'

import { useMemo, useEffect } from 'react'
import * as THREE from 'three'
import { Text } from '@react-three/drei'
// import { CSG } from 'three-bvh-csg' // Import CSG if needed later for openings
import { useFloorPlanStore } from '@/store/use-floor-plan-store'
import type { Room, WallSegment, Point } from '@/types/floor-plan'

type FloorPlan3DProps = {
  wireframe?: boolean
}

type TextureMap = {
  [key: string]: THREE.Texture
}

// --- Constants --- 
const PIXELS_PER_METER = 50 
const DEFAULT_WALL_THICKNESS_METERS = 0.15
const UP_AXIS: 'y' | 'z' = 'y' 
const PLANE_AXES: ['x' | 'y' | 'z', 'x' | 'y' | 'z'] = ['x', 'z'] 

// --- Texture Helper --- 
function createColoredTexture (color: string): THREE.Texture {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const context = canvas.getContext('2d')
  if (context) {
    context.fillStyle = color
    context.fillRect(0, 0, 64, 64)
    context.fillStyle = 'rgba(0,0,0,0.05)'
    for (let i = 0; i < 64; i += 8) {
      context.fillRect(0, i, 64, 1)
      context.fillRect(i, 0, 1, 64)
    }
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(4, 4)
  return texture
}

// --- Geometry Helpers ---
function worldCoords(p: Point, centerX: number, centerY: number, scale: number): THREE.Vector3 {
  const worldX = (p.x - centerX) / scale
  const worldZ = (p.y - centerY) / scale // Assuming y in 2D maps to z in 3D
  
  const pos = new THREE.Vector3()
  pos[PLANE_AXES[0]] = worldX
  pos[UP_AXIS] = 0 // Initially on the ground plane
  pos[PLANE_AXES[1]] = worldZ
  return pos
}

// --- Main Component --- 
export function FloorPlan3D ({ wireframe = false }: FloorPlan3DProps) {
  const {
    analysisResult,
    wallHeight, // User-defined height
    selectedFloorStyle,
    selectedWallStyle,
  } = useFloorPlanStore()

  useEffect(() => {
    console.log('[FloorPlan3D] Rendering with detailed analysis:', {
      hasAnalysisResult: !!analysisResult,
      roomsCount: analysisResult?.rooms?.length || 0,
      wallsCount: analysisResult?.walls?.length || 0,
      doorsCount: analysisResult?.doors?.length || 0,
      windowsCount: analysisResult?.windows?.length || 0,
      wallHeight,
      selectedFloorStyle,
      selectedWallStyle,
      wireframe
    })
  }, [analysisResult, wallHeight, selectedFloorStyle, selectedWallStyle, wireframe])

  const roomsData = analysisResult?.rooms || []
  const wallsData = analysisResult?.walls || []
  const doorsData = analysisResult?.doors || []
  const windowsData = analysisResult?.windows || []
  const overallDim = analysisResult?.overallDimensions
  const scale = analysisResult?.scale || PIXELS_PER_METER

  // --- Materials --- 
  const floorTextures = useMemo<TextureMap>(() => ({
    wood_light: createColoredTexture('#d4a77a'),
    paint_white: createColoredTexture('#e0e0e0')
  }), [])

  const wallTextures = useMemo<TextureMap>(() => ({
    wood_light: createColoredTexture('#d4a77a'),
    paint_white: createColoredTexture('#f0f0f0')
  }), [])

  const floorMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    map: floorTextures[selectedFloorStyle] || floorTextures.wood_light,
    side: THREE.DoubleSide,
    roughness: 0.8, metalness: 0.1, wireframe
  }), [selectedFloorStyle, floorTextures, wireframe])

  const wallMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    map: wallTextures[selectedWallStyle] || wallTextures.paint_white,
    side: THREE.DoubleSide,
    roughness: 0.9, metalness: 0.05, wireframe
  }), [selectedWallStyle, wallTextures, wireframe])

  // --- Geometry Generation --- 
  const floorMeshes = useMemo(() => {
    if (!analysisResult || !overallDim || roomsData.length === 0) return []
    console.log(`[FloorPlan3D] Generating ${roomsData.length} floor meshes...`)

    const centerX = overallDim.width / 2
    const centerY = overallDim.height / 2

    return roomsData.map((room: Room, index: number) => {
      if (!room.polygon || room.polygon.length < 3) return null

      const shapePoints = room.polygon.map(p => {
        const wc = worldCoords(p, centerX, centerY, scale)
        // Use the X and Z components for the 2D shape
        return new THREE.Vector2(wc[PLANE_AXES[0]], wc[PLANE_AXES[1]])
      })
      const roomShape = new THREE.Shape(shapePoints)
      const floorGeometry = new THREE.ShapeGeometry(roomShape)
      
      const floorPosition = new THREE.Vector3() // Positioned at world origin initially
      const floorRotation = new THREE.Euler()
      // Rotate floor to lie flat on XZ plane if UP_AXIS is Y
      if (UP_AXIS === 'y') {
         floorRotation.x = -Math.PI / 2
      } else { 
        // Handle other UP_AXIS if needed
      }

      // Calculate center for label
      const center2D = room.center || { x: centerX, y: centerY }
      const center3D = worldCoords(center2D, centerX, centerY, scale)
      center3D[UP_AXIS] = wallHeight / 2 // Position label in the middle of the room height

      return (
        <group key={room.id || `room-${index}`}>
          <mesh 
            geometry={floorGeometry} 
            material={floorMaterial} 
            position={floorPosition} 
            rotation={floorRotation}
            receiveShadow 
          />
          <Text
            position={center3D}
            fontSize={0.2 * (scale / PIXELS_PER_METER)}
            color="#333333"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.01}
            outlineColor="#ffffff"
          >
            {room.name || 'Room'}
          </Text>
        </group>
      )
    }).filter(Boolean)

  }, [analysisResult, overallDim, roomsData, scale, floorMaterial, wallHeight])

  const wallMeshes = useMemo(() => {
    if (!analysisResult || !overallDim || wallsData.length === 0) return []
    console.log(`[FloorPlan3D] Generating ${wallsData.length} wall meshes...`)

    const centerX = overallDim.width / 2
    const centerY = overallDim.height / 2

    return wallsData.map((wall: WallSegment, index: number) => {
      const start = worldCoords(wall.start, centerX, centerY, scale)
      const end = worldCoords(wall.end, centerX, centerY, scale)
      
      const length = start.distanceTo(end)
      const thickness = (wall.thickness || (DEFAULT_WALL_THICKNESS_METERS * scale)) / scale
      
      if (length === 0) {
         console.warn(`[FloorPlan3D] Wall ${wall.id || index} has zero length.`)
         return null
      }

      // Create a simple box geometry for the wall
      // Dimensions: length, height, thickness
      const wallGeometry = new THREE.BoxGeometry(length, wallHeight, thickness)

      // Calculate wall center position
      const wallCenter = new THREE.Vector3().lerpVectors(start, end, 0.5)
      wallCenter[UP_AXIS] = wallHeight / 2 // Center the wall vertically

      // Calculate rotation angle
      const angle = Math.atan2(
        end[PLANE_AXES[1]] - start[PLANE_AXES[1]],
        end[PLANE_AXES[0]] - start[PLANE_AXES[0]]
      )
      const wallRotation = new THREE.Euler()
      wallRotation[UP_AXIS] = angle // Rotate around the UP_AXIS

      // TODO: Implement openings using CSG or other methods
      // For now, just render the solid wall

      return (
        <mesh
          key={wall.id || `wall-${index}`}
          geometry={wallGeometry}
          material={wallMaterial}
          position={wallCenter}
          rotation={wallRotation}
          castShadow
          receiveShadow
        />
      )
    }).filter(Boolean)

  }, [analysisResult, overallDim, wallsData, scale, wallMaterial, wallHeight])


  // --- Final Render --- 
  return (
    <group position={[0, 0, 0]}> {/* Group to hold everything */}
      {/* --- Add a Ground Plane for Reference --- */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#888888" side={THREE.DoubleSide} />
      </mesh>
      
      {floorMeshes}
      {wallMeshes}
      
      {/* TODO: Render Doors and Windows */}
      
      {/* Remove the old test cube */}
      {/* 
      <mesh position={[0, wallHeight / 2, 0]}> 
        <boxGeometry args={[1, 1, 1]} /> 
        <meshStandardMaterial color="red" wireframe={false} />
      </mesh>
      */}
    </group>
  )
} 