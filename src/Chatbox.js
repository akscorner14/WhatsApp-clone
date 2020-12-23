import React, { useState, useEffect } from "react";
import "./Chatbox.css";
import firebase from "firebase";
import { auth, db } from "./firebase";
import { Avatar, IconButton } from "@material-ui/core";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";

function Chatbox({ room }) {
  const [disName, setDisName] = useState("");
  const [text, setText] = useState("");
  const [message, setMessage] = useState([]);
  useEffect(() => {
    if (!auth?.currentUser.displayName)
      setDisName(auth?.currentUser.email.split("@")[0]);
    else setDisName(auth?.currentUser.displayName.split(" ")[0]);
  }, []);
  useEffect(() => {
    const unsubscribe = db
      .collection("rooms")
      .doc(room)
      .collection("messages")
      .orderBy("time")
      .onSnapshot(function (snapshot) {
        setMessage([]);
        snapshot.forEach(function (doc) {
          if (auth.currentUser.uid === doc.data().uid)
            setMessage((message) => [
              ...message,
              {
                number: 0,
                mes: doc.data().text,
                timestamp: doc.data().time,
                n: doc.data().name,
              },
            ]);
          else
            setMessage((message) => [
              ...message,
              {
                number: 1,
                mes: doc.data().text,
                timestamp: doc.data().time,
                n: doc.data().name,
              },
            ]);
        });
      });
    return () => {
      unsubscribe();
    };
  }, [room]);

  const textSubmit = (e) => {
    e.preventDefault();
    const messagesRef = db.collection("rooms").doc(room).collection("messages");
    messagesRef.add({
      text: text,
      time: firebase.firestore.FieldValue.serverTimestamp(),
      uid: auth.currentUser.uid,
      photoURL: auth.currentUser.photoURL,
      name: disName,
    });
    db.collection("rooms").doc(room).set({
      lastMsg: text,
    });
    setText("");
  };

  return (
    <div className="chatbox">
      <div className="chatbox_header">
        <Avatar />
        <div className="chatbox_headerInfo">
          <h3>{room}</h3>
          <p>{}</p>
        </div>
        <div className="chatbox_headerSetting">
          <IconButton>
            <SearchOutlinedIcon />
          </IconButton>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>
      <div className="chatbox_body">
        {message &&
          message.map((each) => {
            let hrs, date, min, month, year;
            if (each.timestamp != null) {
              date = new Date(each.timestamp.seconds * 1000).getDate();
              month = new Date(each.timestamp.seconds * 1000).getMonth();
              year = new Date(each.timestamp.seconds * 1000).getFullYear();
              hrs = new Date(each.timestamp.seconds * 1000).getHours();
              min = new Date(each.timestamp.seconds * 1000).getMinutes();
            } else {
              date = new Date().getDate();
              month = new Date().getMonth();
              year = new Date().getFullYear();
              hrs = new Date().getHours();
              min = new Date().getMinutes();
            }

            if (each.number === 1) {
              return (
                <div>
                  <div className="chatbox_bodyMessage">
                    <p>
                      <span className="name">{each.n}</span>
                      {each.mes}
                      <span className="time">{`${date}/${month}/${year}  ${hrs}:${min}`}</span>
                    </p>
                  </div>
                </div>
              );
            } else
              return (
                <div>
                  <div className="chatbox_bodyMessage chatReceiver">
                    <p>
                      <span className="name">{disName}</span>
                      {each.mes}
                      <span className="time">{`${date}/${month}/${year}  ${hrs}:${min}`}</span>
                    </p>
                  </div>
                </div>
              );
          })}
      </div>

      <div className="chatbox_bottom">
        <InsertEmoticonIcon />
        <form onSubmit={textSubmit}>
          <input
            placeholder="Enter a message"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button type="submit" />
        </form>
        <MicIcon />
      </div>
    </div>
  );
}
export default Chatbox;
