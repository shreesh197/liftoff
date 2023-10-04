export const saveToken = (tokenData: any) => {
  return {
    type: "SAVE_TOKEN",
    payload: tokenData,
  };
};
