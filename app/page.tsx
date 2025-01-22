"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"

export default function VoiceSearch() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)

  useEffect(() => {
    if ((typeof window !== "undefined" && "SpeechRecognition" in window) || "webkitSpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognition()

      recognitionInstance.continuous = false
      recognitionInstance.interimResults = false
      recognitionInstance.lang = "en-US"

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setTranscript(transcript)
        searchYouTube(transcript)
      }

      recognitionInstance.onerror = (event) => {
        console.error("Speech recognition error", event.error)
        setIsListening(false)
      }

      recognitionInstance.onend = () => {
        setIsListening(false)
      }

      setRecognition(recognitionInstance)
    } else {
      console.error("Speech recognition not supported")
    }
  }, [])

  const toggleListening = useCallback(() => {
    if (isListening) {
      recognition?.stop()
    } else {
      setTranscript("")
      recognition?.start()
    }
    setIsListening(!isListening)
  }, [isListening, recognition])

  const searchYouTube = (query: string) => {
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
    window.open(searchUrl, "_blank")
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Voice Search for YouTube</h1>
      <Button
        onClick={toggleListening}
        className={`px-6 py-3 text-lg ${isListening ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"}`}
      >
        {isListening ? "Stop Listening" : "Start Listening"}
      </Button>
      {transcript && (
        <p className="mt-4 text-lg">
          You said: <strong>{transcript}</strong>
        </p>
      )}
    </div>
  )
}

