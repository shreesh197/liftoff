
export const profileReducer = (state: any = null, action: any) => {
  switch (action.type) {
    case "SAVE_USER":
      return (state = { ...action.payload });
    case "RESET_STATE":
      return (state = null);
    default:
      return state;
  }
};
