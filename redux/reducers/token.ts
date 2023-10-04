import { Token } from "../types";

const initialState: any = {
  access_token: "",
  refresh_token: "",
};

export const tokenReducer = (state: any = initialState, action: any) => {
  switch (action.type) {
    case "SAVE_TOKEN":
      return (state = { ...action.payload });
    case "RESET_STATE":
      return (state = null);
    default:
      return state;
  }
};
