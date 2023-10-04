export const saveRouteRedirect = (route: string) => {
  return {
    type: "SAVE_ROUTE_REDIRECT",
    payload: route,
  };
};
