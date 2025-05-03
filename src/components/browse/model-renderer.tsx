'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { 
  Component, 
  CustomGeometry, 
  Group, 
  Material, 
  MaterialType, 
  Model, 
  Primitive, 
  Transformation, 
  Vector3,
  normalizeVector3
} from './model-schema'
import { useGLTF } from '@react-three/drei'

// Helper to map material type to Three.js material class
const getMaterialClass = (type: MaterialType): typeof THREE.Material => {
  try {
    switch (type) {
      case 'basic':
        return THREE.MeshBasicMaterial;
      case 'phong':
        return THREE.MeshPhongMaterial;
      case 'lambert':
        return THREE.MeshLambertMaterial;
      case 'standard':
      case 'metal':
      case 'wood':
      case 'glass':
      case 'laminate':
      case 'fabric':
      case 'plastic':
      case 'ceramic':
      case 'leather':
        // Check WebGL capabilities before returning MeshStandardMaterial
        try {
          // Create a simple test for WebGL capabilities
          const testCanvas = document.createElement('canvas');
          const gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl');
          
          if (!gl) {
            console.warn('WebGL not available, falling back to MeshPhongMaterial');
            return THREE.MeshPhongMaterial;
          }
          
          // Check if device has sufficient capabilities for PBR materials
          const extensions = [
            'EXT_shader_texture_lod',
            'WEBGL_draw_buffers'
          ];
          
          const hasRequiredExtensions = extensions.every(ext => 
            gl.getExtension(ext) !== null
          );
          
          return hasRequiredExtensions ? 
            THREE.MeshStandardMaterial : 
            THREE.MeshPhongMaterial;
        } catch (e) {
          console.warn('Error checking WebGL capabilities:', e);
          return THREE.MeshPhongMaterial;
        }
      default:
        return THREE.MeshStandardMaterial;
    }
  } catch (error) {
    console.error('Error in getMaterialClass:', error);
    return THREE.MeshBasicMaterial; // Ultimate fallback
  }
};

// Material creation based on material definition
const createMaterial = (material: Material): THREE.Material => {
  try {
    // Get the appropriate material class
    const MaterialClass = getMaterialClass(material.type);
    
    // Create basic properties common to all materials
    const materialProps: Record<string, any> = {
      color: material.color || '#cccccc',
      wireframe: material.wireframe || false
    };
    
    // For materials that support opacity
    if (material.opacity !== undefined && material.opacity < 1) {
      materialProps.transparent = true;
      materialProps.opacity = Math.max(0.01, Math.min(1, material.opacity)); // Clamp to valid range
    }
    
    // Add PBR properties for standard materials
    if (MaterialClass === THREE.MeshStandardMaterial) {
      // Set defaults based on material type first
      switch (material.type) {
        case 'metal':
          materialProps.metalness = 0.9;
          materialProps.roughness = 0.1;
          break;
        case 'wood':
          materialProps.metalness = 0.0;
          materialProps.roughness = 0.8;
          break;
        case 'glass':
          materialProps.metalness = 0.0;
          materialProps.roughness = 0.1;
          materialProps.transparent = true;
          materialProps.opacity = material.opacity ?? 0.5;
          break;
        case 'laminate':
          materialProps.metalness = 0.1;
          materialProps.roughness = 0.7;
          break;
        case 'fabric':
          materialProps.metalness = 0.0;
          materialProps.roughness = 0.9;
          break;
        case 'plastic':
          materialProps.metalness = 0.1;
          materialProps.roughness = 0.5;
          break;
        case 'ceramic':
          materialProps.metalness = 0.2;
          materialProps.roughness = 0.2;
          break;
        case 'leather':
          materialProps.metalness = 0.0;
          materialProps.roughness = 0.6;
          break;
        default:
          materialProps.metalness = 0.5;
          materialProps.roughness = 0.5;
      }
      
      // Now override with any explicitly provided values, ensuring they're in valid ranges
      if (material.metalness !== undefined) {
        materialProps.metalness = Math.max(0, Math.min(1, material.metalness));
      }
      if (material.roughness !== undefined) {
        materialProps.roughness = Math.max(0, Math.min(1, material.roughness));
      }
      
      // Only add these properties if the value is defined and valid
      if (material.clearcoat !== undefined && material.clearcoat >= 0) {
        materialProps.clearcoat = Math.min(1, material.clearcoat);
      }
      if (material.clearcoatRoughness !== undefined && material.clearcoatRoughness >= 0) {
        materialProps.clearcoatRoughness = Math.min(1, material.clearcoatRoughness);
      }
    }
    
    // Add maps if provided - with error handling for loading failures
    const loadTextureWithFallback = (url: string) => {
      try {
        const textureLoader = new THREE.TextureLoader();
        return textureLoader.load(url, 
          undefined, 
          undefined, 
          (err) => {
            console.error(`Failed to load texture: ${url}`, err);
            return undefined;
          }
        );
      } catch (err) {
        console.error(`Error creating texture loader for: ${url}`, err);
        return undefined;
      }
    };
    
    if (material.textureMap) {
      const texture = loadTextureWithFallback(material.textureMap);
      if (texture) materialProps.map = texture;
    }
    
    if (material.normalMap) {
      const texture = loadTextureWithFallback(material.normalMap);
      if (texture) materialProps.normalMap = texture;
    }
    
    if (material.bumpMap) {
      const texture = loadTextureWithFallback(material.bumpMap);
      if (texture) materialProps.bumpMap = texture;
    }
    
    if (material.envMap) {
      const texture = loadTextureWithFallback(material.envMap);
      if (texture) materialProps.envMap = texture;
    }
    
    if (material.emissive) {
      try {
        materialProps.emissive = new THREE.Color(material.emissive);
        if (material.emissiveIntensity !== undefined) {
          materialProps.emissiveIntensity = Math.max(0, material.emissiveIntensity);
        }
      } catch (err) {
        console.error('Invalid emissive color value:', material.emissive);
      }
    }
    
    // Create the material with try/catch to handle potential shader compilation errors
    try {
      // Create the appropriate material type based on the class returned
      if (MaterialClass === THREE.MeshStandardMaterial) {
        return new THREE.MeshStandardMaterial(materialProps);
      } else if (MaterialClass === THREE.MeshPhongMaterial) {
        return new THREE.MeshPhongMaterial(materialProps);
      } else if (MaterialClass === THREE.MeshLambertMaterial) {
        return new THREE.MeshLambertMaterial(materialProps);
      } else {
        return new THREE.MeshBasicMaterial(materialProps);
      }
    } catch (err) {
      console.error('Error creating material', err);
      // Fallback to a simpler material type if standard material fails
      if (MaterialClass === THREE.MeshStandardMaterial) {
        console.warn('Falling back to MeshBasicMaterial due to shader compilation error');
        return new THREE.MeshBasicMaterial({ color: material.color || '#cccccc' });
      }
      // Last resort fallback
      return new THREE.MeshBasicMaterial({ color: '#ff0000' });
    }
  } catch (error) {
    console.error('Error in createMaterial', error);
    // Ultimate fallback
    return new THREE.MeshBasicMaterial({ color: '#ff0000' });
  }
};

