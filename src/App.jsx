import { useState, useEffect } from "react";
import "./App.css";
import Post from "./components/post/Post";
import { db, auth } from "./firebase.jsx";
import { Button, Input, Modal } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Alert } from "@material-ui/lab";
import ImageUpload from "./components/imageUpload/ImageUpload";
import InstagramEmbed from "react-instagram-embed";

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

function App() {
  const [posts, setPosts] = useState([]);
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [user, setUser] = useState(null);

  const clearStates = () => {
    setEmail("");
    setUsername("");
    setPassword("");
    setOpen(false);
    setOpenSignIn(false);
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

  const handleSignIn = (e) => {
    e.preventDefault();
    setErrorMessage("");
    setError(false);

    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        clearStates();
        console.log(`Sign in ->${password},${username}`);
      })
      .catch((err) => {
        setErrorMessage(err.message);
        setError(true);
      });
  };

  const handleLogout = (e) => {
    e.preventDefault();

    console.log(user);

    auth.signOut().catch((err) => {
      console.error(err.message);
    });
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [user, username]);

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snap) => {
        setPosts(
          snap.docs.map((doc) => ({
            data: doc.data(),
            id: doc.id,
          }))
        );
      });
  }, []);

  return (
    <div className="App">
      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
        ></img>

        <div>
          {!user ? (
            <div className="app_loginContainer">
              <Button type="button" onClick={() => setOpenSignIn(true)}>
                Sign in
              </Button>
              <Button type="button" onClick={() => setOpen(true)}>
                Sign Up
              </Button>
            </div>
          ) : (
            <Button type="submit" onClick={handleLogout}>
              Log out
            </Button>
          )}
          <Modal
            open={openSignIn}
            onClose={() => setOpenSignIn(false)}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
          >
            <div style={modalStyle} className={classes.paper}>
              <center>
                <img
                  src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                  alt=""
                ></img>
                <form className="app__signup">
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
                  <Button type="submit" onClick={handleSignIn}>
                    Sign in
                  </Button>
                  {error && <Alert severity="error">{errorMessage}</Alert>}
                </form>
              </center>
            </div>
          </Modal>

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
                <form className="app__signup">
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
      </div>

      <div className="app__posts">
        <div className="app_postsLeft">
          {posts.map((post) => (
            <Post key={post.id} id={post.id} post={post.data} user={user} />
          ))}
        </div>
        <div className="app__postsRight">
          <InstagramEmbed
            url="https://www.instagram.com/p/CQv97CGhYJo"
            clientAccessToken="123|456"
            maxWidth={320}
            hideCaption={false}
            containerTagName="div"
            protocol=""
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>

      {user?.displayName ? (
        <ImageUpload username={user?.displayName} />
      ) : (
        <Alert severity="warning">Please Login To Upload</Alert>
      )}
    </div>
  );
}

export default App;
