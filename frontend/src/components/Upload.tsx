// import React, { useState } from "react";
// import axiosInstance from "../axiosConfig";

// const Upload: React.FC = () => {
//   const [file, setFile] = useState<File | null>(null);
//   const [transcription, setTranscription] = useState<string>("");

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       setFile(e.target.files[0]);
//     }
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       return;
//     }

//     const formData = new FormData();
//     formData.append("audio", file);

//     try {
//       console.log("HERE BEFORE UPLOAD REACT");
//       const uploadResponse = await axiosInstance.post(
//         "/upload/upload",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       console.log("HERE BEFORE TRANSCRIPTION");
//       const transcriptionResponse = await axiosInstance.post(
//         "/transcription/transcribe",
//         {
//           filePath: uploadResponse.data.filePath,
//         }
//       );

//       setTranscription(transcriptionResponse.data.transcription);
//     } catch (error) {
//       console.error("Error uploading and transcribing file:", error);
//     }
//   };

//   return (
//     <div>
//       <h2>Upload and Transcribe Audio</h2>
//       <input type="file" accept="audio/*" onChange={handleFileChange} />
//       <button onClick={handleUpload}>Upload and Transcribe</button>
//       {transcription && (
//         <div>
//           <h3>Transcription</h3>
//           <p>{transcription}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Upload;
import React, { useState } from "react";
import axios from "axios";

const Upload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [transcription, setTranscription] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("audio", file);

    try {
      const uploadResponse = await axios.post(
        "/transcription/transcribe",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setTranscription(uploadResponse.data.transcription);
    } catch (error) {
      console.error("Error uploading and transcribing file:", error);
    }
  };

  return (
    <div>
      <h2>Upload and Transcribe Audio</h2>
      <input type="file" accept="audio/*" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload and Transcribe</button>
      {transcription && (
        <div>
          <h3>Transcription</h3>
          <p>{transcription}</p>
        </div>
      )}
    </div>
  );
};

export default Upload;
