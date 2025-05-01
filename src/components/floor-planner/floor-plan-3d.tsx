'use client'

import { useMemo, useState, useEffect } from 'react'
import { useFloorPlanStore } from '@/store/floor-plan-store'
import { ThreeElements, useThree } from '@react-three/fiber'
import { Text, Box } from '@react-three/drei'
import * as THREE from 'three'

type FloorPlan3DProps = {
  wireframe?: boolean
} & ThreeElements['group']

type TextureMap = {
  [key: string]: THREE.Texture
}

export function FloorPlan3D({ wireframe = false, ...props }: FloorPlan3DProps) {
  const { roomsData, wallHeight, floorStyle, wallStyle, selectedRoom } = useFloorPlanStore()
  
  // Create fallback textures instead of trying to load external files
  const fallbackFloorTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const context = canvas.getContext('2d')
    if (context) {
      context.fillStyle = '#c9c9c9'
      context.fillRect(0, 0, 256, 256)
      context.lineWidth = 2
      context.strokeStyle = '#a5a5a5'
      context.beginPath()
      for (let i = 0; i < 256; i += 32) {
        context.moveTo(0, i)
        context.lineTo(256, i)
        context.moveTo(i, 0)
        context.lineTo(i, 256)
      }
      context.stroke()
    }
    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(0.5, 0.5)
    return texture
  }, [])
  
  const fallbackWallTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const context = canvas.getContext('2d')
    if (context) {
      context.fillStyle = '#e0e0e0'
      context.fillRect(0, 0, 256, 256)
    }
    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(1, 1)
    return texture
  }, [])
  
  // Helper function to create colored textures
  function createColoredTexture(color: string, brightness: number): THREE.Texture {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const context = canvas.getContext('2d')
    if (context) {
      context.fillStyle = color
      context.fillRect(0, 0, 256, 256)
      
      // Add some noise for texture
      for (let i = 0; i < 5000; i++) {
        const x = Math.random() * 256
        const y = Math.random() * 256
        const gray = Math.random() * 30 - 15
        context.fillStyle = `rgba(${gray},${gray},${gray},0.2)`
        context.fillRect(x, y, 2, 2)
      }
    }
    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(2, 2)
    return texture
  }
  
  // Create custom colored textures based on style names
  const floorTextures = useMemo<TextureMap>(() => {
    return {
      wooden: createColoredTexture('#a1662f', 0.8),
      tile: createColoredTexture('#d9d9d9', 0.95),
      marble: createColoredTexture('#f5f5f5', 0.9),
      concrete: createColoredTexture('#9e9e9e', 0.85),
      carpet: createColoredTexture('#6d4c41', 0.7),
    }
  }, [])
  
  const wallTextures = useMemo<TextureMap>(() => {
    return {
      white: createColoredTexture('#ffffff', 0.95),
      beige: createColoredTexture('#f5f5dc', 0.92),
      gray: createColoredTexture('#9e9e9e', 0.9),
      brick: createColoredTexture('#bc4c2a', 0.8),
      wallpaper: createColoredTexture('#b3cde0', 0.85),
    }
  }, [])
  
  // Materials
  const floorMaterial = useMemo(() => {
    const texture = floorTextures[floorStyle] || fallbackFloorTexture
    return new THREE.MeshStandardMaterial({ 
      map: texture, 
      wireframe: wireframe,
      roughness: 0.8,
      metalness: 0.2
    })
  }, [floorTextures, floorStyle, wireframe, fallbackFloorTexture])
  
  const wallMaterial = useMemo(() => {
    const texture = wallTextures[wallStyle] || fallbackWallTexture
    return new THREE.MeshStandardMaterial({ 
      map: texture, 
      wireframe: wireframe,
      roughness: 0.9,
      metalness: 0.1
    })
  }, [wallTextures, wallStyle, wireframe, fallbackWallTexture])
  
  // Generate room meshes
  const rooms = useMemo(() => {
    return roomsData.map((room) => {
      const isSelected = selectedRoom === room.id
      
      // Floor - always at y=0
      const floor = (
        <Box
          key={`floor-${room.id}`}
          args={[room.width, 0.1, room.length]} // width, height, depth
          position={[room.position.x, 0, room.position.z]}
          material={floorMaterial}
          receiveShadow
        >
          {/* Optional floor label */}
          {isSelected && (
            <Text
              position={[0, 0.06, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={0.3}
              color="#000000"
              anchorX="center"
              anchorY="middle"
            >
              {room.type}
            </Text>
          )}
        </Box>
      )
      
      // Walls
      const wallThickness = 0.15
      const halfWidth = room.width / 2
      const halfLength = room.length / 2
      const halfHeight = wallHeight / 2
      
      // North wall (along positive Z)
      const northWall = (
        <Box
          key={`north-wall-${room.id}`}
          args={[room.width, wallHeight, wallThickness]}
          position={[
            room.position.x,
            halfHeight,
            room.position.z + halfLength
          ]}
          material={wallMaterial}
          castShadow
          receiveShadow
        />
      )
      
      // South wall (along negative Z)
      const southWall = (
        <Box
          key={`south-wall-${room.id}`}
          args={[room.width, wallHeight, wallThickness]}
          position={[
            room.position.x,
            halfHeight,
            room.position.z - halfLength
          ]}
          material={wallMaterial}
          castShadow
          receiveShadow
        />
      )
      
      // East wall (along positive X)
      const eastWall = (
        <Box
          key={`east-wall-${room.id}`}
          args={[wallThickness, wallHeight, room.length]}
          position={[
            room.position.x + halfWidth,
            halfHeight,
            room.position.z
          ]}
          material={wallMaterial}
          castShadow
          receiveShadow
        />
      )
      
      // West wall (along negative X)
      const westWall = (
        <Box
          key={`west-wall-${room.id}`}
          args={[wallThickness, wallHeight, room.length]}
          position={[
            room.position.x - halfWidth,
            halfHeight,
            room.position.z
          ]}
          material={wallMaterial}
          castShadow
          receiveShadow
        />
      )
      
      return (
        <group key={room.id}>
          {floor}
          {northWall}
          {southWall}
          {eastWall}
          {westWall}
        </group>
      )
    })
  }, [roomsData, wallHeight, floorMaterial, wallMaterial, selectedRoom])
  
  return (
    <group {...props}>
      {rooms}
    </group>
  )
} 