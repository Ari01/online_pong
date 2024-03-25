import axios from "axios";
import { userType } from "../../types/userType";

export function getUser(id: string | undefined): Promise<userType> {
  return axios(`${process.env.REACT_APP_API}/api/users/userid/${id}`, {
    withCredentials: true,
  }).then((res) => res.data);
}
