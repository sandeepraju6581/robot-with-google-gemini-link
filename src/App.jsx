import { useState, useEffect, Suspense, useRef } from "react";
import "./App.css";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import Robot from "../public/Robot6"; // Ensure this path is correct
import { GoogleGenerativeAI } from "@google/generative-ai";

// Replace with your actual API key
const genAI = new GoogleGenerativeAI("AIzaSyAI0PpMwk4Il0j9v7cb6r93zYeDapokwPE");

function App() {
  const [text, setText] = useState(""); // User's speech input
  const [responseText, setResponseText] = useState(""); // AI response
  const robotRef = useRef();

  // Function to handle robot look-at based on cursor
  const handleLookAt = (event) => {
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = -(event.clientY / window.innerHeight) * 2 + 1;
    const z = 0.5; // Fixed z-coordinate
    if (robotRef.current) {
      robotRef.current.lookAt(x, y, z);
    }
  };

  // Function to handle speech recognition
  const startListening = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = (event) => {
      const speechText = event.results[0][0].transcript;
      setText(speechText);
      generateText(speechText);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };
  };

  // Function to generate text using Gemini AI
  async function generateText(inputText) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    try {
      const result = await model.generateContent(inputText);
      const response = await result.response;
      const aiText = response.text();
      setResponseText(aiText);
      speakText(aiText);
    } catch (error) {
      console.error("Error generating text:", error);
    }
  }

  // Function to convert text to speech
  const speakText = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;
    window.speechSynthesis.speak(speech);
  };

  return (
    <div className="App">
      <h1>Voice-Controlled Robot Assistant</h1>
      
      {/* 3D Canvas for Robot */}
      <div style={{ width: "100%", height: "auto" }}>
        <Canvas onMouseMove={handleLookAt}>
          <ambientLight />
          <Suspense fallback={null}>
            <Robot ref={robotRef} />
          </Suspense>
          <OrbitControls />
          <Environment preset="sunset" />
        </Canvas>
      </div>

      {/* Voice Interaction UI */}
      <button onClick={startListening}>🎤 Speak</button>
      <p><strong>You:</strong> {text}</p>
      <p><strong>AI:</strong> {responseText}</p>
    </div>
  );
}

export default App; 