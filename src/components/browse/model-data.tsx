import { Scene, Model, sceneExample, chairExample, MaterialType, ModelType, ModelSubtype } from '@/components/browse/model-schema'
import { convertToStandardFormat } from '@/components/browse/scene-converter'
import { CircleUser, Armchair, Sofa, Table, Home } from 'lucide-react'
import React from 'react'

// Sample chair JSON
export const sampleChairJson = {
  "scene": {
    "name": "Simple Chair",
    "units": "meters",
    "objects": [
      {
        "id": "chair_001",
        "type": "furniture",
        "subtype": "chair",
        "name": "Modern Chair",
        "position": { "x": 1, "y": 0, "z": 1 },
        "rotation": { "x": 0, "y": 0, "z": 0 },
        "scale": { "x": 1, "y": 1, "z": 1 },
        "components": [
          {
            "id": "chair_seat",
            "primitive": "box",
            "dimensions": { "width": 0.5, "height": 0.05, "depth": 0.5 },
            "position": { "x": 0, "y": 0.4, "z": 0 },
            "material": {
              "type": "laminate",
              "color": "#a67c52",
              "texture": null,
              "metalness": 0.1,
              "roughness": 0.8
            }
          },
          {
            "id": "chair_backrest",
            "primitive": "box",
            "dimensions": { "width": 0.5, "height": 0.4, "depth": 0.05 },
            "position": { "x": 0, "y": 0.625, "z": -0.225 },
            "material": {
              "type": "laminate",
              "color": "#a67c52",
              "texture": null
            }
          },
          {
            "id": "chair_leg_front_left",
            "primitive": "cylinder",
            "dimensions": { "radiusTop": 0.025, "radiusBottom": 0.025, "height": 0.4 },
            "position": { "x": -0.225, "y": 0.2, "z": 0.225 },
            "rotation": { "x": 0, "y": 0, "z": 0 },
            "material": {
              "type": "metal",
              "color": "#555",
              "metalness": 0.9,
              "roughness": 0.2
            }
          },
          {
            "id": "chair_leg_front_right",
            "primitive": "cylinder",
            "dimensions": { "radiusTop": 0.025, "radiusBottom": 0.025, "height": 0.4 },
            "position": { "x": 0.225, "y": 0.2, "z": 0.225 },
            "material": {
              "type": "metal",
              "color": "#555",
              "metalness": 0.9,
              "roughness": 0.2
            }
          },
          {
            "id": "chair_leg_back_left",
            "primitive": "cylinder",
            "dimensions": { "radiusTop": 0.025, "radiusBottom": 0.025, "height": 0.4 },
            "position": { "x": -0.225, "y": 0.2, "z": -0.225 },
            "material": {
              "type": "metal",
              "color": "#555",
              "metalness": 0.9,
              "roughness": 0.2
            }
          },
          {
            "id": "chair_leg_back_right",
            "primitive": "cylinder",
            "dimensions": { "radiusTop": 0.025, "radiusBottom": 0.025, "height": 0.4 },
            "position": { "x": 0.225, "y": 0.2, "z": -0.225 },
            "material": {
              "type": "metal",
              "color": "#555",
              "metalness": 0.9,
              "roughness": 0.2
            }
          }
        ]
      }
    ]
  }
}

// Sample sofa JSON
export const sampleSofaJson = {
  "scene": {
    "name": "Modern Sofa",
    "units": "meters",
    "objects": [
      {
        "id": "sofa_001",
        "type": "furniture",
        "subtype": "sofa",
        "name": "Modern Sofa",
        "components": [
          {
            "id": "sofa_base",
            "primitive": "box",
            "dimensions": { "width": 1.8, "height": 0.15, "depth": 0.8 },
            "position": { "x": 0, "y": 0.075, "z": 0 },
            "material": {
              "type": "fabric",
              "color": "#3a4a6d",
              "roughness": 0.9
            }
          },
          {
            "id": "sofa_seat",
            "primitive": "box",
            "dimensions": { "width": 1.8, "height": 0.15, "depth": 0.7 },
            "position": { "x": 0, "y": 0.225, "z": 0.05 },
            "material": {
              "type": "fabric",
              "color": "#3a4a6d",
              "roughness": 0.9
            }
          },
          {
            "id": "sofa_back",
            "primitive": "box",
            "dimensions": { "width": 1.8, "height": 0.5, "depth": 0.15 },
            "position": { "x": 0, "y": 0.5, "z": -0.325 },
            "material": {
              "type": "fabric",
              "color": "#3a4a6d",
              "roughness": 0.9
            }
          },
          {
            "id": "sofa_armrest_left",
            "primitive": "box",
            "dimensions": { "width": 0.15, "height": 0.3, "depth": 0.8 },
            "position": { "x": -0.825, "y": 0.35, "z": 0 },
            "material": {
              "type": "fabric",
              "color": "#3a4a6d",
              "roughness": 0.9
            }
          },
          {
            "id": "sofa_armrest_right",
            "primitive": "box",
            "dimensions": { "width": 0.15, "height": 0.3, "depth": 0.8 },
            "position": { "x": 0.825, "y": 0.35, "z": 0 },
            "material": {
              "type": "fabric",
              "color": "#3a4a6d",
              "roughness": 0.9
            }
          }
        ]
      }
    ]
  }
}

