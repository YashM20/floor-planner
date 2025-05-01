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

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **UI Components**: Shadcn UI, Radix UI
- **Styling**: Tailwind CSS v4
- **3D Rendering**: Three.js, React Three Fiber, Drei
- **State Management**: Zustand
- **Development**: TypeScript, ESLint

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/floor-planner.git
cd floor-planner

# Install dependencies
pnpm install

# Run the development server
pnpm dev
```

The application will be available at http://localhost:3000.

## Development

```bash
# Run the development server with hot reload
pnpm dev

# Build for production
pnpm build

# Start the production server
pnpm start

# Run linting
pnpm lint
```

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

## Project Structure

```
floor-planner/
├── public/             # Static assets
│   └── textures/       # Texture files for 3D rendering
├── src/                # Source code
│   ├── app/            # Next.js App Router pages
│   ├── components/     # React components
│   │   ├── floor-planner/  # Floor planner specific components
│   │   ├── ui/         # UI components (Shadcn)
│   │   ├── canvas/     # Three.js canvas components
│   │   └── dom/        # DOM-specific components
│   ├── helpers/        # Helper utilities
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Library code and utilities
│   ├── store/          # Zustand state management
│   └── types/          # TypeScript type definitions
├── .eslintrc.json      # ESLint configuration
├── next.config.js      # Next.js configuration
├── package.json        # Project dependencies and scripts
├── tailwind.config.js  # Tailwind CSS configuration
└── tsconfig.json       # TypeScript configuration
```

## Technical Details

- Built with Next.js, React, and Three.js
- Uses React Three Fiber for 3D rendering and visualization
- Implements OrbitControls for camera manipulation
- Responsive design with flexible layout
- Simulated AI processing for room detection (placeholder for real AI implementation)

## Workflow

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

## License

MIT
