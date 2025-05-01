import { FloorPlanUploader } from '@/components/floor-planner/floor-plan-uploader'
import { FloorPlanControls } from '@/components/floor-planner/floor-plan-controls' 
import { FloorPlanRenderer } from '@/components/floor-planner/floor-plan-renderer'
import { RoomsList } from '@/components/floor-planner/rooms-list'
import { ModeToggle } from '@/components/ui/theme-toggle'
import { 
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle
} from '@/components/ui/resizable'

export default function FloorPlannerPage() {
  return (
    <main className="flex flex-col w-full min-h-screen bg-background">
      <div className=" mx-auto flex flex-col w-full justify-around max-h-screen overflow-hidden">
        <header className=" px-4 py-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Dynamic 3D Floor Plan Converter</h1>
            <p className="text-muted-foreground mt-2">
              Upload a floor plan image and convert it into an interactive 3D model
            </p>
          </div>
          <ModeToggle />
        </header>
        
        <ResizablePanelGroup
          direction="horizontal"
          className="w-full h-full px-4 overflow-hidden rounded-lg "
          // style={{ gap: '2rem' }}
        >
          <ResizablePanel 
            defaultSize={40}
            minSize={30}
            className="h-full flex flex-col space-y-6 pr-4 max-h-fit overflow-hidden "
          >
            <div className="flex flex-col justify-between h-full space-y-6 overflow-y-scroll overflow-x-hidden no-scrollbar max-h-[calc(100vh-150px)] pb-10 ">
              <FloorPlanUploader />
              <FloorPlanControls />
              <RoomsList />
            </div>
          </ResizablePanel>
          
          <ResizableHandle withHandle className='bg-transparent -mr-1' />
          
          <ResizablePanel
            defaultSize={60}
            minSize={40}
            className="flex overflow-hidden mx-2"
          >
            <div className="flex min-h-full w-full p-2 bg-muted rounded-md overflow-hidden">
              <FloorPlanRenderer />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </main>
  )
} 