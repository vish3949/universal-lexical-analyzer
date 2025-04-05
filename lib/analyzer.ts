import { OpenRouter } from "@/lib/openrouter"

interface Token {
  type: string
  value: string
  line?: number
  position?: number
}

interface AnalysisResult {
  tokens: Token[]
  summary: {
    [key: string]: number
  }
}

export async function analyzeLexically(code: string, language: string): Promise<AnalysisResult> {
  try {
    const prompt = `
You are a lexical analyzer for programming languages. Analyze the following ${language} code and identify all lexical tokens.
Return ONLY a JSON object with two properties:
1. "tokens": an array of token objects, each with "type", "value", "line", and "position" properties
2. "summary": an object with token types as keys and their counts as values

For token types, use these categories:
- keyword (language keywords)
- identifier (variable names, function names, etc.)
- operator (arithmetic, logical, etc.)
- literal (string literals, character literals)
- number (integer, float, etc.)
- comment (single line, multi-line)
- punctuation (semicolons, commas, etc.)
- delimiter (parentheses, brackets, braces)
- whitespace (spaces, tabs, newlines)

Here's the code to analyze:

\`\`\`${language}
${code}
\`\`\`

Respond ONLY with the JSON object, no explanations or other text.
`

    const response = await OpenRouter.chat({
      messages: [
        {
          role: "system",
          content:
            "You are a lexical analyzer for programming languages. You analyze code and return only valid JSON without markdown formatting or code blocks.",
        },
        { role: "user", content: prompt },
      ],
    })

    // Extract JSON from markdown code blocks if present
    const jsonContent = extractJsonFromResponse(response)

    // Parse the response as JSON
    try {
      const result = JSON.parse(jsonContent)
      return result as AnalysisResult
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError)
      console.error("Response content:", jsonContent)

      // Fallback: Return a basic structure with an error message
      return {
        tokens: [{ type: "error", value: "Failed to parse analysis results" }],
        summary: {
          error: 1,
        },
      }
    }
  } catch (error) {
    console.error("Error during lexical analysis:", error)
    throw new Error("Failed to perform lexical analysis")
  }
}

// Function to extract JSON from a response that might contain markdown code blocks
function extractJsonFromResponse(response: string): string {
  // Check if the response contains a markdown code block
  const codeBlockMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/)

  if (codeBlockMatch && codeBlockMatch[1]) {
    // Return the content inside the code block
    return codeBlockMatch[1].trim()
  }

  // If no code block is found, return the original response
  return response.trim()
}

