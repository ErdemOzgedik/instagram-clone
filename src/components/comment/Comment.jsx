import "./comment.css";

export default function Comment({ data }) {
  return (
    <div className="comment">
      <span>{data.username}</span>
      {data.comment}
    </div>
  );
}
