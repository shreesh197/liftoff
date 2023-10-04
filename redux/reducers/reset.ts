const resetReducer = (state: any, action: any) => {
  switch (action.type) {
    case "RESET_STATE":
      return (state = action.payload);
    default:
      return state;
  }
};

export default resetReducer;
