import { FloorPlanAnalysis } from "@/types/floor-plan";

// Export the inner object directly, matching the FloorPlanAnalysis schema
export const sampleFloorPlanData: FloorPlanAnalysis = {
  "overallDimensions": {
    "width": 800,
    "height": 719
  },
  "rooms": [
    {
      "id": "room-1",
      "name": "Bath",
      "polygon": [
        { "x": 65, "y": 175 },
        { "x": 218, "y": 175 },
        { "x": 218, "y": 320 },
        { "x": 65, "y": 320 }
      ],
      "area": 22185,
      "center": { "x": 141, "y": 247 }
    },
    {
      "id": "room-2",
      "name": "Lndry",
      "polygon": [
        { "x": 225, "y": 63 },
        { "x": 378, "y": 63 },
        { "x": 378, "y": 168 },
        { "x": 225, "y": 168 }
      ],
      "area": 16065,
      "center": { "x": 301, "y": 115 }
    },
    {
      "id": "room-3",
      "name": "Closet",
      "polygon": [
        { "x": 386, "y": 63 },
        { "x": 538, "y": 63 },
        { "x": 538, "y": 168 },
        { "x": 386, "y": 168 }
      ],
      "area": 15960,
      "center": { "x": 462, "y": 115 }
    },
    {
      "id": "room-4",
      "name": "Bedroom 1",
      "polygon": [
        { "x": 545, "y": 63 },
        { "x": 735, "y": 63 },
        { "x": 735, "y": 319 },
        { "x": 545, "y": 319 }
      ],
      "area": 48450,
      "center": { "x": 640, "y": 191 }
    },
    {
      "id": "room-5",
      "name": "Hall",
      "polygon": [
        { "x": 225, "y": 175 },
        { "x": 538, "y": 175 },
        { "x": 538, "y": 319 },
        { "x": 225, "y": 319 }
      ],
      "area": 45072,
      "center": { "x": 381, "y": 247 }
    },
    {
      "id": "room-6",
      "name": "Kitchen",
      "polygon": [
        { "x": 65, "y": 328 },
        { "x": 414, "y": 328 },
        { "x": 414, "y": 495 },
        { "x": 65, "y": 495 }
      ],
      "area": 58283,
      "center": { "x": 239, "y": 411 }
    },
    {
      "id": "room-7",
      "name": "Eating",
      "polygon": [
        { "x": 65, "y": 502 },
        { "x": 414, "y": 502 },
        { "x": 414, "y": 663 },
        { "x": 65, "y": 663 }
      ],
      "area": 56289,
      "center": { "x": 239, "y": 582 }
    },
    {
      "id": "room-8",
      "name": "Living",
      "polygon": [
        { "x": 422, "y": 328 },
        { "x": 735, "y": 328 },
        { "x": 735, "y": 663 },
        { "x": 422, "y": 663 }
      ],
      "area": 104955,
      "center": { "x": 578, "y": 495 }
    },
    {
      "id": "room-9",
      "name": "Balcony/Deck",
      "polygon": [
        { "x": 65, "y": 680 },
        { "x": 735, "y": 680 },
        { "x": 735, "y": 780 },
        { "x": 65, "y": 780 }
      ],
      "area": 67000,
      "center": { "x": 400, "y": 730 }
    }
  ],
  "walls": [
    { "id": "wall-1", "start": { "x": 65, "y": 55 }, "end": { "x": 735, "y": 55 }, "thickness": 8 },
    { "id": "wall-2", "start": { "x": 735, "y": 55 }, "end": { "x": 735, "y": 671 }, "thickness": 8 },
    { "id": "wall-3", "start": { "x": 735, "y": 671 }, "end": { "x": 65, "y": 671 }, "thickness": 8 },
    { "id": "wall-4", "start": { "x": 65, "y": 671 }, "end": { "x": 65, "y": 55 }, "thickness": 8 },
    { "id": "wall-5", "start": { "x": 221, "y": 55 }, "end": { "x": 221, "y": 171 }, "thickness": 4 },
    { "id": "wall-6", "start": { "x": 382, "y": 55 }, "end": { "x": 382, "y": 171 }, "thickness": 4 },
    { "id": "wall-7", "start": { "x": 541, "y": 55 }, "end": { "x": 541, "y": 171 }, "thickness": 4 },
    { "id": "wall-8", "start": { "x": 221, "y": 171 }, "end": { "x": 541, "y": 171 }, "thickness": 4 },
    { "id": "wall-9", "start": { "x": 221, "y": 171 }, "end": { "x": 221, "y": 324 }, "thickness": 4 },
    { "id": "wall-10", "start": { "x": 541, "y": 171 }, "end": { "x": 541, "y": 324 }, "thickness": 4 },
    { "id": "wall-11", "start": { "x": 65, "y": 324 }, "end": { "x": 735, "y": 324 }, "thickness": 4 },
    { "id": "wall-12", "start": { "x": 418, "y": 324 }, "end": { "x": 418, "y": 671 }, "thickness": 4 },
    { "id": "wall-13", "start": { "x": 65, "y": 498 }, "end": { "x": 418, "y": 498 }, "thickness": 4 }
  ],
  "doors": [
    {
      "id": "door-1",
      "wallId": "wall-9",
      "position": { "x": 221, "y": 205 },
      "width": 30,
      "swingDirection": "inward"
    },
    {
      "id": "door-2",
      "wallId": "wall-8",
      "position": { "x": 301, "y": 171 },
      "width": 30,
      "swingDirection": "inward"
    },
    {
      "id": "door-3",
      "wallId": "wall-8",
      "position": { "x": 462, "y": 171 },
      "width": 30,
      "swingDirection": "inward"
    },
    {
      "id": "door-4",
      "wallId": "wall-10",
      "position": { "x": 541, "y": 247 },
      "width": 35,
      "swingDirection": "inward"
    },
    {
      "id": "door-5",
      "wallId": "wall-3",
      "position": { "x": 578, "y": 671 },
      "width": 70,
      "swingDirection": "outward"
    }
  ],
  "windows": [
    { "id": "window-1", "wallId": "wall-4", "position": { "x": 65, "y": 113 }, "width": 30 },
    { "id": "window-2", "wallId": "wall-4", "position": { "x": 65, "y": 247 }, "width": 30 },
    { "id": "window-3", "wallId": "wall-1", "position": { "x": 301, "y": 55 }, "width": 30 },
    { "id": "window-4", "wallId": "wall-1", "position": { "x": 462, "y": 55 }, "width": 30 },
    { "id": "window-5", "wallId": "wall-1", "position": { "x": 640, "y": 55 }, "width": 40 },
    { "id": "window-6", "wallId": "wall-2", "position": { "x": 735, "y": 191 }, "width": 40 },
    { "id": "window-7", "wallId": "wall-4", "position": { "x": 65, "y": 411 }, "width": 40 },
    { "id": "window-8", "wallId": "wall-4", "position": { "x": 65, "y": 582 }, "width": 40 },
    { "id": "window-9", "wallId": "wall-2", "position": { "x": 735, "y": 582 }, "width": 40 }
  ],
  "objects": [
    { "label": "Shower", "boundingBox": { "x": 75, "y": 65, "width": 70, "height": 68 }, "id": "object-1" },
    { "label": "Toilet", "boundingBox": { "x": 160, "y": 185, "width": 30, "height": 40 }, "id": "object-2" },
    { "label": "Sink", "boundingBox": { "x": 75, "y": 185, "width": 60, "height": 30 }, "id": "object-3" },
    { "label": "Bed", "boundingBox": { "x": 555, "y": 75, "width": 170, "height": 130 }, "id": "object-4" },
    { "label": "Nightstand", "boundingBox": { "x": 555, "y": 215, "width": 30, "height": 30 }, "id": "object-5" },
    { "label": "Nightstand", "boundingBox": { "x": 700, "y": 75, "width": 30, "height": 30 }, "id": "object-6" },
    { "label": "Kitchen Counter/Sink", "boundingBox": { "x": 75, "y": 335, "width": 30, "height": 155 }, "id": "object-7" },
    { "label": "Stove", "boundingBox": { "x": 130, "y": 335, "width": 40, "height": 30 }, "id": "object-8" },
    { "label": "Refrigerator", "boundingBox": { "x": 228, "y": 335, "width": 40, "height": 40 }, "id": "object-9" },
    { "label": "Kitchen Island", "boundingBox": { "x": 215, "y": 400, "width": 120, "height": 50 }, "id": "object-10" },
    { "label": "Dining Table", "boundingBox": { "x": 140, "y": 540, "width": 180, "height": 80 }, "id": "object-11" },
    { "label": "Chair", "boundingBox": { "x": 145, "y": 515, "width": 25, "height": 25 }, "id": "object-12" },
    { "label": "Chair", "boundingBox": { "x": 195, "y": 515, "width": 25, "height": 25 }, "id": "object-13" },
    { "label": "Chair", "boundingBox": { "x": 245, "y": 515, "width": 25, "height": 25 }, "id": "object-14" },
    { "label": "Chair", "boundingBox": { "x": 295, "y": 515, "width": 25, "height": 25 }, "id": "object-15" },
    { "label": "Chair", "boundingBox": { "x": 145, "y": 620, "width": 25, "height": 25 }, "id": "object-16" },
    { "label": "Chair", "boundingBox": { "x": 195, "y": 620, "width": 25, "height": 25 }, "id": "object-17" },
    { "label": "Chair", "boundingBox": { "x": 245, "y": 620, "width": 25, "height": 25 }, "id": "object-18" },
    { "label": "Chair", "boundingBox": { "x": 295, "y": 620, "width": 25, "height": 25 }, "id": "object-19" },
    { "label": "Sofa", "boundingBox": { "x": 525, "y": 510, "width": 150, "height": 50 }, "id": "object-20" },
    { "label": "Coffee Table", "boundingBox": { "x": 550, "y": 440, "width": 50, "height": 50 }, "id": "object-21" },
    { "label": "Armchair", "boundingBox": { "x": 440, "y": 440, "width": 40, "height": 40 }, "id": "object-22" },
    { "label": "Plant", "boundingBox": { "x": 75, "y": 630, "width": 30, "height": 30 }, "id": "object-23" },
    { "label": "Plant", "boundingBox": { "x": 375, "y": 630, "width": 30, "height": 30 }, "id": "object-24" },
    { "label": "Plant", "boundingBox": { "x": 695, "y": 335, "width": 30, "height": 30 }, "id": "object-25" },
    { "label": "Stairs", "boundingBox": { "x": 675, "y": 335, "width": 50, "height": 330 }, "id": "object-26" },
    { "label": "Outdoor Chair", "boundingBox": { "x": 590, "y": 710, "width": 30, "height": 30 }, "id": "object-27" },
    { "label": "Outdoor Chair", "boundingBox": { "x": 655, "y": 710, "width": 30, "height": 30 }, "id": "object-28" },
    { "label": "Outdoor Table", "boundingBox": { "x": 615, "y": 700, "width": 40, "height": 40 }, "id": "object-29" },
    { "label": "Plant", "boundingBox": { "x": 695, "y": 710, "width": 30, "height": 30 }, "id": "object-30" }
  ]
};