// Sample table JSON
export const sampleTableJson = {
  "scene": {
    "name": "Coffee Table",
    "units": "meters",
    "objects": [
      {
        "id": "table_001",
        "type": "furniture",
        "subtype": "table",
        "name": "Coffee Table",
        "components": [
          {
            "id": "table_top",
            "primitive": "box",
            "dimensions": { "width": 1.2, "height": 0.05, "depth": 0.6 },
            "position": { "x": 0, "y": 0.4, "z": 0 },
            "material": {
              "type": "wood",
              "color": "#5d4037",
              "roughness": 0.7
            }
          },
          {
            "id": "table_leg_front_left",
            "primitive": "cylinder",
            "dimensions": { "radiusTop": 0.02, "radiusBottom": 0.02, "height": 0.4 },
            "position": { "x": -0.55, "y": 0.2, "z": 0.25 },
            "material": {
              "type": "metal",
              "color": "#333333",
              "metalness": 0.8,
              "roughness": 0.2
            }
          },
          {
            "id": "table_leg_front_right",
            "primitive": "cylinder",
            "dimensions": { "radiusTop": 0.02, "radiusBottom": 0.02, "height": 0.4 },
            "position": { "x": 0.55, "y": 0.2, "z": 0.25 },
            "material": {
              "type": "metal",
              "color": "#333333",
              "metalness": 0.8,
              "roughness": 0.2
            }
          },
          {
            "id": "table_leg_back_left",
            "primitive": "cylinder",
            "dimensions": { "radiusTop": 0.02, "radiusBottom": 0.02, "height": 0.4 },
            "position": { "x": -0.55, "y": 0.2, "z": -0.25 },
            "material": {
              "type": "metal",
              "color": "#333333",
              "metalness": 0.8,
              "roughness": 0.2
            }
          },
          {
            "id": "table_leg_back_right",
            "primitive": "cylinder",
            "dimensions": { "radiusTop": 0.02, "radiusBottom": 0.02, "height": 0.4 },
            "position": { "x": 0.55, "y": 0.2, "z": -0.25 },
            "material": {
              "type": "metal",
              "color": "#333333",
              "metalness": 0.8,
              "roughness": 0.2
            }
          }
        ]
      }
    ]
  }
}

// Simple chair template with basic materials only
export const simpleSafeChairJson = {
  "scene": {
    "name": "Simple Safe Chair",
    "units": "meters",
    "objects": [
      {
        "id": "chair_001",
        "type": "furniture",
        "subtype": "chair",
        "name": "Safe Chair",
        "components": [
          {
            "id": "chair_seat",
            "primitive": "box",
            "dimensions": { "width": 0.5, "height": 0.05, "depth": 0.5 },
            "position": { "x": 0, "y": 0.4, "z": 0 },
            "material": {
              "type": "basic",
              "color": "#a67c52"
            }
          },
          {
            "id": "chair_backrest",
            "primitive": "box",
            "dimensions": { "width": 0.5, "height": 0.4, "depth": 0.05 },
            "position": { "x": 0, "y": 0.625, "z": -0.225 },
            "material": {
              "type": "basic",
              "color": "#a67c52"
            }
          },
          {
            "id": "chair_leg_1",
            "primitive": "cylinder",
            "dimensions": { "radiusTop": 0.025, "radiusBottom": 0.025, "height": 0.4 },
            "position": { "x": -0.225, "y": 0.2, "z": 0.225 },
            "material": {
              "type": "basic",
              "color": "#555555"
            }
          },
          {
            "id": "chair_leg_2",
            "primitive": "cylinder",
            "dimensions": { "radiusTop": 0.025, "radiusBottom": 0.025, "height": 0.4 },
            "position": { "x": 0.225, "y": 0.2, "z": 0.225 },
            "material": {
              "type": "basic",
              "color": "#555555"
            }
          },
          {
            "id": "chair_leg_3",
            "primitive": "cylinder",
            "dimensions": { "radiusTop": 0.025, "radiusBottom": 0.025, "height": 0.4 },
            "position": { "x": -0.225, "y": 0.2, "z": -0.225 },
            "material": {
              "type": "basic",
              "color": "#555555"
            }
          },
          {
            "id": "chair_leg_4",
            "primitive": "cylinder",
            "dimensions": { "radiusTop": 0.025, "radiusBottom": 0.025, "height": 0.4 },
            "position": { "x": 0.225, "y": 0.2, "z": -0.225 },
            "material": {
              "type": "basic",
              "color": "#555555"
            }
          }
        ]
      }
    ],
    "settings": {
      "backgroundColor": "#f8f9fa",
      "shadows": true,
      "ambientLight": {
        "color": "#ffffff",
        "intensity": 0.5
      },
      "directionalLight": [
        {
          "color": "#ffffff",
          "intensity": 1,
          "position": { "x": 5, "y": 5, "z": 5 },
          "castShadow": true
        }
      ]
    }
  }
}

