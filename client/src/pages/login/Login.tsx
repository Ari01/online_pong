import axios from "axios";
import "../../styles/global.css";
import "../../styles/login.css";
import React, { useContext, useState } from "react";
import { ChatContext } from "../../context/socketContext";
import "../../styles/global.css";

export function VerifLogged() {
  return false;
}

export default function Login() {
  const [devlog, setDevLog] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('')
  const socket = useContext(ChatContext);

  const buttonAuth = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    window.location.assign(`${process.env.REACT_APP_API}/api/auth/login`);
  };

  const handleDevLogin = (e: React.SyntheticEvent) => {
    e.preventDefault();
    axios
      .post(
        `${process.env.REACT_APP_API}/api/auth/devlog`,
        {
          username,
          password,
        },
        { withCredentials: true }
      )
      .then((response) => {
        if (response && response.data) {
          console.log("redirecting");
          socket.emit("login", response.data);
        } else {
          console.log('error authenticating admin')
        }
      })
      .catch((e) => console.log("error login dev"));
  };

  if (devlog) {
    return (
      <div className="center">
        <form className="form" onSubmit={handleDevLogin}>
          <div className="formInput">
            <div className="formInputName"> Username </div>
            <input
              className="formInputValue"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="formInput">
            <div className="formInputName"> Password </div>
            <input
              className="formInputValue"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="formButtons">
            <button className="button-auth" type="submit">
              {" "}
              Connect{" "}
            </button>
            <button
              className="button-auth"
              onClick={() => {
                setUsername("");
                setDevLog(false);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  } else {
    return (
      <div className="back bg-base flex flex-col items-center justify-center gap-5">
        <div className="">
          <h1 className="font-retro text-7xl">TRANSCENDANCE </h1>
          <p className="font-retro">Play for fun on PongGame </p>
        </div>
        <button
          onClick={buttonAuth}
          className="btn btn-sm md:btn-md  gap-2 normal-case lg:gap-3"
          name="button 1"
        >
          Connect with 42
        </button>
        <button
          onClick={() => setDevLog(true)}
          className="btn btn-sm md:btn-md  gap-2 normal-case lg:gap-3"
        >
          Dev connect
        </button>
      </div>
    );
  }
}
