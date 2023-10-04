import rootReducer from "./reducers";

import { legacy_createStore as createStore, compose } from "redux";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // d

const persistConfig = {
  key: "root",
  storage,
};

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

const composeEnhancers =
  (process.env.NODE_ENV === "development" && typeof window !== "undefined"
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : null) || compose;
// export const store = createStore(persistedReducer, composeEnhancers());

export const store = createStore(persistedReducer, composeEnhancers());
export const persistor = persistStore(store);

// : null;
