import { combineReducers } from "redux";

import routeReducer from "./route";
import { tokenReducer } from "./token";
import { profileReducer } from "./user";
import referenceReducer from "./reference";

import { batchDetailsReducer } from "./batch";

import routeRedirectReducer from "./route-redirect";

const appReducer = combineReducers({
  route: routeReducer,
  routeRedirect: routeRedirectReducer,
  profile: profileReducer,
  token: tokenReducer,
  reference: referenceReducer,
  batchDetails: batchDetailsReducer,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === "RESET_STATE") {
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
