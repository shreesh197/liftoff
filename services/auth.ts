import Api from ".";

export const loginUser = (data: any, options: any = {}) => {
  return Api(3)
    .post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, data, options)
    .then((result: any) => {
      return result.data;
    });
};
