import Api from "../index";

export const getUserById = (user_id: string) => {
  if (user_id) {
    return Api(3)
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}/profile-service/api/v1/users/${user_id}`
      )
      .then((result: any) => {
        return result.data;
      });
  }
};

export const getBatchByBatchId = (batchId: string) => {
  return Api(3)
    .get(`${process.env.NEXT_PUBLIC_API_URL}/batch/${batchId}`)
    .then((result) => {
      return result.data;
    });
};
