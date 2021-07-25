import { useState, useEffect } from "react";
import "./App.css";
import Post from "./components/post/Post";
import { db, auth } from "./firebase.jsx";
import { Button } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import ImageUpload from "./components/imageUpload/ImageUpload";
import InstagramEmbed from "react-instagram-embed";
import Login from "./components/login/Login";
import Signup from "./components/signup/Signup";

function App() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);

  const handleLogout = (e) => {
    e.preventDefault();

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
  }, [user]);

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
              <Login />
              <Signup />
            </div>
          ) : (
            <Button type="submit" onClick={handleLogout}>
              Log out
            </Button>
          )}
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
