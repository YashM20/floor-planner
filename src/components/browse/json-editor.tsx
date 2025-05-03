'use client'

import { useCallback, useState } from 'react'
import { Model, Scene } from './model-schema'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

type JsonEditorProps = {
  initialJson?: Model | Scene
  onChange?: (data: Model | Scene) => void
  onError?: (error: Error) => void
}

export function JsonEditor({ initialJson, onChange, onError }: JsonEditorProps) {
  const [jsonText, setJsonText] = useState<string>(JSON.stringify(initialJson, null, 2))
  const [error, setError] = useState<string | null>(null)

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setJsonText(value)
    setError(null)
  }, [])

  const handleApply = useCallback(() => {
    try {
      const parsed = JSON.parse(jsonText)
      setError(null)
      onChange?.(parsed)
    } catch (err) {
      setError(`Invalid JSON: ${(err as Error).message}`)
      onError?.(err as Error)
    }
  }, [jsonText, onChange, onError])

  const handleReset = useCallback(() => {
    setJsonText(JSON.stringify(initialJson, null, 2))
    setError(null)
  }, [initialJson])

  const handleFormat = useCallback(() => {
    try {
      const parsed = JSON.parse(jsonText)
      setJsonText(JSON.stringify(parsed, null, 2))
      setError(null)
    } catch (err) {
      setError(`Cannot format: ${(err as Error).message}`)
    }
  }, [jsonText])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Edit JSON</CardTitle>
        <CardDescription>Modify the JSON structure to update the 3D model</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          value={jsonText}
          onChange={handleTextChange}
          className="font-mono text-sm min-h-[300px] resize-y"
          placeholder="Enter JSON here..."
        />
        {error && (
          <div className="text-red-500 text-sm mt-2">
            {error}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2 justify-end">
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
        <Button variant="outline" onClick={handleFormat}>
          Format
        </Button>
        <Button onClick={handleApply}>Apply Changes</Button>
      </CardFooter>
    </Card>
  )
} 