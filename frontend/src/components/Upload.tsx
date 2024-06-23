import React, { useState, ChangeEvent, FormEvent } from "react";
import axiosInstance from "../axiosConfig";

const Upload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [feedback, setFeedback] = useState<string>("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("audio", file);

    try {
      const response = await axiosInstance.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setFeedback(response.data.feedback);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="audio/*" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      {feedback && <div>{feedback}</div>}
    </div>
  );
};

export default Upload;
