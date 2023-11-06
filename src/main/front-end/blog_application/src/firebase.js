// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth";
import { getStorage} from "firebase/storage";

export {auth, storage}
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAuS5ZWiv48WxBAl_z5yIPMggerHbLToFo",
  authDomain: "blogapplication-c76e2.firebaseapp.com",
  projectId: "blogapplication-c76e2",
  storageBucket: "blogapplication-c76e2.appspot.com",
  messagingSenderId: "976880153461",
  appId: "1:976880153461:web:2af24615c669f098ce193c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const storage = getStorage(app);
