import React from "react";
import "./Sidechat.css";
import Avatar from "@material-ui/core/Avatar";
function Sidechat({ roomname, l, setRoom }) {
  return (
    <div
      className="sidechat"
      onClick={() => {
        setRoom(roomname);
      }}
    >
      <Avatar />
      <div className="sidechat_chatInfo">
        <h2>{roomname}</h2>
        <p>{l}</p>
      </div>
    </div>
  );
}

export default Sidechat;
