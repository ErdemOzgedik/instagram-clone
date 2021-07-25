import "./signup.css";
import { Button, Input, Modal } from "@material-ui/core";
import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { auth } from "../../firebase";
import { Alert } from "@material-ui/lab";

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
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function Signup() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const clearStates = () => {
    setEmail("");
    setUsername("");
    setPassword("");
    setOpen(false);
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    setErrorMessage("");
    setError(false);

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        authUser.user.updateProfile({ displayName: username });

        clearStates();
        console.log(`Register -> ${email},${password},${username}`);
      })
      .catch((err) => {
        setErrorMessage(err.message);
        setError(true);
      });
  };

  return (
    <div>
      <Button type="button" onClick={() => setOpen(true)}>
        Sign Up
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={classes.paper}>
          <center>
            <img
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt=""
            ></img>
            <form className="signup__form">
              <Input
                placeholder="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                placeholder="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="password"
                type="pasword"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" onClick={handleSignUp}>
                Sign up
              </Button>

              {error && <Alert severity="error">{errorMessage}</Alert>}
            </form>
          </center>
        </div>
      </Modal>
    </div>
  );
}
