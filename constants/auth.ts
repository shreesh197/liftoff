export const authConfig = {
  meEndpoint: "/auth/me",
  loginEndpoint: "/jwt/login",
  registerEndpoint: "/jwt/register",
  storageTokenKeyName: "token",
  onTokenExpiration: "refresh_token",
  storageUserKeyName: "user",
  storageUserIdKeyName: "user_id",
  storageUserDetails: "user_data",
  rootStore: "persist:root",
};

export const profileTypeMapping = {
  user: "user",
  admin: "admin",
};
