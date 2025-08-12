"use client";
import { useState, useRef } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const lastTranscriptRef = useRef(""); // Track last added sentence

  if (typeof window !== "undefined" && "webkitSpeechRecognition" in window && !recognitionRef.current) {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "hi-IN";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript.trim();
        if (event.results[i].isFinal) {
          // Only append if it's new
          if (transcript !== lastTranscriptRef.current) {
            lastTranscriptRef.current = transcript;
            finalTranscript += transcript + " ";
          }
        } else {
          interimTranscript += transcript + " ";
        }
      }

      if (finalTranscript) {
        setText((prev) => prev + finalTranscript);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognitionRef.current = recognition;
  }

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      lastTranscriptRef.current = ""; // reset tracking
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      setIsListening(false);
      recognitionRef.current.stop();
    }
  };

  return (
    <main style={{ textAlign: "center", padding: "20px" }}>
      <h1>🎤 Hindi Voice Typing (Mobile Duplicate Fix)</h1>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="यहाँ आपका टेक्स्ट आएगा..."
        style={{ width: "80%", height: "200px", fontSize: "18px" }}
      />

      <br />
      {!isListening ? (
        <button
          onClick={startListening}
          style={{
            padding: "10px 20px",
            fontSize: "18px",
            marginTop: "10px",
            cursor: "pointer",
            background: "green",
            color: "white",
          }}
        >
          ▶ Start Listening
        </button>
      ) : (
        <button
          onClick={stopListening}
          style={{
            padding: "10px 20px",
            fontSize: "18px",
            marginTop: "10px",
            cursor: "pointer",
            background: "red",
            color: "white",
          }}
        >
          ⏹ Stop Listening
        </button>
      )}
    </main>
  );
}
