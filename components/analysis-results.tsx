"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertCircle } from "lucide-react"

interface Token {
  type: string
  value: string
  line?: number
  position?: number
}

interface AnalysisResultsProps {
  results: {
    tokens: Token[]
    summary?: {
      [key: string]: number
    }
  } | null
  isLoading: boolean
}

export default function AnalysisResults({ results, isLoading }: AnalysisResultsProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full bg-gray-800" />
        <Skeleton className="h-8 w-3/4 bg-gray-800" />
        <Skeleton className="h-8 w-5/6 bg-gray-800" />
        <Skeleton className="h-8 w-2/3 bg-gray-800" />
        <Skeleton className="h-8 w-4/5 bg-gray-800" />
      </div>
    )
  }

  if (!results) {
    return (
      <div className="flex flex-col items-center justify-center h-80 text-gray-500">
        <AlertCircle className="h-12 w-12 mb-4 opacity-50" />
        <p className="text-lg font-medium">No analysis results yet</p>
        <p className="text-sm">Select a language and analyze your code to see results</p>
      </div>
    )
  }

  const getTokenColor = (type: string) => {
    const typeColors: Record<string, string> = {
      keyword: "bg-blue-900/50 text-blue-300 border-blue-800",
      identifier: "bg-green-900/50 text-green-300 border-green-800",
      operator: "bg-purple-900/50 text-purple-300 border-purple-800",
      literal: "bg-yellow-900/50 text-yellow-300 border-yellow-800",
      number: "bg-yellow-900/50 text-yellow-300 border-yellow-800",
      string: "bg-orange-900/50 text-orange-300 border-orange-800",
      comment: "bg-gray-700/50 text-gray-300 border-gray-600",
      punctuation: "bg-pink-900/50 text-pink-300 border-pink-800",
      delimiter: "bg-pink-900/50 text-pink-300 border-pink-800",
      whitespace: "bg-gray-800/50 text-gray-400 border-gray-700",
    }

    return typeColors[type.toLowerCase()] || "bg-gray-800 text-gray-300 border-gray-700"
  }

  return (
    <div className="space-y-6">
      {results.summary && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3 text-gray-300">Token Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(results.summary).map(([type, count]) => (
              <div key={type} className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                <div className="text-sm text-gray-400">{type}</div>
                <div className="text-xl font-semibold">{count}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-medium mb-3 text-gray-300">Tokens</h3>
        <ScrollArea className="h-80 rounded-md border border-gray-800 bg-gray-950 p-4">
          <div className="space-y-2">
            {results.tokens.map((token, index) => (
              <div key={index} className="flex items-center gap-2">
                <Badge className={`${getTokenColor(token.type)} whitespace-nowrap`}>{token.type}</Badge>
                <div className="bg-gray-800 rounded px-2 py-1 font-mono text-sm overflow-x-auto flex-1">
                  {token.value}
                </div>
                {token.line && (
                  <div className="text-xs text-gray-500 whitespace-nowrap">
                    Line {token.line}
                    {token.position && `:${token.position}`}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