// For better compatibility with all devices, create a version of the chair with basic materials
export const compatibleChairExample = {
  ...chairExample,
  components: chairExample.components.map(component => ({
    ...component,
    material: {
      ...component.material,
      type: 'basic' as MaterialType // Override to use basic material
    }
  })),
  groups: chairExample.groups?.map(group => ({
    ...group,
    components: group.components.map(component => ({
      ...component,
      material: {
        ...component.material,
        type: 'basic' as MaterialType // Override to use basic material
      }
    }))
  }))
}

// Create a compatible scene example using basic materials
export const compatibleSceneExample = {
  "name": "Enclosed Living Room Scene",
  "units": "meters",
  "settings": {
    "backgroundColor": "#1a1a1a",
    "shadows": true,
    "ambientLight": {
      "color": "#ffffff",
      "intensity": 0.4
    },
    "directionalLight": [
      {
        "color": "#ffffff",
        "intensity": 0.9,
        "position": {
          "x": -6,
          "y": 8,
          "z": 5
        },
        "castShadow": true
      }
    ]
  },
  "objects": [
    {
      "id": "floor_plane_001",
      "name": "Room Floor",
      "type": "structure",
      "subtype": "floor",
      "position": {
        "x": 0,
        "y": -0.025,
        "z": 0
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "components": [
        {
          "id": "floor_surface",
          "geometry": {
            "type": "box",
            "dimensions": {
              "width": 8.0,
              "height": 0.05,
              "depth": 8.0
            }
          },
          "position": {
            "x": 0,
            "y": 0,
            "z": 0
          },
          "material": {
            "type": "standard",
            "color": "#b0a08a",
            "roughness": 0.9
          },
          "castShadow": false,
          "receiveShadow": true
        }
      ],
      "groups": []
    },
    {
      "id": "wall_back_001",
      "name": "Back Wall",
      "type": "structure",
      "subtype": "wall",
      "position": {
        "x": 0,
        "y": 1.25,
        "z": -4.0
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "components": [
        {
          "id": "wall_back_surface",
          "geometry": {
            "type": "box",
            "dimensions": {
              "width": 8.0,
              "height": 2.5,
              "depth": 0.1
            }
          },
          "position": {
            "x": 0,
            "y": 0,
            "z": 0
          },
          "material": {
            "type": "standard",
            "color": "#dcdcdc",
            "roughness": 0.95
          },
          "castShadow": false,
          "receiveShadow": true
        }
      ],
      "groups": []
    },
    {
      "id": "wall_left_001",
      "name": "Left Wall",
      "type": "structure",
      "subtype": "wall",
      "position": {
        "x": -4.0,
        "y": 1.25,
        "z": 0
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "components": [
        {
          "id": "wall_left_surface",
          "geometry": {
            "type": "box",
            "dimensions": {
              "width": 0.1,
              "height": 2.5,
              "depth": 8.0
            }
          },
          "position": {
            "x": 0,
            "y": 0,
            "z": 0
          },
          "material": {
            "type": "standard",
            "color": "#dcdcdc",
            "roughness": 0.95
          },
          "castShadow": false,
          "receiveShadow": true
        }
      ],
      "groups": []
    },
    {
      "id": "wall_right_001",
      "name": "Right Wall",
      "type": "structure",
      "subtype": "wall",
      "position": {
        "x": 4.0,
        "y": 1.25,
        "z": 0
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "components": [
        {
          "id": "wall_right_surface",
          "geometry": {
            "type": "box",
            "dimensions": {
              "width": 0.1,
              "height": 2.5,
              "depth": 8.0
            }
          },
          "position": {
            "x": 0,
            "y": 0,
            "z": 0
          },
          "material": {
            "type": "standard",
            "color": "#dcdcdc",
            "roughness": 0.95
          },
          "castShadow": false,
          "receiveShadow": true
        }
      ],
      "groups": []
    },
    {
      "id": "wall_front_001",
      "name": "Front Wall",
      "type": "structure",
      "subtype": "wall",
      "position": {
        "x": 0,
        "y": 1.25,
        "z": 4.0
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "components": [
        {
          "id": "wall_front_left",
          "geometry": {
            "type": "box",
            "dimensions": {
              "width": 3.0,
              "height": 2.5,
              "depth": 0.1
            }
          },
          "position": {
            "x": -2.5,
            "y": 0,
            "z": 0
          },
          "material": {
            "type": "standard",
            "color": "#dcdcdc",
            "roughness": 0.95
          },
          "castShadow": false,
          "receiveShadow": true
        },
        {
          "id": "wall_front_right",
          "geometry": {
            "type": "box",
            "dimensions": {
              "width": 3.0,
              "height": 2.5,
              "depth": 0.1
            }
          },
          "position": {
            "x": 2.5,
            "y": 0,
            "z": 0
          },
          "material": {
            "type": "standard",
            "color": "#dcdcdc",
            "roughness": 0.95
          },
          "castShadow": false,
          "receiveShadow": true
        },
        {
          "id": "door_frame",
          "geometry": {
            "type": "box",
            "dimensions": {
              "width": 2.0,
              "height": 2.2,
              "depth": 0.1
            }
          },
          "position": {
            "x": 0,
            "y": -0.15,
            "z": 0
          },
          "material": {
            "type": "standard",
            "color": "#8b4513",
            "roughness": 0.7
          },
          "castShadow": true,
          "receiveShadow": true
        },
        {
          "id": "door",
          "geometry": {
            "type": "box",
            "dimensions": {
              "width": 1.8,
              "height": 2.1,
              "depth": 0.05
            }
          },
          "position": {
            "x": 0,
            "y": -0.15,
            "z": 0.025
          },
          "material": {
            "type": "standard",
            "color": "#a0522d",
            "roughness": 0.6
          },
          "castShadow": true,
          "receiveShadow": true
        }
      ],
      "groups": []
    },
    {
      "id": "rug_001",
      "name": "Area Rug",
      "type": "decor",
      "subtype": "rug",
      "position": {
        "x": 0,
        "y": 0.01,
        "z": 1.0
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "components": [
        {
          "id": "rug_surface",
          "geometry": {
            "type": "box",
            "dimensions": {
              "width": 2.5,
              "height": 0.015,
              "depth": 1.8
            }
          },
          "position": {
            "x": 0,
            "y": 0,
            "z": 0
          },
          "material": {
            "type": "standard",
            "color": "#6d5e50",
            "roughness": 0.95
          },
          "castShadow": false,
          "receiveShadow": true
        }
      ],
      "groups": []
    },
    {
      "id": "sofa_instance_001",
      "name": "Modern Sofa",
      "type": "furniture",
      "subtype": "sofa",
      "position": {
        "x": 0,
        "y": 0,
        "z": -1.5
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "components": [
        {
          "id": "sofa_base_inst1",
          "geometry": {
            "type": "box",
            "dimensions": {
              "width": 1.8,
              "height": 0.15,
              "depth": 0.8
            }
          },
          "position": {
            "x": 0,
            "y": 0.075,
            "z": 0
          },
          "material": {
            "type": "standard",
            "color": "#3a4a6d",
            "roughness": 0.85
          },
          "castShadow": true,
          "receiveShadow": true
        },
        {
          "id": "sofa_seat_inst1",
          "geometry": {
            "type": "box",
            "dimensions": {
              "width": 1.8,
              "height": 0.15,
              "depth": 0.7
            }
          },
          "position": {
            "x": 0,
            "y": 0.225,
            "z": 0.05
          },
          "material": {
            "type": "standard",
            "color": "#3a4a6d",
            "roughness": 0.85
          },
          "castShadow": true,
          "receiveShadow": true
        },
        {
          "id": "sofa_back_inst1",
          "geometry": {
            "type": "box",
            "dimensions": {
              "width": 1.8,
              "height": 0.5,
              "depth": 0.15
            }
          },
          "position": {
            "x": 0,
            "y": 0.5,
            "z": -0.325
          },
          "material": {
            "type": "standard",
            "color": "#3a4a6d",
            "roughness": 0.85
          },
          "castShadow": true,
          "receiveShadow": true
        },
        {
          "id": "sofa_armrest_left_inst1",
          "geometry": {
            "type": "box",
            "dimensions": {
              "width": 0.15,
              "height": 0.3,
              "depth": 0.8
            }
          },
          "position": {
            "x": -0.825,
            "y": 0.35,
            "z": 0
          },
          "material": {
            "type": "standard",
            "color": "#3a4a6d",
            "roughness": 0.85
          },
          "castShadow": true,
          "receiveShadow": true
        },
        {
          "id": "sofa_armrest_right_inst1",
          "geometry": {
            "type": "box",
            "dimensions": {
              "width": 0.15,
              "height": 0.3,
              "depth": 0.8
            }
          },
          "position": {
            "x": 0.825,
            "y": 0.35,
            "z": 0
          },
          "material": {
            "type": "standard",
            "color": "#3a4a6d",
            "roughness": 0.85
          },
          "castShadow": true,
          "receiveShadow": true
        }
      ],
      "groups": []
    },
    {
      "id": "coffeetable_instance_001",
      "name": "Coffee Table",
      "type": "furniture",
      "subtype": "table",
      "position": {
        "x": 0,
        "y": 0,
        "z": 0.8
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "components": [
        {
          "id": "table_top_inst1",
          "geometry": {
            "type": "box",
            "dimensions": {
              "width": 1.2,
              "height": 0.05,
              "depth": 0.6
            }
          },
          "position": {
            "x": 0,
            "y": 0.4,
            "z": 0
          },
          "material": {
            "type": "standard",
            "color": "#5d4037",
            "roughness": 0.6
          },
          "castShadow": true,
          "receiveShadow": true
        }
      ],
      "groups": [
        {
          "id": "legs_group_inst1",
          "name": "Legs",
          "components": [
            {
              "id": "table_leg_fl_inst1",
              "geometry": {
                "type": "cylinder",
                "dimensions": {
                  "radiusTop": 0.02,
                  "radiusBottom": 0.02,
                  "height": 0.4
                }
              },
              "position": {
                "x": -0.55,
                "y": 0.2,
                "z": 0.25
              },
              "material": {
                "type": "standard",
                "color": "#333333",
                "metalness": 0.8,
                "roughness": 0.3
              },
              "castShadow": true,
              "receiveShadow": true
            },
            {
              "id": "table_leg_fr_inst1",
              "geometry": {
                "type": "cylinder",
                "dimensions": {
                  "radiusTop": 0.02,
                  "radiusBottom": 0.02,
                  "height": 0.4
                }
              },
              "position": {
                "x": 0.55,
                "y": 0.2,
                "z": 0.25
              },
              "material": {
                "type": "standard",
                "color": "#333333",
                "metalness": 0.8,
                "roughness": 0.3
              },
              "castShadow": true,
              "receiveShadow": true
            },
            {
              "id": "table_leg_bl_inst1",
              "geometry": {
                "type": "cylinder",
                "dimensions": {
                  "radiusTop": 0.02,
                  "radiusBottom": 0.02,
                  "height": 0.4
                }
              },
              "position": {
                "x": -0.55,
                "y": 0.2,
                "z": -0.25
              },
              "material": {
                "type": "standard",
                "color": "#333333",
                "metalness": 0.8,
                "roughness": 0.3
              },
              "castShadow": true,
              "receiveShadow": true
            },
            {
              "id": "table_leg_br_inst1",
              "geometry": {
                "type": "cylinder",
                "dimensions": {
                  "radiusTop": 0.02,
                  "radiusBottom": 0.02,
                  "height": 0.4
                }
              },
              "position": {
                "x": 0.55,
                "y": 0.2,
                "z": -0.25
              },
              "material": {
                "type": "standard",
                "color": "#333333",
                "metalness": 0.8,
                "roughness": 0.3
              },
              "castShadow": true,
              "receiveShadow": true
            }
          ]
        }
      ]
    },
    {
      "id": "chair_instance_001",
      "name": "Safe Chair",
      "type": "furniture",
      "subtype": "chair",
      "position": {
        "x": -1.5,
        "y": 0,
        "z": 0.8
      },
      "rotation": {
        "x": 0,
        "y": 30,
        "z": 0
      },
      "components": [
        {
          "id": "chair_seat_inst1",
          "geometry": {
            "type": "box",
            "dimensions": {
              "width": 0.5,
              "height": 0.05,
              "depth": 0.5
            }
          },
          "position": {
            "x": 0,
            "y": 0.4,
            "z": 0
          },
          "material": {
            "type": "standard",
            "color": "#a67c52",
            "roughness": 0.7
          },
          "castShadow": true,
          "receiveShadow": true
        },
        {
          "id": "chair_backrest_inst1",
          "geometry": {
            "type": "box",
            "dimensions": {
              "width": 0.5,
              "height": 0.4,
              "depth": 0.05
            }
          },
          "position": {
            "x": 0,
            "y": 0.625,
            "z": -0.225
          },
          "material": {
            "type": "standard",
            "color": "#a67c52",
            "roughness": 0.7
          },
          "castShadow": true,
          "receiveShadow": true
        }
      ],
      "groups": [
        {
          "id": "legs_group_ch_inst1",
          "name": "Legs",
          "components": [
            {
              "id": "chair_leg_1_inst1",
              "geometry": {
                "type": "cylinder",
                "dimensions": {
                  "radiusTop": 0.025,
                  "radiusBottom": 0.025,
                  "height": 0.4
                }
              },
              "position": {
                "x": -0.225,
                "y": 0.2,
                "z": 0.225
              },
              "material": {
                "type": "standard",
                "color": "#555555",
                "metalness": 0.7,
                "roughness": 0.4
              },
              "castShadow": true,
              "receiveShadow": true
            },
            {
              "id": "chair_leg_2_inst1",
              "geometry": {
                "type": "cylinder",
                "dimensions": {
                  "radiusTop": 0.025,
                  "radiusBottom": 0.025,
                  "height": 0.4
                }
              },
              "position": {
                "x": 0.225,
                "y": 0.2,
                "z": 0.225
              },
              "material": {
                "type": "standard",
                "color": "#555555",
                "metalness": 0.7,
                "roughness": 0.4
              },
              "castShadow": true,
              "receiveShadow": true
            },
            {
              "id": "chair_leg_3_inst1",
              "geometry": {
                "type": "cylinder",
                "dimensions": {
                  "radiusTop": 0.025,
                  "radiusBottom": 0.025,
                  "height": 0.4
                }
              },
              "position": {
                "x": -0.225,
                "y": 0.2,
                "z": -0.225
              },
              "material": {
                "type": "standard",
                "color": "#555555",
                "metalness": 0.7,
                "roughness": 0.4
              },
              "castShadow": true,
              "receiveShadow": true
            },
            {
              "id": "chair_leg_4_inst1",
              "geometry": {
                "type": "cylinder",
                "dimensions": {
                  "radiusTop": 0.025,
                  "radiusBottom": 0.025,
                  "height": 0.4
                }
              },
              "position": {
                "x": 0.225,
                "y": 0.2,
                "z": -0.225
              },
              "material": {
                "type": "standard",
                "color": "#555555",
                "metalness": 0.7,
                "roughness": 0.4
              },
              "castShadow": true,
              "receiveShadow": true
            }
          ]
        }
      ]
    }
  ]
}

// Convert all sample JSON to use basic materials for better compatibility
export const convertAndMakeSafe = (jsonData: any): Scene => {
  try {
    // First convert to standard format
    const scene = convertToStandardFormat(jsonData)
    
    // Then make all materials basic for maximum compatibility
    if (scene.objects) {
      scene.objects = scene.objects.map(obj => {
        // Update direct components
        if (obj.components) {
          obj.components = obj.components.map(comp => ({
            ...comp,
            material: {
              ...comp.material,
              type: 'basic' as MaterialType
            }
          }))
        }
        
        // Update components in groups
        if (obj.groups) {
          obj.groups = obj.groups.map(group => ({
            ...group,
            components: group.components.map(comp => ({
              ...comp,
              material: {
                ...comp.material,
                type: 'basic' as MaterialType
              }
            }))
          }))
        }
        
        return obj
      })
    }
    
    return scene
  } catch (error) {
    console.error("Error converting scene:", error)
    // Return a minimal valid scene if conversion fails
    return {
      name: "Fallback Safe Scene",
      objects: []
    }
  }
}

// Living room template
export const livingRoomJson: Scene = {
  name: "Cozy Living Room",
  units: "meters",
  settings: {
    backgroundColor: "#e0e0e0",
    shadows: true,
    ambientLight: {
      color: "#ffffff",
      intensity: 0.6
    },
    directionalLight: [
      {
        color: "#ffffff",
        intensity: 0.8,
        position: {
          x: -5,
          y: 8,
          z: 6
        },
        castShadow: true
      }
    ]
  },
  objects: [
    {
      id: "floor_plane_001",
      name: "Room Floor",
      type: "structure" as ModelType,
      subtype: "floor" as ModelSubtype,
      position: {
        x: 0,
        y: -0.025,
        z: 0
      },
      rotation: {
        x: 0,
        y: 0,
        z: 0
      },
      components: [
        {
          id: "floor_surface",
          geometry: {
            type: "box" as const,
            dimensions: {
              width: 8.0,
              height: 0.05,
              depth: 8.0
            }
          },
          position: {
            x: 0,
            y: 0,
            z: 0
          },
          material: {
            type: "basic" as MaterialType,
            color: "#b0a08a",
            roughness: 0.8
          },
          castShadow: false,
          receiveShadow: true
        }
      ]
    },
    {
      id: "rug_001",
      name: "Area Rug",
      type: "decor" as ModelType,
      subtype: "rug" as ModelSubtype,
      position: {
        x: 0,
        y: 0.01,
        z: 1.0
      },
      rotation: {
        x: 0,
        y: 0,
        z: 0
      },
      components: [
        {
          id: "rug_surface",
          geometry: {
            type: "box" as const,
            dimensions: {
              width: 2.5,
              height: 0.01,
              depth: 1.8
            }
          },
          position: {
            x: 0,
            y: 0,
            z: 0
          },
          material: {
            type: "basic" as MaterialType,
            color: "#6d5e50",
            roughness: 0.9
          },
          castShadow: false,
          receiveShadow: true
        }
      ]
    },
    {
      id: "sofa_instance_001",
      name: "Modern Sofa",
      type: "furniture" as ModelType,
      subtype: "sofa" as ModelSubtype,
      position: {
        x: 0,
        y: 0,
        z: -1.5
      },
      rotation: {
        x: 0,
        y: 0,
        z: 0
      },
      components: [
        {
          id: "sofa_base_inst1",
          geometry: {
            type: "box" as const,
            dimensions: {
              width: 1.8,
              height: 0.15,
              depth: 0.8
            }
          },
          position: {
            x: 0,
            y: 0.075,
            z: 0
          },
          material: {
            type: "basic" as MaterialType,
            color: "#3a4a6d",
            roughness: 0.9
          },
          castShadow: true,
          receiveShadow: true
        },
        {
          id: "sofa_seat_inst1",
          geometry: {
            type: "box" as const,
            dimensions: {
              width: 1.8,
              height: 0.15,
              depth: 0.7
            }
          },
          position: {
            x: 0,
            y: 0.225,
            z: 0.05
          },
          material: {
            type: "basic" as MaterialType,
            color: "#3a4a6d",
            roughness: 0.9
          },
          castShadow: true,
          receiveShadow: true
        },
        {
          id: "sofa_back_inst1",
          geometry: {
            type: "box" as const,
            dimensions: {
              width: 1.8,
              height: 0.5,
              depth: 0.15
            }
          },
          position: {
            x: 0,
            y: 0.5,
            z: -0.325
          },
          material: {
            type: "basic" as MaterialType,
            color: "#3a4a6d",
            roughness: 0.9
          },
          castShadow: true,
          receiveShadow: true
        },
        {
          id: "sofa_armrest_left_inst1",
          geometry: {
            type: "box" as const,
            dimensions: {
              width: 0.15,
              height: 0.3,
              depth: 0.8
            }
          },
          position: {
            x: -0.825,
            y: 0.35,
            z: 0
          },
          material: {
            type: "basic" as MaterialType,
            color: "#3a4a6d",
            roughness: 0.9
          },
          castShadow: true,
          receiveShadow: true
        },
        {
          id: "sofa_armrest_right_inst1",
          geometry: {
            type: "box" as const,
            dimensions: {
              width: 0.15,
              height: 0.3,
              depth: 0.8
            }
          },
          position: {
            x: 0.825,
            y: 0.35,
            z: 0
          },
          material: {
            type: "basic" as MaterialType,
            color: "#3a4a6d",
            roughness: 0.9
          },
          castShadow: true,
          receiveShadow: true
        }
      ]
    },
    {
      id: "coffeetable_instance_001",
      name: "Coffee Table",
      type: "furniture" as ModelType,
      subtype: "table" as ModelSubtype,
      position: {
        x: 0,
        y: 0,
        z: 0.8
      },
      rotation: {
        x: 0,
        y: 0,
        z: 0
      },
      components: [
        {
          id: "table_top_inst1",
          geometry: {
            type: "box" as const,
            dimensions: {
              width: 1.2,
              height: 0.05,
              depth: 0.6
            }
          },
          position: {
            x: 0,
            y: 0.4,
            z: 0
          },
          material: {
            type: "basic" as MaterialType,
            color: "#5d4037",
            roughness: 0.7
          },
          castShadow: true,
          receiveShadow: true
        }
      ],
      groups: [
        {
          id: "legs_group_inst1",
          name: "Legs",
          components: [
            {
              id: "table_leg_fl_inst1",
              geometry: {
                type: "cylinder" as const,
                dimensions: {
                  radiusTop: 0.02,
                  radiusBottom: 0.02,
                  height: 0.4
                }
              },
              position: {
                x: -0.55,
                y: 0.2,
                z: 0.25
              },
              material: {
                type: "basic" as MaterialType,
                color: "#333333",
                metalness: 0.8,
                roughness: 0.2
              },
              castShadow: true,
              receiveShadow: true
            },
            {
              id: "table_leg_fr_inst1",
              geometry: {
                type: "cylinder" as const,
                dimensions: {
                  radiusTop: 0.02,
                  radiusBottom: 0.02,
                  height: 0.4
                }
              },
              position: {
                x: 0.55,
                y: 0.2,
                z: 0.25
              },
              material: {
                type: "basic" as MaterialType,
                color: "#333333",
                metalness: 0.8,
                roughness: 0.2
              },
              castShadow: true,
              receiveShadow: true
            },
            {
              id: "table_leg_bl_inst1",
              geometry: {
                type: "cylinder" as const,
                dimensions: {
                  radiusTop: 0.02,
                  radiusBottom: 0.02,
                  height: 0.4
                }
              },
              position: {
                x: -0.55,
                y: 0.2,
                z: -0.25
              },
              material: {
                type: "basic" as MaterialType,
                color: "#333333",
                metalness: 0.8,
                roughness: 0.2
              },
              castShadow: true,
              receiveShadow: true
            },
            {
              id: "table_leg_br_inst1",
              geometry: {
                type: "cylinder" as const,
                dimensions: {
                  radiusTop: 0.02,
                  radiusBottom: 0.02,
                  height: 0.4
                }
              },
              position: {
                x: 0.55,
                y: 0.2,
                z: -0.25
              },
              material: {
                type: "basic" as MaterialType,
                color: "#333333",
                metalness: 0.8,
                roughness: 0.2
              },
              castShadow: true,
              receiveShadow: true
            }
          ]
        }
      ]
    },
    {
      id: "chair_instance_001",
      name: "Safe Chair",
      type: "furniture" as ModelType,
      subtype: "chair" as ModelSubtype,
      position: {
        x: -1.5,
        y: 0,
        z: 0.8
      },
      rotation: {
        x: 0,
        y: 30,
        z: 0
      },
      components: [
        {
          id: "chair_seat_inst1",
          geometry: {
            type: "box" as const,
            dimensions: {
              width: 0.5,
              height: 0.05,
              depth: 0.5
            }
          },
          position: {
            x: 0,
            y: 0.4,
            z: 0
          },
          material: {
            type: "basic" as MaterialType,
            color: "#a67c52"
          },
          castShadow: true,
          receiveShadow: true
        },
        {
          id: "chair_backrest_inst1",
          geometry: {
            type: "box" as const,
            dimensions: {
              width: 0.5,
              height: 0.4,
              depth: 0.05
            }
          },
          position: {
            x: 0,
            y: 0.625,
            z: -0.225
          },
          material: {
            type: "basic" as MaterialType,
            color: "#a67c52"
          },
          castShadow: true,
          receiveShadow: true
        }
      ],
      groups: [
        {
          id: "legs_group_ch_inst1",
          name: "Legs",
          components: [
            {
              id: "chair_leg_1_inst1",
              geometry: {
                type: "cylinder" as const,
                dimensions: {
                  radiusTop: 0.025,
                  radiusBottom: 0.025,
                  height: 0.4
                }
              },
              position: {
                x: -0.225,
                y: 0.2,
                z: 0.225
              },
              material: {
                type: "basic" as MaterialType,
                color: "#555555"
              },
              castShadow: true,
              receiveShadow: true
            },
            {
              id: "chair_leg_2_inst1",
              geometry: {
                type: "cylinder" as const,
                dimensions: {
                  radiusTop: 0.025,
                  radiusBottom: 0.025,
                  height: 0.4
                }
              },
              position: {
                x: 0.225,
                y: 0.2,
                z: 0.225
              },
              material: {
                type: "basic" as MaterialType,
                color: "#555555"
              },
              castShadow: true,
              receiveShadow: true
            },
            {
              id: "chair_leg_3_inst1",
              geometry: {
                type: "cylinder" as const,
                dimensions: {
                  radiusTop: 0.025,
                  radiusBottom: 0.025,
                  height: 0.4
                }
              },
              position: {
                x: -0.225,
                y: 0.2,
                z: -0.225
              },
              material: {
                type: "basic" as MaterialType,
                color: "#555555"
              },
              castShadow: true,
              receiveShadow: true
            },
            {
              id: "chair_leg_4_inst1",
              geometry: {
                type: "cylinder" as const,
                dimensions: {
                  radiusTop: 0.025,
                  radiusBottom: 0.025,
                  height: 0.4
                }
              },
              position: {
                x: 0.225,
                y: 0.2,
                z: -0.225
              },
              material: {
                type: "basic" as MaterialType,
                color: "#555555"
              },
              castShadow: true,
              receiveShadow: true
            }
          ]
        }
      ]
    }
  ]
}

// Template models array with JSX icons
type TemplateScene = {
  id: string
  name: string
  scene: Scene
  icon: React.ReactNode
}

// Template models for quick starting
export const templateScenes: TemplateScene[] = [
  { id: 'scene-full', name: 'Complete Room', scene: convertAndMakeSafe(compatibleSceneExample), icon: <CircleUser size={24} /> },
  { id: 'living-room', name: 'Cozy Living Room', scene: livingRoomJson, icon: <Home size={24} /> },
  { id: 'chair-simple', name: 'Simple Chair', scene: convertAndMakeSafe(simpleSafeChairJson), icon: <Armchair size={24} /> },
  { id: 'sofa-modern', name: 'Modern Sofa', scene: convertAndMakeSafe(sampleSofaJson), icon: <Sofa size={24} /> },
  { id: 'table-coffee', name: 'Coffee Table', scene: convertAndMakeSafe(sampleTableJson), icon: <Table size={24} /> }
] 