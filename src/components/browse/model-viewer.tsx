'use client'

import { Suspense, useState, useCallback, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { 
  OrbitControls, 
  Environment, 
  Grid, 
  PerspectiveCamera,
  Stats,
  Html,
  useProgress,
  ContactShadows,
  AccumulativeShadows,
  RandomizedLight,
  useHelper,
  SoftShadows
} from '@react-three/drei'
import * as THREE from 'three'
import { Scene, Model, chairExample, sceneExample, normalizeVector3 } from './model-schema'
import { ModelRenderer } from './model-renderer'

// Loading state component
function Loader() {
  const { progress, item, loaded, total } = useProgress()
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
        <span className="mt-2 text-sm text-gray-500">{progress.toFixed(0)}% loaded</span>
        {item && (
          <span className="mt-1 text-xs text-gray-400">
            Loading: {item} ({loaded}/{total})
          </span>
        )}
      </div>
    </Html>
  )
}

// Helper component for directional light with shadow visualization in dev mode
function DirectionalLightWithHelper({ 
  position, 
  intensity, 
  color, 
  castShadow = true,
  showHelper = false 
}: { 
  position: [number, number, number], 
  intensity?: number, 
  color?: string,
  castShadow?: boolean,
  showHelper?: boolean
}) {
  const lightRef = useRef<THREE.DirectionalLight>(null)
  
  // Optionally show light helper in development
  // Only show helper if explicitly requested and in development mode
  useEffect(() => {
    if (showHelper && lightRef.current && process.env.NODE_ENV === 'development') {
      const helper = new THREE.DirectionalLightHelper(lightRef.current, 1, color || '#ffffff')
      lightRef.current.add(helper)
      
      return () => {
        if (lightRef.current) {
          lightRef.current.remove(helper)
        }
      }
    }
  }, [showHelper, color])
  
  return (
    <directionalLight
      ref={lightRef}
      position={position}
      intensity={intensity || 1}
      color={color || '#ffffff'}
      castShadow={castShadow}
      shadow-mapSize={[2048, 2048]}
      shadow-normalBias={0.05}
      shadow-camera-left={-10}
      shadow-camera-right={10}
      shadow-camera-top={10}
      shadow-camera-bottom={-10}
      shadow-camera-near={0.1}
      shadow-camera-far={40}
      shadow-radius={3}
    />
  )
}

type ModelViewerProps = {
  scene?: Scene;
  model?: Model;
  showGrid?: boolean;
  showStats?: boolean;
  showAxes?: boolean;
  showShadows?: boolean;
  showHelpers?: boolean;
  backgroundColor?: string;
  environmentPreset?: 'sunset' | 'dawn' | 'night' | 'warehouse' | 'forest' | 'apartment' | 'studio' | 'city' | 'park' | 'lobby';
  height?: number | string;
  width?: number | string;
  onSelectComponent?: (id: string) => void;
  cameraPosition?: [number, number, number];
  autoRotate?: boolean;
  softShadows?: boolean;
}

export function ModelViewer({ 
  scene = sceneExample,
  model,
  showGrid = true,
  showStats = false,
  showAxes = false,
  showShadows = true,
  showHelpers = false,
  backgroundColor,
  environmentPreset = 'studio',
  height = 500,
  width = '100%',
  onSelectComponent,
  cameraPosition = [3, 3, 3],
  autoRotate = false,
  softShadows = true
}: ModelViewerProps) {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null)
  
  // Determine which model(s) to render
  let modelsToRender: Model[] = []
  
  if (model) {
    // If a specific model is provided, just render that one
    modelsToRender = [model]
  } else if (scene && scene.objects) {
    // Otherwise render all objects in the scene
    modelsToRender = scene.objects
  }
  
  // Handle applying scene settings
  const resolvedBackgroundColor = backgroundColor || scene?.settings?.backgroundColor || '#f1f5f9'
  const enableShadows = scene?.settings?.shadows !== undefined ? scene.settings.shadows : showShadows
  
  const handleComponentSelect = useCallback((id: string) => {
    setSelectedComponent(id)
    onSelectComponent?.(id)
  }, [onSelectComponent])

  return (
    <div style={{ width, height, position: 'relative' }}>
      <Canvas
        shadows={enableShadows}
        dpr={[1, 2]} // Responsive pixel ratio
        camera={{ position: cameraPosition, fov: 50 }}
        gl={{ 
          antialias: true,
          // Improved rendering
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
      >
        <color attach="background" args={[resolvedBackgroundColor]} />
        
        {/* Optional soft shadows for better visual quality */}
        {softShadows && enableShadows && <SoftShadows />}
        
        <Suspense fallback={<Loader />}>
          {/* Environment lighting */}
          <Environment preset={environmentPreset} background={false} />
          
          {/* Main lighting */}
          {scene?.settings?.ambientLight ? (
            <ambientLight 
              intensity={scene.settings.ambientLight.intensity || 0.5} 
              color={scene.settings.ambientLight.color || '#ffffff'} 
            />
          ) : (
            <ambientLight intensity={0.5} />
          )}
          
          {/* Directional lights */}
          {scene?.settings?.directionalLight && scene.settings.directionalLight.length > 0 ? (
            // Use lights from scene settings
            scene.settings.directionalLight.map((light, index) => (
              <DirectionalLightWithHelper 
                key={index}
                position={normalizeVector3(light.position || [10, 10, 5]) as [number, number, number]}
                intensity={light.intensity}
                color={light.color}
                castShadow={light.castShadow}
                showHelper={showHelpers}
              />
            ))
          ) : (
            // Default light
            <DirectionalLightWithHelper 
              position={[10, 10, 5]} 
              intensity={1} 
              showHelper={showHelpers}
            />
          )}
          
          {/* Floor grid */}
          {showGrid && <Grid 
            infiniteGrid 
            fadeDistance={50}
            fadeStrength={1.5}
            cellSize={0.5} 
            cellThickness={0.5} 
            sectionSize={2} 
            sectionThickness={1}
            sectionColor="#9d4b4b" 
            cellColor="#6f6f6f"
          />}
          
          {/* Axes helper */}
          {showAxes && <axesHelper args={[5]} />}
          
          {/* Contact shadows for realistic grounding */}
          {enableShadows && (
            <ContactShadows 
              position={[0, -0.01, 0]} 
              opacity={0.4} 
              scale={10} 
              blur={1.5} 
              far={10} 
            />
          )}
          
          {/* 3D Model(s) */}
          <group>
            {modelsToRender.map(modelItem => (
              <ModelRenderer 
                key={modelItem.id} 
                model={modelItem} 
                onSelect={handleComponentSelect} 
                autoRotate={autoRotate}
              />
            ))}
          </group>
          
          {/* Camera controls */}
          <OrbitControls 
            makeDefault
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            minDistance={1}
            maxDistance={50}
            minPolarAngle={0}
            maxPolarAngle={Math.PI / 2}
          />
          
          {/* Optional performance stats */}
          {showStats && <Stats className="stats" />}
        </Suspense>
      </Canvas>
      
      {/* Optional UI overlay for the selected component */}
      {selectedComponent && (
        <div className="absolute bottom-4 left-4 right-4 bg-white/80 backdrop-blur-sm p-3 rounded-md shadow-md text-sm">
          <p className="font-medium">Selected: {selectedComponent}</p>
        </div>
      )}
    </div>
  )
} 