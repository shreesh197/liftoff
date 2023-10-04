export const saveReference = (id: string) => {
  return {
    type: "SAVE_REFERENCE",
    payload: id,
  };
};
