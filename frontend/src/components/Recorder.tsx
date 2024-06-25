// src/components/AudioRecorder.tsx
import React, { useState, useRef } from "react";
import axiosInstance from "../axiosConfig";

const AudioRecorder: React.FC = () => {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [question, setQuestion] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };
        mediaRecorderRef.current.start();
        setRecording(true);
        setError(null);
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
        setError("Error accessing microphone.");
      });
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const handleSubmit = async () => {
    if (!question) {
      setError("Question is required.");
      return;
    }
    if (audioChunksRef.current.length === 0) {
      setError("No audio recorded.");
      return;
    }

    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
    audioChunksRef.current = [];
    const audioUrl = URL.createObjectURL(audioBlob);
    setAudioURL(audioUrl);

    const formData = new FormData();
    formData.append("audio", audioBlob);
    formData.append("question", question);

    try {
      const response = await axiosInstance.post("/api/transcribe", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response);
      setTranscription(response.data.transcription.text);
      setAnalysis(response.data.analysis);
      setError(null);
    } catch (error) {
      console.error("Error uploading audio:", error);
      setError("Error uploading audio.");
    }
  };

  return (
    <div>
      <div>
        <label htmlFor="question">Interview Question:</label>
        <input
          id="question"
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
      </div>
      <button onClick={recording ? stopRecording : startRecording}>
        {recording ? "Stop Recording" : "Start Recording"}
      </button>
      <button onClick={handleSubmit} disabled={recording}>
        Submit
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {audioURL && <audio src={audioURL} controls />}
      {transcription && <p>Transcription: {transcription}</p>}
      {analysis && <p>Analysis: {analysis}</p>}
    </div>
  );
};

export default AudioRecorder;
