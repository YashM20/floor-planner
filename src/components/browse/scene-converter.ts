import { 
  Component, 
  CustomGeometry, 
  Group, 
  Material, 
  MaterialType, 
  Model, 
  ModelSubtype, 
  ModelType, 
  Primitive, 
  Scene, 
  Vector3 
} from './model-schema';

/**
 * Converts a position, rotation or scale from object notation {x,y,z} to array [x,y,z]
 */
export const objectToArray = (vec: {x: number, y: number, z: number}): [number, number, number] => {
  return [vec.x, vec.y, vec.z];
};

/**
 * Converts a position, rotation or scale from array [x,y,z] to object notation {x,y,z}
 */
export const arrayToObject = (vec: [number, number, number]): {x: number, y: number, z: number} => {
  return {x: vec[0], y: vec[1], z: vec[2]};
};

/**
 * Convert scene format: scene.objects[].components[] to our internal format
 */
export const convertToStandardFormat = (inputData: any): Scene => {
  // Check if the input is already in our internal format
  if (!inputData.scene && inputData.objects && Array.isArray(inputData.objects)) {
    return inputData as Scene;
  }

  // Handle case where the input is the scene structure with nested objects
  if (inputData.scene) {
    const scene = inputData.scene;
    const sceneObjects: Model[] = [];

    // Process each object in the scene
    if (scene.objects && Array.isArray(scene.objects)) {
      scene.objects.forEach((obj: any) => {
        const components: Component[] = [];
        const groupsMap: Record<string, Group> = {};

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

            // Group legs or similar components automatically
            let groupId: string | null = null;
            if (comp.id && comp.id.includes('_leg_')) {
              groupId = 'legs';
            } else if (comp.id && comp.id.includes('_door_')) {
              groupId = 'doors';
            } else if (comp.id && comp.id.includes('_drawer_')) {
              groupId = 'drawers';
            }

            // Create the component with all properties
            const component: Component = {
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
            };

            // Add to appropriate group or to direct components
            if (groupId) {
              if (!groupsMap[groupId]) {
                groupsMap[groupId] = {
                  id: groupId,
                  name: groupId.charAt(0).toUpperCase() + groupId.slice(1),
                  components: []
                };
              }
              groupsMap[groupId].components.push(component);
            } else {
              components.push(component);
            }
          });
        }

        // Add the processed object to the scene
        sceneObjects.push({
          id: obj.id,
          name: obj.name || 'Unnamed Object',
          type: (obj.type || 'furniture') as ModelType,
          subtype: obj.subtype as ModelSubtype,
          position: obj.position,
          rotation: obj.rotation,
          scale: obj.scale,
          components: components,
          groups: Object.values(groupsMap)
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

/**
 * Convert from our internal format to the simplified format for export
 */
export const convertToSimplifiedFormat = (scene: Scene): any => {
  const result: any = {
    scene: {
      name: scene.name,
      units: scene.units || 'meters',
      objects: []
    }
  };

  // Convert each model to a simplified format
  if (scene.objects) {
    scene.objects.forEach(model => {
      const simpleObject: any = {
        id: model.id,
        name: model.name,
        type: model.type,
        subtype: model.subtype,
        position: model.position,
        rotation: model.rotation,
        scale: model.scale,
        components: []
      };

      // Add all direct components
      model.components.forEach(comp => {
        simpleObject.components.push(convertComponentToSimple(comp));
      });

      // Add all group components
      if (model.groups) {
        model.groups.forEach(group => {
          group.components.forEach(comp => {
            simpleObject.components.push(convertComponentToSimple(comp));
          });
        });
      }

      result.scene.objects.push(simpleObject);
    });
  }

  // Add scene settings if they exist
  if (scene.settings) {
    result.scene.settings = scene.settings;
  }

  return result;
};

/**
 * Helper to convert a component to the simplified format
 */
const convertComponentToSimple = (comp: Component): any => {
  const result: any = {
    id: comp.id,
    name: comp.name
  };

  // Add position, rotation, scale
  if (comp.position) result.position = comp.position;
  else if (comp.transformation?.position) result.position = comp.transformation.position;

  if (comp.rotation) result.rotation = comp.rotation;
  else if (comp.transformation?.rotation) result.rotation = comp.transformation.rotation;

  if (comp.scale) result.scale = comp.scale;
  else if (comp.transformation?.scale) result.scale = comp.transformation.scale;

  // Add primitive type and dimensions
  if ('type' in comp.geometry) {
    result.primitive = comp.geometry.type;
    result.dimensions = comp.geometry.dimensions;
  } else {
    result.path = comp.geometry.path;
    result.format = comp.geometry.format;
  }

  // Add material
  result.material = comp.material;

  // Add shadow properties
  if (comp.castShadow !== undefined) result.castShadow = comp.castShadow;
  if (comp.receiveShadow !== undefined) result.receiveShadow = comp.receiveShadow;

  return result;
}; 