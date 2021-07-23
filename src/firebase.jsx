import firebase from "firebase";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "instagram-clone-f933d.firebaseapp.com",
  projectId: "instagram-clone-f933d",
  storageBucket: "instagram-clone-f933d.appspot.com",
  messagingSenderId: process.env.REACT_APP_SENDER_ID,
  appId: process.env.REACT_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT,
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const storage = firebaseApp.storage();

export { db, auth, storage };
