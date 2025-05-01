'use client'

import { useState } from 'react'
import { useFloorPlanStore } from '@/store/use-floor-plan-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Upload, X } from 'lucide-react'
import { toast } from 'sonner'

export function FloorPlanUploader() {
  const {
    uploadedImage,
    setUploadedImage,
    setAnalysisResult
  } = useFloorPlanStore()

  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleRemovePlan = () => {
    setUploadedImage(null)
    setAnalysisResult(null)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    handleRemovePlan() // Clear previous state

    setUploading(true)
    setUploadProgress(0)
    const reader = new FileReader()

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + 10
        if (newProgress >= 100) {
          clearInterval(interval)
          return 100
        }
        return newProgress
      })
    }, 50)

    reader.onerror = () => {
      console.error('Error reading file')
      clearInterval(interval)
      setUploading(false)
      setUploadProgress(0)
      toast.error('Failed to read the selected file.') // Added toast feedback
    }

    reader.onload = (event) => {
      clearInterval(interval)
      setUploadProgress(100)
      const imageUrl = event.target?.result as string
      if (imageUrl) {
        setUploadedImage(imageUrl)
      } else {
        console.error('File reader result was null')
        toast.error('Failed to load the image preview.') // Added toast feedback
      }
      setTimeout(() => {
        setUploading(false)
        setUploadProgress(0)
      }, 300)
    }

    reader.readAsDataURL(file)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>1. Upload Floor Plan</CardTitle>
        <CardDescription>
          Select an image file (PNG, JPG, WEBP) to begin.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {uploadedImage ? (
          <div className="space-y-4">
            <div className="relative aspect-video rounded-md overflow-hidden border bg-muted/20">
              <img
                src={uploadedImage}
                alt="Floor Plan Preview"
                className="w-full h-full object-contain p-1"
              />
            </div>
            <div className="flex justify-between gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemovePlan}
              >
                <X className="mr-2 h-4 w-4" />
                Remove
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => document.getElementById('floor-plan-upload')?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Replace
              </Button>
              <Input
                id="floor-plan-upload"
                type="file"
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Label
              htmlFor="floor-plan-upload-area"
              className="cursor-pointer block"
            >
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-md hover:border-primary transition-colors bg-muted/50">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-primary font-medium mb-1">
                  Click to Upload or Drag & Drop
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, WEBP supported
                </p>
              </div>
            </Label>
            <Input
              id="floor-plan-upload-area"
              type="file"
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        )}
        
        {uploading && (
          <div className="space-y-2 pt-2">
            <Progress value={uploadProgress} className="h-2" />
            <p className="text-xs text-center text-muted-foreground">
              Loading preview... {uploadProgress}%
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 