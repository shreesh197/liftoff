import { BatchDetails } from "../types";

export const saveBatchDetails = (batchDetails: BatchDetails) => {
  return {
    type: "SAVE_USER_BATCH",
    payload: batchDetails,
  };
};
