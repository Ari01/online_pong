import axios from "axios";
import { userType } from "../../types/userType";

export function updateUser(
  id: string | undefined,
  user: userType
): Promise<userType> {
  return axios
    .post(`${process.env.REACT_APP_API}/api/users/updateUser/${id}`, user, {
      withCredentials: true,
    })
    .then((res) => res.data);
}
