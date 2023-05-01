import axios from "axios";

export const send2faCode = (code: string) => {
  axios
    .post(
      `${process.env.REACT_APP_API}/api/auth/2fa/authenticate`,
      {
        twoFactorAuthenticationCode: code,
      },
      {
        withCredentials: true,
      }
    )
    .then((response) => response.data);
};
