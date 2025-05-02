'use client'

import { useMemo, useEffect } from 'react'
import * as THREE from 'three'
import { Html } from '@react-three/drei'
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

  // Add this useEffect to log the received analysisResult
  useEffect(() => {
    console.log('[FloorPlan3D] Received analysisResult from store:', analysisResult)
  }, [analysisResult])

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

  // Diagnostic logs for door and window data
  useEffect(() => {
    if (analysisResult) {
      console.log('[FloorPlan3D] DOORS DATA CHECK:', {
        doorsExist: !!doorsData,
        doorsIsArray: Array.isArray(doorsData),
        doorsLength: doorsData?.length,
        doorsData: doorsData
      });
      
      console.log('[FloorPlan3D] WINDOWS DATA CHECK:', {
        windowsExist: !!windowsData,
        windowsIsArray: Array.isArray(windowsData),
        windowsLength: windowsData?.length,
        windowsData: windowsData
      });
    }
  }, [analysisResult, doorsData, windowsData]);

  // Additional detailed effect to trace door meshes generation
  useEffect(() => {
    // Only run this if we have walls and doors data
    if (wallsData?.length && doorsData?.length) {
      console.log('[FloorPlan3D] Door generation prerequisites:', {
        haveWalls: wallsData.length > 0,
        wallIds: wallsData.map(w => w.id),
        haveDoors: doorsData.length > 0,
        doorWallIds: doorsData.map(d => d.wallId)
      });
      
      // Check if each door references a valid wall
      doorsData.forEach(door => {
        const wall = wallsData.find(w => w.id === door.wallId);
        console.log(`[FloorPlan3D] Door ${door.id} references wall ${door.wallId}: ${wall ? 'FOUND' : 'NOT FOUND'}`);
      });
    }
  }, [wallsData, doorsData]);

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

      // Calculate center for HTML label - position slightly above the floor
      const center2D = room.center || { x: centerX, y: centerY } 
      const labelPosition = worldCoords(center2D, centerX, centerY, scale)
      labelPosition[UP_AXIS] = 0.1 // Position 10cm above floor level

      return (
        <group key={room.id || `room-${index}`}>
          <mesh 
            geometry={floorGeometry} 
            material={floorMaterial} 
            position={floorPosition} 
            rotation={floorRotation}
            receiveShadow 
          />
          <Html 
            position={labelPosition} 
            center // Centers the HTML content block on the position
            className="select-none pointer-events-none" // Prevent interaction with label
            occlude // Optional: Make label hide behind walls (can remove if labels should always be visible)
            // distanceFactor={10} // Optional: Make label smaller further away
          >
            <div className="bg-background/70 backdrop-blur-sm text-foreground px-2 py-1 rounded text-xs whitespace-nowrap shadow">
              {room.name || 'Room'}
            </div>
          </Html>
        </group>
      )
    }).filter(Boolean)

  }, [analysisResult, overallDim, roomsData, scale, floorMaterial])

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

  // --- Door Geometry Generation ---
  const doorMeshes = useMemo(() => {
    console.log('[FloorPlan3D] Attempting to generate door meshes:', {
      hasAnalysisResult: !!analysisResult,
      hasOverallDim: !!overallDim,
      doorsDataLength: doorsData?.length || 0
    });
    
    if (!analysisResult || !overallDim || doorsData.length === 0) {
      console.log('[FloorPlan3D] Not generating door meshes - prerequisites not met');
      return [];
    }
    
    console.log(`[FloorPlan3D] Generating ${doorsData.length} door representations...`);

    const centerX = overallDim.width / 2;
    const centerY = overallDim.height / 2;

    const meshes = doorsData.map((door, index) => {
      // Find the wall this door belongs to
      const wall = wallsData.find(w => w.id === door.wallId);
      if (!wall) {
        console.warn(`[FloorPlan3D] Wall ${door.wallId} not found for door ${door.id}`);
        return null;
      }

      console.log(`[FloorPlan3D] Processing door ${door.id} on wall ${door.wallId}`);
      
      const wallStart = worldCoords(wall.start, centerX, centerY, scale);
      const wallEnd = worldCoords(wall.end, centerX, centerY, scale);
      const wallVector = new THREE.Vector3().subVectors(wallEnd, wallStart);
      const wallLength = wallVector.length();
      const wallAngle = Math.atan2(
        wallEnd[PLANE_AXES[1]] - wallStart[PLANE_AXES[1]],
        wallEnd[PLANE_AXES[0]] - wallStart[PLANE_AXES[0]]
      );

      // Find position along the wall
      // Assuming door.position is the center of the door on the 2D plan
      const doorCenter2D = door.position;
      const doorCenter3D = worldCoords(doorCenter2D, centerX, centerY, scale);
      
      // Simplified Door Representation
      const doorHeight = Math.min(2.1, wallHeight * 0.9); // Standard door height
      const doorWidth = door.width / scale;
      
      // Make door width slightly larger than wall thickness to ensure visibility
      const wallThicknessInMeters = (wall.thickness || DEFAULT_WALL_THICKNESS_METERS * scale) / scale;
      const doorThickness = wallThicknessInMeters * 1.2;

      const doorGeometry = new THREE.BoxGeometry(doorWidth, doorHeight, doorThickness);
      const doorMaterial = new THREE.MeshStandardMaterial({ 
        color: '#A5682A', // Wooden door color
        emissive: '#3D2314', // Subtle warm glow
        roughness: 0.7, 
        metalness: 0.2, 
        wireframe 
      });

      // Position the door center correctly
      doorCenter3D[UP_AXIS] = doorHeight / 2;
      
      // Align door rotation with the wall
      const doorRotation = new THREE.Euler();
      doorRotation[UP_AXIS] = wallAngle;

      return (
        <mesh
          key={door.id || `door-${index}`}
          geometry={doorGeometry}
          material={doorMaterial}
          position={doorCenter3D}
          rotation={doorRotation}
          castShadow
          receiveShadow
        />
      );
    }).filter(Boolean);
    
    return meshes;
  }, [analysisResult, overallDim, doorsData, wallsData, scale, wallHeight, wireframe]);


  // --- Window Geometry Generation ---
  const windowMeshes = useMemo(() => {
    console.log('[FloorPlan3D] Attempting to generate window meshes:', {
      hasAnalysisResult: !!analysisResult,
      hasOverallDim: !!overallDim,
      windowsDataLength: windowsData?.length || 0
    });
    
    if (!analysisResult || !overallDim || windowsData.length === 0) {
      console.log('[FloorPlan3D] Not generating window meshes - prerequisites not met');
      return [];
    }
    
    console.log(`[FloorPlan3D] Generating ${windowsData.length} window representations...`);

    const centerX = overallDim.width / 2;
    const centerY = overallDim.height / 2;

    // Standard window properties
    const windowHeight = 1.2; // meters
    const sillHeight = 0.9; // meters from floor

    const meshes = windowsData.map((window, index) => {
      // Find the wall this window belongs to
      const wall = wallsData.find(w => w.id === window.wallId);
      if (!wall) {
        console.warn(`[FloorPlan3D] Wall ${window.wallId} not found for window ${window.id}`);
        return null;
      }

      console.log(`[FloorPlan3D] Processing window ${window.id} on wall ${window.wallId}`);
      
      const wallStart = worldCoords(wall.start, centerX, centerY, scale);
      const wallEnd = worldCoords(wall.end, centerX, centerY, scale);
      const wallAngle = Math.atan2(
        wallEnd[PLANE_AXES[1]] - wallStart[PLANE_AXES[1]],
        wallEnd[PLANE_AXES[0]] - wallStart[PLANE_AXES[0]]
      );

      // Window positioning and dimensions
      const windowCenter2D = window.position;
      const windowCenter3D = worldCoords(windowCenter2D, centerX, centerY, scale);
      const windowWidth = window.width / scale;
      
      // Make window thickness slightly larger than wall thickness to ensure visibility
      const wallThicknessInMeters = (wall.thickness || DEFAULT_WALL_THICKNESS_METERS * scale) / scale;
      const windowThickness = wallThicknessInMeters * 1.2;

      // Position the window center correctly (vertically)
      windowCenter3D[UP_AXIS] = sillHeight + (windowHeight / 2);

      // Check if window exceeds wall height
      if ((sillHeight + windowHeight) > wallHeight) {
        console.warn(`[FloorPlan3D] Window ${window.id} exceeds wall height. Clamping.`);
      }

      // Window geometry and material
      const windowGeometry = new THREE.BoxGeometry(windowWidth, windowHeight, windowThickness);
      const windowMaterial = new THREE.MeshStandardMaterial({
        color: '#88CCEE', // Light blue for glass
        emissive: '#003366', // Subtle blue glow
        transparent: true,
        opacity: 0.7, // Somewhat transparent
        roughness: 0.1, // Smooth like glass
        metalness: 0.3,
        wireframe
      });

      // Align window rotation with the wall
      const windowRotation = new THREE.Euler();
      windowRotation[UP_AXIS] = wallAngle;

      return (
        <mesh
          key={window.id || `window-${index}`}
          geometry={windowGeometry}
          material={windowMaterial}
          position={windowCenter3D}
          rotation={windowRotation}
          castShadow
          receiveShadow
        />
      );
    }).filter(Boolean);
    
    console.log('[FloorPlan3D] Generated window meshes count:', meshes.length);
    return meshes;
  }, [analysisResult, overallDim, windowsData, wallsData, scale, wallHeight, wireframe]);

  // Add additional debugging for final render output
  useEffect(() => {
    if (analysisResult) {
      console.log('[FloorPlan3D] Final render output counts:', {
        floorMeshesCount: floorMeshes?.length || 0,
        wallMeshesCount: wallMeshes?.length || 0,
        doorMeshesCount: doorMeshes?.length || 0,
        windowMeshesCount: windowMeshes?.length || 0
      });
    }
  }, [analysisResult, floorMeshes, wallMeshes, doorMeshes, windowMeshes]);

      console.log('[FloorPlan3D] Render return - meshes status:', {
        floorMeshesPresent: !!floorMeshes && floorMeshes.length > 0,
        wallMeshesPresent: !!wallMeshes && wallMeshes.length > 0,
        doorMeshesPresent: !!doorMeshes && doorMeshes.length > 0,
        windowMeshesPresent: !!windowMeshes && windowMeshes.length > 0
      })
  return (
    <group position={[0, 0, 0]}> 
      
      {/* --- Add a Ground Plane for Reference --- */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#888888" side={THREE.DoubleSide} />
      </mesh>
      
      {floorMeshes}
      {wallMeshes}
      {doorMeshes}   {/* Render Doors */}
      {windowMeshes} {/* Render Windows */}
      
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