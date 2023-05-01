import axios from "axios";

export const deactivate2fa = () => {
  return axios
    .post(
      `${process.env.REACT_APP_API}/api/auth/2fa/turn-off`,
      {},
      {
        withCredentials: true,
      }
    )
    .then((response) => response.data);
};
