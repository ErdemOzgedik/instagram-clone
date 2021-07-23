import { Avatar } from "@material-ui/core";
import "./post.css";

export default function Post({ post }) {
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
    </div>
  );
}
