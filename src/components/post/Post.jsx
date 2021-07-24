import { Avatar } from "@material-ui/core";
import { useEffect, useState } from "react";
import "./post.css";
import { auth, db } from "../../firebase.jsx";
import firebase from "firebase";
import Comment from "../comment/Comment";

export default function Post({ post, id }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    db.collection("comments")
      .where("postId", "==", id)
      .orderBy("timestamp", "asc")
      .onSnapshot((snap) => {
        setComments(
          snap.docs.map((doc) => ({
            data: doc.data(),
            id: doc.id,
          }))
        );
      });
  }, []);

  const handleComment = (e) => {
    e.preventDefault();

    db.collection("comments")
      .add({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        comment,
        postId: id,
        username: auth.currentUser.displayName,
      })
      .then((docRef) => {
        setComment("");
        console.log("Comment written with ID: ", docRef.id);
      })
      .catch((err) => {
        console.error(err.message);
      });
  };

  return (
    <div className="post">
      <div className="post__header">
        <Avatar alt="PostUser" src={post.userImage} className="post__avatar" />
        <h3 className="post_user">{post.username}</h3>
      </div>

      <img className="post__image" src={post.imageUrl} alt="" />
      <h4 className="post__caption">
        <span>{post.username}</span> : {post.caption}
      </h4>

      <div className="post__comment">
        <form className="post__commentForm">
          <input
            type="text"
            placeholder="Add comment..."
            className="post__commentInput"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button type="submit" onClick={handleComment}>
            Add Comment
          </button>
        </form>
      </div>

      {comments.map(({ data, id }) => {
        return <Comment key={id} data={data} />;
      })}
    </div>
  );
}
