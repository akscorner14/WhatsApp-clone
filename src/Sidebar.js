import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import _ from "lodash";
import Sidechat from "./Sidechat";
import Avatar from "@material-ui/core/Avatar";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import { Button, IconButton } from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";
import { auth, db } from "./firebase";
function Sidebar({ setRoom, room }) {
  const [name, setName] = useState("");
  const [noRoom, setNoRoom] = useState([]);
  const [last, setLast] = useState("");
  const [lastRoom, setLastRoom] = useState(null);
  let details = [];

  useEffect(() => {
    getChatList();
  }, []);
  useEffect(() => {
    noRoom.forEach(function (each) {
      if (each.name === lastRoom) {
        each.mes = last;
        setLastRoom(null);
      }
    });
  }, [last, lastRoom, noRoom]);
  const retreive = () => {
    if (name) {
      db.collection("rooms")
        .doc(name)
        .set({
          posi: "sk",
        })
        .then(function (docRef) {})
        .catch(function (error) {
          console.error("Error adding document: ", error);
        });
    }
  };

  const getChatList = function () {
    db.collection("rooms").onSnapshot(function (snapshot) {
      snapshot.docChanges().forEach(function (change) {
        if (change.type === "added") {
          db.collection("rooms")
            .doc(change.doc.id)
            .collection("messages")
            .get()
            .then(function (querySnapshot) {
              querySnapshot.forEach(function (doc) {
                if (doc.data().uid === auth.currentUser.uid) {
                  setNoRoom((prev) => [
                    ...prev,
                    {
                      name: change.doc.id,
                      mes: change.doc.data().lastMsg,
                    },
                  ]);
                }
              });
            })
            .catch(function (error) {
              console.log("Error getting documents: ", error);
            });
        }
        if (change.type === "modified") {
          setLastRoom(change.doc.id);
          setLast(change.doc.data().lastMsg);

          db.collection("rooms")
            .doc(change.doc.id)
            .collection("messages")
            .get()
            .then(function (querySnapshot) {
              querySnapshot.forEach(function (doc) {
                if (doc.data().uid === auth.currentUser.uid) {
                  setNoRoom((prev) => [
                    ...prev,
                    {
                      name: change.doc.id,
                      mes: change.doc.data().lastMsg,
                    },
                  ]);
                }
              });
            });
        }
      });
    });
  };

  details = _.uniqBy(noRoom, "name");
  return (
    <div className="sidebar">
      <div className="sidebar_top">
        <div className="sidebar_topLeft">
          {auth?.currentUser?.photoURL ? (
            <Avatar src={auth.currentUser.photoURL} />
          ) : (
            <Avatar />
          )}

          <Button
            onClick={() => {
              auth
                .signOut()
                .then(function () {
                  setRoom("Default Room");
                })
                .catch(function (error) {
                  console.log(error);
                });
            }}
          >
            Logout
          </Button>
        </div>
        <div className="sidebar_topRight">
          <IconButton>
            <DonutLargeIcon />
          </IconButton>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>
      <div className="sidebar_search">
        <SearchIcon />
        <input placeholder="Search or start new chat" />
      </div>
      <div className="sidebar_chat">
        <div className="sidebar_chat_button">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              retreive();
            }}
          >
            <Button
              className="random"
              type="submit"
              onClick={() => {
                let nae = prompt("Enter room name");
                setName(nae);
                setRoom(nae);
              }}
            >
              Add new Room
            </Button>
          </form>
        </div>
        {details &&
          details.map((each) => {
            return (
              <Sidechat l={each.mes} roomname={each.name} setRoom={setRoom} />
            );
          })}
      </div>
    </div>
  );
}
export default Sidebar;
