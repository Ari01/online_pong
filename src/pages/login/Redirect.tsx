import axios from "axios";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userType } from "../../types/userType";
import { saveItem } from "../../utils/storage";
import { ChatContext } from "../../context/socketContext";

interface IRedirectProps {
  setIsLogged: (arg: boolean) => void;
  setUser: (arg: userType) => void;
}

const Redirect: React.FC<IRedirectProps> = ({ setIsLogged, setUser }) => {
  const navigate = useNavigate();
  const socket = useContext(ChatContext);

  console.log('redirect route')
  console.log('socket is')
  console.log(socket)

  /*useEffect(() => {
    axios(`${process.env.REACT_APP_API}/api/users`, { withCredentials: true })
      .then((res) => {
        //[deprecated, use socket emit below] console.log("User found: " + res.data.username);
        //setUser(res.data);
        //setIsLogged(true);
        //saveItem("user", res.data);
        //saveItem("isLogged", true);
        //navigate("/home");

        //console.log("res", res.data);
        //socket.emit("login", res.data);
      })
      .catch((e) => {
        console.log("User not found " + e);
      });
  }, [socket]);*/

  return (
    <div>
      Thank you for signing in ! Unfortunately online pong is currently not opened to 42 users.
    </div>
  );
};

export default Redirect;
