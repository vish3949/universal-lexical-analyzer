"use client"

import { useEffect, useState } from "react"
import { Textarea } from "@/components/ui/textarea"

interface CodeEditorProps {
  code: string
  onChange: (code: string) => void
  language: string
}

export default function CodeEditor({ code, onChange, language }: CodeEditorProps) {
  const [placeholder, setPlaceholder] = useState("// Enter your code here")

  useEffect(() => {
    switch (language) {
      case "python":
        setPlaceholder('# Enter your Python code here\n\ndef example_function():\n    print("Hello, world!")')
        break
      case "java":
        setPlaceholder(
          '// Enter your Java code here\n\npublic class Example {\n    public static void main(String[] args) {\n        System.out.println("Hello, world!");\n    }\n}',
        )
        break
      case "c":
        setPlaceholder(
          '// Enter your C code here\n\n#include <stdio.h>\n\nint main() {\n    printf("Hello, world!\\n");\n    return 0;\n}',
        )
        break
      case "cpp":
        setPlaceholder(
          '// Enter your C++ code here\n\n#include <iostream>\n\nint main() {\n    std::cout << "Hello, world!" << std::endl;\n    return 0;\n}',
        )
        break
      case "javascript":
        setPlaceholder(
          '// Enter your JavaScript code here\n\nfunction example() {\n    console.log("Hello, world!");\n}\n\nexample();',
        )
        break
      default:
        setPlaceholder("// Enter your code here")
    }
  }, [language])

  return (
    <Textarea
      value={code}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="font-mono h-80 bg-gray-950 border-gray-800 resize-none"
    />
  )
}

