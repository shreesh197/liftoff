import Api from ".";

export const postMessageToAI = (data: any) => {
  return Api(1)
    .post("https://api.openai.com/v1/chat/completions", data)
    .then((result) => {
      return result.data;
    });
};
