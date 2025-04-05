import Link from "next/link"
import { GradientBackground } from "@/components/gradient-background"
import { Button } from "@/components/ui/button"
import { Code } from "lucide-react"

export default function Home() {
  return (
    <div className="relative min-h-screen bg-black text-white">
      <GradientBackground />

      <main className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
            Universal Lexical Analyzer
          </h1>

          <div className="bg-gray-900/70 backdrop-blur-sm rounded-xl p-8 mb-12 border border-gray-800">
            <h2 className="text-2xl font-semibold mb-6 text-gray-100">Project Details</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-400">University</h3>
                  <p className="text-white">VIT</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-400">Course</h3>
                  <p className="text-white">Theory of Computation</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-400">Faculty</h3>
                  <p className="text-white">Suganthini</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-400">Team Members</h3>
                <ul className="list-disc list-inside text-white">
                  <li>Vishwakanth</li>
                  <li>Harshitha</li>
                  <li>Ronicaa</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/70 backdrop-blur-sm rounded-xl p-8 mb-12 border border-gray-800">
            <h2 className="text-2xl font-semibold mb-6 text-gray-100">About the Project</h2>
            <p className="text-gray-300 mb-4">
              This Universal Lexical Analyzer is designed to perform lexical analysis on code written in multiple
              programming languages. The analyzer breaks down the source code into tokens, identifying keywords,
              identifiers, operators, and other lexical elements.
            </p>
            <p className="text-gray-300 mb-6">Supported languages include Python, Java, C, C++, and JavaScript.</p>

            <div className="flex flex-wrap gap-3">
              <div className="px-3 py-1 rounded-full bg-blue-900/50 text-blue-300 border border-blue-800">Python</div>
              <div className="px-3 py-1 rounded-full bg-orange-900/50 text-orange-300 border border-orange-800">
                Java
              </div>
              <div className="px-3 py-1 rounded-full bg-green-900/50 text-green-300 border border-green-800">C</div>
              <div className="px-3 py-1 rounded-full bg-purple-900/50 text-purple-300 border border-purple-800">
                C++
              </div>
              <div className="px-3 py-1 rounded-full bg-yellow-900/50 text-yellow-300 border border-yellow-800">
                JavaScript
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Link href="/analyzer">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 rounded-xl text-lg font-medium"
              >
                <Code className="mr-2 h-5 w-5" />
                Start Analyzing
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

