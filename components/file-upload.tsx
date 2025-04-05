"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { FileText, Upload } from "lucide-react"

interface FileUploadProps {
  onUpload: (content: string) => void
}

export default function FileUpload({ onUpload }: FileUploadProps) {
  const [fileName, setFileName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setError(null)

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string
        onUpload(content)
      } catch (err) {
        setError("Failed to read file content")
        console.error(err)
      }
    }
    reader.onerror = () => {
      setError("Failed to read file")
    }
    reader.readAsText(file)
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-700 rounded-lg bg-gray-950">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".py,.java,.c,.cpp,.js,.txt"
      />

      {fileName ? (
        <div className="text-center">
          <FileText className="h-12 w-12 text-green-500 mx-auto mb-2" />
          <p className="text-green-400 font-medium mb-1">{fileName}</p>
          <p className="text-gray-400 text-sm mb-4">File uploaded successfully</p>
          <Button
            variant="outline"
            onClick={handleButtonClick}
            className="border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Another File
          </Button>
        </div>
      ) : (
        <div className="text-center">
          <Upload className="h-12 w-12 text-gray-500 mx-auto mb-2" />
          <p className="text-gray-300 font-medium mb-1">Upload a code file</p>
          <p className="text-gray-500 text-sm mb-4">Supported formats: .py, .java, .c, .cpp, .js, .txt</p>
          <Button
            variant="outline"
            onClick={handleButtonClick}
            className="border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            <Upload className="mr-2 h-4 w-4" />
            Select File
          </Button>
        </div>
      )}

      {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
    </div>
  )
}

