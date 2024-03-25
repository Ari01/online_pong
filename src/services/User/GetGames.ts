import axios from "axios";
import { gameType } from "../../types/gameType";

export function getGames(id: string): Promise<gameType[]> {
  return axios(`${process.env.REACT_APP_API}/api/users/games/${id}`, {
    withCredentials: true,
  }).then((res) => res.data);
}