// Create geometry from primitive definition
const createGeometry = (primitive: Primitive): THREE.BufferGeometry => {
  switch (primitive.type) {
    case 'box':
      return new THREE.BoxGeometry(
        primitive.dimensions.width ?? 1,
        primitive.dimensions.height ?? 1,
        primitive.dimensions.depth ?? 1
      );
    case 'cylinder':
      return new THREE.CylinderGeometry(
        primitive.dimensions.radiusTop ?? primitive.dimensions.radius ?? 0.5,
        primitive.dimensions.radiusBottom ?? primitive.dimensions.radius ?? 0.5,
        primitive.dimensions.height ?? 1,
        primitive.dimensions.segments ?? 32
      );
    case 'sphere':
      return new THREE.SphereGeometry(
        primitive.dimensions.radius ?? 0.5,
        primitive.dimensions.segments ?? 32,
        primitive.dimensions.segments ?? 32
      );
    case 'plane':
      return new THREE.PlaneGeometry(
        primitive.dimensions.width ?? 1,
        primitive.dimensions.height ?? 1
      );
    default:
      return new THREE.BoxGeometry(1, 1, 1);
  }
};

// Apply transformation to a mesh
const applyTransformation = (mesh: THREE.Object3D, transformation: Transformation | undefined): void => {
  if (!transformation) return;
  
  if (transformation.position) {
    const [x, y, z] = normalizeVector3(transformation.position);
    mesh.position.set(x, y, z);
  }
  
  if (transformation.rotation) {
    const [x, y, z] = normalizeVector3(transformation.rotation);
    mesh.rotation.set(x, y, z);
  }
  
  if (transformation.scale) {
    const [x, y, z] = normalizeVector3(transformation.scale);
    mesh.scale.set(x, y, z);
  }
};

// Apply direct position, rotation, scale to a mesh
const applyDirectTransforms = (
  mesh: THREE.Object3D, 
  position?: Vector3, 
  rotation?: Vector3, 
  scale?: Vector3
): void => {
  if (position) {
    const [x, y, z] = normalizeVector3(position);
    mesh.position.set(x, y, z);
  }
  
  if (rotation) {
    const [x, y, z] = normalizeVector3(rotation);
    mesh.rotation.set(x, y, z);
  }
  
  if (scale) {
    const [x, y, z] = normalizeVector3(scale);
    mesh.scale.set(x, y, z);
  }
};

