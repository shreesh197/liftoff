export const saveRoute = (id: string) => {
  return {
    type: "SAVE_ROUTE",
    payload: id,
  };
};
