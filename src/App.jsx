import { useState, useEffect } from "react";
import "./App.css";
import Login from "./components/login/Login";
import Post from "./components/post/Post";
import Signup from "./components/signup/Signup";
import { db } from "./firebase.jsx";

function App() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    db.collection("posts").onSnapshot((snap) => {
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
        <Login />
        <Signup />
      </div>

      {posts.map((post) => (
        <Post key={post.id} post={post.data} />
      ))}
    </div>
  );
}

export default App;