// Component to render a single component
const ModelComponent = ({ component, onSelect }: { component: Component, onSelect?: (id: string) => void }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Create the material
  const material = createMaterial(component.material);
  
  useEffect(() => {
    if (!meshRef.current) return;
    
    // Apply transformation
    if (component.transformation) {
      applyTransformation(meshRef.current, component.transformation);
    } else {
      // Apply direct transforms if provided
      applyDirectTransforms(
        meshRef.current, 
        component.position, 
        component.rotation, 
        component.scale
      );
    }
  }, [component]);
  
  // Handle primitive geometry
  if ('type' in component.geometry) {
    const geometry = createGeometry(component.geometry);

    return (
      <mesh
        ref={meshRef}
        geometry={geometry}
        material={material}
        castShadow={component.castShadow}
        receiveShadow={component.receiveShadow}
        visible={component.visible !== false}
        onClick={(e) => {
          e.stopPropagation();
          onSelect?.(component.id);
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      />
    );
  }
  
  // Handle custom geometry (GLTF/GLB models)
  return <CustomModel 
    geometry={component.geometry as CustomGeometry} 
    component={component} 
    onSelect={onSelect} 
  />;
};

// Component for handling custom models
const CustomModel = ({ 
  geometry, 
  component, 
  onSelect 
}: { 
  geometry: CustomGeometry, 
  component: Component, 
  onSelect?: (id: string) => void 
}) => {
  const { scene } = useGLTF(geometry.path);
  const groupRef = useRef<THREE.Group>(null);
  
  useEffect(() => {
    if (!groupRef.current) return;
    
    // Apply transformation
    if (component.transformation) {
      applyTransformation(groupRef.current, component.transformation);
    } else {
      // Apply direct transforms if provided
      applyDirectTransforms(
        groupRef.current, 
        component.position, 
        component.rotation, 
        component.scale
      );
    }
    
    // Apply material to all meshes in the group
    const material = createMaterial(component.material);
    groupRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = material;
        child.castShadow = component.castShadow ?? false;
        child.receiveShadow = component.receiveShadow ?? false;
      }
    });
  }, [component, geometry]);
  
  return (
    <primitive 
      ref={groupRef}
      object={scene.clone()} 
      onClick={(e: React.MouseEvent<THREE.Object3D>) => {
        e.stopPropagation();
        onSelect?.(component.id);
      }}
      onPointerOver={() => {
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
    />
  );
};

// Component to render a group of components
const ModelGroup = ({ 
  group, 
  onSelect 
}: { 
  group: Group, 
  onSelect?: (id: string) => void 
}) => {
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!groupRef.current) return;
    
    // Apply transformation
    if (group.transformation) {
      applyTransformation(groupRef.current, group.transformation);
    } else {
      // Apply direct transforms if provided
      applyDirectTransforms(
        groupRef.current, 
        group.position, 
        group.rotation, 
        group.scale
      );
    }
  }, [group]);

  return (
    <group ref={groupRef} visible={group.visible !== false}>
      {group.components.map((component: Component) => (
        <ModelComponent key={component.id} component={component} onSelect={onSelect} />
      ))}
    </group>
  );
};

// Main component to render an entire model
export function ModelRenderer({ 
  model, 
  autoRotate = false,
  onSelect,
  modelScale = 1
}: { 
  model: Model,
  autoRotate?: boolean,
  onSelect?: (id: string) => void,
  modelScale?: number
}) {
  const groupRef = useRef<THREE.Group>(null);

  // Apply model-level transforms
  useEffect(() => {
    if (!groupRef.current) return;
    
    // Apply transformation
    if (model.transformation) {
      applyTransformation(groupRef.current, model.transformation);
    } else {
      // Apply direct transforms if provided
      applyDirectTransforms(
        groupRef.current, 
        model.position, 
        model.rotation, 
        model.scale
      );
    }
    
    // Apply global scale
    groupRef.current.scale.multiplyScalar(modelScale);
  }, [model, modelScale]);

  // Optional auto-rotation animation
  useFrame((state, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Render individual components */}
      {model.components.map((component: Component) => (
        <ModelComponent key={component.id} component={component} onSelect={onSelect} />
      ))}
      
      {/* Render groups */}
      {model.groups?.map((group: Group) => (
        <ModelGroup key={group.id} group={group} onSelect={onSelect} />
      ))}
    </group>
  );
} 