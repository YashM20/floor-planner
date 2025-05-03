'use client'

import { useCallback, useState } from 'react'
import { Model, Scene } from './model-schema'
import { validateModel, validateScene } from './model-schema-zod'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { InfoIcon, AlertTriangleIcon, CheckIcon } from 'lucide-react'
import { ZodError } from 'zod'

type JsonEditorProps = {
  initialJson?: Model | Scene
  onChange?: (data: Model | Scene) => void
  onError?: (error: Error) => void
}

export function JsonEditor({ initialJson, onChange, onError }: JsonEditorProps) {
  const [jsonText, setJsonText] = useState<string>(JSON.stringify(initialJson, null, 2))
  const [error, setError] = useState<string | null>(null)
  const [zodErrors, setZodErrors] = useState<string[]>([])
  const [validationStatus, setValidationStatus] = useState<'none' | 'valid' | 'invalid'>('none')

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setJsonText(value)
    setError(null)
    setValidationStatus('none')
    setZodErrors([])
  }, [])

  const formatZodError = (error: ZodError): string[] => {
    return error.errors.map(err => {
      const path = err.path.join('.');
      return `${path ? path + ': ' : ''}${err.message}`;
    });
  };

  const validateJson = useCallback((jsonData: any): boolean => {
    try {
      // First, determine if it's a scene or model by checking for 'objects' property
      if ('objects' in jsonData || ('scene' in jsonData && 'objects' in jsonData.scene)) {
        validateScene(jsonData);
      } else {
        validateModel(jsonData);
      }
      setValidationStatus('valid');
      setZodErrors([]);
      return true;
    } catch (err) {
      if (err instanceof ZodError) {
        setZodErrors(formatZodError(err));
      } else {
        setZodErrors([String(err)]);
      }
      setValidationStatus('invalid');
      return false;
    }
  }, []);

  const handleApply = useCallback(() => {
    try {
      // Parse the JSON first
      const parsed = JSON.parse(jsonText);
      setError(null);
      
      // Validate with Zod
      const isValid = validateJson(parsed);
      
      // Only apply changes if validation passes
      if (isValid) {
        onChange?.(parsed);
      }
    } catch (err) {
      // Handle JSON parsing errors
      setError(`Invalid JSON: ${(err as Error).message}`);
      onError?.(err as Error);
      setValidationStatus('invalid');
    }
  }, [jsonText, onChange, onError, validateJson]);

  const handleValidate = useCallback(() => {
    try {
      const parsed = JSON.parse(jsonText);
      validateJson(parsed);
    } catch (err) {
      setError(`Invalid JSON: ${(err as Error).message}`);
      setValidationStatus('invalid');
    }
  }, [jsonText, validateJson]);

  const handleReset = useCallback(() => {
    setJsonText(JSON.stringify(initialJson, null, 2))
    setError(null)
    setZodErrors([])
    setValidationStatus('none')
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
          <Alert variant="destructive" className="mt-4">
            <AlertTriangleIcon className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}
        
        {validationStatus === 'valid' && (
          <Alert className="mt-4 bg-green-50 border-green-200 text-green-800">
            <CheckIcon className="h-4 w-4 text-green-600" />
            <AlertTitle>Valid JSON Schema</AlertTitle>
            <AlertDescription>
              The JSON structure is valid and meets all requirements
            </AlertDescription>
          </Alert>
        )}
        
        {zodErrors.length > 0 && (
          <Alert variant="destructive" className="mt-4">
            <AlertTriangleIcon className="h-4 w-4" />
            <AlertTitle>Schema Validation Errors</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                {zodErrors.map((err, index) => (
                  <li key={index} className="text-sm">{err}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex gap-2 justify-end">
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
        <Button variant="outline" onClick={handleFormat}>
          Format
        </Button>
        <Button variant="outline" onClick={handleValidate}>
          Validate
        </Button>
        <Button 
          onClick={handleApply}
          disabled={validationStatus === 'invalid'}
        >
          Apply Changes
        </Button>
      </CardFooter>
    </Card>
  )
} 