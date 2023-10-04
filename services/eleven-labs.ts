import Api from ".";

export const getAllVoices = () => {
  return Api(2)
    .get(`${process.env.NEXT_PUBLIC_BASE_URL}/voices`)
    .then((result) => {
      return result.data;
    });
};

export const getVoiceById = (voiceId: string) => {
  return Api(2)
    .get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/voices/${voiceId}?with_settings=false`
    )
    .then((result) => {
      return result.data;
    });
};

export const getTextToSpeech = (voiceId: string, data: any) => {
  return Api(2)
    .post(`${process.env.NEXT_PUBLIC_BASE_URL}/text-to-speech/${voiceId}`, data)
    .then((result) => {
      return result.data;
    });
};
