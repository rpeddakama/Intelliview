import axios from "axios";
import fs from "fs";
import FormData from "form-data";

const transcribeAudio = async (filePath: string): Promise<string> => {
  const form = new FormData();
  form.append("file", fs.createReadStream(filePath));
  form.append("model", "whisper-1");

  const response = await axios.post(
    "https://api.openai.com/v1/audio/transcriptions",
    form,
    {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    }
  );

  return response.data.text;
};

export default transcribeAudio;
