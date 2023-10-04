// pages/api/audio.ts

import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Set the xi-api-key header for the Axios request
    axios.defaults.headers.common["xi-api-key"] =
      "377750fb9fd35cbf183063b709f5bd4a";
    // Make a POST request to the external API
    const response = await axios.post(
      "https://api.elevenlabs.io/v1/text-to-speech/DqjMt2X0sFO9GxWG5DBe",
      {
        text: "I'm sorry, but as your mentor, I'm here to help build your career. However, I'm unable to provide feedback on the given response as it is not in English and I am unable to translate it. Please provide the response in English so that I can assist you further.",
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
        },
      }
    );

    // Extract the audio data from the response
    const audioData = response.data;

    // Set appropriate headers for the audio
    res.setHeader("Content-Type", "audio/mp3");

    // Send the audio data as the response
    res.status(200).send(audioData);
  } catch (error) {
    console.error("Error proxying audio:", error);
    res.status(500).send("Internal Server Error");
  }
};
