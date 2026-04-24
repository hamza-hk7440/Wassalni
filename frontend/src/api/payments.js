import api from "./axios";

export const createRecharge = async ({
  user_id,
  amount,
  platform,
  web_redirect,
}) => {
  const response = await api.post("/api/payments/recharge", {
    user_id,
    amount,
    platform,
    web_redirect,
  });
  return response.data;
};
