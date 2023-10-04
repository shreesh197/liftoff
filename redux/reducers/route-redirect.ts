const routeRedirectReducer = (state = "", action: any) => {
  switch (action.type) {
    case "SAVE_ROUTE_REDIRECT":
      return (state = action.payload);
    case "RESET_STATE":
      return (state = "");
    default:
      return state;
  }
};

export default routeRedirectReducer;
