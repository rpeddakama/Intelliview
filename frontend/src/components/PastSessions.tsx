import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";

interface Recording {
  _id: string;
  question: string;
  transcription: string;
  analysis: string;
  date: string;
}

const PastSessions: React.FC = () => {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const response = await axiosInstance.get("/api/recordings");
        setRecordings(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching recordings:", error);
        setError("Error fetching recordings.");
      }
    };

    fetchRecordings();
  }, []);

  return (
    <div>
      <h2>Past Recordings</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {recordings.map((recording) => (
          <li key={recording._id}>
            <p>
              <strong>Question:</strong> {recording.question}
            </p>
            <p>
              <strong>Transcription:</strong> {recording.transcription}
            </p>
            <p>
              <strong>Analysis:</strong> {recording.analysis}
            </p>
            <p>
              <strong>Date:</strong> {new Date(recording.date).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PastSessions;
