import axios from "axios";

export const turnOn2fa = (code: String) => {
  axios
    .post(
      `${process.env.REACT_APP_API}/api/auth/2fa/turn-on`,
      {
        twoFactorAuthenticationCode: code,
      },
      {
        withCredentials: true,
      }
    )
    .then((response) => response.data);
};
