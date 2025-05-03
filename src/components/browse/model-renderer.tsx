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

// Map our material types to Three.js materials
const getMaterialClass = (materialType: MaterialType): any => {
  switch (materialType) {
    case 'basic': return THREE.MeshBasicMaterial;
    case 'phong': return THREE.MeshPhongMaterial;
    case 'lambert': return THREE.MeshLambertMaterial;
    // For special materials (wood, metal, etc.) we use MeshStandardMaterial with appropriate settings
    default: return THREE.MeshStandardMaterial;
  }
};

// Material creation based on material definition
const createMaterial = (material: Material): THREE.Material => {
  // Get the appropriate material class
  const MaterialClass = getMaterialClass(material.type);
  
  // Create basic properties common to all materials
  const materialProps: Record<string, any> = {
    color: material.color,
    wireframe: material.wireframe
  };
  
  // For materials that support opacity
  if (material.opacity !== undefined && material.opacity < 1) {
    materialProps.transparent = true;
    materialProps.opacity = material.opacity;
  }
  
  // Add PBR properties for standard materials
  if (MaterialClass === THREE.MeshStandardMaterial) {
    // Set defaults based on material type first
    switch (material.type) {
      case 'metal':
        materialProps.metalness = material.metalness ?? 0.9;
        materialProps.roughness = material.roughness ?? 0.1;
        break;
      case 'wood':
        materialProps.metalness = material.metalness ?? 0.0;
        materialProps.roughness = material.roughness ?? 0.8;
        break;
      case 'glass':
        materialProps.metalness = material.metalness ?? 0.0;
        materialProps.roughness = material.roughness ?? 0.1;
        materialProps.transparent = true;
        materialProps.opacity = material.opacity ?? 0.5;
        break;
      case 'laminate':
        materialProps.metalness = material.metalness ?? 0.1;
        materialProps.roughness = material.roughness ?? 0.7;
        break;
      case 'fabric':
        materialProps.metalness = material.metalness ?? 0.0;
        materialProps.roughness = material.roughness ?? 0.9;
        break;
      case 'plastic':
        materialProps.metalness = material.metalness ?? 0.1;
        materialProps.roughness = material.roughness ?? 0.5;
        break;
      case 'ceramic':
        materialProps.metalness = material.metalness ?? 0.2;
        materialProps.roughness = material.roughness ?? 0.2;
        break;
      case 'leather':
        materialProps.metalness = material.metalness ?? 0.0;
        materialProps.roughness = material.roughness ?? 0.6;
        break;
      default:
        // These will be overridden by any explicitly provided values below
        materialProps.metalness = 0.5;
        materialProps.roughness = 0.5;
    }
    
    // Now override with any explicitly provided values
    if (material.metalness !== undefined) materialProps.metalness = material.metalness;
    if (material.roughness !== undefined) materialProps.roughness = material.roughness;
    if (material.clearcoat !== undefined) materialProps.clearcoat = material.clearcoat;
    if (material.clearcoatRoughness !== undefined) materialProps.clearcoatRoughness = material.clearcoatRoughness;
  }
  
  // Add maps if provided
  if (material.textureMap) {
    const textureLoader = new THREE.TextureLoader();
    materialProps.map = textureLoader.load(material.textureMap);
  }
  
  if (material.normalMap) {
    const textureLoader = new THREE.TextureLoader();
    materialProps.normalMap = textureLoader.load(material.normalMap);
  }
  
  if (material.bumpMap) {
    const textureLoader = new THREE.TextureLoader();
    materialProps.bumpMap = textureLoader.load(material.bumpMap);
  }
  
  if (material.envMap) {
    const textureLoader = new THREE.TextureLoader();
    materialProps.envMap = textureLoader.load(material.envMap);
  }
  
  if (material.emissive) {
    materialProps.emissive = new THREE.Color(material.emissive);
    if (material.emissiveIntensity !== undefined) {
      materialProps.emissiveIntensity = material.emissiveIntensity;
    }
  }
  
  // Create the material
  return new MaterialClass(materialProps);
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