'use client'

import { useEffect } from 'react'
import { useFloorPlanStore } from '@/store/use-floor-plan-store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Ruler, Maximize, Home, HelpCircle, Hash, Calendar } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function RoomsList() {
  const {
    analysisResult,
    isProcessing,
    error
  } = useFloorPlanStore()

  const rooms = analysisResult?.rooms || []
  const wallsCount = analysisResult?.walls?.length || 0
  const doorsCount = analysisResult?.doors?.length || 0
  const windowsCount = analysisResult?.windows?.length || 0

  useEffect(() => {
    console.log('[RoomsList] Detailed data:', {
      hasAnalysisResult: !!analysisResult,
      roomsCount: rooms.length,
      wallsCount,
      doorsCount,
      windowsCount,
      isProcessing,
      error
    })
  }, [analysisResult, rooms.length, wallsCount, doorsCount, windowsCount, isProcessing, error])

  if (isProcessing) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Room Analysis</CardTitle>
          <CardDescription>
            Processing floor plan...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-full pb-16">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-sm text-muted-foreground">Analyzing rooms...</p>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  if (error && !analysisResult) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Room Analysis</CardTitle>
          <CardDescription className="text-destructive">
            Analysis failed
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-full pb-16">
          <p className="text-sm text-destructive text-center">
            Could not analyze rooms. <br/> Error: {error}
          </p>
        </CardContent>
      </Card>
    )
  }
  
  if (rooms.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Room Analysis</CardTitle>
          <CardDescription>
            Upload and process a floor plan to see room details.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-full pb-16">
          <p className="text-sm text-muted-foreground">
            No analysis data available.
          </p>
        </CardContent>
      </Card>
    )
  }
  
  // Try to get timestamp from localStorage if this is loaded data
  let timeInfo = null
  try {
    const savedData = localStorage.getItem('savedFloorPlan')
    if (savedData) {
      const parsed = JSON.parse(savedData)
      if (parsed.timestamp) {
        timeInfo = new Date(parsed.timestamp).toLocaleString()
      }
    }
  } catch (error) {
    console.error('[RoomsList] Error parsing saved timestamp:', error)
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Structure Analysis</CardTitle>
        <CardDescription>
          Detected: {rooms.length} {rooms.length === 1 ? 'room' : 'rooms'}, 
          {wallsCount} walls, {doorsCount} doors, {windowsCount} windows.
          {timeInfo && (
            <div className="flex items-center text-xs mt-1">
              <Calendar className="h-3 w-3 mr-1" />
              Saved: {timeInfo}
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full pr-4">
          <div className="space-y-2">
            {rooms.map((room, index) => {
              if (!room.id) {
                console.warn(`[RoomsList] Room at index ${index} has no ID`)
              }
              
              return (
                <div
                  key={room.id || `room-${index}`}
                  className={`
                    p-3 rounded-md border transition-colors 
                    bg-muted/50 border-border/50
                  `}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant="secondary">
                      <Home className="h-3.5 w-3.5 mr-1.5" />
                      {room.name || 'Unnamed Room'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">ID: {room.id || index}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-muted-foreground pl-1">
                    {/* Keep existing room details for now - Removed dimensions as it's no longer in the schema */}
                    {/* 
                    {room.dimensions && (
                      <div className="flex items-center" title="Approx. Dimensions (pixels)">
                        <Ruler className="h-3.5 w-3.5 mr-1.5" />
                        <span>
                          {room.dimensions.width}px × {room.dimensions.height}px
                        </span>
                      </div>
                    )}
                    */}
                    {room.area && (
                      <div className="flex items-center" title="Approx. Area (pixels^2)">
                        <Maximize className="h-3.5 w-3.5 mr-1.5" />
                        <span>{room.area.toFixed(0)} px²</span>
                      </div>
                    )}
                    {room.center && (
                      <div className="flex items-center col-span-2" title="Approx. Center (pixels)">
                        <Hash className="h-3.5 w-3.5 mr-1.5" />
                        <span>Center: ({room.center.x.toFixed(1)}, {room.center.y.toFixed(1)})</span>
                      </div>
                    )}
                    <div className="flex items-center col-span-2" title="Polygon Points (Floor)">
                      <HelpCircle className="h-3.5 w-3.5 mr-1.5" />
                      <span>{room.polygon?.length || 0} floor points</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
} 