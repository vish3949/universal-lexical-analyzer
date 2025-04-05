const OPENROUTER_API_KEY = "api key"
const SITE_URL = "https://lexical-analyzer.vercel.app"
const SITE_NAME = "Universal Lexical Analyzer"

interface Message {
  role: "user" | "assistant" | "system"
  content: string
}

interface OpenRouterResponse {
  choices: {
    message: {
      content: string
    }
  }[]
}

export const OpenRouter = {
  /**
   * Send a chat completion request to OpenRouter
   */
  async chat({ messages }: { messages: Message[] }): Promise<string> {
    try {
      // Add a specific instruction to not use markdown formatting
      const enhancedMessages = [
        ...messages.slice(0, -1),
        {
          role: messages[messages.length - 1].role,
          content:
            messages[messages.length - 1].content +
            "\n\nIMPORTANT: Return ONLY the raw JSON without any markdown formatting, code blocks, or backticks.",
        },
      ]

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": SITE_URL,
          "X-Title": SITE_NAME,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Try a different model that might have fewer restrictions
          model: "openai/gpt-3.5-turbo",
          messages: enhancedMessages,
          // Explicitly opt out of data collection
          allow_training: false,
          data_policy: {
            allow_collection: false,
            allow_search_index: false,
            allow_prompt_training: false,
          },
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`OpenRouter API error response: ${errorText}`)

        // If we still get an error, try a direct fallback to a simple implementation
        return await fallbackAnalysis(messages[messages.length - 1].content)
      }

      const data = (await response.json()) as OpenRouterResponse
      return data.choices[0].message.content
    } catch (error) {
      console.error("OpenRouter API error:", error)
      // Try fallback if the API call fails completely
      return await fallbackAnalysis(messages[messages.length - 1].content)
    }
  },
}

// Simple fallback implementation that does basic lexical analysis
// This will run if the OpenRouter API call fails
async function fallbackAnalysis(prompt: string): Promise<string> {
  try {
    // Extract the code from the prompt
    const codeMatch = prompt.match(/```[\w+]*\n([\s\S]*?)```/)
    const code = codeMatch ? codeMatch[1] : ""
    const language = prompt.match(/following (\w+) code/)?.[1] || "unknown"

    // Very basic lexical analysis
    const tokens: any[] = []
    const summary: Record<string, number> = {}

    // Simple regex patterns for basic token types
    const patterns = [
      { type: "keyword", regex: /\b(if|else|for|while|return|function|class|var|let|const|import|export)\b/g },
      { type: "identifier", regex: /\b[a-zA-Z_]\w*\b/g },
      { type: "operator", regex: /[+\-*/%=&|<>!^]+/g },
      { type: "number", regex: /\b\d+(\.\d+)?\b/g },
      { type: "string", regex: /(["'])(.*?)\1/g },
      { type: "comment", regex: /\/\/.*|\/\*[\s\S]*?\*\//g },
      { type: "punctuation", regex: /[;,.]/g },
      { type: "delimiter", regex: /[(){}[\]]/g },
    ]

    // Split code into lines for line numbers
    const lines = code.split("\n")

    lines.forEach((line, lineIndex) => {
      patterns.forEach(({ type, regex }) => {
        let match
        while ((match = regex.exec(line)) !== null) {
          tokens.push({
            type,
            value: match[0],
            line: lineIndex + 1,
            position: match.index + 1,
          })

          summary[type] = (summary[type] || 0) + 1
        }
      })
    })

    return JSON.stringify({ tokens, summary })
  } catch (error) {
    console.error("Fallback analysis error:", error)
    // Return a minimal valid result if everything fails
    return JSON.stringify({
      tokens: [{ type: "fallback", value: "Basic analysis only" }],
      summary: { fallback: 1 },
    })
  }
}

