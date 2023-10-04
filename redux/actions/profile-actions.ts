export const saveProfile = (profileData: any) => {
  return {
    type: "SAVE_USER",
    payload: profileData,
  };
};
