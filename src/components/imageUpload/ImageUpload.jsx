import { Button } from "@material-ui/core";
import React from "react";
import { useState } from "react";
import { db, storage } from "../../firebase";
import firebase from "firebase";

export default function ImageUpload({ username }) {
  const [caption, setCaption] = useState("");
  const [progress, setProgress] = useState(0);
  const [image, setImage] = useState(null);

  const handleFileUpload = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();
    const uploadTask = storage.ref(`images/${image.name}`).put(image);

    uploadTask.on(
      "state_changed",
      (snap) => {
        //progress part
        const progress = Math.round(
          (snap.bytesTransferred / snap.totalBytes) * 100
        );
        setProgress(progress);
      },
      (err) => {
        //error
        console.error(err.message);
      },
      () => {
        //completed
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            db.collection("posts")
              .add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                caption,
                imageUrl: url,
                username,
              })
              .then((docRef) => {
                console.log("Document written with ID: ", docRef.id);
              })
              .catch((err) => {
                console.error(err.message);
              });
            setProgress(0);
            setCaption("");
            setImage(null);
          });
      }
    );
  };

  return (
    <div className="imageUpload">
      <form>
        <div className="imageUpload__header">UPLOAD YOU POST</div>

        <progress
          className="imageUpload__progress"
          value={progress}
          max="100"
        />
        <input
          type="text"
          placeholder="Enter a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <input type="file" onChange={handleFileUpload} />

        <Button type="submit" onClick={handleUpload}>
          Upload
        </Button>
      </form>
    </div>
  );
}
