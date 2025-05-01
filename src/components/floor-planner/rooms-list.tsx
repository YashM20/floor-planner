'use client'

import { useFloorPlanStore } from '@/store/floor-plan-store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { DoorOpen, DoorClosed, Ruler, Maximize } from 'lucide-react'

export function RoomsList() {
  const { roomsData, selectedRoom, setSelectedRoom, isProcessing } = useFloorPlanStore()
  
  if (isProcessing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Room Analysis</CardTitle>
          <CardDescription>
            Processing floor plan...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-10">
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-sm text-muted-foreground">Analyzing rooms...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  if (roomsData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Room Analysis</CardTitle>
          <CardDescription>
            Upload and process a floor plan to see room details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-10">
            <p className="text-sm text-muted-foreground">No rooms detected yet</p>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Room Analysis</CardTitle>
        <CardDescription>
          {roomsData.length} rooms detected
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[320px] pr-4">
          <div className="space-y-3">
            {roomsData.map((room) => (
              <div
                key={room.id}
                className={`
                  p-3 rounded-md cursor-pointer transition-colors relative 
                  ${selectedRoom === room.id 
                    ? 'bg-primary/10 border border-primary/20'
                    : 'bg-muted hover:bg-muted/80 border border-transparent'
                  }
                `}
                onClick={() => setSelectedRoom(room.id)}
              >
                <div 
                  className="absolute left-0 top-0 bottom-0 w-2 rounded-l-md" 
                  style={{ backgroundColor: room.color }}
                />
                
                <div className="pl-3">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{room.type}</h3>
                    <span className="text-sm text-muted-foreground">{room.area} m²</span>
                  </div>
                  
                  <div className="mt-2 grid grid-cols-2 gap-y-1 text-sm">
                    <div className="flex items-center">
                      <Ruler className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                      <span>
                        {room.width}m × {room.length}m
                      </span>
                    </div>
                    
                    <div className="flex items-center">
                      <Maximize className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                      <span>
                        {room.area} m²
                      </span>
                    </div>
                    
                    <div className="flex items-center col-span-2">
                      {room.type === 'Hallway' ? (
                        <DoorOpen className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                      ) : (
                        <DoorClosed className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                      )}
                      <span>
                        Position: ({room.position.x}, {room.position.z})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
} 