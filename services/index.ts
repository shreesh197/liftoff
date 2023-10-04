import { store } from "../redux/store";
import { StoreState } from "../redux/types";
import axios from "axios";

export default function Api(type: number, isTokenRequired: boolean = true) {
  let token = "";
  if (isTokenRequired) {
    const state: StoreState = store.getState();
    token = state.token.access_token;
  }
  const api = axios.create({
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
  if (type === 1) {
    api.defaults.headers.common[
      "Authorization"
    ] = `Bearer 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`;
  } else if (type === 2) {
    api.defaults.headers.common["xi-api-key"] =
      "377750fb9fd35cbf183063b709f5bd4a";
  } else {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      api.defaults.headers.common["Authorization"] = "";
    }
  }

  return api;
}
