"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { GradientBackground } from "@/components/gradient-background"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Code, Download, Upload } from "lucide-react"
import CodeEditor from "@/components/code-editor"
import FileUpload from "@/components/file-upload"
import AnalysisResults from "@/components/analysis-results"
import { analyzeLexically } from "@/lib/analyzer"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const languages = [
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "c", label: "C" },
  { value: "cpp", label: "C++" },
  { value: "javascript", label: "JavaScript" },
]

export default function AnalyzerPage() {
  const router = useRouter()
  const [language, setLanguage] = useState("")
  const [code, setCode] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = (content: string) => {
    setCode(content)
    setError(null)
  }

  const handleAnalyze = async () => {
    if (!language) {
      setError("Please select a language first")
      return
    }

    if (!code.trim()) {
      setError("Please enter or upload some code to analyze")
      return
    }

    setIsAnalyzing(true)
    setError(null)

    try {
      const analysisResults = await analyzeLexically(code, language)
      setResults(analysisResults)
    } catch (error) {
      console.error("Analysis error:", error)
      setError("An error occurred during analysis. Using fallback analysis method.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleDownloadResults = () => {
    if (!results) return

    const dataStr = JSON.stringify(results, null, 2)
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

    const downloadLink = document.createElement("a")
    downloadLink.setAttribute("href", dataUri)
    downloadLink.setAttribute("download", `lexical-analysis-${language}-${new Date().toISOString().slice(0, 10)}.json`)
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
  }

  return (
    <div className="relative min-h-screen bg-black text-white">
      <GradientBackground />

      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
            Lexical Analyzer
          </h1>

          {error && (
            <Alert variant="destructive" className="mb-6 bg-red-900/50 border-red-800 text-red-200">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="mb-6">
            <label className="block text-gray-400 mb-2">Select Language</label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-full md:w-64 bg-gray-900 border-gray-700">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="bg-gray-900/70 backdrop-blur-sm border-gray-800">
              <CardHeader>
                <CardTitle>Input Code</CardTitle>
                <CardDescription>Enter or upload code to analyze</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="editor">
                  <TabsList className="bg-gray-800 mb-4">
                    <TabsTrigger value="editor" className="data-[state=active]:bg-gray-700">
                      <Code className="mr-2 h-4 w-4" />
                      Code Editor
                    </TabsTrigger>
                    <TabsTrigger value="upload" className="data-[state=active]:bg-gray-700">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload File
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="editor">
                    <CodeEditor code={code} onChange={setCode} language={language} />
                  </TabsContent>

                  <TabsContent value="upload">
                    <FileUpload onUpload={handleFileUpload} />
                  </TabsContent>
                </Tabs>

                <div className="mt-4">
                  <Button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !language || !code.trim()}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 w-full"
                  >
                    {isAnalyzing ? "Analyzing..." : "Analyze Code"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/70 backdrop-blur-sm border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Analysis Results</CardTitle>
                  <CardDescription>Lexical tokens identified in your code</CardDescription>
                </div>
                {results && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadResults}
                    className="border-gray-700 text-gray-300 hover:bg-gray-800"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download JSON
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <AnalysisResults results={results} isLoading={isAnalyzing} />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

