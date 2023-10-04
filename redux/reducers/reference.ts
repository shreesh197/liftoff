const referenceReducer = (state = "", action: any) => {
  switch (action.type) {
    case "SAVE_REFERENCE":
      return (state = action.payload);
    case "RESET_REFERENCE":
      return (state = "");
    default:
      return state;
  }
};

export default referenceReducer;
