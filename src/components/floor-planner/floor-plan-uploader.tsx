'use client'

import { useState } from 'react'
import { useFloorPlanStore } from '@/store/floor-plan-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Upload } from 'lucide-react'

export function FloorPlanUploader() {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const { floorPlanImage, setFloorPlanImage, setRoomsData, resetFloorPlan } = useFloorPlanStore()

  // Simulate file upload with progress
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    // Reset any existing floor plan
    resetFloorPlan()
    
    // Start upload simulation
    setUploading(true)
    
    const reader = new FileReader()
    
    // Simulate progress updates
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + 5
        if (newProgress >= 100) {
          clearInterval(interval)
          return 100
        }
        return newProgress
      })
    }, 100)
    
    reader.onload = (event) => {
      // Clear interval when done
      clearInterval(interval)
      setUploadProgress(100)
      
      // Set the image in the store
      const imageUrl = event.target?.result as string
      setFloorPlanImage(imageUrl)
      
      // Complete upload
      setTimeout(() => {
        setUploading(false)
        setUploadProgress(0)
      }, 500)
    }
    
    reader.readAsDataURL(file)
  }

  return (
    <Card className="flex ">
      <CardHeader>
        <CardTitle>Upload Floor Plan</CardTitle>
        <CardDescription>
          Upload a floor plan image to begin the conversion process
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {floorPlanImage ? (
          <div className="space-y-4">
            <div className="relative aspect-video rounded-md overflow-hidden border">
              <img 
                src={floorPlanImage} 
                alt="Floor Plan" 
                className="w-full h-full object-contain" 
              />
            </div>
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => resetFloorPlan()}
              >
                Remove Plan
              </Button>
              <Button
                variant="default"
                onClick={() => document.getElementById('floor-plan-upload')?.click()}
              >
                Replace
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-md bg-muted/50">
              <Upload className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-1">
                Drag and drop your floor plan image
              </p>
              <p className="text-xs text-muted-foreground">
                or click to browse
              </p>
            </div>
            
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="floor-plan-upload" className="sr-only">
                Upload Floor Plan
              </Label>
              <Input
                id="floor-plan-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <Button 
                variant="default" 
                className="w-full"
                onClick={() => document.getElementById('floor-plan-upload')?.click()}
              >
                Upload Floor Plan
              </Button>
            </div>
          </div>
        )}
        
        {uploading && (
          <div className="space-y-2">
            <Progress value={uploadProgress} />
            <p className="text-xs text-center text-muted-foreground">
              Uploading... {uploadProgress}%
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 