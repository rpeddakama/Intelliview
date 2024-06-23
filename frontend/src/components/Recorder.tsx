// src/components/AudioRecorder.tsx
import React, { useState, useRef } from "react";
import axiosInstance from "../axiosConfig";

const AudioRecorder: React.FC = () => {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<string | null>();
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
        mediaRecorderRef.current.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/wav",
          });
          audioChunksRef.current = [];
          const audioUrl = URL.createObjectURL(audioBlob);
          setAudioURL(audioUrl);

          // Send audioBlob to the backend
          const formData = new FormData();
          formData.append("audio", audioBlob);

          try {
            const response = await axiosInstance.post(
              "/api/transcribe",
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );
            console.log(response);
            setTranscription(response.data.transcription.text);
          } catch (error) {
            console.error("Error uploading audio:", error);
          }
        };
        mediaRecorderRef.current.start();
        setRecording(true);
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
      });
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <div>
      <button onClick={recording ? stopRecording : startRecording}>
        {recording ? "Stop Recording" : "Start Recording"}
      </button>
      {audioURL && <audio src={audioURL} controls />}
      {transcription && <p>Transcription: {transcription}</p>}
    </div>
  );
};

export default AudioRecorder;
