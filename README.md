
# Dynamic 3D Floor Plan Converter

A web application that converts 2D floor plan images into interactive 3D models.

## Features

- Upload and process floor plan images
- Automatic room detection and analysis
- Interactive 3D model generation
- Customizable wall height and styling options
- Multiple view controls (Top, Front, Side, Perspective)
- Wireframe toggle for detailed inspection
- Room selection and focus capability

## Usage

1. **Upload a Floor Plan**
   - Click "Upload Floor Plan" button to select an image file

2. **Process the Image**
   - Once uploaded, click "Process Plan" to analyze the floor plan
   - The system will detect rooms and display them in the sidebar

3. **Customize Settings**
   - Adjust wall height using the slider (1m-5m)
   - Select floor and wall styles from dropdown menus

4. **Generate 3D Model**
   - Click "Generate 3D" to create the interactive 3D model
   - View and interact with your floor plan in 3D space

5. **Control the View**
   - Use view control buttons (Top, Front, Side, Perspective)
   - Toggle wireframe mode for structural inspection
   - Select rooms from the sidebar to focus on specific areas

## Technical Details

- Built with HTML, CSS, and JavaScript
- Uses Three.js for 3D rendering and visualization
- Implements OrbitControls for camera manipulation
- Responsive design with flexible layout
- Simulated AI processing for room detection (placeholder for real AI implementation)

## Implementation

The application follows a simple workflow:
1. Image upload and preview
2. Processing and room detection
3. 3D model generation with walls, floors, doors, and windows
4. Interactive visualization with camera controls

Each detected room includes:
- Room type identification
- Area calculation
- Dimensions (width × length)
- Position coordinates
- Color coding by room type
