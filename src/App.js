import React, { useState, useEffect } from "react";
import "./App.css";
import Modal from "@material-ui/core/Modal";
import firebase from "firebase";
import { auth } from "./firebase";
import Chatbox from "./Chatbox";
import Sidebar from "./Sidebar";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";

function getModalStyle() {
  const top = 50;
  const left = 50;
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    textAlign: "center",
    position: "absolute",
    width: 300,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  cont: {
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  mail: {
    marginBottom: "10px",
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [clicked, setClicked] = useState("");
  const [currentRoom, setCurrentRoom] = useState("Default Room");
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
      } else {
        setUser(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [user]);

  const clickGoogle = () => {
    var provider = new firebase.auth.GoogleAuthProvider();
    auth
      .signInWithPopup(provider)
      .then(function (result) {
        setUser(user);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setOpen(false);
    console.log(email, password);
    setEmail("");
    setPassword("");
    if (clicked === "sign") {
      auth
        .createUserWithEmailAndPassword(email, password)
        .catch(function (error) {
          alert(error.message);
        });
    } else if (clicked === "log") {
      auth.signInWithEmailAndPassword(email, password).catch(function (error) {
        alert(error.message);
      });
    }
  };
  auth.onAuthStateChanged(function (user) {
    if (user) {
      setUser(user);
    } else {
      setUser(null);
    }
  });

  return (
    <div className="app">
      {!user && (
        <div>
          <Button
            variant="contained"
            id="random"
            onClick={() => {
              setOpen(true);
            }}
          >
            Sign in with Email<i class="material-icons">email</i>
          </Button>

          <Modal open={open} onClose={() => setOpen(false)}>
            <div style={modalStyle} className={classes.paper}>
              <form className={classes.cont} onSubmit={handleSubmit}>
                <input
                  value={email}
                  type="email"
                  placeholder="Email"
                  className={classes.mail}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  value={password}
                  type="password"
                  placeholder="Password"
                  className={classes.pass}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
                <Button type="submit" onClick={() => setClicked("sign")}>
                  Sign In
                </Button>
                <Button type="submit" onClick={() => setClicked("log")}>
                  Log In
                </Button>
              </form>
            </div>
          </Modal>

          <Button
            variant="contained"
            id="google"
            onClick={() => {
              setOpen(false);
              clickGoogle();
            }}
          >
            Sign in with Google<i class="fab fa-google"></i>
          </Button>
        </div>
      )}
      {user && (
        <div className="app_content">
          <Sidebar room={currentRoom} setRoom={setCurrentRoom} />
          <Chatbox room={currentRoom} setRoom={setCurrentRoom} />
        </div>
      )}
    </div>
  );
}

export default App;
